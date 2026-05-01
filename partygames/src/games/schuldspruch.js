const SchuldspruchPackages = [
  { id: 'allgemein', name: 'Allgemein', emoji: '💡', tasks: [
    '... bei einem Rodeo mitmachen', '... aus Versehen etwas stehlen', '... eine Woche im Wald überleben', 
    '... im Lotto gewinnen und alles an einem Tag ausgeben', '... ein Geheimnis versehentlich ausplaudern', 
    '... Präsident werden', '... den Geburtstag des Partners vergessen', '... in einer Prüfung schummeln', 
    '... sich bei einem Date total blamieren', '... einen Promi nicht erkennen', '... auf einer einsamen Insel überleben', 
    '... ein peinliches Foto posten', '... in einem Horrorfilm als erster sterben', '... eine Million Euro spenden',
    '... jemanden versehentlich auf Social Media stalken', '... vergessen den Herd auszuschalten',
    '... einen Marathon ohne Training laufen', '... sich in einer fremden Stadt verlaufen',
    '... mit einem Tier sprechen als wäre es ein Mensch', '... ein Jahr lang ohne Internet leben'
  ]},
  { id: 'party', name: 'Party', emoji: '🎉', tasks: [
    '... als erstes betrunken sein', '... auf dem Tisch tanzen', '... mit einem Fremden nach Hause gehen', 
    '... eine Runde für alle ausgeben', '... am nächsten Morgen nichts mehr wissen', '... auf der Party einschlafen', 
    '... den DJ nerven', '... peinlich tanzen', '... sein Handy verlieren', '... dem Gastgeber beim Aufräumen helfen',
    '... die ganze Nacht Karaoke singen', '... einen Handstand auf der Tanzfläche versuchen',
    '... Chips in den Dip fallen lassen und es ignorieren', '... sich über das Mischverhältnis beschweren',
    '... heimlich die Playlist ändern', '... als Erster nach Hause gehen', '... mit der Katze chillen statt mit Gästen',
    '... am nächsten Tag den peinlichsten Anruf tätigen', '... eine Pizza um 3 Uhr morgens bestellen',
    '... versuchen in einen Club zu kommen trotz Hausverbot'
  ]},
  { id: 'peinlich', name: 'Peinlich', emoji: '😳', tasks: [
    '... in der Öffentlichkeit furzen', '... eine Nachricht an den Ex schicken', '... beim Lügen erwischt werden', 
    '... gegen eine Glastür laufen', '... jemanden mit falschem Namen ansprechen', '... im falschen Moment lachen', 
    '... sich in der Öffentlichkeit blamieren', '... mit Schokoflecken im Gesicht herumlaufen',
    '... beim Niesen einen lauten Pups lassen', '... Klopapier am Schuh kleben haben',
    '... jemanden grüßen der jemand anderen meinte', '... beim Reden Spucke verlieren',
    '... den Namen einer Person sofort vergessen', '... in die falsche Autotür einsteigen',
    '... ein privates Gespräch laut in der Bahn führen', '... ein Emoji völlig falsch verwenden',
    '... beim Lachen Getränk aus der Nase prusten', '... mit offenem Hosenstall herumlaufen',
    '... ein Kompliment völlig falsch verstehen', '... sein eigenes Spiegelbild grüßen'
  ]},
  { id: 'extrem', name: 'Extrem', emoji: '🔥', tasks: [
    '... für 10.000€ Insekten essen', '... nackt durch die Straße flitzen', '... aus einem fliegenden Flugzeug springen', 
    '... an einer Schlägerei teilnehmen', '... ins Gefängnis kommen', '... einen Geist bei sich zuhause beschwören',
    '... ein Jahr im Kloster verbringen', '... ohne Geld durch Europa trampen',
    '... eine Woche lang nur von Abfall leben', '... sich den Namen des Ex tätowieren lassen',
    '... an einer Reality-TV-Show teilnehmen', '... einen Bärenkampf (theoretisch) gewinnen wollen',
    '... ein Jahr lang aufs Smartphone verzichten', '... seine Ersparnis auf Schwarz setzen',
    '... alleine in einem verlassenen Haus übernachten', '... eine Rede vor 10.000 Menschen halten',
    '... von einer Brücke in eiskaltes Wasser springen', '... sich alle Haare abrasieren für eine Wette',
    '... eine Woche lang nicht schlafen', '... in die Wildnis ziehen und nie zurückkommen'
  ]},
  { id: 'urlaub', name: 'Urlaub', emoji: '🌴', tasks: [
    '... am Flughafen seinen Pass vergessen', '... den Koffer einer anderen Person mitnehmen',
    '... sich im falschen Hotel einchecken', '... versuchen mit Händen und Füßen zu sprechen',
    '... den Flug verpassen weil man eingeschlafen ist', '... ein schreckliches Souvenir kaufen',
    '... im Urlaub krank werden', '... eine Liege reservieren und nie kommen',
    '... sich weigern lokales Essen zu probieren', '... die Reise mit einer Excel-Tabelle planen',
    '... am Strand einschlafen und einen Sonnenbrand bekommen', '... sein Handy im Meer versenken'
  ]},
  { id: 'schule', name: 'Beruf & Schule', emoji: '🏢', tasks: [
    '... in einer wichtigen Zoom-Konferenz einschlafen', '... den Chef versehentlich "Schatz" nennen',
    '... eine peinliche Mail an den falschen Verteiler schicken', '... Hausaufgaben vom Nachbarn abschreiben',
    '... bei einer Präsentation den roten Faden verlieren', '... zu spät kommen und eine schlechte Ausrede haben',
    '... heimlich unter dem Tisch essen', '... im Unterricht/Meeting laut schnarchen',
    '... den Namen eines Kollegen seit Jahren falsch sagen', '... die Kaffeemaschine im Büro kaputt machen',
    '... versuchen sich mit Kaffee vor einem Kater zu retten'
  ]}
];

const Schuldspruch = {
  name: "Schuldspruch",
  tagline: "Wer würde am ehesten...?",
  color: "#ff3b30",
  shadow: "rgba(255, 59, 48, 0.4)",
  glow: "rgba(255, 59, 48, 0.2)",
  emoji: "👉",

  state: {
    mode: null,
    players: [],
    maxRounds: 5,
    voteTime: 15,
    activePackageIds: ['allgemein'],
    currentRound: 0,
    scores: {},
    phase: 'setup',
    currentQuestion: '',
    votes: {}, // playerId -> targetId (online)
    offlineVotes: {}, // index -> voteCount (offline)
    timeLeft: 0,
    timerInterval: null,
    questionPool: []
  },

  /* ================= UNIFIED LOBBY HOOKS ================= */
  collectOnlineSettings() {
    return {
      maxRounds: this.state.maxRounds,
      voteTime: this.state.voteTime,
      activePackageIds: [...this.state.activePackageIds]
    };
  },

  onOnlineGameStart(settings) {
    this.state.mode = 'online';
    this.state.maxRounds = parseInt(settings.maxRounds) || 5;
    this.state.voteTime = parseInt(settings.voteTime) || 15;
    this.state.players = settings.players || [];
    this.state.activePackageIds = settings.activePackageIds || ['allgemein'];
    this.state.currentRound = 1;
    this.state.scores = {};
    this.state.players.forEach(p => this.state.scores[p.id] = 0);
    this.prepareQuestionPool();
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
    if (data.type === 'vote') {
        this.state.votes[data.playerId] = data.targetId;
        // Check if all voted
        if (Object.keys(this.state.votes).length >= this.state.players.length) {
            this.resolveOnlineRound();
        } else {
            this.broadcastState();
            this.renderOnlineGame();
        }
    }
  },

  /* ================= OPEN & SETUP ================= */
  open() {
    Router.go('setup');
    document.getElementById('setup-title').textContent = this.name;
    document.getElementById('setup-content').innerHTML = `
      <div class="card">
        <div class="card-label">Wähle deinen Modus</div>
        <button class="btn-primary" style="margin-bottom:15px; background:var(--green); color:#000;" onclick="Schuldspruch.setupOffline()">
           📱 Offline (Ein Gerät teilen)
        </button>
        <button class="btn-primary" onclick="UnifiedLobby.open(Schuldspruch)">
           🌐 Online (Jeder ein Gerät)
        </button>
      </div>
    `;
  },

  prepareQuestionPool() {
    this.state.questionPool = [];
    this.state.activePackageIds.forEach(pid => {
        const pkg = SchuldspruchPackages.find(p => p.id === pid);
        if (pkg) this.state.questionPool.push(...pkg.tasks);
    });
    this.shuffleArray(this.state.questionPool);
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
        <div class="card-label">👥 Spieler (Min. 3)</div>
        <div class="players-list" id="fz-players-list"></div>
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px; font-size: 0.9rem;" onclick="Schuldspruch.addOfflinePlayer()">＋ Spieler hinzufügen</button>
      </div>

      <div class="card">
        <div class="card-label">📦 Kategorien</div>
        <div id="fz-pkg-grid"></div>
      </div>

      <div class="card">
        <div class="card-label">⏱️ Rundenanzahl</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="1" max="21" step="1" value="${this.state.maxRounds > 20 ? 21 : this.state.maxRounds}" 
             style="--pct: ${(( (this.state.maxRounds > 20 ? 21 : this.state.maxRounds) - 1) / (21 - 1)) * 100}%"
             oninput="
               const val = parseInt(this.value);
               document.getElementById('fz-rounds-val').textContent = val > 20 ? 'Endlos' : val; 
               Schuldspruch.state.maxRounds = val > 20 ? 999 : val;
               this.style.setProperty('--pct', ((val - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="fz-rounds-val" style="font-weight:bold; width: 60px; text-align:right;">${this.state.maxRounds > 20 ? 'Endlos' : this.state.maxRounds}</span>
        </div>
      </div>

      <button class="btn-primary" onclick="Schuldspruch.startOfflineGame()">🚀 Weiter</button>
    `;
    this.renderOfflinePlayersList();
    this.renderPackages('fz-pkg-grid');
  },

  renderOfflinePlayersList() {
    const list = document.getElementById('fz-players-list');
    if (!list) return;
    list.innerHTML = this.state.players.map((p, i) => `
      <div style="display:flex; gap:10px; margin-bottom:8px;">
        <input type="text" class="player-input" value="${p}" onchange="Schuldspruch.updateOfflinePlayer(${i}, this.value)">
        ${this.state.players.length > 3 ? `<button class="btn-icon" onclick="Schuldspruch.removeOfflinePlayer(${i})">✕</button>` : ''}
      </div>
    `).join('');
  },

  addOfflinePlayer() {
    this.state.players.push(`Spieler ${this.state.players.length + 1}`);
    this.renderOfflinePlayersList();
  },

  removeOfflinePlayer(idx) {
    if (this.state.players.length <= 3) return;
    this.state.players.splice(idx, 1);
    this.renderOfflinePlayersList();
  },

  updateOfflinePlayer(idx, val) {
    if (val.trim()) this.state.players[idx] = val.trim();
  },

  renderPackages(containerId) {
    PackageManager.renderGrid({
        namespace: 'Schuldspruch',
        targetId: containerId,
        packages: SchuldspruchPackages,
        activeIds: this.state.activePackageIds,
        isMulti: true,
        countSuffix: 'Fragen',
        onToggle: (id) => {
            if (this.state.activePackageIds.includes(id)) {
                if (this.state.activePackageIds.length <= 1) return alert("Mindestens ein Paket muss aktiv sein!");
                this.state.activePackageIds = this.state.activePackageIds.filter(pid => pid !== id);
            } else {
                this.state.activePackageIds.push(id);
            }
            this.renderPackages(containerId);
            if (this.state.mode === 'online' && Multiplayer.role === 'host') {
                refreshLobby(); 
            }
        }
    });
  },

  /* ================= OFFLINE GAME ================= */
  startOfflineGame() {
    this.state.currentRound = 1;
    this.state.scores = {};
    this.state.players.forEach((_, i) => this.state.scores[i] = 0);
    this.prepareQuestionPool();
    this.startNewOfflineRound();
  },

  startNewOfflineRound() {
    this.state.phase = 'voting';
    if (this.state.questionPool.length === 0) this.prepareQuestionPool(); // reshuffle if empty
    this.state.currentQuestion = this.state.questionPool.pop();
    this.state.offlineVotes = {};
    this.state.players.forEach((_, i) => this.state.offlineVotes[i] = 0);
    
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Schuldspruch';
    this.renderOfflineGame();
  },

  renderOfflineGame() {
    const s = this.state;
    if (s.phase === 'results') return this.renderResults();

    let ht = '';
    if (s.phase === 'voting') {
        ht = `
          <div style="font-size:0.75rem; background:var(--surface2); padding:4px 10px; border-radius:10px; margin-bottom:8px; display:inline-block;">
            Runde <b>${s.currentRound}</b> ${s.maxRounds > 20 ? '' : ` / ${s.maxRounds}`}
          </div>
          <div class="card" style="text-align:center; padding: 25px 15px; margin-bottom:15px; background:var(--primary-dim); border: 2px solid var(--primary);">
            <h2 style="font-size:1.6rem; line-height:1.3; margin:0;">Wer würde am ehesten ${s.currentQuestion}?</h2>
            ${s.maxRounds > 20 ? `<button class="btn-primary" style="background:var(--primary); color:#fff; font-size:0.8rem; margin-top:20px; padding:5px 10px; width:auto;" onclick="Schuldspruch.renderResults()">Spiel beenden</button>` : ''}
          </div>
          <p style="text-align:center; color:var(--text-muted); margin-bottom:15px; font-size:0.9rem;">Sammelt die Stimmen aller Spieler. Gebt dazu das Handy weiter oder tippt gemeinsam ab.</p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${s.players.map((p, i) => `
                <div style="background:var(--surface2); border-radius:10px; padding:10px 15px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:bold; font-size:1.1rem;">${p}</span>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span style="font-size:1.2rem; min-width:30px; text-align:center;">${s.offlineVotes[i]}</span>
                        <button class="btn-primary" style="margin:0; width:50px; font-size:1.5rem; background:var(--primary); color:#fff; padding:5px;" onclick="Schuldspruch.addOfflineVote(${i})">+1</button>
                    </div>
                </div>
            `).join('')}
          </div>
          <button class="btn-primary" style="margin-top:25px;" onclick="Schuldspruch.resolveOfflineRound()">Auswertung</button>
        `;
    } else if (s.phase === 'round_result') {
        // Find winners
        let maxVotes = -1;
        let winners = [];
        Object.keys(s.offlineVotes).forEach(i => {
            if (s.offlineVotes[i] > maxVotes) {
               maxVotes = s.offlineVotes[i];
               winners = [s.players[i]];
            } else if (s.offlineVotes[i] === maxVotes) {
               winners.push(s.players[i]);
            }
        });

        ht = `
          <div class="card" style="text-align:center; padding: 40px 20px;">
            <h2 style="color:var(--text-muted); font-size:1rem; margin-bottom:10px;">Auswertung</h2>
            <h3 style="font-size:1.6rem; margin-bottom:30px; line-height:1.3;">Wer würde am ehesten ${s.currentQuestion}?</h3>
            
            <div style="font-size:clamp(3rem, 15vw, 4rem); margin-bottom:10px;">👇</div>
            <div style="font-size:clamp(1.8rem, 8vw, 2.5rem); font-weight:bold; color:var(--primary); line-height:1.1; margin-bottom:10px;">
               ${maxVotes > 0 ? winners.join(' & ') : 'Niemand'}
            </div>
            <p style="color:var(--text-muted); margin-bottom:30px;">mit ${maxVotes} Stimmen</p>
            
            <button class="btn-primary" onclick="Schuldspruch.nextRoundOffline()">Weiter (${s.currentRound}/${s.maxRounds})</button>
          </div>
        `;
    }
    
    document.getElementById('play-content').innerHTML = ht;
  },

  addOfflineVote(idx) {
      this.state.offlineVotes[idx]++;
      this.renderOfflineGame();
  },

  resolveOfflineRound() {
      // Find winners and distribute points
      let maxVotes = -1;
      let winners = [];
      Object.keys(this.state.offlineVotes).forEach(i => {
          if (this.state.offlineVotes[i] > maxVotes) {
             maxVotes = this.state.offlineVotes[i];
             winners = [i];
          } else if (this.state.offlineVotes[i] === maxVotes) {
             winners.push(i);
          }
      });

      if (maxVotes > 0) {
          winners.forEach(i => {
              this.state.scores[i]++;
          });
      }

      this.state.phase = 'round_result';
      this.renderOfflineGame();
  },

  nextRoundOffline() {
      if (this.state.currentRound >= this.state.maxRounds) {
          this.state.phase = 'results';
          this.renderResults();
      } else {
          this.state.currentRound++;
          this.startNewOfflineRound();
      }
  },

  /* ================= ONLINE SPECIFIC ================= */
  renderHostSetup() {
    return `
      <div class="card">
        <div class="card-label">📦 Kategorien</div>
        <div id="fz-pkg-grid-on"></div>
      </div>
      <div class="card">
        <div class="card-label">⏱️ Rundenanzahl</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="1" max="21" step="1" value="${this.state.maxRounds > 20 ? 21 : this.state.maxRounds}" 
             style="--pct: ${(( (this.state.maxRounds > 20 ? 21 : this.state.maxRounds) - 1) / (21 - 1)) * 100}%"
             oninput="
               const val = parseInt(this.value);
               document.getElementById('fz-rounds-val-on').textContent = val > 20 ? 'Endlos' : val; 
               Schuldspruch.state.maxRounds = val > 20 ? 999 : val;
               this.style.setProperty('--pct', ((val - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="fz-rounds-val-on" style="font-weight:bold; width: 60px; text-align:right;">${this.state.maxRounds > 20 ? 'Endlos' : this.state.maxRounds}</span>
        </div>
      </div>
      <div class="card">
        <div class="card-label">⏳ Zeit für Abstimmung (Sekunden)</div>
        <div style="display:flex; align-items:center; gap:10px;">
           <input type="range" class="styled-range" min="5" max="60" step="5" value="${this.state.voteTime}" 
             style="--pct: ${((this.state.voteTime - 5) / (60 - 5)) * 100}%"
             oninput="
               document.getElementById('fz-time-val-on').textContent = this.value; 
               Schuldspruch.state.voteTime = parseInt(this.value);
               this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
             ">
           <span id="fz-time-val-on" style="font-weight:bold; width: 30px; text-align:right;">${this.state.voteTime}</span>
        </div>
      </div>
    `;
  },

  onHostLobbyRendered() {
    this.renderPackages('fz-pkg-grid-on');
  },

  startNewOnlineRound() {
      this.state.phase = 'voting';
      if (this.state.questionPool.length === 0) this.prepareQuestionPool();
      this.state.currentQuestion = this.state.questionPool.pop();
      this.state.votes = {};
      this.state.timeLeft = this.state.voteTime;
      
      this.broadcastState();
      
      Router.go('play');
      document.getElementById('play-game-name').textContent = 'Schuldspruch';
      this.renderOnlineGame();

      // Start timer
      clearInterval(this.state.timerInterval);
      this.state.timerInterval = setInterval(() => {
          this.state.timeLeft--;
          if (this.state.timeLeft <= 0) {
              clearInterval(this.state.timerInterval);
              this.resolveOnlineRound();
          } else {
              this.broadcastState(); // send updated time
              this.renderOnlineGame();
          }
      }, 1000);
  },

  broadcastState() {
      Multiplayer.sendGameState({
          type: 'sync_state',
          state: {
              phase: this.state.phase,
              currentQuestion: this.state.currentQuestion,
              scores: this.state.scores,
              currentRound: this.state.currentRound,
              players: this.state.players.map(p => ({ id: p.id, name: p.name })),
              timeLeft: this.state.timeLeft,
              votes: this.state.votes,
              maxRounds: this.state.maxRounds
          }
      });
  },

  renderOnlineGame() {
      const s = this.state;
      if (s.phase === 'results') return this.renderResults();

      const myId = Multiplayer.role === 'host' ? 'host-1' : Multiplayer.myId;
      const iVoted = !!s.votes[myId];

      let ht = '';
      if (s.phase === 'voting') {
          ht = `
            <div style="font-size:0.75rem; background:var(--surface2); padding:4px 10px; border-radius:10px; margin-bottom:8px; display:inline-block;">
              Runde <b>${s.currentRound}</b> ${s.maxRounds > 20 ? '' : ` / ${s.maxRounds}`}
            </div>
            <div class="card" style="text-align:center; padding: 25px 15px; margin-bottom:15px; background:var(--primary-dim); border: 2px solid var(--primary);">
              <h2 style="font-size:1.6rem; line-height:1.3; margin:0;">Wer würde am ehesten ${s.currentQuestion}?</h2>
              ${s.maxRounds > 20 && Multiplayer.role === 'host' ? `<button class="btn-primary" style="background:var(--primary); color:#fff; font-size:0.8rem; margin-top:15px; padding:5px 10px; width:auto;" onclick="Schuldspruch.renderResults()">Spiel beenden</button>` : ''}
            </div>
            
            <div style="text-align:center; margin-bottom:20px; font-weight:bold; color:var(--primary); font-size:1.5rem;">
               ⏱️ ${s.timeLeft}s
            </div>

            ${!iVoted ? `
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
                    ${s.players.map(p => `
                        <div style="background:var(--surface); border:1px solid var(--border); padding:20px; text-align:center; border-radius:15px; cursor:pointer;" onclick="Schuldspruch.submitOnlineVote('${p.id}')">
                           <div style="font-size:1.2rem; font-weight:bold;">${p.name}</div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="card" style="text-align:center; padding:30px 20px;">
                    <div style="font-size:clamp(2rem, 8vw, 3rem); margin-bottom:10px;">✅</div>
                    <h3>Stimme abgegeben!</h3>
                    <p style="color:var(--text-muted);">Warte auf die anderen Spieler...</p>
                    <p style="margin-top:10px;">${Object.keys(s.votes).length} / ${s.players.length} haben abgestimmt.</p>
                </div>
            `}
          `;
      } else if (s.phase === 'round_result') {
          // Calculate max votes from s.votes
          let voteCounts = {};
          s.players.forEach(p => voteCounts[p.id] = 0);
          Object.values(s.votes).forEach(targetId => {
              if (voteCounts[targetId] !== undefined) voteCounts[targetId]++;
          });
          
          let maxVotes = -1;
          let winners = [];
          Object.keys(voteCounts).forEach(id => {
              if (voteCounts[id] > maxVotes) {
                 maxVotes = voteCounts[id];
                 winners = [s.players.find(p=>p.id===id).name];
              } else if (voteCounts[id] === maxVotes) {
                 winners.push(s.players.find(p=>p.id===id).name);
              }
          });

          ht = `
            <div class="card" style="text-align:center; padding: 40px 20px;">
              <h2 style="color:var(--text-muted); font-size:1rem; margin-bottom:10px;">Auswertung</h2>
              <h3 style="font-size:1.6rem; margin-bottom:30px; line-height:1.3;">Wer würde am ehesten ${s.currentQuestion}?</h3>
              
              <div style="font-size:clamp(3rem, 15vw, 4rem); margin-bottom:10px;">👇</div>
              <div style="font-size:clamp(1.8rem, 8vw, 2.5rem); font-weight:bold; color:var(--primary); line-height:1.1; margin-bottom:10px;">
                 ${maxVotes > 0 ? winners.join(' & ') : 'Niemand'}
              </div>
              <p style="color:var(--text-muted); margin-bottom:30px;">mit ${maxVotes} Stimmen</p>
              
               ${Multiplayer.role === 'host' ? `
                    <div style="display:flex; gap:10px; justify-content:center;">
                      <button class="btn-primary" onclick="Schuldspruch.nextRoundOnline()">Weiter (${s.currentRound}/${s.maxRounds})</button>
                      <button class="btn-primary" style="background:var(--surface2); color:var(--text); width:auto;" onclick="Schuldspruch.returnToLobby()">Lobby</button>
                    </div>
               ` : '<p style="color:var(--text-muted);">Warte auf den Host...</p>'}
             </div>
           `;
      }
      
      document.getElementById('play-content').innerHTML = ht;
  },

  submitOnlineVote(targetId) {
      const myId = Multiplayer.role === 'host' ? 'host-1' : Multiplayer.myId;
      if (Multiplayer.role === 'host') {
          this.handleOnlineData({ type: 'vote', playerId: myId, targetId: targetId });
      } else {
          Multiplayer.sendToHost({ type: 'vote', playerId: myId, targetId: targetId });
          // Optimistic local update
          this.state.votes[myId] = targetId;
          this.renderOnlineGame();
      }
  },

  resolveOnlineRound() {
      clearInterval(this.state.timerInterval);
      
      // Tally votes
      let voteCounts = {};
      this.state.players.forEach(p => voteCounts[p.id] = 0);
      Object.values(this.state.votes).forEach(targetId => {
          if (voteCounts[targetId] !== undefined) voteCounts[targetId]++;
      });
      
      let maxVotes = -1;
      let winners = [];
      Object.keys(voteCounts).forEach(id => {
          if (voteCounts[id] > maxVotes) {
             maxVotes = voteCounts[id];
             winners = [id];
          } else if (voteCounts[id] === maxVotes) {
             winners.push(id);
          }
      });

      if (maxVotes > 0) {
          winners.forEach(id => {
              this.state.scores[id]++;
          });
      }

      this.state.phase = 'round_result';
      this.broadcastState();
      this.renderOnlineGame();
  },

  nextRoundOnline() {
      if (this.state.currentRound >= this.state.maxRounds) {
          this.state.phase = 'results';
          this.broadcastState();
          this.renderResults();
      } else {
          this.state.currentRound++;
          this.startNewOnlineRound();
      }
  },

  /* ================= RESULTS ================= */
  renderResults() {
    clearInterval(this.state.timerInterval);
    this.state.phase = 'results';
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
        
        ${this.state.mode === 'online' && Multiplayer.role === 'host' ? `
            <button class="btn-primary" onclick="Schuldspruch.startNewOnlineRound(); Schuldspruch.state.currentRound=1; Schuldspruch.state.scores={}; Schuldspruch.state.players.forEach(p=>Schuldspruch.state.scores[p.id]=0);">Nochmal spielen</button>
        ` : ''}
        ${this.state.mode === 'offline' ? `
            <button class="btn-primary" onclick="Schuldspruch.startOfflineGame()">Nochmal spielen</button>
        ` : ''}

        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px;" onclick="Schuldspruch.open()">Hauptmenü</button>
        ${this.state.mode === 'online' ? `<button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px;" onclick="Schuldspruch.returnToLobby()">Lobby</button>` : ''}
      </div>
    `;

    if (this.state.mode === 'online' && Multiplayer.role === 'host') {
        this.broadcastState();
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

  returnToLobby() {
    if (Multiplayer.role === 'host') {
      hostReturnToLobby();
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

