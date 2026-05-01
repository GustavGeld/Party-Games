// ============================================================
//  multiplayer.js — P2P networking layer for Spektrum
//  Supports Local (same WiFi/device) and Internet modes
// ============================================================

var Multiplayer = {
  peer: null,
  connections: [],
  role: null,       // 'host' or 'guest'
  myId: null,
  hostId: null,
  isConnected: false,
  mode: 'internet', // 'local' or 'internet'

  // Room discovery via BroadcastChannel (works same-origin / same device)
  _discoveryChannel: null,
  _announceInterval: null,
  _discoveredRooms: {},

  // Event callbacks (set by the game before calling createRoom/joinRoom)
  onStatusChange: function(status, message) {},
  onDataReceived: function(data, conn) {},
  onPlayerJoined: function(conn) {},
  onPlayerLeft: function(conn) {},
  onRoomDiscovered: function(rooms) {},

  // --- ICE Server Configurations ---
  // Local: only STUN (fast, no relay needed on same network)
  LOCAL_ICE: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' }
    ]
  },

  // Internet: STUN servers for NAT traversal across different networks
  // NOTE: Free TURN servers (PeerJS, Metered open relay) have been discontinued.
  // For TURN support, sign up at https://dashboard.metered.ca/signup?tool=turnserver
  // and use their REST API to fetch dynamic credentials.
  INTERNET_ICE: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.services.mozilla.com:3478' }
    ]
  },

  _getIceConfig: function() {
    return this.mode === 'local' ? this.LOCAL_ICE : this.INTERNET_ICE;
  },

  generateId: function() {
    return 'p_' + Math.random().toString(36).substr(2, 9);
  },

  // ============================================================
  //  Room Discovery (BroadcastChannel — same browser/device)
  // ============================================================
  startDiscovery: function() {
    this.stopDiscovery();
    this._discoveredRooms = {};

    try {
      this._discoveryChannel = new BroadcastChannel('spektrum-room-discovery');
      this._discoveryChannel.onmessage = (event) => {
        var msg = event.data;
        if (!msg) return;

        if (msg.type === 'room-announce') {
          this._discoveredRooms[msg.roomCode] = {
            roomCode: msg.roomCode,
            hostName: msg.hostName || 'Host',
            playerCount: msg.playerCount || 1,
            timestamp: Date.now()
          };
          // Remove stale rooms (>12s without announcement)
          var now = Date.now();
          var keys = Object.keys(this._discoveredRooms);
          for (var i = 0; i < keys.length; i++) {
            if (now - this._discoveredRooms[keys[i]].timestamp > 12000) {
              delete this._discoveredRooms[keys[i]];
            }
          }
          this.onRoomDiscovered(Object.values(this._discoveredRooms));
        }

        if (msg.type === 'room-closed') {
          delete this._discoveredRooms[msg.roomCode];
          this.onRoomDiscovered(Object.values(this._discoveredRooms));
        }
      };

      // Ask active hosts to announce themselves
      this._discoveryChannel.postMessage({ type: 'room-scan' });
    } catch (e) {
      console.warn('BroadcastChannel not supported, room discovery unavailable');
    }
  },

  stopDiscovery: function() {
    if (this._discoveryChannel) {
      try { this._discoveryChannel.close(); } catch (e) {}
      this._discoveryChannel = null;
    }
    this._discoveredRooms = {};
  },

  _startAnnouncing: function(roomCode, hostName) {
    this._stopAnnouncing();
    try {
      this._discoveryChannel = new BroadcastChannel('spektrum-room-discovery');

      // Respond to scan requests from other tabs
      this._discoveryChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'room-scan') {
          this._discoveryChannel.postMessage({
            type: 'room-announce',
            roomCode: roomCode,
            hostName: hostName,
            playerCount: this.connections.length + 1
          });
        }
      };

      // Periodic announcement
      var self = this;
      var announce = function() {
        if (self._discoveryChannel) {
          try {
            self._discoveryChannel.postMessage({
              type: 'room-announce',
              roomCode: roomCode,
              hostName: hostName,
              playerCount: self.connections.length + 1
            });
          } catch (e) {}
        }
      };
      announce();
      this._announceInterval = setInterval(announce, 3000);
    } catch (e) {
      console.warn('BroadcastChannel not supported');
    }
  },

  _stopAnnouncing: function() {
    if (this._announceInterval) {
      clearInterval(this._announceInterval);
      this._announceInterval = null;
    }
    if (this._discoveryChannel) {
      try {
        this._discoveryChannel.postMessage({ type: 'room-closed', roomCode: this.hostId });
      } catch (e) {}
      try { this._discoveryChannel.close(); } catch (e) {}
      this._discoveryChannel = null;
    }
  },

  // ============================================================
  //  Connection Management
  // ============================================================
  createRoom: function(roomCode, hostName) {
    this.role = 'host';
    this.myId = this.generateId();
    this.hostId = roomCode;
    this.connections = [];
    this.isConnected = false;

    this.onStatusChange('connecting', 'Erstelle Raum...');

    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
    }

    var iceConfig = this._getIceConfig();
    this.peer = new Peer(roomCode, {
      debug: 1, 
      config: iceConfig,
      pingInterval: 5000 
    });

    this.peer.on('open', (id) => {
      this.isConnected = true;
      this.onStatusChange('connected', id);
      // Announce for local discovery
      if (this.mode === 'local') {
        this._startAnnouncing(roomCode, hostName || 'Host');
      }
    });

    this.peer.on('connection', (conn) => {
      this._setupConnection(conn);
    });

    this.peer.on('disconnected', () => {
      console.warn('Host signaling disconnected. Reconnecting...');
      this.isConnected = false;
      if (!this.peer.destroyed) {
        this.peer.reconnect();
      }
    });

    this.peer.on('close', () => {
      console.warn('Peer connection closed.');
      this.isConnected = false;
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS Host Error:', err.type, err);
      // Suppress alert for common Firefox signaling glitches if the lib is already handling it
      var ignoreTypes = ['disconnected', 'network', 'signaling-error'];
      if (ignoreTypes.includes(err.type)) {
        console.warn('Suppressing temporary network alert:', err.type);
        return;
      }
      this.onStatusChange('error', (err.message || err.type) + ' (' + err.type + ')');
    });
  },

  joinRoom: function(roomCode) {
    this.role = 'guest';
    this.myId = this.generateId();
    this.hostId = roomCode;
    this.connections = [];
    this.isConnected = false;

    this.onStatusChange('connecting', 'Verbinde...');

    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
    }

    var iceConfig = this._getIceConfig();
    this.peer = new Peer(this.myId, {
      debug: 1,
      config: iceConfig,
      pingInterval: 5000
    });

    this.peer.on('open', () => {
      var conn = this.peer.connect(roomCode, {
        reliable: true
      });
      this._setupConnection(conn);
    });

    this.peer.on('disconnected', () => {
      console.warn('Guest disconnected from signaling, reconnecting...');
      if (this.peer && !this.peer.destroyed) {
        setTimeout(() => {
          if (this.peer && !this.peer.destroyed) this.peer.reconnect();
        }, 1000);
      }
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS Guest Error:', err.type, err);
      var ignoreTypes = ['disconnected', 'network', 'signaling-error'];
      if (ignoreTypes.includes(err.type)) {
        console.warn('Suppressing temporary network alert:', err.type);
        return;
      }
      this.onStatusChange('error', (err.message || err.type) + ' (' + err.type + ')');
    });
  },

  _setupConnection: function(conn) {
    conn.on('open', () => {
      this.connections.push(conn);
      if (this.role === 'guest') {
        this.isConnected = true;
        this.onStatusChange('connected', 'Verbunden');
      }
      this.onPlayerJoined(conn);
    });

    conn.on('data', (data) => {
      this.onDataReceived(data, conn);
    });

    conn.on('close', () => {
      this.connections = this.connections.filter(function(c) { return c !== conn; });
      this.onPlayerLeft(conn);
      if (this.role === 'guest') {
        this.isConnected = false;
        this.onStatusChange('disconnected', 'Verbindung getrennt');
      }
    });

    conn.on('error', function(err) {
      console.error('Connection error:', err);
    });
  },

  // ============================================================
  //  Data Sending
  // ============================================================
  sendGameState: function(data) {
    this.connections.forEach(function(conn) {
      if (conn.open) {
        try { conn.send(data); } catch (e) { console.error('Send error:', e); }
      }
    });
  },

  sendToHost: function(data) {
    if (this.role === 'guest' && this.connections[0] && this.connections[0].open) {
      try { this.connections[0].send(data); } catch (e) { console.error('Send to host error:', e); }
    } else {
      this.sendGameState(data);
    }
  },

  // ============================================================
  //  Cleanup
  // ============================================================
  disconnect: function() {
    this._stopAnnouncing();
    this.stopDiscovery();

    this.connections.forEach(function(conn) {
      if (conn.open) conn.close();
    });
    this.connections = [];

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isConnected = false;
    this.role = null;
  }
};
