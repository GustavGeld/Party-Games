/* ===================================================
   SharedRoom — Persistenter Multiplayer-Raum
   Spieler können den Raum betreten und darin das Spiel
   wechseln ohne neu verbinden zu müssen.
   =================================================== */

const SharedRoom = {
  isActive: false,
  selectedGameId: null,    // ID of the game currently selected by host
  isInLobby: false,

  /* ===== ENTRY POINT ===== */
  open() {
    this.isActive = true;
    this.isInLobby = false;
    this.selectedGameId = GAMES.find(g => g.supportsOnline !== false)?.id || null;

    this._wireCallbacks();

    Router.go('setup');
    document.getElementById('setup-title').textContent = '🏠 Gemeinsamer Raum';
    document.getElementById('setup-content').innerHTML = `
      <div class="card" style="text-align:center;">
        <div class="card-label">🏠 Raum erstellen</div>
        <input type="text" id="sr-host-name" class="player-input" placeholder="Dein Name" value="Host" style="margin-bottom:15px;">
        <button class="btn-primary" onclick="SharedRoom.hostRoom()">Raum erstellen</button>
      </div>
      <div class="card" style="text-align:center;">
        <div class="card-label">🔑 Raum beitreten</div>
        <input type="text" id="sr-guest-name" class="player-input" placeholder="Dein Name" value="" style="margin-bottom:10px;">
        <input type="text" id="sr-join-code" class="player-input" placeholder="Raum-Code (z.B. AB12)" style="margin-bottom:15px; text-transform:uppercase;">
        <button class="btn-primary" onclick="SharedRoom.joinRoom()">Beitreten</button>
      </div>
    `;
  },

  _generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  },

  /* ===== STATE ===== */
  state: {
    players: [],
    myName: 'Host',
    mode: 'online'
  },

  /* ===== HOST ===== */
  hostRoom() {
    const nameInput = document.getElementById('sr-host-name');
    const hostName = (nameInput?.value || '').trim() || 'Host';
    const roomCode = this._generateRoomCode();

    this.state.players = [{ id: 'host-1', name: hostName, connection: null, isHost: true }];
    this.state.myName = hostName;
    this.state.mode = 'online';
    this.selectedGameId = GAMES.find(g => g.supportsOnline !== false)?.id || null;

    Multiplayer.mode = 'internet';
    Multiplayer.createRoom(roomCode, hostName);

    Router.go('play');
    document.getElementById('play-game-name').textContent = '🏠 Gemeinsamer Raum';
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:40px 10px;">
        <div class="card-label">Raum wird erstellt...</div>
        <h3>Bitte kurz warten.</h3>
      </div>
    `;
  },

  /* ===== GUEST ===== */
  joinRoom() {
    const nameInput = document.getElementById('sr-guest-name');
    const codeInput = document.getElementById('sr-join-code');
    const guestName = (nameInput?.value || '').trim();
    const code = (codeInput?.value || '').trim().toUpperCase();

    if (!guestName) return alert('Bitte gib deinen Namen ein!');
    if (!code) return alert('Bitte gib den Raum-Code ein!');

    this.state.myName = guestName;
    this.state.mode = 'online';

    Multiplayer.mode = 'internet';
    Multiplayer.joinRoom(code);

    Router.go('play');
    document.getElementById('play-game-name').textContent = '🏠 Gemeinsamer Raum';
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:40px 10px;">
        <div class="card-label">Verbinde...</div>
        <h3>Auf Host warten.</h3>
      </div>
    `;
  },

  /* ===== CALLBACKS ===== */
  _wireCallbacks() {
    Multiplayer.onStatusChange = (status, msg) => this._handleStatus(status, msg);
    Multiplayer.onDataReceived = (data, conn) => this._handleData(data, conn);
    Multiplayer.onPlayerJoined = (conn) => { if (this.isInLobby) this._renderHostLobby(); };
    Multiplayer.onPlayerLeft = (conn) => {
      this.state.players = this.state.players.filter(p => p.connection !== conn);
      if (this.isInLobby) this._renderHostLobby();
    };
  },

  _handleStatus(status, msg) {
    if (status === 'connected') {
      if (Multiplayer.role === 'host') {
        this.isInLobby = true;
        this._renderHostLobby();
      } else {
        Multiplayer.sendToHost({
          type: 'sr_join',
          name: this.state.myName,
          myId: Multiplayer.myId
        });
        this._renderGuestLobby({ players: [], selectedGameId: null });
      }
    } else if (status === 'error') {
      alert('Netzwerkfehler: ' + msg);
    }
  },

  _handleData(data, conn) {
    // Intercept return to lobby messages
    if (data.type === 'return_lobby' || data.type === 'back_to_lobby' || data.type === 'sr_return_to_lobby') {
      this.isInLobby = true;
      if (Multiplayer.role === 'host') {
        this._renderHostLobby();
      } else {
        this._renderGuestLobby({ players: this.state.players, selectedGameId: this.selectedGameId });
      }
      return;
    }

    if (Multiplayer.role === 'host') {
      if (data.type === 'sr_join') {
        if (!this.state.players.find(p => p.id === data.myId)) {
          this.state.players.push({ id: data.myId, name: data.name, connection: conn, isHost: false });
          if (typeof Multiplayer !== 'undefined') {
            Multiplayer.players = this.state.players.map(p => ({ id: p.id, name: p.name }));
          }
          if (this.isInLobby) this._renderHostLobby();
          this._broadcastLobbyState();
        }
      } else if (data.type === 'sr_name_change') {
        const p = this.state.players.find(p => p.id === data.myId);
        if (p) { p.name = data.name; if (this.isInLobby) this._renderHostLobby(); this._broadcastLobbyState(); }
      } else {
        // Forward game-specific data to the active module
        const gameWrapper = GAMES.find(g => g.id === this.selectedGameId);
        if (gameWrapper && gameWrapper.module && gameWrapper.module.handleOnlineData) {
          gameWrapper.module.handleOnlineData(data, conn);
        }
      }
    } else {
      if (data.type === 'sr_lobby_state') {
        this.selectedGameId = data.selectedGameId;
        this.state.players = data.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost, connection: null }));
        this._renderGuestLobby(data);
      } else if (data.type === 'sr_game_start') {
        this.selectedGameId = data.gameId;
        const gameWrapper = GAMES.find(g => g.id === data.gameId);
        if (!gameWrapper) return;
        const gameModule = gameWrapper.module;
        if (!gameModule) return;

        // Patch game state with our player info
        if (!gameModule.state) gameModule.state = {};
        gameModule.state.players = data.players;
        gameModule.state.myName = this.state.myName;
        gameModule.state.mode = 'online';
        this.isInLobby = false;

        const settings = data.settings || {};
        settings.players = data.players;

        if (gameModule.onOnlineGameStart) {
          gameModule.onOnlineGameStart(settings);
        }
      } else if (data.type === 'sr_return_to_lobby') {
        // Host returned everyone to the shared lobby after a game
        this.isInLobby = true;
        this._renderGuestLobby({ players: this.state.players, selectedGameId: this.selectedGameId });
      } else {
        // Forward game-specific data to the active module
        const gameWrapper = GAMES.find(g => g.id === this.selectedGameId);
        if (gameWrapper && gameWrapper.module && gameWrapper.module.handleOnlineData) {
          gameWrapper.module.handleOnlineData(data, conn);
        }
      }
    }
  },

  _broadcastLobbyState() {
    Multiplayer.sendGameState({
      type: 'sr_lobby_state',
      players: this.state.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost || false })),
      selectedGameId: this.selectedGameId
    });
  },

  /* ===== HOST LOBBY ===== */
  _renderHostLobby() {
    this.isInLobby = true;
    const onlineGames = GAMES.filter(g => g.supportsOnline !== false);
    const gameWrapper = onlineGames.find(g => g.id === this.selectedGameId) || onlineGames[0];
    this.selectedGameId = gameWrapper?.id;
    const gameModule = gameWrapper?.module;

    let setupHTML = '';
    if (gameModule && gameModule.renderHostSetup) setupHTML = gameModule.renderHostSetup();

    const playerListHTML = this.state.players.map(p => `
      <div style="background:var(--surface2); padding:10px 15px; border-radius:8px; margin-bottom:5px; font-weight:bold; display:flex; align-items:center; gap:8px;">
        <span>${p.isHost ? '👑' : '👤'}</span> ${p.name} ${p.isHost ? '<span style="color:var(--primary); font-size:0.8em;">(Host)</span>' : ''}
      </div>
    `).join('');

    const gameOptionsHTML = onlineGames.map(g => `
      <option value="${g.id}" ${g.id === this.selectedGameId ? 'selected' : ''}>${g.emoji} ${g.name}</option>
    `).join('');

    document.getElementById('play-game-name').textContent = '🏠 Gemeinsamer Raum';
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center;">
        <div class="card-label">Raum-Code</div>
        <h1 style="color:var(--primary); font-size:3rem; letter-spacing:0.15em; font-family:'Abril Fatface',cursive; margin:10px 0;">${Multiplayer.hostId}</h1>
        <button class="btn-primary" style="background:#ff3366; color:white; font-size:0.8rem; padding:10px 25px; margin-bottom:10px; width:auto; border:none; transition: all 0.3s;" onclick="SharedRoom.copyCode(this)">Kopieren 📋</button>
      </div>
      <div class="card">
        <div class="card-label">👥 Spieler (${this.state.players.length})</div>
        <div class="players-list">${playerListHTML}</div>
      </div>
      <div class="card">
        <div class="card-label">Dein Name</div>
        <div style="display:flex; gap:8px;">
          <input type="text" id="sr-host-name-change" class="player-input" value="${this.state.myName}" style="flex:1;">
          <button class="btn-primary" style="white-space:nowrap;" onclick="SharedRoom._changeHostName()">✓ Ändern</button>
        </div>
      </div>
      <div class="card">
        <div class="card-label">🎮 Spiel auswählen</div>
        <select id="sr-game-select" class="input-field" style="width:100%; padding:12px; border-radius:8px; background:var(--bg-card); border:1px solid var(--border); color:var(--text); font-size:1rem; margin-bottom:0.5rem;" onchange="SharedRoom._onGameChange(this.value)">
          ${gameOptionsHTML}
        </select>
      </div>
      ${setupHTML}
      <button class="btn-primary" style="margin-top:15px; font-size:1.3rem; padding:20px; width:100%;" onclick="SharedRoom._startGame()">🚀 Spiel starten</button>
    `;

    if (gameModule && gameModule.onHostLobbyRendered) gameModule.onHostLobbyRendered();
  },

  _onGameChange(gameId) {
    this.selectedGameId = gameId;
    this._broadcastLobbyState();
    this._renderHostLobby();
  },

  _changeHostName() {
    const input = document.getElementById('sr-host-name-change');
    const newName = (input?.value || '').trim();
    if (!newName) return;
    this.state.myName = newName;
    const hostPlayer = this.state.players.find(p => p.id === 'host-1');
    if (hostPlayer) hostPlayer.name = newName;
    this._renderHostLobby();
    this._broadcastLobbyState();
  },

  _startGame() {
    const gameWrapper = GAMES.find(g => g.id === this.selectedGameId);
    if (!gameWrapper) return alert('Kein Spiel ausgewählt!');
    const gameModule = gameWrapper.module;
    if (!gameModule) return alert('Spielmodul nicht geladen!');

    let settings = {};
    if (gameModule.collectOnlineSettings) settings = gameModule.collectOnlineSettings();

    // Patch game state
    if (!gameModule.state) gameModule.state = {};
    gameModule.state.players = this.state.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost, connection: p.connection }));
    gameModule.state.myName = this.state.myName;
    gameModule.state.mode = 'online';

    // Broadcast to guests
    const cleanPlayers = this.state.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost || false }));
    settings.players = cleanPlayers;
    
    if (typeof Multiplayer !== 'undefined') {
      Multiplayer.players = cleanPlayers;
    }

    Multiplayer.sendGameState({
      type: 'sr_game_start',
      gameId: this.selectedGameId,
      settings: settings,
      players: cleanPlayers
    });

    this.isInLobby = false;

    // Host also starts the game
    if (gameModule.onOnlineGameStart) {
      gameModule.onOnlineGameStart(settings);
    }
  },

  /* ===== GUEST LOBBY ===== */
  _renderGuestLobby(data = {}) {
    const players = data.players || this.state.players || [];
    const gameId = data.selectedGameId || this.selectedGameId;
    const selectedGame = GAMES.find(g => g.id === gameId);
    const gameName = selectedGame ? `${selectedGame.emoji} ${selectedGame.name}` : 'Kein Spiel ausgewählt';

    const playerListHTML = players.length > 0
      ? players.map(p => `
          <div style="background:var(--surface2); padding:10px 15px; border-radius:8px; margin-bottom:5px; font-weight:bold; display:flex; align-items:center; gap:8px;">
            <span>${p.isHost ? '👑' : '👤'}</span> ${p.name}
          </div>
        `).join('')
      : '<div style="color:var(--text-muted);">Warte auf Spielerliste...</div>';

    document.getElementById('play-game-name').textContent = '🏠 Gemeinsamer Raum';
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center;">
        <div class="card-label">Verbunden mit Raum</div>
        <h1 style="color:var(--primary); font-size:3rem; letter-spacing:0.15em; font-family:'Abril Fatface',cursive; margin:10px 0;">${Multiplayer.hostId}</h1>
        <div style="color:var(--green); font-weight:bold;">✅ Verbunden</div>
      </div>
      <div class="card">
        <div class="card-label">Dein Name</div>
        <div style="display:flex; gap:8px;">
          <input type="text" id="sr-guest-name-change" class="player-input" value="${this.state.myName}" style="flex:1;">
          <button class="btn-primary" style="white-space:nowrap;" onclick="SharedRoom._changeGuestName()">✓ Ändern</button>
        </div>
      </div>
      <div class="card">
        <div class="card-label">👥 Spieler im Raum</div>
        <div class="players-list">${playerListHTML}</div>
      </div>
      <div class="card" style="text-align:center;">
        <div class="card-label">🎮 Ausgewähltes Spiel</div>
        <div style="font-size:1.3rem; font-weight:bold; margin-top:5px;">${gameName}</div>
      </div>
      <div class="card" style="text-align:center;">
        <h3 style="color:var(--text-muted);">⏳ Warte darauf, dass der Host das Spiel startet...</h3>
      </div>
    `;
  },

  _changeGuestName() {
    const input = document.getElementById('sr-guest-name-change');
    const newName = (input?.value || '').trim();
    if (!newName) return;
    this.state.myName = newName;
    Multiplayer.sendToHost({ type: 'sr_name_change', myId: Multiplayer.myId, name: newName });
  },

  copyCode(btn) {
    if (!Multiplayer.hostId) return;
    navigator.clipboard.writeText(Multiplayer.hostId);
    const oldText = btn.innerHTML;
    btn.innerHTML = 'Kopiert! ✅';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.innerHTML = oldText;
      btn.style.background = '#ff3366';
    }, 2000);
  },

  /* ===== RETURN TO LOBBY (called after a game ends) ===== */
  returnToLobby() {
    if (!this.isActive) return;
    this.isInLobby = true;
    this._wireCallbacks();

    if (Multiplayer.role === 'host') {
      // Broadcast return to lobby to all guests
      Multiplayer.sendGameState({
        type: 'sr_return_to_lobby',
        players: this.state.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost || false })),
        selectedGameId: this.selectedGameId
      });
      Router.go('play');
      this._renderHostLobby();
    } else {
      Router.go('play');
      this._renderGuestLobby({ players: this.state.players, selectedGameId: this.selectedGameId });
    }
  }
};
