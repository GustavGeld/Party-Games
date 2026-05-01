const WortOrakelPackages = [
  { id: 'allgemein', name: 'Allgemein', emoji: '💡', tasks: ['Elefant', 'Feuerwehr', 'Pizza', 'Schach', 'Internet', 'Kaffee', 'Taschenlampe', 'Donald Duck', 'Super Mario', 'Eiffelturm', 'Zahnarzt', 'Hubschrauber', 'Gitarre', 'Mikrowelle', 'Kühlschrank', 'Postbote', 'Regenschirm', 'Taxi', 'Kino', 'Strand'] },
  { id: 'promis', name: 'Promis', emoji: '🌟', tasks: ['Angela Merkel', 'Elon Musk', 'Beyoncé', 'Albert Einstein', 'Cristiano Ronaldo', 'Harry Potter', 'Marilyn Monroe', 'Steve Jobs', 'Michael Jackson', 'Lionel Messi', 'Bill Gates', 'Taylor Swift', 'Barack Obama', 'Brad Pitt', 'Lady Gaga', 'Heidi Klum'] },
  { id: 'tiere', name: 'Tiere', emoji: '🦓', tasks: ['Blauwal', 'Faultier', 'Chamäleon', 'Erdmännchen', 'Pinguin', 'Känguru', 'Skorpion', 'Koala', 'Nashorn', 'Schildkröte', 'Wombat', 'Eichhörnchen', 'Oktopus', 'Flamingo', 'Gorilla', 'Giraffe'] },
  { id: 'food', name: 'Essen', emoji: '🍔', tasks: ['Döner', 'Sushi', 'Spaghetti', 'Schnitzel', 'Lasagne', 'Currywurst', 'Burger', 'Tacos', 'Pfannkuchen', 'Gedünsteter Brokkoli', 'Pommes', 'Zwiebelringe', 'Waffeln', 'Apfelstrudel'] },
  { id: 'jobs', name: 'Berufe', emoji: '👨‍🔧', tasks: ['Programmierer', 'Astronaut', 'Influencer', 'Schornsteinfeger', 'Bademeister', 'Anwalt', 'Richter', 'Detektiv', 'Bibliothekar', 'Klempner', 'Elektriker', 'Stewardess'] }
];

const WortOrakel = {
  name: "Wort-Orakel",
  tagline: "Wer bin ich? Errate deinen geheimen Begriff!",
  color: "#a855f7",
  shadow: "rgba(168, 85, 247, 0.4)",
  glow: "rgba(168, 85, 247, 0.2)",
  emoji: "🔮",
  
  state: {
    mode: null,
    players: [],
    useOwnWords: false,
    activePackageIds: ['allgemein'],
    phase: 'setup', // setup, input, viewing, play
    words: {}, // playerId -> entered word
    assignedWords: {}, // playerId -> word they need to guess
    doneStatus: {}, // playerId -> boolean (guessed it)
    viewingIndex: 0, // for offline viewing phase
    myWordInput: ''
  },

  /* ================= UNIFIED LOBBY HOOKS ================= */
  
  collectOnlineSettings() {
    return {
      useOwnWords: this.state.useOwnWords,
      activePackageIds: [...this.state.activePackageIds]
    };
  },

  onOnlineGameStart(settings) {
    this.state.mode = 'online';
    this.state.useOwnWords = settings.useOwnWords;
    this.state.players = settings.players || [];
    this.state.activePackageIds = settings.activePackageIds || ['allgemein'];
    this.state.phase = 'input';
    this.state.words = {};
    this.state.assignedWords = {};
    this.state.doneStatus = {};
    this.state.myWordInput = '';

    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Wort-Orakel';
    this.renderOnlineInput();
  },

  handleOnlineData(data, conn) {
    const s = this.state;
    if (Multiplayer.role === 'host') {
      if (data.type === 'submit_word') {
        s.words[data.playerId] = data.word;
        this.checkAllWordsSubmitted();
      } else if (data.type === 'guessed_it') {
        s.doneStatus[data.playerId] = true;
        this.broadcastState();
        this.renderHostGame();
      }
    } else {
      if (data.type === 'sync_phase') {
        s.phase = data.phase;
        s.assignedWords = data.assignedWords;
        s.doneStatus = data.doneStatus;
        s.players = data.players;
        this.renderOnlineGame();
      } else if (data.type === 'return_lobby') {
        refreshLobby();
      }
    }
  },

  /* ================= CORE LOGIC ================= */

  open() {
    Router.go('setup');
    document.getElementById('setup-title').textContent = 'Wort-Orakel';
    document.getElementById('setup-content').innerHTML = `
      <div class="card">
        <div class="card-label">Wähle deinen Modus</div>
        <button class="btn-primary" style="margin-bottom:15px; background:var(--green); color:#000;" onclick="WortOrakel.setupOffline()">
           📱 Offline (Ein Gerät teilen)
        </button>
        <button class="btn-primary" onclick="UnifiedLobby.open(WortOrakel)">
           🌐 Online (Jeder ein Gerät)
        </button>
      </div>
    `;
  },

  setupOffline() {
    this.state.mode = 'offline';
    this.state.players = ['Spieler 1', 'Spieler 2', 'Spieler 3'];
    this.state.useOwnWords = false;
    this.renderOfflineSetup();
  },

  renderOfflineSetup() {
    let ht = `
      <div class="card">
        <div class="card-label">👥 Spieler verwalten</div>
        <div class="players-list" id="wo-players-list"></div>
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px; font-size: 0.9rem;" onclick="WortOrakel.addOfflinePlayer()">＋ Spieler hinzufügen</button>
      </div>

      <div class="card">
        <div class="card-label">⚙️ Spiel-Optionen</div>
        <div style="display:flex; flex-direction:column; gap:15px;">
           <div style="display:flex; align-items:center; justify-content:space-between; background:var(--surface2); padding:15px; border-radius:12px; cursor:pointer;" onclick="document.getElementById('wo-own-toggle').click()">
              <div style="text-align:left;">
                <strong style="display:block; font-size:1.1rem;">Eigene Begriffe</strong>
                <small style="color:var(--text-muted);">Jeder denkt sich ein Wort für die anderen aus.</small>
              </div>
              <div class="toggle-switch">
                <input type="checkbox" id="wo-own-toggle" ${this.state.useOwnWords ? 'checked' : ''} onchange="WortOrakel.state.useOwnWords = this.checked; WortOrakel.renderOfflineSetup()">
                <span class="slider"></span>
              </div>
           </div>
        </div>
      </div>
      
      ${!this.state.useOwnWords ? `
      <div class="card">
        <div class="card-label">📦 Wort-Pakete</div>
        <div id="wo-pkg-grid"></div>
      </div>
      ` : ''}

      <button class="btn-primary" id="wo-start-btn" onclick="WortOrakel.startOfflineGame()">🚀 Weiter</button>
    `;
    document.getElementById('setup-content').innerHTML = ht;
    this.renderOfflinePlayersList();
    if (!this.state.useOwnWords) this.renderPackages();
  },

  renderOfflinePlayersList() {
    const list = document.getElementById('wo-players-list');
    if(!list) return;
    list.innerHTML = this.state.players.map((name, i) => `
      <div class="player-row">
        <div class="player-avatar">${i + 1}</div>
        <input class="player-input" type="text" value="${name}" placeholder="Spieler ${i + 1}" oninput="WortOrakel.state.players[${i}] = this.value">
        ${this.state.players.length > 2 ? `<button class="btn-icon" onclick="WortOrakel.removeOfflinePlayer(${i})">✕</button>` : ''}
      </div>
    `).join('');
  },

  addOfflinePlayer() {
    this.state.players.push(`Spieler ${this.state.players.length + 1}`);
    this.renderOfflineSetup();
  },

  removeOfflinePlayer(i) {
    if(this.state.players.length > 2) this.state.players.splice(i, 1);
    this.renderOfflineSetup();
  },

  renderPackages() {
    PackageManager.renderGrid({
        namespace: 'WortOrakel',
        targetId: 'wo-pkg-grid',
        packages: WortOrakelPackages,
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
  },

  startOfflineGame() {
    this.state.phase = 'input';
    this.state.words = {};
    this.state.viewingIndex = 0;
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Wort-Orakel';
    
    if (this.state.useOwnWords) {
      this.renderOfflineInput(0);
    } else {
      this.assignPackageWords();
      this.renderOfflineViewing(0);
    }
  },

  /* ================= OFFLINE INPUT ================= */
  renderOfflineInput(playerIdx) {
    const name = this.state.players[playerIdx];
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding: 40px 20px;">
        <div class="card-label">Eingabe: Spieler ${playerIdx + 1} / ${this.state.players.length}</div>
        <h2 style="margin-bottom:10px;">${name}</h2>
        <p style="color:var(--text-muted); margin-bottom:30px;">Denk dir einen Begriff für jemand anderen aus!</p>
        
        <input type="text" id="wo-input-field" class="player-input" style="font-size:1.5rem; text-align:center; padding:15px; margin-bottom:20px;" placeholder="z.B. Zitrone">
        
        <button class="btn-primary" onclick="WortOrakel.submitOfflineWord(${playerIdx})">Festlegen</button>
      </div>
    `;
    setTimeout(() => document.getElementById('wo-input-field').focus(), 100);
  },

  submitOfflineWord(idx) {
    const val = document.getElementById('wo-input-field').value.trim();
    if (!val) return;
    this.state.words[idx] = val;
    
    if (idx + 1 < this.state.players.length) {
      this.renderOfflineInput(idx + 1);
    } else {
      this.assignDerangement();
      this.renderOfflineViewing(0);
    }
  },

  assignDerangement() {
    const n = this.state.players.length;
    let wordPool = Object.values(this.state.words);
    
    let assigned = {};
    let attempts = 0;
    while(attempts < 100) {
      let shuffledPool = [...wordPool];
      this.shuffleArray(shuffledPool);
      
      let valid = true;
      for(let i=0; i<n; i++) {
        if (shuffledPool[i] === this.state.words[i]) {
          valid = false;
          break;
        }
      }
      
      if (valid) {
        for(let i=0; i<n; i++) assigned[i] = shuffledPool[i];
        break;
      }
      attempts++;
    }
    
    if (Object.keys(assigned).length === 0) {
        for(let i=0; i<n; i++) assigned[i] = wordPool[(i+1)%n];
    }
    
    this.state.assignedWords = assigned;
  },

  assignPackageWords() {
    let pool = [];
    WortOrakelPackages.forEach(pkg => {
        if (this.state.activePackageIds.includes(pkg.id)) {
            pool = pool.concat(pkg.tasks);
        }
    });
    this.shuffleArray(pool);
    this.state.assignedWords = {};
    this.state.players.forEach((p, i) => {
      this.state.assignedWords[i] = pool[i % pool.length];
    });
  },

  /* ================= OFFLINE VIEWING ================= */
  renderOfflineViewing(playerIdx) {
    const targetName = this.state.players[playerIdx];
    const word = this.state.assignedWords[playerIdx];
    
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding: 40px 20px;">
        <div class="card-label">Wort-Check: ${playerIdx + 1} / ${this.state.players.length}</div>
        <p style="margin-bottom:10px;">Das Wort für</p>
        <h2 style="color:var(--primary); font-size:clamp(1.8rem, 8vw, 2.5rem); margin-bottom:20px;">${targetName}</h2>
        
        <div id="wo-secret-area" 
             style="background:var(--surface2); padding:30px; border-radius:15px; cursor:pointer; min-height:140px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; border: 2px dashed var(--border); transition: all 0.3s ease;" 
             onclick="WortOrakel.revealWord(this, '${word.replace(/'/g, "\\'")}')">
          <span style="font-weight:bold; color:var(--text-muted); text-align:center; line-height:1.4;">
             KLICKEN ZUM AUFDECKEN<br>
             <span style="font-size:0.8rem; opacity:0.8;">(Alle außer ${targetName} dürfen schauen!)</span>
          </span>
        </div>
        
        <button class="btn-primary" onclick="${playerIdx + 1 < this.state.players.length ? `WortOrakel.renderOfflineViewing(${playerIdx+1})` : `WortOrakel.renderOfflineGameStart()`}">Weiter</button>
      </div>
    `;
  },

  revealWord(el, word) {
    el.innerHTML = `<span style="font-size:clamp(1.5rem, 6vw, 2.2rem); font-weight:bold; color:var(--primary); animation: pop 0.3s ease-out;">${word}</span>`;
    el.style.border = '2px solid var(--primary)';
    el.style.background = 'var(--primary-dim)';
    el.style.transform = 'scale(1.02)';
  },

  renderOfflineGameStart() {
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding: 50px 20px;">
        <h1 style="font-size:clamp(2rem, 8vw, 3rem); margin-bottom:20px;">🎯 Los geht's!</h1>
        <p style="font-size:1.1rem; color:var(--text-muted); margin-bottom:40px;">Das Spiel beginnt. Findet heraus, wer ihr seid!<br><br>Falls jemand seinen Begriff vergessen hat, könnt ihr ihn unten kurz nachschauen.</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-bottom:30px;">
          ${this.state.players.map((name, i) => `
            <div style="background:var(--surface2); border:1px solid var(--border); border-radius:15px; text-align:left; cursor:pointer; padding:16px; transition: all 0.2s;" onclick="WortOrakel.togglePeek(this, ${i})">
              <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px;">${name}</div>
              <div class="peek" style="display:none; font-weight:bold; color:var(--primary); font-size:1.2rem; animation: pop 0.25s ease-out;">${this.state.assignedWords[i]}</div>
              <div class="name-display" style="font-weight:bold; overflow:hidden; text-overflow:ellipsis; font-size:1.1rem;">${name}</div>
            </div>
          `).join('')}
        </div>
        
        <button class="btn-primary" onclick="WortOrakel.startOfflineGame()">Nochmal spielen</button>
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px;" onclick="WortOrakel.open()">Hauptmenü</button>
      </div>
    `;
  },

  togglePeek(el, idx) {
    const peek = el.querySelector('.peek');
    const name = el.querySelector('.name-display');
    const isActive = peek.style.display === 'block';

    if (isActive) {
        peek.style.display = 'none';
        name.style.display = 'block';
        el.classList.remove('active');
    } else {
        peek.style.display = 'block';
        name.style.display = 'none';
        el.classList.add('active');
    }
  },

  /* ================= ONLINE LOGIC ================= */

  renderHostSetup() {
    return `
      <div class="card">
        <div class="card-label">⚙️ Spiel-Optionen</div>
        <div style="display:flex; flex-direction:column; gap:15px;">
           <div style="display:flex; align-items:center; justify-content:space-between; background:var(--surface2); padding:15px; border-radius:12px; cursor:pointer;" onclick="document.getElementById('wo-own-toggle-on').click()">
              <div style="text-align:left;">
                <strong style="display:block; font-size:1.1rem;">Eigene Begriffe</strong>
                <small style="color:var(--text-muted);">Jeder denkt sich ein Wort für die anderen aus.</small>
              </div>
              <div class="toggle-switch">
                <input type="checkbox" id="wo-own-toggle-on" ${this.state.useOwnWords ? 'checked' : ''} onchange="WortOrakel.state.useOwnWords = this.checked; UnifiedLobby._updateHostLobby()">
                <span class="slider"></span>
              </div>
           </div>
        </div>
      </div>
      
      ${!this.state.useOwnWords ? `
      <div class="card">
        <div class="card-label">📦 Wort-Pakete</div>
        <div id="wo-pkg-grid"></div>
      </div>
      ` : ''}
    `;
  },

  onHostLobbyRendered() {
    if (!this.state.useOwnWords) this.renderPackages();
  },

  renderOnlineInput() {
    if (!this.state.useOwnWords && Multiplayer.role === 'host') {
        this.assignOnlinePackageWords();
        return;
    }
    
    if (!this.state.useOwnWords && Multiplayer.role === 'guest') {
        document.getElementById('play-content').innerHTML = `
            <div class="card" style="text-align:center; padding: 40px 10px;">
                <h3>⏳ Warte auf die Begriffe des Hosts...</h3>
            </div>
        `;
        return;
    }

    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding: 40px 20px;">
        <h2 style="margin-bottom:10px;">Begriff wählen</h2>
        <p style="color:var(--text-muted); margin-bottom:30px;">Denk dir einen Begriff für jemand anderen aus!</p>
        
        <input type="text" id="wo-online-field" class="player-input" style="font-size:1.5rem; text-align:center; padding:15px; margin-bottom:20px;" placeholder="z.B. Sherlock Holmes">
        
        <button class="btn-primary" id="wo-submit-btn" onclick="WortOrakel.submitOnlineWord()">Bereit!</button>
      </div>
    `;
    setTimeout(() => document.getElementById('wo-online-field').focus(), 100);
  },

  submitOnlineWord() {
    const word = document.getElementById('wo-online-field').value.trim();
    if (!word) return;
    
    document.getElementById('wo-submit-btn').disabled = true;
    document.getElementById('wo-submit-btn').textContent = 'Gesendet...';

    if (Multiplayer.role === 'host') {
      this.state.words['host-1'] = word;
      this.checkAllWordsSubmitted();
    } else {
      Multiplayer.sendToHost({ type: 'submit_word', playerId: Multiplayer.myId, word: word });
    }
  },

  assignOnlinePackageWords() {
    let pool = [];
    WortOrakelPackages.forEach(pkg => {
        if (this.state.activePackageIds.includes(pkg.id)) {
            pool = pool.concat(pkg.tasks);
        }
    });
    this.shuffleArray(pool);
    
    this.state.assignedWords = {};
    const playerIds = this.state.players.map(p => p.id);
    playerIds.forEach((id, i) => {
      this.state.assignedWords[id] = pool[i % pool.length];
    });
    
    this.state.phase = 'play';
    this.broadcastState();
    this.renderHostGame();
  },

  checkAllWordsSubmitted() {
    const participantIds = this.state.players.map(p => p.id);
    const submittedIds = Object.keys(this.state.words);
    
    if (participantIds.every(id => submittedIds.includes(id))) {
      this.assignOnlineDerangement(participantIds);
      this.state.phase = 'play';
      this.broadcastState();
      this.renderHostGame();
    } else {
      this.renderHostWaiting();
    }
  },

  assignOnlineDerangement(playerIds) {
    const n = playerIds.length;
    let wordPool = playerIds.map(id => this.state.words[id]);
    
    let assigned = {};
    let attempts = 0;
    while(attempts < 100) {
      let shuffledPool = [...wordPool];
      this.shuffleArray(shuffledPool);
      
      let valid = true;
      for(let i=0; i<n; i++) {
        const myOriginalWord = this.state.words[playerIds[i]];
        if (shuffledPool[i] === myOriginalWord) {
          valid = false;
          break;
        }
      }
      
      if (valid) {
        for(let i=0; i<n; i++) assigned[playerIds[i]] = shuffledPool[i];
        break;
      }
      attempts++;
    }
    
    if (Object.keys(assigned).length === 0) {
        for(let i=0; i<n; i++) assigned[playerIds[i]] = wordPool[(i+1)%n];
    }
    
    this.state.assignedWords = assigned;
  },

  broadcastState() {
    Multiplayer.sendGameState({
      type: 'sync_phase',
      phase: this.state.phase,
      assignedWords: this.state.assignedWords,
      doneStatus: this.state.doneStatus,
      players: this.state.players.map(p => ({ id: p.id, name: p.name }))
    });
  },

  renderHostWaiting() {
    const participantIds = this.state.players.map(p => p.id);
    const submittedIds = Object.keys(this.state.words);
    
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding: 40px 10px;">
        <h3>⌛ Warte auf Begriffe...</h3>
        <p>${submittedIds.length} / ${participantIds.length} abgegeben</p>
      </div>
    `;
  },

  renderHostGame() {
    this.renderOnlineGame();
  },

  renderOnlineGame() {
    const myId = Multiplayer.role === 'host' ? 'host-1' : Multiplayer.myId;
    const isDone = this.state.doneStatus[myId];
    const myWord = this.state.assignedWords[myId];
    const myPlayer = this.state.players.find(p => p.id === myId);
    const myName = myPlayer ? myPlayer.name : 'Du';
    
    let ht = `
      <div class="card" style="text-align:center; padding: 20px;">
        <div class="card-label">🔥 Das Spiel läuft</div>
        
        <div style="background:var(--primary); color:#000; padding:20px; border-radius:15px; margin-bottom:20px;">
          <small style="opacity:0.7; font-weight:bold; text-transform:uppercase;">${myName}, wer bist du?</small>
          <div style="font-size:2rem; font-weight:bold;">???</div>
          ${isDone ? '<div style="background:#fff; padding:5px; border-radius:5px; margin-top:10px; font-weight:bold;">✅ ERRATEN!</div>' : `
            <button class="btn-primary" style="background:#000; color:#fff; width:auto; margin-top:15px;" onclick="WortOrakel.submitGuessed()">Wort erraten!</button>
          `}
        </div>

        <div class="card-label">Die anderen sind:</div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
          ${this.state.players.filter(p => p.id !== myId).map(p => `
            <div class="card" style="margin:0; padding:15px; text-align:left; border: 2px solid ${this.state.doneStatus[p.id] ? 'var(--green)' : 'transparent'}">
                <div style="font-size:0.7rem; color:var(--text-muted);">${p.name}</div>
                <div style="font-weight:bold; font-size:1.1rem;">${this.state.assignedWords[p.id]}</div>
                ${this.state.doneStatus[p.id] ? '<div style="color:var(--green); font-size:0.7rem; font-weight:bold;">FERTIG</div>' : ''}
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top:20px; display:flex; gap:10px;">
            <button class="btn-primary" style="background:var(--surface2); color:var(--text);" onclick="WortOrakel.returnToLobby()">Lobby</button>
            ${Multiplayer.role === 'host' ? `<button class="btn-primary" onclick='WortOrakel.onOnlineGameStart({useOwnWords: ${this.state.useOwnWords}, activePackageIds: ${JSON.stringify(this.state.activePackageIds)}})'>Neustart</button>` : ''}
        </div>
      </div>
    `;
    
    document.getElementById('play-content').innerHTML = ht;
  },

  returnToLobby() {
    if (this.state.mode === 'offline') {
        this.open();
    } else {
        if (Multiplayer.role === 'host') {
            hostReturnToLobby();
        } else {
            refreshLobby();
        }
    }
  },

  submitGuessed() {
    const myId = Multiplayer.role === 'host' ? 'host-1' : Multiplayer.myId;
    this.state.doneStatus[myId] = true;
    if (Multiplayer.role === 'host') {
      this.broadcastState();
      this.renderHostGame();
    } else {
      Multiplayer.sendToHost({ type: 'guessed_it', playerId: myId });
    }
  },

  /* ================= HELPERS ================= */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
};
