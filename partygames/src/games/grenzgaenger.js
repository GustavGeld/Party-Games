const GrenzGaengerPackages = [
  { id: 'allgemein', name: 'Allgemein', emoji: '🌍', tasks: [
    "Wie viele Länder kannst du aufzählen?", "Wie viele Automarken fallen dir ein?", "Wie viele Disney-Filme kennst du?",
    "Wie viele Schokoladen-Riegel kannst du nennen?", "Wie viele Hauptstädte kannst du aufzählen?", "Wie viele Obstsorten kannst du aufzählen?",
    "Wie viele Gemüsesorten kennst du?", "Wie viele Sportarten kannst du nennen?", "Wie viele Instrumente fallen dir ein?",
    "Wie viele Farben kannst du aufzählen?", "Wie viele Berufe kennst du?", "Wie viele Sprachen kannst du nennen?",
    "Wie viele Brettspiele fallen dir ein?", "Wie viele Eissorten kennst du?", "Wie viele Gewürze fallen dir ein?",
    "Wie viele Hunderassen kennst du?", "Wie viele Werkzeuge kannst du aufzählen?", "Wie viele Haushaltsgeräte fallen dir ein?",
    "Wie viele Bäume kannst du nennen?", "Wie viele Sternzeichen kennst du?"
  ]},
  { id: 'nerd', name: 'Nerd-Wissen', emoji: '🎮', tasks: [
    "Wie viele Pokémon fallen dir ein?", "Wie viele Marvel-Helden kennst du?", "Wie viele Harry Potter Charaktere fallen dir ein?",
    "Wie viele Planeten im Sonnensystem kannst du nennen?", "Wie viele Star Wars Planeten kennst du?", "Wie viele Videospiel-Konsolen fallen dir ein?",
    "Wie viele Programmiersprachen kannst du nennen?", "Wie viele Superhelden-Kräfte kannst du aufzählen?", "Wie viele Animes kennst du?",
    "Wie viele Star Trek Charaktere kennst du?", "Wie viele Lord of the Rings Orte fallen dir ein?", "Wie viele League of Legends Champions kannst du nennen?",
    "Wie viele Science-Fiction Filme kennst du?", "Wie viele IT-Begriffe fallen dir ein?", "Wie viele Raumschiffe aus Filmen kennst du?",
    "Wie viele Superbösewichte kannst du aufzählen?", "Wie viele Videospiel-Entwickler fallen dir ein?", "Wie viele Anime-Serien kennst du?",
    "Wie viele Brettspiel-Klassiker kannst du nennen?", "Wie viele Retro-Spiele fallen dir ein?"
  ]},
  { id: 'popkultur', name: 'Popkultur', emoji: '🎬', tasks: [
    "Wie viele Netflix-Serien fallen dir ein?", "Wie viele berühmte YouTuber kennst du?", "Wie viele Boybands/Girlgroups kannst du nennen?",
    "Wie viele Sitcoms kennst du?", "Wie viele Reality-TV Shows fallen dir ein?", "Wie viele berühmte Paare (Promis) kennst du?",
    "Wie viele Oscar-Gewinner fallen dir ein?", "Wie viele Taylor Swift Songs kennst du?", "Wie viele Hollywood-Regisseure fallen dir ein?",
    "Wie viele Boygroups aus den 90ern kannst du nennen?", "Wie viele Kardashians kannst du aufzählen?", "Wie viele berühmte Comedians kennst du?",
    "Wie viele Mode-Labels fallen dir ein?", "Wie viele Reality-Stars kennst du?", "Wie viele berühmte Hunde (TV/Film) kennst du?",
    "Wie viele Casting-Shows fallen dir ein?", "Wie viele Zeichentrick-Väter kannst du nennen?", "Wie viele berühmte Detektive fallen dir ein?",
    "Wie viele Sitcom-Charaktere kennst du?", "Wie viele Musikgenres kannst du aufzählen?"
  ]},
  { id: 'geographie', name: 'Heimat & Geographie', emoji: '🇩🇪', tasks: [
    "Wie viele Bundesländer (DE/AT/CH) kennst du?", "Wie viele deutsche Städte fallen dir ein?", "Wie viele Berge in den Alpen kannst du nennen?",
    "Wie viele deutsche Flüsse kennst du?", "Wie viele Nachbarländer Deutschlands fallen dir ein?", "Wie viele Sehenswürdigkeiten in Berlin kennst du?",
    "Wie viele Wahrzeichen in Paris kennst du?", "Wie viele Seen in deiner Region fallen dir ein?", "Wie viele US-Bundesstaaten kannst du nennen?",
    "Wie viele Inseln im Mittelmeer kennst du?", "Wie viele Hauptstädte in Afrika fallen dir ein?", "Wie viele Gebirgsketten auf der Welt kannst du nennen?",
    "Wie viele Meere gibt es auf der Erde?", "Wie viele Bezirke deiner Stadt kennst du?", "Wie viele Flüsse in Europa fallen dir ein?",
    "Wie viele Wüsten kennst du?", "Wie viele Länder in Südamerika kannst du nennen?", "Wie viele Sehenswürdigkeiten in London kennst du?",
    "Wie viele deutsche Dialekte fallen dir ein?", "Wie viele Nationalflaggen kannst du visualisieren?"
  ]},
  { id: 'sport', name: 'Sport', emoji: '⚽', tasks: [
    "Wie viele Fußballvereine aus der Bundesliga kennst du?", "Wie viele Formel-1-Fahrer fallen dir ein?", "Wie viele olympische Disziplinen kannst du nennen?",
    "Wie viele berühmte Tennisspieler kennst du?", "Wie viele Fitness-Übungen fallen dir ein?", "Wie viele NBA-Teams kannst du aufzählen?",
    "Wie viele Wintersportarten fallen dir ein?", "Wie viele Sportmarken kennst du?", "Wie viele Kampfsportarten kannst du nennen?",
    "Wie viele berühmte Fußballstadien fallen dir ein?", "Wie viele Formel-1 Teams kannst du nennen?"
  ]},
  { id: 'food', name: 'Essen & Trinken', emoji: '🍕', tasks: [
    "Wie viele Pastasorten kennst du?", "Wie viele Käsesorten fallen dir ein?", "Wie viele Cocktails kannst du nennen?",
    "Wie viele Pizzabeläge fallen dir ein?", "Wie viele Fast-Food-Ketten kennst du?", "Wie viele Weinsorten kannst du nennen?",
    "Wie viele Softdrinks fallen dir ein?", "Wie viele Tee-Sorten kennst du?", "Wie viele Desserts fallen dir ein?",
    "Wie viele Kräuter aus der Küche kannst du nennen?"
  ]}
];

const GrenzGaenger = {
  name: "Grenz-Gänger",
  tagline: "Pokere hoch: Wer schafft am meisten?",
  color: "#f59e0b",
  shadow: "rgba(245, 158, 11, 0.4)",
  glow: "rgba(245, 158, 11, 0.2)",
  emoji: "🧗",

  state: {
    mode: null,
    players: [],
    maxRounds: 5,
    activePackageIds: ['allgemein'],
    currentRound: 0,
    scores: {}, // playerId -> points
    phase: 'setup', // bidding, challenge, result
    currentQuestion: '',
    currentBid: 0,
    currentBidderIdx: 0, // index in this.state.players
    lastBidderIdx: -1,
    challengerIdx: -1,
    history: []
  },

  /* ================= UNIFIED LOBBY HOOKS ================= */
  
  collectOnlineSettings() {
    return {
      maxRounds: this.state.maxRounds,
      activePackageIds: [...this.state.activePackageIds]
    };
  },

  onOnlineGameStart(settings) {
    this.state.mode = 'online';
    this.state.maxRounds = parseInt(settings.maxRounds) || 5;
    this.state.activePackageIds = settings.activePackageIds || ['allgemein'];
    this.state.currentRound = 1;
    this.state.scores = {};
    this.state.players.forEach(p => this.state.scores[p.id] = 0);
    this.startNewOnlineRound();
  },

  handleOnlineData(data, conn) {
    if (Multiplayer.role !== 'host') {
        if (data.type === 'sync_state') {
            this.state = {...this.state, ...data.state};
            this.renderOnlineGame();
        } else if (data.type === 'return_lobby') {
            refreshLobby();
        }
        return;
    }

    // HOST Logic
    if (data.type === 'bid') {
        this.state.lastBidderIdx = this.state.currentBidderIdx;
        this.state.currentBid = data.value;
        this.state.currentBidderIdx = (this.state.currentBidderIdx + 1) % this.state.players.length;
        this.state.phase = 'bidding';
        this.broadcastState();
        this.renderOnlineGame();
    } else if (data.type === 'challenge') {
        this.state.challengerIdx = this.state.currentBidderIdx;
        this.state.phase = 'challenge';
        this.broadcastState();
        this.renderOnlineGame();
    } else if (data.type === 'resolve') {
        this.resolveRound(data.success);
    }
  },

  /* ================= CORE LOGIC ================= */

  open() {
    Router.go('setup');
    document.getElementById('setup-title').textContent = this.name;
    document.getElementById('setup-content').innerHTML = `
      <div class="card">
        <div class="card-label">Wähle deinen Modus</div>
        <button class="btn-primary" style="margin-bottom:15px; background:var(--green); color:#000;" onclick="GrenzGaenger.setupOffline()">
           📱 Offline (Ein Gerät teilen)
        </button>
        <button class="btn-primary" onclick="UnifiedLobby.open(GrenzGaenger)">
           🌐 Online (Jeder ein Gerät)
        </button>
      </div>
    `;
  },

  setupOffline() {
    this.state.mode = 'offline';
    this.state.players = ['Spieler 1', 'Spieler 2', 'Spieler 3'];
    this.state.maxRounds = 5;
    this.state.activePackageIds = ['allgemein'];
    this.renderOfflineSetup();
  },

  renderOfflineSetup() {
    document.getElementById('setup-content').innerHTML = `
      <div class="card">
        <div class="card-label">👥 Spieler verwalten</div>
        <div class="players-list" id="lz-players-list"></div>
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px; font-size: 0.9rem;" onclick="GrenzGaenger.addOfflinePlayer()">＋ Spieler hinzufügen</button>
      </div>

      <div class="card">
        <div class="card-label">📦 Kategorien</div>
        <div id="lz-pkg-grid"></div>
      </div>

      <div class="card">
        <div class="card-label">⏱️ Rundenanzahl</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="1" max="21" step="1" value="${this.state.maxRounds > 20 ? 21 : this.state.maxRounds}" 
             style="--pct: ${(( (this.state.maxRounds > 20 ? 21 : this.state.maxRounds) - 1) / (21 - 1)) * 100}%"
             oninput="
               const val = parseInt(this.value);
               document.getElementById('lz-rounds-val').textContent = val > 20 ? 'Endlos' : val; 
               GrenzGaenger.state.maxRounds = val > 20 ? 999 : val;
               this.style.setProperty('--pct', ((val - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="lz-rounds-val" style="font-weight:bold; width: 60px; text-align:right;">${this.state.maxRounds > 20 ? 'Endlos' : this.state.maxRounds}</span>
        </div>
      </div>

      <button class="btn-primary" onclick="GrenzGaenger.startOfflineGame()">🚀 Weiter</button>
    `;
    this.renderOfflinePlayersList();
    this.renderPackages();
  },

  renderPackages() {
    const pkgGridId = this.state.mode === 'online' ? 'lz-pkg-grid-on' : 'lz-pkg-grid';
    PackageManager.renderGrid({
        namespace: 'GrenzGaenger',
        targetId: pkgGridId,
        packages: GrenzGaengerPackages,
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

  renderOfflinePlayersList() {
    const list = document.getElementById('lz-players-list');
    if(!list) return;
    list.innerHTML = this.state.players.map((name, i) => `
      <div class="player-row">
        <div class="player-avatar">${i + 1}</div>
        <input class="player-input" type="text" value="${name}" placeholder="Spieler ${i + 1}" oninput="GrenzGaenger.state.players[${i}] = this.value">
        ${this.state.players.length > 2 ? `<button class="btn-icon" onclick="GrenzGaenger.removeOfflinePlayer(${i})">✕</button>` : ''}
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

  startOfflineGame() {
    this.state.currentRound = 1;
    this.state.scores = {};
    this.state.players.forEach((p, i) => this.state.scores[i] = 0);
    this.startNewOfflineRound();
  },

  getRandomQuestion() {
    let pool = [];
    GrenzGaengerPackages.forEach(pkg => {
        if (this.state.activePackageIds.includes(pkg.id)) {
            pool = pool.concat(pkg.tasks);
        }
    });
    return pool[Math.floor(Math.random() * pool.length)];
  },

  startNewOfflineRound() {
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Grenz-Gänger';
    this.state.currentQuestion = this.getRandomQuestion();
    this.state.currentBid = 0;
    this.state.currentBidderIdx = (this.state.currentRound - 1) % this.state.players.length;
    this.state.lastBidderIdx = -1;
    this.state.challengerIdx = -1;
    this.state.phase = 'bidding';
    this.renderOfflineGame();
  },

  startNewOnlineRound() {
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Grenz-Gänger';
    this.state.currentQuestion = this.getRandomQuestion();
    this.state.currentBid = 0;
    this.state.currentBidderIdx = (this.state.currentRound - 1) % this.state.players.length;
    this.state.lastBidderIdx = -1;
    this.state.challengerIdx = -1;
    this.state.phase = 'bidding';
    this.broadcastState();
    this.renderOnlineGame();
  },

  /* ================= UI RENDERING ================= */

  renderOfflineGame() {
    const s = this.state;
    const currName = s.players[s.currentBidderIdx];
    const lastName = s.lastBidderIdx !== -1 ? s.players[s.lastBidderIdx] : '-';
    
    let ht = `
      <div style="font-size:0.8rem; background:var(--surface2); padding:5px 10px; border-radius:10px; margin-bottom:10px; display:inline-block;">
        Runde <b>${s.currentRound}</b> ${s.maxRounds > 20 ? '' : ` / ${s.maxRounds}`}
      </div>
      
      <div class="card" style="text-align:center; padding: 15px; margin-bottom:12px;">
        <h2 style="margin-bottom:12px; font-size:1.2rem; line-height:1.3;">${s.currentQuestion}</h2>
        <div style="font-size:clamp(2rem, 8vw, 3rem); font-weight:bold; color:var(--primary); line-height:1;">${s.currentBid}</div>
        <p style="color:var(--text-muted); font-size:0.8rem; margin-top:4px;">Gebot von: <b style="color:var(--text)">${lastName}</b></p>
        ${s.maxRounds > 20 ? `<button class="btn-primary" style="background:var(--primary); color:#fff; font-size:0.8rem; margin-top:10px; padding:5px 10px; width:auto;" onclick="GrenzGaenger.renderResults()">Spiel beenden</button>` : ''}
      </div>

      <div class="card" style="text-align:center; padding: 18px; border: 2px solid var(--primary); background: var(--primary-dim); margin-bottom:12px;">
        <div class="card-label" style="font-size:0.7rem;">Am Zug</div>
        <h3 style="font-size:1.4rem; margin-bottom:15px;">${currName}</h3>
        
        ${s.phase === 'bidding' ? `
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:15px;">
                <div style="display:flex; gap:10px; align-items: stretch;">
                    <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin:0; width: 60px; font-size: 1.5rem;" onclick="GrenzGaenger.offlineAction('bid', ${s.currentBid + 1})">+1</button>
                    <input type="number" id="lz-custom-bid" class="player-input" style="flex:1; text-align:center; font-size:1.3rem;" value="${s.currentBid + 1}" min="${s.currentBid + 1}" step="1">
                    <button class="btn-primary" style="width:100px; margin:0; padding:0 20px;" onclick="GrenzGaenger.offlineAction('bid', parseInt(document.getElementById('lz-custom-bid').value))">BIETEN</button>
                </div>
            </div>
            ${s.currentBid > 0 ? `<button class="btn-primary" style="background:var(--primary); color:#fff; border-radius:20px; font-size:0.9rem; padding:12px; margin-top:10px;" onclick="GrenzGaenger.offlineAction('challenge')">🚫 Das schafft er nie!</button>` : ''}
        ` : ''}

        ${s.phase === 'challenge' ? `
            <div style="background:var(--bg); color:var(--primary); border: 2px solid var(--primary); padding:20px; border-radius:15px; margin-bottom:25px;">
                <b style="font-size:1.2rem; text-transform:uppercase; letter-spacing:0.1em;">CHALLENGE!</b><br>
                <span style="font-size:1.1rem; color:var(--text); display:block; margin-top:10px;"><b>${s.players[s.lastBidderIdx]}</b> muss nun <b>${s.currentBid}</b> Dinge nennen.</span>
            </div>
            <p style="margin-bottom:15px; font-weight:bold;">Hat er es geschafft?</p>
            <div style="display:flex; gap:10px;">
                <button class="btn-primary" style="background:var(--green); color:#000; margin:0;" onclick="GrenzGaenger.offlineAction('resolve', true)">✅ JA!</button>
                <button class="btn-primary" style="background:var(--primary); color:#fff; margin:0;" onclick="GrenzGaenger.offlineAction('resolve', false)">❌ NEIN!</button>
            </div>
        ` : ''}
      </div>

      <div class="card-label" style="margin-top:25px; margin-bottom:10px;">Punktestand:</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${s.players.map((name, i) => `
            <div style="background:var(--surface); border:1px solid var(--border); padding:8px 14px; border-radius:12px; font-size:0.85rem;">
                ${name}: <b style="color:var(--secondary)">${s.scores[i]}</b>
            </div>
        `).join('')}
      </div>
      <div style="margin-top:20px;">
      </div>
    `;
    document.getElementById('play-content').innerHTML = ht;
  },

  offlineAction(type, val) {
    const s = this.state;
    if (type === 'bid') {
        if (isNaN(val) || val <= s.currentBid) return alert("Du musst höher bieten!");
        s.lastBidderIdx = s.currentBidderIdx;
        s.currentBid = val;
        s.currentBidderIdx = (s.currentBidderIdx + 1) % s.players.length;
    } else if (type === 'challenge') {
        s.challengerIdx = s.currentBidderIdx;
        s.phase = 'challenge';
    } else if (type === 'resolve') {
        this.resolveRound(val);
        return;
    }
    this.renderOfflineGame();
  },

  resolveRound(success) {
    const s = this.state;
    const performerIdx = this.state.mode === 'online' ? this.state.players[s.lastBidderIdx].id : s.lastBidderIdx;
    
    if (success) {
        s.scores[performerIdx]++;
    } else {
        // Everyone except performer gets a point
        if (this.state.mode === 'online') {
            s.players.forEach(p => {
                if (p.id !== performerIdx) s.scores[p.id]++;
            });
        } else {
            s.players.forEach((_, i) => {
                if (i !== performerIdx) s.scores[i]++;
            });
        }
    }

    if (s.currentRound >= s.maxRounds) {
        s.phase = 'results';
        this.renderResults();
    } else {
        s.currentRound++;
        if (this.state.mode === 'online') {
            this.startNewOnlineRound();
        } else {
            this.startNewOfflineRound();
        }
    }
  },

  renderResults() {
    const s = this.state;
    let winners = [];
    let maxScore = -1;
    
    if (this.state.mode === 'online') {
        s.players.forEach(p => {
            if (s.scores[p.id] > maxScore) {
                maxScore = s.scores[p.id];
                winners = [p.name];
            } else if (s.scores[p.id] === maxScore) {
                winners.push(p.name);
            }
        });
    } else {
        s.players.forEach((name, i) => {
            if (s.scores[i] > maxScore) {
                maxScore = s.scores[i];
                winners = [name];
            } else if (s.scores[i] === maxScore) {
                winners.push(name);
            }
        });
    }
    this.state.phase = 'results';

    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:50px 20px;">
        <h1 style="font-size:clamp(2.2rem, 10vw, 3.5rem); margin-bottom:10px; font-family:'Abril Fatface', cursive;">🏆 Sieg!</h1>
        <h2 style="color:var(--primary); margin-bottom:40px; font-size:2rem;">${winners.join(' & ')}</h2>
        
        <div class="card-label">Finale Punkte</div>
        <div style="background:var(--surface2); padding:20px; border-radius:15px; margin-bottom:40px;">
            ${(this.state.mode === 'online' ? s.players.map(p => `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>${p.name}</span>
                    <b style="color:var(--secondary)">${s.scores[p.id]} Pkt.</b>
                </div>
            `) : s.players.map((name, i) => `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>${name}</span>
                    <b style="color:var(--secondary)">${s.scores[i]} Pkt.</b>
                </div>
            `)).join('')}
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${this.state.mode === 'offline' || Multiplayer.role === 'host' ? `<button class="btn-primary" onclick="GrenzGaenger.rematch()">Nochmal spielen</button>` : ''}
          <button class="btn-primary" style="background:var(--surface2); color:var(--text);" onclick="GrenzGaenger.open()">Hauptmenü</button>
          ${this.state.mode === 'online' ? `<button class="btn-primary" style="background:var(--surface2); color:var(--text);" onclick="GrenzGaenger.returnToLobby()">Lobby</button>` : ''}
        </div>
      </div>
    `;

    if (this.state.mode === 'online' && Multiplayer.role === 'host') {
        this.broadcastState();
    }
  },

  /* ================= ONLINE SPECIFIC ================= */

  renderHostSetup() {
    return `
      <div class="card">
        <div class="card-label">📦 Kategorien</div>
        <div id="lz-pkg-grid-on"></div>
      </div>
      <div class="card">
        <div class="card-label">⏱️ Rundenanzahl</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="1" max="21" step="1" value="${this.state.maxRounds > 20 ? 21 : this.state.maxRounds}" 
             style="--pct: ${(( (this.state.maxRounds > 20 ? 21 : this.state.maxRounds) - 1) / (21 - 1)) * 100}%"
             oninput="
               const val = parseInt(this.value);
               document.getElementById('lz-rounds-val-on').textContent = val > 20 ? 'Endlos' : val; 
               GrenzGaenger.state.maxRounds = val > 20 ? 999 : val;
               this.style.setProperty('--pct', ((val - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="lz-rounds-val-on" style="font-weight:bold; width: 60px; text-align:right;">${this.state.maxRounds > 20 ? 'Endlos' : this.state.maxRounds}</span>
        </div>
      </div>
    `;
  },

  onHostLobbyRendered() {
    this.renderPackages();
  },

  broadcastState() {
    Multiplayer.sendGameState({
        type: 'sync_state',
        state: {
            phase: this.state.phase,
            currentQuestion: this.state.currentQuestion,
            currentBid: this.state.currentBid,
            currentBidderIdx: this.state.currentBidderIdx,
            lastBidderIdx: this.state.lastBidderIdx,
            challengerIdx: this.state.challengerIdx,
            scores: this.state.scores,
            currentRound: this.state.currentRound,
            players: this.state.players.map(p => ({ id: p.id, name: p.name })),
            activePackageIds: this.state.activePackageIds
        }
    });
  },

  renderOnlineGame() {
    const s = this.state;
    if (s.phase === 'results') return this.renderResults();

    const myId = Multiplayer.role === 'host' ? 'host-1' : Multiplayer.myId;
    const isMyTurn = s.players[s.currentBidderIdx].id === myId;
    const currName = isMyTurn ? 'DU' : s.players[s.currentBidderIdx].name;
    const lastName = s.lastBidderIdx !== -1 ? s.players[s.lastBidderIdx].name : '-';
    const isChallenger = s.challengerIdx !== -1 && s.players[s.challengerIdx].id === myId;
    
    let ht = `
      <div style="font-size:0.75rem; background:var(--surface2); padding:4px 10px; border-radius:10px; margin-bottom:8px; display:inline-block;">
        Runde <b>${s.currentRound}</b> ${s.maxRounds > 20 ? '' : ` / ${s.maxRounds}`}
      </div>

      <div class="card" style="text-align:center; padding: 15px; margin-bottom:12px;">
        <h2 style="margin-bottom:12px; font-size:1.2rem; line-height:1.3;">${s.currentQuestion}</h2>
        <div style="font-size:clamp(2rem, 8vw, 3rem); font-weight:bold; color:var(--primary); line-height:1;">${s.currentBid}</div>
        <p style="color:var(--text-muted); font-size:0.8rem; margin-top:4px;">Gebot von: <b style="color:var(--text)">${lastName}</b> ${s.lastBidderIdx !== -1 && s.players[s.lastBidderIdx].id === myId ? '(DIR)' : ''}</p>
        ${s.maxRounds > 20 && Multiplayer.role === 'host' ? `<button class="btn-primary" style="background:var(--primary); color:#fff; font-size:0.8rem; margin-top:10px; padding:5px 10px; width:auto;" onclick="GrenzGaenger.renderResults()">Spiel beenden</button>` : ''}
      </div>

      <div class="card" style="text-align:center; padding: 18px; border: 2px solid ${isMyTurn ? 'var(--primary)' : 'transparent'}; background: ${isMyTurn ? 'var(--primary-dim)' : 'var(--surface)'}; margin-bottom:12px;">
        <div class="card-label" style="font-size:0.7rem;">Am Zug</div>
        <h3 style="font-size:1.4rem; margin-bottom:15px;">${currName}</h3>
        
        ${s.phase === 'bidding' ? (
            isMyTurn ? `
                 <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:10px;">
                    <div style="display:flex; gap:10px; align-items: stretch;">
                        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin:0; width: 60px; font-size: 1.5rem;" onclick="GrenzGaenger.onlineAction('bid', ${s.currentBid + 1})">+1</button>
                        <input type="number" id="lz-custom-bid-on" class="player-input" style="flex:1; text-align:center; font-size:1.3rem;" value="${s.currentBid + 1}" min="${s.currentBid + 1}" step="1">
                        <button class="btn-primary" style="width:100px; margin:0; padding:0 20px;" onclick="GrenzGaenger.onlineAction('bid', parseInt(document.getElementById('lz-custom-bid-on').value))">BIETEN</button>
                    </div>
                </div>
                ${s.currentBid > 0 ? `<button class="btn-primary" style="background:var(--primary); color:#fff; border-radius:20px; font-size:0.9rem; padding:12px; margin-top:10px;" onclick="GrenzGaenger.onlineAction('challenge')">🚫 Das schafft er nie!</button>` : ''}
            ` : `<p style="color:var(--text-muted);">Warte darauf, dass <b>${currName}</b> bietet...</p>`
        ) : ''}

        ${s.phase === 'challenge' ? `
            <div style="background:var(--bg); color:var(--primary); border: 2px solid var(--primary); padding:20px; border-radius:15px; margin-bottom:25px;">
                <b style="font-size:1.2rem; text-transform:uppercase; letter-spacing:0.1em;">CHALLENGE!</b><br>
                <span style="font-size:1.1rem; color:var(--text); display:block; margin-top:10px;"><b>${s.players[s.lastBidderIdx].name}</b> muss nun <b>${s.currentBid}</b> Dinge nennen.</span>
            </div>
            ${isChallenger ? `
                <p style="margin-bottom:15px; font-weight:bold;">Hat er es geschafft?</p>
                <div style="display:flex; gap:10px;">
                    <button class="btn-primary" style="background:var(--green); color:#000; margin:0;" onclick="GrenzGaenger.onlineAction('resolve', true)">✅ JA!</button>
                    <button class="btn-primary" style="background:var(--primary); color:#fff; margin:0;" onclick="GrenzGaenger.onlineAction('resolve', false)">❌ NEIN!</button>
                </div>
            ` : `<p style="color:var(--text-muted);">Warte auf Bestätigung von <b>${s.players[s.challengerIdx].name}</b>...</p>`}
        ` : ''}
      </div>

      <div class="card-label" style="margin-top:25px; margin-bottom:10px;">Punktestand:</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${s.players.map(p => `
            <div style="background:var(--surface); border: 1px solid ${p.id === myId ? 'var(--primary)' : 'var(--border)'}; padding:8px 14px; border-radius:12px; font-size:0.85rem;">
                ${p.name}: <b style="color:var(--secondary)">${s.scores[p.id]}</b>
            </div>
        `).join('')}
      </div>
      <div style="margin-top:20px;">
      </div>
    `;
    document.getElementById('play-content').innerHTML = ht;
  },

  onlineAction(type, val = null) {
    if (type === 'bid' && (isNaN(val) || val <= this.state.currentBid)) return alert("Du musst höher bieten!");
    
    if (Multiplayer.role === 'host') {
        this.handleOnlineData({ type, value: val, success: val, playerId: 'host-1' }, null);
    } else {
        Multiplayer.sendToHost({ type, value: val, success: val, playerId: Multiplayer.myId });
    }
  },

  returnToLobby() {
    if (this.state.mode === 'offline') {
        this.open();
    } else {
        if (Multiplayer.role === 'host') {
            Multiplayer.sendGameState({ type: 'return_lobby' });
            refreshLobby();
        } else {
            refreshLobby();
        }
    }
  },

  rematch() {
      if (this.state.mode === 'online') {
          this.onOnlineGameStart(this.collectOnlineSettings());
      } else {
          this.startOfflineGame();
      }
  }
};
