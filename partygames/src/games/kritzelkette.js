const KritzelPackages = [
  { id: 'standard', name: 'Standard', emoji: '🍎', tasks: ['Hund', 'Katze', 'Baum', 'Haus', 'Auto', 'Sonne', 'Mond', 'Apfel', 'Banane', 'Tasse', 'Uhr', 'Schuh', 'Fahrrad', 'Blume', 'Flugzeug', 'Computer', 'Gitarre', 'Elefant', 'Giraffe', 'Schmetterling', 'Regenbogen', 'Pinguin', 'Pizza', 'Eiscreme', 'Kamera', 'Brille', 'Regenschirm', 'Kaktus', 'Löwe', 'Erdbeere', 'Handy', 'Taschenlampe', 'Zahnbürste', 'Kuchen', 'Hubschrauber', 'Feuerwehr', 'Polizei', 'Pferd', 'Fußball', 'Vogel'] },
  { id: '18plus', name: 'Zweideutig', emoji: '🌶️', tasks: ['Bier', 'Wein', 'Betrunkener', 'Hangover', 'Striptease', 'Kuss', 'Po', 'Toilette', 'Handschellen', 'Peitsche', 'Sektkorken', 'Bett', 'Dusche', 'Kondom', 'Sperma', 'Orgasmus', 'Vibrator', 'Leder', 'Dessous', 'Gleitgel', 'Fesselung', 'Lust', 'Stöhnen', 'Nackt', 'Vorhaut', 'Busen', 'Hoden', 'Eierstock', 'Kamamasutra', 'Loch', 'Stange', 'Gurke', 'Melone', 'Sahne', 'Saugen', 'Blasen', 'Lecken', 'Reiten', 'Kommen', 'Dreier'] },
  { id: 'filme', name: 'Filme', emoji: '🍿', tasks: ['Titanic', 'Avatar', 'Star Wars', 'Harry Potter', 'Matrix', 'Der Herr der Ringe', 'Spiderman', 'Batman', 'Der König der Löwen', 'Jurassic Park', 'Inception', 'Pulp Fiction', 'Forrest Gump', 'Gladiator', 'Fight Club', 'Der Pate', 'Shrek', 'Findet Nemo', 'Fluch der Karibik', 'Iron Man', 'The Avengers', 'Joker', 'Die Eiskönigin', 'Toy Story', 'Terminator', 'James Bond', 'Indiana Jones', 'E.T.', 'Der Weiße Hai', 'Psycho', 'Star Trek', 'Alien', 'Blade Runner', 'The Green Mile', 'Saw', 'Scream', 'Ghostbusters', 'Back to the Future', 'Die Hard', 'Rocky'] },
  { id: 'gaming', name: 'Gaming', emoji: '🎮', tasks: ['Mario', 'Minecraft', 'Pikachu', 'Controller', 'Headset', 'Fortnite Lama', 'Tetris', 'Link (Zelda)', 'Master Chief', 'Lara Croft', 'Sonic', 'Donkey Kong', 'Pac-Man', 'Snake (MGS)', 'Geralt von Riva', 'Kratos', 'Bowser', 'Yoshi', 'Cloud Strife', 'Steve (Minecraft)', 'Enderman', 'Creeper', 'Pokéball', 'Gameboy', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Among Us Crewmate', 'Angry Birds', 'Candy Crush', 'Roblox', 'Valorant', 'League of Legends', 'World of Warcraft', 'Skyrim', 'GTA V', 'Red Dead Redemption', 'Cyberpunk 2077', 'Elden Ring', 'Dark Souls'] },
  { id: 'cartoons', name: 'Cartoons', emoji: '🎨', tasks: ['Bugs Bunny', 'Asterix', 'Micky Maus', 'Homer Simpson', 'SpongeBob', 'Pikachu', 'Scooby-Doo', 'Tom & Jerry', 'Sailor Moon', 'Shrek'] },
  { id: 'schule', name: 'Schulen', emoji: '📚', tasks: ['Mathematik', 'Deutsch', 'Sportunterricht', 'Musik', 'Kunst', 'Geschichte', 'Biologie', 'Chemie', 'Physik', 'Geografie'] },
  { id: 'sport', name: 'Sportarten', emoji: '⚽', tasks: ['Fußball', 'Basketball', 'Tennis', 'Schwimmen', 'Boxen', 'Golf', 'Yoga', 'Skifahren', 'Reiten', 'Radfahren'] },
  { id: 'berufe', name: 'Berufe', emoji: '👨‍🔧', tasks: ['Koch', 'Arzt', 'Feuerwehrmann', 'Polizist', 'Pilot', 'Gärtner', 'Maler', 'Astronaut', 'Friseur', 'Detektiv'] }
];

const KritzelGame = {
  name: "Kritzel-Kette",
  state: {
    mode: null,
    players: [], // Offline: strings. Online: {id, name, connection}
    activePackageIds: ['standard'],
    round: 0,
    p_index: 0, // offline current player index
    chains: [],
    myName: '', // guest
    submissions: 0, // online
    timeLimitDraw: 60,
    timeLimitGuess: 30,
    startWithWriting: false, // New setting: Write own word at start?
    timerInterval: null,
    timeLeft: 0,
    shift: 1 // Randomized shift for chain distribution
  },

  /* ================= UnifiedLobby v2 HOOKS ================= */

  // Called by UnifiedLobby to collect settings before broadcasting game_start
  collectOnlineSettings() {
    return {
      activePackageIds: [...this.state.activePackageIds],
      timeLimitDraw: this.state.timeLimitDraw,
      timeLimitGuess: this.state.timeLimitGuess,
      startWithWriting: this.state.startWithWriting
    };
  },

  // Called on BOTH host and guest when host clicks "Spiel starten"
  onOnlineGameStart(settings) {
    this.state.mode = 'online';
    this.state.players = settings.players || [];
    this.state.activePackageIds = settings.activePackageIds || ['standard'];
    this.state.timeLimitDraw = settings.timeLimitDraw || 60;
    this.state.timeLimitGuess = settings.timeLimitGuess || 30;
    this.state.startWithWriting = !!settings.startWithWriting;

    Router.go('play');
    document.getElementById('play-game-name').textContent = 'KritzelKette';

    if (Multiplayer.role === 'host') {
      this.startActualOnlineGame();
    } else {
      document.getElementById('play-content').innerHTML = `
        <div class="card" style="text-align:center; padding: 40px 10px;">
          <h3>⏳ Warte auf den Host...</h3>
        </div>
      `;
    }

    if (Multiplayer.role === 'host') {
      const btn = document.createElement('button');
      btn.className = 'btn-primary';
      btn.style = 'background:var(--surface2); color:var(--text); margin-top:20px; width:auto;';
      btn.textContent = '🏠 Zurück zur Lobby';
      btn.onclick = () => hostReturnToLobby();
      document.getElementById('play-content').appendChild(btn);
    }
  },

  // Called by UnifiedLobby for game-specific data (drawings, guesses, results)
  returnToLobby() {
    if (Multiplayer.role === 'host') {
      hostReturnToLobby();
    }
  },

  handleOnlineData(data, conn) {
    const s = this.state;

    // HOST receives data
    if (Multiplayer.role === 'host') {
      if (data.type === 'action') {
        s.submissions = s.submissions || 0;
        const chain = s.chains[data.chainIndex];
        if (chain) {
          chain.entries.push({ type: data.actionType, playerId: data.myId, playerName: data.name, value: data.value });
        }
        s.submissions++;

        if (s.submissions >= s.players.length) {
          s.submissions = 0;
          s.round++;
          this.nextOnlineRound();
        }
      }
    }
    // GUEST receives data
    else {
      if (data.type === 'turn') {
        // Only process if it's meant for us
        if (data.targetPlayerId && data.targetPlayerId !== Multiplayer.myId) return;

        s.round = data.round;
        s.myTurnData = data;
        s.isGameOver = false;
        this.renderActionScreen(data.actionType, data.prevValue, data.chainIndex, data.isOnline);
      } else if (data.type === 'results') {
        s.chains = data.chains;
        this.renderResultScreen();
      }
    }
  },

  open() {
    // Start Screen
    Router.go('setup');
    document.getElementById('setup-title').textContent = 'KritzelKette';
    
    document.getElementById('setup-content').innerHTML = `
      <div class="card">
        <div class="card-label">W\u00E4hle deinen Modus</div>
        <button class="btn-primary" style="margin-bottom:15px; background:var(--green); color:#000;" onclick="KritzelGame.setupOffline()">
           \uD83D\uDCF1 Offline (Ein Ger\u00E4t teilen)
        </button>
        <button class="btn-primary" onclick="UnifiedLobby.open(KritzelGame)">
           \uD83C\uDF10 Online (Jeder ein Ger\u00E4t)
        </button>
      </div>
    `;
  },

  /* ================= OFFLINE SETUP ================= */
  setupOffline() {
    this.state.mode = 'offline';
    this.state.players = ['Anna', 'Bert', 'Clara'];
    this.renderOfflineStart();
  },

  renderOfflineStart() {
    let ht = `
      <div class="card">
        <div class="card-label">👥 Spieler verwalten</div>
        <div class="players-list" id="kk-players-list"></div>
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px; font-size: 0.9rem;" onclick="KritzelGame.addOfflinePlayer()">＋ Spieler hinzufügen</button>
      </div>

      <div class="card">
        <div class="card-label">⚙️ Spiel-Regeln</div>
        <div style="display:flex; flex-direction:column; gap:15px;">
           <div style="display:flex; align-items:center; justify-content:space-between; background:var(--surface2); padding:15px; border-radius:12px; cursor:pointer;" onclick="document.getElementById('kk-write-toggle-off').click()">
              <div style="text-align:left;">
                <strong style="display:block; font-size:1.1rem;">Eigene Startwörter</strong>
                <small style="color:var(--text-muted);">Jeder schreibt am Anfang einen eigenen Begriff.</small>
              </div>
              <div class="toggle-switch">
                <input type="checkbox" id="kk-write-toggle-off" ${this.state.startWithWriting ? 'checked' : ''} onchange="KritzelGame.state.startWithWriting = this.checked; KritzelGame.renderOfflineStart()">
                <span class="slider"></span>
              </div>
           </div>
        </div>
      </div>
      
      ${!this.state.startWithWriting ? `
      <div class="card">
        <div class="card-label">📦 Wörter-Pakete</div>
        <div class="packages-grid" id="kk-pkg-grid"></div>
      </div>
      ` : ''}
      <div class="card">
        <div class="card-label">⏱️ Zeitlimit: Zeichnen</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="15" max="180" step="15" value="${this.state.timeLimitDraw}" 
             style="--pct: ${((this.state.timeLimitDraw - 15) / (180 - 15)) * 100}%"
             oninput="
               document.getElementById('kk-time-draw-val').textContent = this.value + 's'; 
               KritzelGame.state.timeLimitDraw = parseInt(this.value);
               this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="kk-time-draw-val" style="font-weight:bold; width: 50px; text-align:right;">${this.state.timeLimitDraw}s</span>
        </div>
      </div>
      <div class="card">
        <div class="card-label">⏱️ Zeitlimit: Erraten</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="10" max="120" step="10" value="${this.state.timeLimitGuess}" 
             style="--pct: ${((this.state.timeLimitGuess - 10) / (120 - 10)) * 100}%"
             oninput="
               document.getElementById('kk-time-guess-val').textContent = this.value + 's'; 
               KritzelGame.state.timeLimitGuess = parseInt(this.value);
               this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="kk-time-guess-val" style="font-weight:bold; width: 50px; text-align:right;">${this.state.timeLimitGuess}s</span>
        </div>
      </div>
      <div id="kk-warn"></div>
      <button class="btn-primary" id="kk-start-btn" onclick="KritzelGame.startOfflineGame()">🚀 Weiter</button>
    `;
    document.getElementById('setup-content').innerHTML = ht;
    this.renderOfflinePlayers();
    this.renderPackages();
  },

  renderOfflinePlayers() {
    const list = document.getElementById('kk-players-list');
    if(!list) return;
    list.innerHTML = this.state.players.map((name, i) => `
      <div class="player-row">
        <div class="player-avatar">${i + 1}</div>
        <input class="player-input" type="text" value="${name}" placeholder="Spieler ${i + 1}" oninput="KritzelGame.setOfflinePlayer(${i}, this.value)">
        ${this.state.players.length > 2 ? `<button class="btn-icon" onclick="KritzelGame.removeOfflinePlayer(${i})">✕</button>` : ''}
      </div>
    `).join('');
    this.validateStart();
  },
  
  addOfflinePlayer() {
    this.state.players.push(`Spieler ${this.state.players.length+1}`);
    this.renderOfflinePlayers();
  },
  
  removeOfflinePlayer(i) {
    if(this.state.players.length > 2) this.state.players.splice(i, 1);
    this.renderOfflinePlayers();
  },
  
  setOfflinePlayer(i, val) {
    this.state.players[i] = val;
    this.validateStart();
  },

  /* ================= UNIFIED LOBBY COMPATIBILITY ================= */
  renderHostSetup() {
    return `
      <div class="card">
        <div class="card-label">⚙️ Spiel-Regeln</div>
        <div style="display:flex; flex-direction:column; gap:15px;">
           <div style="display:flex; align-items:center; justify-content:space-between; background:var(--surface2); padding:15px; border-radius:12px; cursor:pointer;" onclick="document.getElementById('kk-write-toggle-on').click()">
              <div style="text-align:left;">
                <strong style="display:block; font-size:1.1rem;">Eigene Startwörter</strong>
                <small style="color:var(--text-muted);">Jeder schreibt am Anfang einen eigenen Begriff.</small>
              </div>
              <div class="toggle-switch">
                <input type="checkbox" id="kk-write-toggle-on" ${this.state.startWithWriting ? 'checked' : ''} onchange="KritzelGame.state.startWithWriting = this.checked; refreshLobby()">
                <span class="slider"></span>
              </div>
           </div>
        </div>
      </div>

      ${!this.state.startWithWriting ? `
      <div class="card">
        <div class="card-label">📦 Wörter-Pakete</div>
        <div class="packages-grid" id="kk-pkg-grid"></div>
      </div>
      ` : ''}
      <div class="card">
        <div class="card-label">⏱️ Zeitlimit: Zeichnen</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="15" max="180" step="15" value="${this.state.timeLimitDraw}" 
             style="--pct: ${((this.state.timeLimitDraw - 15) / (180 - 15)) * 100}%"
             oninput="
               document.getElementById('kk-time-draw-val').textContent = this.value + 's'; 
               KritzelGame.state.timeLimitDraw = parseInt(this.value);
               this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="kk-time-draw-val" style="font-weight:bold; width: 50px; text-align:right;">${this.state.timeLimitDraw}s</span>
        </div>
      </div>
      <div class="card">
        <div class="card-label">⏱️ Zeitlimit: Erraten</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="10" max="120" step="10" value="${this.state.timeLimitGuess}" 
             style="--pct: ${((this.state.timeLimitGuess - 10) / (120 - 10)) * 100}%"
             oninput="
               document.getElementById('kk-time-guess-val').textContent = this.value + 's'; 
               KritzelGame.state.timeLimitGuess = parseInt(this.value);
               this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="kk-time-guess-val" style="font-weight:bold; width: 50px; text-align:right;">${this.state.timeLimitGuess}s</span>
        </div>
      </div>
      <div id="kk-warn"></div>
    `;
  },

  onHostLobbyRendered() {
    this.renderPackages();
  },

  startOnlineGame() {
    this.startActualOnlineGame();
  },

  startActualOnlineGame() {
    const s = this.state;
    s.round = 1;
    s.submissions = 0;
    
    this.initChains();
    
    // Switch to lobby waiting UI for Host
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'KritzelKette (Host)';
    this.nextOnlineRound();
  },

  hostRoom() {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.state.players = [ { id: 'host-1', name: 'Host', connection: null } ]; // Host is player 1
    Multiplayer.createRoom(code, 'Host');
  },

  renderHostLobby(code) {
    let ht = `
      <div class="card" style="text-align:center;">
        <div class="card-label">Raum Code</div>
        <h1 style="color:var(--primary); font-size: 3rem; letter-spacing: 0.1em; font-family:'Abril Fatface', cursive;">${code}</h1>
        <p style="color:var(--text-muted);">Andere Spieler können diesen Code eingeben um beizutreten.</p>
      </div>
      <div class="card">
        <div class="card-label">👥 Lobby (${this.state.players.length})</div>
        <div class="players-list">
          ${this.state.players.map(p => `
            <div class="player-row">
              <div class="player-avatar">👤</div>
              <div class="player-input">${p.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-label">📦 Wörter-Pakete</div>
        <div class="packages-grid" id="kk-pkg-grid"></div>
      </div>
      <div class="card">
        <div class="card-label">⏱️ Zeitlimit: Zeichnen</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="15" max="180" step="15" value="${this.state.timeLimitDraw}" 
             style="--pct: ${((this.state.timeLimitDraw - 15) / (180 - 15)) * 100}%"
             oninput="
               document.getElementById('kk-time-draw-val').textContent = this.value + 's'; 
               KritzelGame.state.timeLimitDraw = parseInt(this.value);
               this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="kk-time-draw-val" style="font-weight:bold; width: 50px; text-align:right;">${this.state.timeLimitDraw}s</span>
        </div>
      </div>
      <div class="card">
        <div class="card-label">⏱️ Zeitlimit: Erraten</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="10" max="120" step="10" value="${this.state.timeLimitGuess}" 
             style="--pct: ${((this.state.timeLimitGuess - 10) / (120 - 10)) * 100}%"
             oninput="
               document.getElementById('kk-time-guess-val').textContent = this.value + 's'; 
               KritzelGame.state.timeLimitGuess = parseInt(this.value);
               this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="kk-time-guess-val" style="font-weight:bold; width: 50px; text-align:right;">${this.state.timeLimitGuess}s</span>
        </div>
      </div>
      <div id="kk-warn"></div>
      <button class="btn-primary" id="kk-start-btn" onclick="KritzelGame.startOnlineGame()">🚀 Spiel Starten</button>
    `;
    document.getElementById('setup-content').innerHTML = ht;
    this.renderPackages();
  },

  joinRoom() {
    const name = document.getElementById('join-name').value.trim();
    const code = document.getElementById('join-code').value.trim().toUpperCase();
    if(!name || !code) return alert("Bitte Name und Code eingeben!");
    this.state.myName = name;
    Multiplayer.joinRoom(code);
  },

  renderOnlineLobby(code) {
    document.getElementById('setup-content').innerHTML = `
      <div class="card" style="text-align:center;">
        <div class="card-label">Raum: ${code}</div>
        <h3>Verbunden als: ${this.state.myName}</h3>
        <br>
        <p>Warte darauf dass der Host das Spiel startet...</p>
      </div>
    `;
  },

  /* ================= PACKAGES & VALIDATION ================= */
  renderPackages() {
    const pkgGridId = 'kk-pkg-grid';
    PackageManager.renderGrid({
        namespace: 'KritzelGame',
        targetId: pkgGridId,
        packages: KritzelPackages,
        activeIds: this.state.activePackageIds,
        isMulti: true,
        onToggle: (id) => {
            const ids = this.state.activePackageIds;
            const idx = ids.indexOf(id);
            if (idx > -1) {
                if (ids.length > 1) ids.splice(idx, 1);
            } else {
                ids.push(id);
            }
            this.renderPackages();
        }
    });
    this.validateStart();
  },

  validateStart() {
    const btn = document.getElementById('kk-start-btn');
    const warn = document.getElementById('kk-warn');
    if(!btn) return;
    
    let validPlayers = true;
    if(this.state.mode === 'offline') {
      validPlayers = this.state.players.filter(p => typeof p === 'string' && p.trim()).length >= 2;
    } else {
      validPlayers = this.state.players.length >= 2; // host + 1 guest min
    }
    const ok = validPlayers && this.state.activePackageIds.length > 0;
    
    btn.disabled = !ok;
    if(warn) {
      warn.innerHTML = !ok ? `<div class="warn-badge">⚠️ Mindestens 2 Spieler erforderlich.</div>` : '';
    }
  },

  async startOfflineGame() {
    this.state.players = this.state.players.filter(p => p.trim());
    await this.initChains();
    this.state.round = 1;
    this.state.p_index = 0;
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'KritzelKette';
    this.nextOfflineTurn();
  },

  async startOnlineGame() {
    this.startActualOnlineGame();
  },

  initChains() {
    const s = this.state;
    const n = s.players.length;
    
    // Create N chains for N players
    s.chains = [];
    
    // Randomize shift sequence for rounds 1..N-1
    s.shiftSequence = Array.from({length: n - 1}, (_, i) => i + 1);
    for (let i = s.shiftSequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s.shiftSequence[i], s.shiftSequence[j]] = [s.shiftSequence[j], s.shiftSequence[i]];
    }
    // Shift 0 is always 0 (everyone starts their own chain)
    s.shiftSequence.unshift(0);

    let pool = [];
    if (!s.startWithWriting) {
      for(const pkg of KritzelPackages) {
        if(s.activePackageIds.includes(pkg.id)) pool.push(...pkg.tasks);
      }
      pool.sort(() => Math.random() - 0.5);
    }

    if (s.mode === 'offline') {
        for(let i=0; i<n; i++) {
            s.chains.push({
                id: i,
                initiator: s.players[i],
                entries: s.startWithWriting ? [] : [ { type: 'word', value: pool[i % pool.length] || 'Sonne', playerName: 'System' } ]
            });
        }
    } else {
        for(let i=0; i<n; i++) {
            let p = s.players[i];
            s.chains.push({
                id: i,
                initiator: p.name,
                ownerId: p.id,
                entries: s.startWithWriting ? [] : [ { type: 'word', value: pool[i % pool.length] || 'Sonne', playerName: 'System' } ]
            });
        }
    }
  },

  /* ================= OFFLINE GAME FLOW ================= */
  nextOfflineTurn() {
    const s = this.state;
    const n = s.players.length;
    
    if (s.round > n) {
      this.renderResultScreen();
      return;
    }
    
    if (s.p_index >= n) {
      s.p_index = 0;
      s.round++;
      this.nextOfflineTurn();
      return;
    }
    
    const currPlayerName = s.players[s.p_index];
    
    // Calculate cumulative shift up to current round
    let totalShift = 0;
    for (let i = 0; i < s.round; i++) totalShift += s.shiftSequence[i];
    const chainIndex = (s.p_index - totalShift + n * 100) % n;
    const currentChain = s.chains[chainIndex];
    
    if (s.startWithWriting && s.round === 1) {
      const ht = `
        <div class="card" style="text-align:center; padding: 50px 20px;">
          <div class="card-label">Runde ${s.round} / ${n}</div>
          <h2 style="font-size:2rem; margin-bottom: 20px;">Anfangswort schreiben</h2>
          <p style="color:var(--text-muted); font-size:1.1rem; font-weight:bold; margin-bottom: 40px;">Zugeordnet zu:<br><span style="font-size: 2rem; color:var(--primary);">${currPlayerName}</span></p>
          <button class="btn-primary" style="font-size:1.3rem; padding: 20px;" onclick="KritzelGame.renderActionScreen('write', '', ${chainIndex}, false)">Ich bin bereit!</button>
        </div>
      `;
      document.getElementById('play-content').innerHTML = ht;
    } else {
      const lastEntry = currentChain.entries[currentChain.entries.length - 1];
      let ht = `
        <div class="card" style="text-align:center; padding: 50px 20px;">
          <div class="card-label">Runde ${s.round} / ${n}</div>
          <h2 style="font-size:2rem; margin-bottom: 20px;">Schritt ${s.round} / ${n}</h2>
          <p style="color:var(--text-muted); font-size:1.1rem; font-weight:bold; margin-bottom: 40px;">Zugeordnet zu:<br><span style="font-size: 2rem; color:var(--primary);">${currPlayerName}</span></p>
          <button class="btn-primary" style="font-size:1.3rem; padding: 20px;" onclick="KritzelGame.launchOfflineAction(${chainIndex}, '${lastEntry.type}', \`${lastEntry.value.replace(/`/g, '')}\`)">Ich bin bereit!</button>
        </div>
      `;
      document.getElementById('play-content').innerHTML = ht;
    }
  },

  launchOfflineAction(chainIndex, lastType, lastValue) {
    const actionType = lastType === 'drawing' ? 'guess' : 'drawing';
    this.renderActionScreen(actionType, lastValue, chainIndex, false);
  },

  submitOfflineAction(chainIndex, actionType, value) {
    const s = this.state;
    const currPlayerName = s.players[s.p_index];
    s.chains[chainIndex].entries.push({
      type: actionType,
      playerName: currPlayerName,
      value: value
    });
    s.p_index++;
    this.nextOfflineTurn();
  },

  /* ================= ONLINE GAME FLOW (HOST DRIVEN) ================= */
  nextOnlineRound() {
    const s = this.state;
    const n = s.players.length;
    
    if (s.round > n) {
      Multiplayer.sendGameState({ type: 'results', chains: s.chains });
      this.renderResultScreen();
      return;
    }

    const hostStatus = document.getElementById('host-status');
    if(hostStatus) hostStatus.innerHTML = `Runde ${s.round} / ${n} läuft.<br>Warte auf Spieler...`;

    // Distribute turns
    for(let i=0; i<n; i++) {
        const player = s.players[i];
        
        // Logical shift ensures player gets a different chain every round.
        let chainIndex;
        let actionType;
        let prevValue = '';

        if (s.startWithWriting && s.round === 1) {
          chainIndex = i; 
          actionType = 'write';
        } else {
          let totalShift = 0;
          for (let k = 0; k < s.round; k++) totalShift += s.shiftSequence[k];
          chainIndex = (i - totalShift + n * 100) % n;
          
          const currentChain = s.chains[chainIndex];
          const lastEntry = currentChain.entries[currentChain.entries.length - 1];
          actionType = lastEntry.type === 'drawing' ? 'guess' : 'drawing';
          prevValue = lastEntry.value;
        }
        
        const payload = {
            type: 'turn',
            round: s.round,
            chainIndex: chainIndex,
            actionType: actionType,
            prevValue: prevValue,
            isOnline: true,
            targetPlayerId: player.id
        };

        if(player.id === 'host-1' || player.id === Multiplayer.myId) {
            s.myTurnData = payload;
            Router.go('play');
            this.renderActionScreen(actionType, prevValue, chainIndex, true);
        } else {
            if(player.connection) {
                player.connection.send(payload);
            } else {
                // For SharedRoom: Broadcast and let guests filter by targetPlayerId
                Multiplayer.sendGameState(payload);
            }
        }
    }
  },

  submitOnlineAction(chainIndex, actionType, value) {
    const s = this.state;
    const myId = Multiplayer.myId || 'host-1';
    const myName = s.myName || 'Host';

    if (Multiplayer.role === 'host') {
        const chain = s.chains[chainIndex];
        chain.entries.push({ type: actionType, playerId: myId, playerName: myName, value: value });
        s.submissions = (s.submissions || 0) + 1;
        
        document.getElementById('play-content').innerHTML = `
          <div class="card" style="text-align:center; padding: 40px 10px;">
            <h3>Eingereicht!</h3>
            <p>Warte auf restliche Spieler... (${s.submissions}/${s.players.length})</p>
          </div>
        `;

        
        if (s.submissions >= s.players.length) {
            s.submissions = 0;
            s.round++;
            this.nextOnlineRound();
        }
    } else {
        // Guest submission
        Multiplayer.sendToHost({
            type: 'action',
            chainIndex, actionType, value, myId, name: myName
        });
        document.getElementById('play-content').innerHTML = `
          <div class="card" style="text-align:center; padding: 40px 10px;">
            <h3>Eingereicht!</h3>
            <p style="color:var(--text-muted); margin-top:20px;">Warte darauf, dass alle Spieler fertig sind...</p>
          </div>
        `;
    }
  },

  /* ================= ACTION SCREENS (SHARED) ================= */
  renderActionScreen(actionType, prevValue, chainIndex, isOnline) {
    const timeLimit = actionType === 'drawing' ? this.state.timeLimitDraw : this.state.timeLimitGuess;
    let ht = `<div id="kk-timer-display" style="text-align:center; font-size:2.5rem; font-family:'Abril Fatface', cursive; color:var(--primary); margin-bottom: 15px;">${timeLimit}</div>`;
    
    if(actionType === 'drawing') {
      ht += `
        <div class="card" style="text-align:center;">
          <div class="card-label">Runde ${this.state.round} / ${this.state.players.length}</div>
          <p style="margin-bottom:10px; color:var(--text-muted);">Zeichne diesen Begriff:</p>
          <h2 style="font-size:2.5rem; color:var(--primary); font-family:'Abril Fatface', cursive; margin-bottom: 20px;">${prevValue}</h2>
          
          <div style="background:#fff; border-radius: 12px; margin-bottom: 15px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <canvas id="kk-canvas" width="400" height="400" style="width:100%; display:block; touch-action: none; cursor:crosshair;"></canvas>
          </div>
          
          <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
             <button class="btn-icon" style="background:#000;" onclick="KritzelGame.setBrush('#000', 4)"></button>
             <button class="btn-icon" style="background:#ff3366;" onclick="KritzelGame.setBrush('#ff3366', 4)"></button>
             <button class="btn-icon" style="background:#00e5ff;" onclick="KritzelGame.setBrush('#00e5ff', 4)"></button>
             <button class="btn-icon" style="background:#00ff88;" onclick="KritzelGame.setBrush('#00ff88', 4)"></button>
             <button class="btn-icon" style="background:#ffcc00;" onclick="KritzelGame.setBrush('#ffcc00', 4)"></button>
             <button class="btn-icon" style="color:#000; font-size: 1.2rem; background:#fff; border: 2px solid #ccc" onclick="KritzelGame.setBrush('#ffffff', 15)">🧼</button>
             <button class="btn-icon" style="color:#000; font-size: 1.2rem; background:#fff" onclick="KritzelGame.clearCanvas()">🧹</button>
          </div>
          
          <button class="btn-primary" onclick="KritzelGame.finishDrawing(${chainIndex}, ${isOnline})">Absenden</button>
        </div>
      `;
    } else if (actionType === 'write') {
      ht += `
        <div class="card" style="text-align:center;">
          <div class="card-label">Runde ${this.state.round} / ${this.state.players.length}</div>
          <p style="margin-bottom:20px; color:var(--text-muted); font-size:1.2rem;">Gib einen Begriff ein, den jemand anderes zeichnen soll:</p>
          <input type="text" id="kk-write-input" class="player-input" placeholder="Z.B. Fliegendes Schwein" style="margin-bottom: 25px; text-align:center; font-size:1.5rem;">
          <button class="btn-primary" onclick="KritzelGame.finishWrite(${chainIndex}, ${isOnline})">Begriff abgeben</button>
        </div>
      `;
    } else {
      ht += `
        <div class="card" style="text-align:center;">
          <div class="card-label">Runde ${this.state.round} / ${this.state.players.length}</div>
          <p style="margin-bottom:10px; color:var(--text-muted);">Was ist das?</p>
          <div style="background:#fff; border-radius: var(--r); padding: 5px; margin-bottom: 20px;">
             <img src="${prevValue}" style="width:100%; max-width:400px; border-radius: 8px; pointer-events:none;">
          </div>
          <input type="text" id="kk-guess-input" class="player-input" placeholder="Dein Tipp..." style="margin-bottom: 20px; text-align:center; font-size:1.5rem;">
          <button class="btn-primary" onclick="KritzelGame.finishGuess(${chainIndex}, ${isOnline})">Absenden</button>
        </div>
      `;
    }
    
    document.getElementById('play-content').innerHTML = ht;
    
    this.startTimer(actionType, chainIndex, isOnline);

    if(actionType === 'drawing') {
       this.initCanvas();
    } else if (actionType === 'write') {
       setTimeout(() => {
         const input = document.getElementById('kk-write-input');
         if(input) input.focus();
       }, 100);
    } else {
       setTimeout(() => {
         const input = document.getElementById('kk-guess-input');
         if(input) input.focus();
       }, 100);
    }
  },

  startTimer(actionType, chainIndex, isOnline) {
    clearInterval(this.state.timerInterval);
    this.state.timeLeft = actionType === 'drawing' ? this.state.timeLimitDraw : this.state.timeLimitGuess;
    const disp = document.getElementById('kk-timer-display');
    this.state.timerInterval = setInterval(() => {
        this.state.timeLeft--;
        if(disp) disp.textContent = this.state.timeLeft;
        if(this.state.timeLeft <= 0) {
            clearInterval(this.state.timerInterval);
            if(actionType === 'drawing') this.finishDrawing(chainIndex, isOnline);
            else if(actionType === 'write') this.finishWrite(chainIndex, isOnline);
            else this.finishGuess(chainIndex, isOnline);
        }
    }, 1000);
  },

  /* ================= CANVAS LOGIC ================= */
  initCanvas() {
    const canvas = document.getElementById('kk-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // We need to scale internal resolution to match displayed CSS size for good quality on mobile -> For simplicity we keep it 400x400 internally
    // Actually fixed width/height attributes are better, let's make it 400x400 internally
    canvas.width = 400;
    canvas.height = 400;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    this.ctx = ctx;
    this.canvas = canvas;
    this.setBrush('#000000', 4);
    
    let drawing = false;
    
    const getPos = (e) => {
        let rect = canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        if(e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const start = (e) => {
        e.preventDefault();
        drawing = true;
        let pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if(!drawing) return;
        e.preventDefault();
        let pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stop = (e) => {
        if(drawing) { e.preventDefault(); drawing = false; ctx.closePath(); }
    };

    canvas.addEventListener('mousedown', start, {passive:false});
    canvas.addEventListener('mousemove', draw, {passive:false});
    canvas.addEventListener('mouseup', stop, {passive:false});
    canvas.addEventListener('mouseout', stop, {passive:false});

    canvas.addEventListener('touchstart', start, {passive:false});
    canvas.addEventListener('touchmove', draw, {passive:false});
    canvas.addEventListener('touchend', stop, {passive:false});
    canvas.addEventListener('touchcancel', stop, {passive:false});
  },

  setBrush(color, size) {
    if(this.ctx) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = size;
    }
  },
  
  clearCanvas() {
    if(this.ctx && this.canvas) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  finishDrawing(chainIndex, isOnline) {
    clearInterval(this.state.timerInterval);
    if(!this.canvas) return;
    const base64 = this.canvas.toDataURL('image/jpeg', 0.8);
    if(isOnline) this.submitOnlineAction(chainIndex, 'drawing', base64);
    else this.submitOfflineAction(chainIndex, 'drawing', base64);
  },

  finishGuess(chainIndex, isOnline) {
    clearInterval(this.state.timerInterval);
    const input = document.getElementById('kk-guess-input');
    let val = input ? input.value.trim() : '';
    if(!val) val = "???"; // fallback
    if(isOnline) this.submitOnlineAction(chainIndex, 'guess', val);
    else this.submitOfflineAction(chainIndex, 'guess', val);
  },

  finishWrite(chainIndex, isOnline) {
    clearInterval(this.state.timerInterval);
    const input = document.getElementById('kk-write-input');
    let val = input ? input.value.trim() : '';
    if(!val) {
      // Pick random word if they sent nothing
      let pool = [];
      KritzelPackages.forEach(p => pool = pool.concat(p.tasks));
      val = pool[Math.floor(Math.random() * pool.length)] || 'Abenteuer';
    }
    if(isOnline) this.submitOnlineAction(chainIndex, 'word', val);
    else this.submitOfflineAction(chainIndex, 'word', val);
  },

  /* ================= RESULT SCREEN ================= */
  renderResultScreen() {
    clearInterval(this.state.timerInterval);
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Ergebnisse!';
    
    const chains = this.state.chains;
    let ht = `<div style="text-align:center; margin-bottom: 20px;"><p style="color:var(--text-muted);">Schaut euch die Ergebnisse an!</p></div>`;
    
    chains.forEach(c => {
       ht += `
        <div class="card" style="margin-bottom: 30px; animation: slideIn .4s cubic-bezier(.34, 1.15, .64, 1) both; overflow:hidden;">
            <div style="background: var(--surface2); margin: -22px -22px 20px -22px; padding: 15px 22px; border-bottom: 1px solid var(--border);">
               <strong style="color:var(--primary); font-family:'Abril Fatface', cursive; font-size: 1.4rem;">Startwort: ${c.entries[0].value}</strong>
               <p style="font-size:0.8rem; color:var(--text-muted);">(Begonnen von ${c.entries[0].playerName})</p>
            </div>
       `;
       
       for(let i=1; i<c.entries.length; i++) {
           const e = c.entries[i];
           ht += `<div style="margin-bottom: 20px; padding-left: 15px; border-left: 2px dashed ${e.type === 'drawing' ? 'var(--cyan)' : 'var(--secondary)'};">`;
           if(e.type === 'drawing') {
              ht += `<p style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 5px;"><strong>${e.playerName}</strong> zeichnete:</p>`;
              ht += `<img src="${e.value}" style="width:100%; max-width:300px; border-radius: 8px; border: 2px solid var(--surface2);">`;
           } else {
              ht += `<p style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 5px;"><strong>${e.playerName}</strong> tippte:</p>`;
              ht += `<h3 style="color:var(--secondary); font-size:1.5rem; font-weight:900;">"${e.value}"</h3>`;
           }
           ht += `</div>`;
       }
       ht += `</div>`;
    });
    
    if (Multiplayer.role === 'host') {
        ht += `<button class="btn-primary" style="background:var(--cyan); color:#000;" onclick="hostReturnToLobby()">Zurück zur Lobby</button>`;
    } else if (SharedRoom.isActive) {
        ht += `<p style="color:var(--text-muted);">Warte auf den Host...</p>`;
    } else {
        ht += `<button class="btn-primary" onclick="location.reload()">Zurück zum Hauptmenü</button>`;
    }
    ht += `<br><br><br>`;

    document.getElementById('play-content').innerHTML = ht;
  }

};
