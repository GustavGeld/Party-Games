/* ===================================================
   UnifiedLobby v2 — Inspired by Spektrum's online lobby
   Features:
   - Host: Raum erstellen, Code teilen, Name ändern, spielspezifische Einstellungen
   - Guest: Mit Code beitreten, Name ändern, Spielerliste sehen, warte auf Host
   - Host broadcastet game_start + Einstellungen an alle Guests
   =================================================== */

const UnifiedLobby = {
  currentGame: null,
  isInLobby: false,

  /* ===== ENTRY POINT ===== */
  open(gameObj) {
    this.currentGame = gameObj;
    this.isInLobby = true;
    const gameName = (gameObj && gameObj.name) ? gameObj.name : 'Spiel';

    // Wire up Multiplayer callbacks
    this._wireCallbacks();

    // Show a simple Host/Join screen (Raum-Code based, like Spektrum)
    Router.go('setup');
    document.getElementById('setup-title').textContent = gameName + ' — Online';

    document.getElementById('setup-content').innerHTML = `
      <div class="card" style="text-align:center;">
        <div class="card-label">🏠 Raum erstellen</div>
        <input type="text" id="ul-host-name" class="player-input" placeholder="Dein Name" value="Host" style="margin-bottom:15px;">
        <button class="btn-primary" onclick="UnifiedLobby.hostRoom()">Raum erstellen</button>
      </div>
      <div class="card" style="text-align:center;">
        <div class="card-label">🔑 Raum beitreten</div>
        <input type="text" id="ul-guest-name" class="player-input" placeholder="Dein Name" value="" style="margin-bottom:10px;">
        <input type="text" id="ul-join-code" class="player-input" placeholder="Raum-Code (z.B. AB12)" style="margin-bottom:15px; text-transform:uppercase;">
        <button class="btn-primary" onclick="UnifiedLobby.joinRoom()">Beitreten</button>
      </div>
    `;
  },

  /* ===== CLIPBOARD HELPER ===== */
  copyRoomCode() {
    const code = Multiplayer.hostId;
    if (!code) return;
    
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById('ul-copy-btn');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Kopiert! ✅';
        btn.classList.add('btn-success');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-success');
        }, 2000);
      }
    }).catch(err => {
      console.error('Copy failed', err);
    });
  },

  /* ===== GENERATE 4-CHAR CODE ===== */
  _generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  },

  /* ===== HOST: CREATE ROOM ===== */
  hostRoom() {
    const nameInput = document.getElementById('ul-host-name');
    const hostName = (nameInput && nameInput.value ? nameInput.value : '').trim() || 'Host';
    const roomCode = this._generateRoomCode();

    // Init game state
    this.currentGame.state.players = [{ id: 'host-1', name: hostName, connection: null }];
    this.currentGame.state.myName = hostName;
    this.currentGame.state.mode = 'online';

    Multiplayer.mode = 'internet';
    Multiplayer.createRoom(roomCode, hostName);

    // Show connecting screen
    Router.go('play');
    document.getElementById('play-game-name').textContent = this.currentGame.name + ' — Online';
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding: 40px 10px;">
        <div class="card-label">Raum wird erstellt...</div>
        <h3>Bitte kurz warten.</h3>
      </div>
    `;
  },

  /* ===== GUEST: JOIN ROOM ===== */
  joinRoom() {
    const nameInput = document.getElementById('ul-guest-name');
    const codeInput = document.getElementById('ul-join-code');
    const guestName = (nameInput && nameInput.value ? nameInput.value : '').trim();
    const code = (codeInput && codeInput.value ? codeInput.value : '').trim().toUpperCase();

    if (!guestName) return alert('Bitte gib deinen Namen ein!');
    if (!code) return alert('Bitte gib den Raum-Code ein!');

    this.currentGame.state.myName = guestName;
    this.currentGame.state.mode = 'online';

    Multiplayer.mode = 'internet';
    Multiplayer.joinRoom(code);

    // Show connecting screen
    Router.go('play');
    document.getElementById('play-game-name').textContent = this.currentGame.name + ' — Online';
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding: 40px 10px;">
        <div class="card-label">Verbinde...</div>
        <h3>Auf Host warten.</h3>
      </div>
    `;
  },

  /* ===== MULTIPLAYER CALLBACKS ===== */
  _wireCallbacks() {
    Multiplayer.onStatusChange = (status, msg) => this._handleStatus(status, msg);
    Multiplayer.onDataReceived = (data, conn) => this._handleData(data, conn);
    Multiplayer.onPlayerJoined = (conn) => { if (this.isInLobby) this._updateHostLobby(); };
    Multiplayer.onPlayerLeft = (conn) => {
      // Remove player from game state
      if (Multiplayer.role === 'host' && this.currentGame && this.currentGame.state) {
        this.currentGame.state.players = this.currentGame.state.players.filter(p => p.connection !== conn);
        if (this.isInLobby) this._updateHostLobby();
      }
    };
  },

  _handleStatus(status, msg) {
    if (status === 'connected') {
      if (Multiplayer.role === 'host') {
        if (this.isInLobby) this._updateHostLobby();
      } else if (Multiplayer.role === 'guest') {
        // Send join message to host
        Multiplayer.sendToHost({
          type: 'join',
          name: this.currentGame.state.myName,
          myId: Multiplayer.myId
        });
        // Show guest waiting screen
        this._renderGuestLobby();
      }
    } else if (status === 'error') {
      alert('Netzwerkfehler: ' + msg);
    }
  },

  _handleData(data, conn) {
    const game = this.currentGame;
    if (!game) return;

    // HOST receives data
    if (Multiplayer.role === 'host') {
      if (data.type === 'join') {
        // Add player if not already in list
        if (!game.state.players.find(p => p.id === data.myId)) {
          game.state.players.push({ id: data.myId, name: data.name, connection: conn });
          if (this.isInLobby) this._updateHostLobby();
          // Send updated player list and current state to all guests
          this._broadcastPlayerList();
        }
      } else if (data.type === 'name_change') {
        const player = game.state.players.find(p => p.id === data.myId);
        if (player) {
          player.name = data.name;
          if (this.isInLobby) this._updateHostLobby();
          this._broadcastPlayerList();
        }
      } else {
        // Forward game-specific data
        if (game.handleOnlineData) game.handleOnlineData(data, conn);
      }
    }
    // GUEST receives data
    else {
      if (data.type === 'player_list') {
        game.state.players = data.players.map(p => ({ id: p.id, name: p.name, connection: null }));
        this._renderGuestLobby();
      } else if (data.type === 'game_start') {
        // Host says go! Pass settings along
        if (game.onOnlineGameStart) {
          game.onOnlineGameStart(data.settings || {});
        }
      } else {
        // Forward game-specific data
        if (game.handleOnlineData) game.handleOnlineData(data, conn);
      }
    }
  },

  _broadcastPlayerList() {
    const game = this.currentGame;
    if (!game) return;
    Multiplayer.sendGameState({
      type: 'player_list',
      players: game.state.players.map(p => ({ id: p.id, name: p.name }))
    });
  },

  /* ===== HOST LOBBY UI ===== */
  _updateHostLobby() {
    this.isInLobby = true;
    if (Multiplayer.role !== 'host') return;
    const game = this.currentGame;

    // Game-specific HTML (packages, timer, etc.)
    let setupHTML = '';
    if (game.renderHostSetup) setupHTML = game.renderHostSetup();

    let playerListHTML = game.state.players.map(p => `
      <div style="background:var(--surface2); padding:10px 15px; border-radius:8px; margin-bottom:5px; font-weight:bold; display:flex; align-items:center; gap:8px;">
        <span>👤</span> ${p.name} ${p.id === 'host-1' ? '<span style="color:var(--primary); font-size:0.8em;">(Host)</span>' : ''}
      </div>
    `).join('');

    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center;">
        <div class="card-label">Raum-Code</div>
        <h1 style="color:var(--primary); font-size: 3rem; letter-spacing: 0.15em; font-family:'Abril Fatface', cursive; margin:10px 0;">${Multiplayer.hostId}</h1>
        <button id="ul-copy-btn" class="btn-primary" style="background:#ff3366; color:white; font-size:0.8rem; padding: 10px 25px; margin-bottom:10px; width: auto; border:none;" onclick="UnifiedLobby.copyRoomCode()">Kopieren 📋</button>
        <p style="color:var(--text-muted); font-size:0.85rem;">Teile diesen Code mit deinen Mitspielern</p>
      </div>
      <div class="card">
        <div class="card-label">${(game && game.name === 'Busfahrer' && game.state.cheatMode) ? '👤' : '👥'} Spieler (${game.state.players.length})</div>
        <div class="players-list">${playerListHTML}</div>
      </div>
      <div class="card">
        <div class="card-label">Dein Name</div>
        <div style="display:flex; gap:8px;">
          <input type="text" id="ul-host-name-change" class="player-input" value="${game.state.myName}" style="flex:1;">
          <button class="btn-primary" style="white-space:nowrap;" onclick="UnifiedLobby._changeHostName()">✓ Ändern</button>
        </div>
      </div>
      ${setupHTML}
      <button class="btn-primary" style="margin-top:15px; font-size: 1.3rem; padding: 20px; width:100%;" onclick="UnifiedLobby._startGame()">🚀 Spiel starten</button>
    `;

    // Let the game do post-render work (e.g., rendering package toggles)
    if (game.onHostLobbyRendered) game.onHostLobbyRendered();
  },

  _changeHostName() {
    const input = document.getElementById('ul-host-name-change');
    const newName = (input && input.value ? input.value : '').trim();
    if (!newName) return;
    const game = this.currentGame;
    game.state.myName = newName;
    const hostPlayer = game.state.players.find(p => p.id === 'host-1');
    if (hostPlayer) hostPlayer.name = newName;
    this._updateHostLobby();
    this._broadcastPlayerList();
  },

  _startGame() {
    const game = this.currentGame;
    // Collect game-specific settings
    let settings = {};
    if (game.collectOnlineSettings) settings = game.collectOnlineSettings();

    // Broadcast start to all guests
    Multiplayer.sendGameState({ type: 'game_start', settings: settings });

    // Start game locally on host
    if (game.onOnlineGameStart) {
      this.isInLobby = false;
      game.onOnlineGameStart(settings);
    }
  },

  /* ===== GUEST LOBBY UI ===== */
  _renderGuestLobby() {
    const game = this.currentGame;

    let playerListHTML = '';
    if (game.state.players && game.state.players.length > 0) {
      playerListHTML = game.state.players.map(p => `
        <div style="background:var(--surface2); padding:10px 15px; border-radius:8px; margin-bottom:5px; font-weight:bold; display:flex; align-items:center; gap:8px;">
          <span>👤</span> ${p.name}
        </div>
      `).join('');
    } else {
      playerListHTML = '<div style="color:var(--text-muted);">Warte auf Spielerliste...</div>';
    }

    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center;">
        <div class="card-label">Verbunden mit Raum</div>
        <h1 style="color:var(--primary); font-size: 3rem; letter-spacing: 0.15em; font-family:'Abril Fatface', cursive; margin:10px 0;">${Multiplayer.hostId}</h1>
        <button id="ul-copy-btn" class="btn-primary" style="background:#ff3366; color:white; font-size:0.8rem; padding: 10px 25px; margin-bottom:10px; width: auto; border:none;" onclick="UnifiedLobby.copyRoomCode()">Kopieren 📋</button>
        <div style="color:var(--green); font-weight:bold;">✅ Verbunden</div>
      </div>
      <div class="card">
        <div class="card-label">Dein Name</div>
        <div style="display:flex; gap:8px;">
          <input type="text" id="ul-guest-name-change" class="player-input" value="${game.state.myName}" style="flex:1;">
          <button class="btn-primary" style="white-space:nowrap;" onclick="UnifiedLobby._changeGuestName()">✓ Ändern</button>
        </div>
      </div>
      <div class="card">
        <div class="card-label">${(game && game.name === 'Busfahrer' && game.state.cheatMode) ? '👤' : '👥'} Spieler im Raum</div>
        <div class="players-list">${playerListHTML}</div>
      </div>
      <div class="card" style="text-align:center;">
        <h3 style="color:var(--text-muted);">⏳ Warte darauf, dass der Host das Spiel startet...</h3>
      </div>
    `;
  },

  _changeGuestName() {
    const input = document.getElementById('ul-guest-name-change');
    const newName = (input && input.value ? input.value : '').trim();
    if (!newName) return;
    this.currentGame.state.myName = newName;
    Multiplayer.sendToHost({
      type: 'name_change',
      myId: Multiplayer.myId,
      name: newName
    });
  }
};
