/**
 * ICH HAB NOCH NIE - Party Game Module
 * Modes: Classic (Round-based), Voting (Anonymous), Blitz (Speed)
 */

window.IchHabNochNie = {
  id: 'ichhabnochnie',
  name: 'Ich hab noch nie',
  emoji: '🤐',
  color: '#8e44ad',
  description: 'Das ultimative Enthüllungsspiel. Wer lügt, wer trinkt?',
  
  state: {
    mode: 'klassisch', // 'klassisch' | 'voting' | 'blitz'
    players: [],
    currentPlayerIndex: 0,
    activeCategories: ['harmlos', 'mittel', 'spicy'],
    deck: [],
    usedCards: [],
    currentCard: null,
    
    // Voting Mode
    votes: {}, // { playerId: true/false }
    votingOpen: false,
    voteTimer: 0,
    
    // Blitz Mode
    timeLeft: 60,
    cardCount: 0,
    drinkCounts: {}, // { playerName: count }
    
    phase: 'setup', // 'setup' | 'play' | 'reveal' | 'gameover'
    isOnline: false
  },

  categories: {
    harmlos: {
      name: 'Harmlos',
      emoji: '💚',
      cards: [
        "einen Film weinend beendet",
        "eine ganze Pizza alleine gegessen",
        "mich im Kino verlaufen",
        "beim Zähneputzen die Kleidung bekleckert",
        "so getan als würde ich telefonieren um jemanden zu meiden",
        "meinen eigenen Namen gegoogelt",
        "eine Spinne mit dem Staubsauger weggesaugt",
        "den falschen Mülleimer benutzt",
        "an meinem Finger geschnuppert nachdem ich was angefasst habe",
        "im Schlaf geredet",
        "beim Laufen gegen eine Glasscheibe gelaufen",
        "Süßigkeiten im Bett gegessen und Krümel überall gehabt",
        "beim Sport so getan als würde ich mich dehnen um Pause zu machen",
        "ein Lied mitgesungen obwohl ich den Text nicht kann"
      ]
    },
    mittel: {
      name: 'Mittel',
      emoji: '🟡',
      cards: [
        "jemanden auf einer Party geküsst",
        "betrunken eine Ex angeschrieben",
        "beim ersten Date die Rechnung nicht bezahlt",
        "so getan als wäre ich krank um nicht zur Arbeit zu müssen",
        "ein Geheimnis verraten das ich versprochen hatte zu bewahren",
        "aus Versehen eine Nachricht an die Person geschickt über die ich gelästert habe",
        "beim Vorbeigehen in ein Schaufenster geschaut um mein Spiegelbild zu checken",
        "so getan als würde ich jemanden nicht sehen um nicht hallo sagen zu müssen",
        "etwas geliehen und nie zurückgegeben",
        "im Restaurant nach dem Essen das Besteck eingesteckt",
        "eine Peinlichkeit auf Social Media gepostet und direkt wieder gelöscht",
        "meinem Partner/meiner Partnerin das Passwort verheimlicht"
      ]
    },
    spicy: {
      name: 'Spicy',
      emoji: '🔴',
      cards: [
        "eine Nacht mit jemandem verbracht den ich kaum kannte",
        "in der Öffentlichkeit erwischt worden",
        "jemanden geküsst der hier im Raum ist",
        "einen Dirty Talk per Nachricht an die falsche Person geschickt",
        "ohne Unterwäsche das Haus verlassen",
        "beim Sex an jemand anderen gedacht",
        "jemanden gedatet nur um dessen Ex eifersüchtig zu machen",
        "eine Dating-App benutzt während ich in einer Beziehung war",
        "nackt gebadet (außer in der Wanne)",
        "in einer Umkleidekabine Sex gehabt",
        "jemanden betrogen",
        "Sex im Auto gehabt"
      ]
    },
    extrem: {
      name: 'Extrem',
      emoji: '🤯',
      cards: [
        "etwas Illegales getan wofür ich verhaftet werden könnte",
        "einen Diebstahl begangen",
        "beim Fremdgehen erwischt worden",
        "eine Beziehung zerstört (bewusst)",
        "in eine fremde Wohnung eingebrochen",
        "Drogen auf einer Party verkauft",
        "eine Schlägerei angefangen",
        "Geld von Freunden geklaut",
        "jemanden erpresst",
        "beim Klauen in einem Supermarkt erwischt worden",
        "jemandem das Herz gebrochen und es nicht bereut",
        "mich an einem Ex-Partner gerächt",
        "gelogen um jemanden ins Gefängnis oder in große Schwierigkeiten zu bringen"
      ]
    },
    gruppe: {
      name: 'Gruppe',
      emoji: '🎯',
      cards: [
        "X's Ex gedatet",
        "im Urlaub dieser Gruppe etwas versteckt",
        "jemanden aus dieser Gruppe heimlich gestalkt",
        "über jemanden aus dieser Gruppe schlecht geredet",
        "jemanden aus dieser Gruppe auf 'Stumm' geschaltet",
        "gelogen um nicht zu einem Treffen dieser Gruppe kommen zu müssen",
        "jemandem aus dieser Gruppe Geld geliehen und es nie zurückerwartet",
        "ein Geheimnis über jemanden hier im Raum erfahren, das ich nicht wissen sollte"
      ]
    }
  },

  open() {
    this.state.phase = 'setup';
    this.state.players = (window.Multiplayer && Multiplayer.players && Multiplayer.players.map(p => p.name)) || ['Spieler 1', 'Spieler 2'];
    this.state.isOnline = !!(window.Multiplayer && (Multiplayer.role || SharedRoom.isActive));
    
    if (!this.state.isOnline) {
      Router.go('setup');
      document.getElementById('setup-title').textContent = this.name;
      document.getElementById('setup-content').innerHTML = `
        <div class="card">
          <div class="card-label">Wähle deinen Modus</div>
          <button class="btn-primary" style="margin-bottom:15px; background:var(--green); color:#000;" onclick="window.IchHabNochNie.setupOffline()">
            📱 Offline (Ein Gerät teilen)
          </button>
          <button class="btn-primary" onclick="UnifiedLobby.open(window.IchHabNochNie)">
            🌐 Online (Eigener Raum)
          </button>
        </div>
      `;
    } else {
      Router.go('setup');
      this.renderSetup();
    }
  },

  setupOffline() {
    this.state.isOnline = false;
    this.state.mode = 'klassisch';
    this.renderSetup();
  },

  renderSetup() {
    const s = this.state;
    const isHost = !s.isOnline || (Multiplayer.role === 'host');
    const updateCmd = isHost ? `window.IchHabNochNie.syncSetup()` : ``;

    let html = `
      <div class="setup-container">
        <h1 style="color:var(--primary); font-family:'Abril Fatface', cursive; font-size:clamp(1.8rem, 8vw, 2.8rem); text-align:center; margin-bottom:10px;">Ich hab noch nie...</h1>
        <p style="text-align:center; color:var(--text-muted); margin-bottom:30px;">Konfiguriere deine Wahrheitssitzung</p>

        <!-- Pakete -->
        <div class="card" style="margin-bottom:20px;">
          <div class="card-label">Fragen-Pakete</div>
          <div class="packages-grid" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));">
            ${Object.entries(this.categories).map(([key, cat]) => `
              <div class="pkg-card ${s.activeCategories.includes(key) ? 'active' : ''}" onclick="window.IchHabNochNie.toggleCategory('${key}'); ${updateCmd}">
                <div class="pkg-emoji">${cat.emoji}</div>
                <div class="pkg-name">${cat.name}</div>
                <div class="pkg-count">${cat.cards.length} Karten</div>
                <div class="pkg-check">✓</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Spieler (offline) -->
        ${!s.isOnline ? `
          <div class="card" style="margin-bottom:20px;">
            <div class="card-label">Spieler</div>
            <div id="ihn-players-list">
              ${s.players.map((p, i) => `
                <div class="player-row" style="display:flex; gap:10px; margin-bottom:8px;">
                  <input type="text" class="player-input" value="${p}" onchange="window.IchHabNochNie.state.players[${i}]=this.value" style="flex:1;">
                  ${s.players.length > 2 ? `<button class="btn-icon" onclick="window.IchHabNochNie.state.players.splice(${i},1); window.IchHabNochNie.renderSetup()">✕</button>` : ''}
                </div>
              `).join('')}
            </div>
            <button class="btn-primary btn-outline" style="width:auto; font-size:0.8rem; margin-top:10px;" onclick="window.IchHabNochNie.state.players.push('Spieler '+(window.IchHabNochNie.state.players.length+1)); window.IchHabNochNie.renderSetup()">+ Spieler</button>
          </div>
        ` : ''}

        ${isHost ? `<button class="btn-primary" onclick="window.IchHabNochNie.startGame()">Spiel starten 🚀</button>` : `<p style="text-align:center; color:var(--text-muted);">Warte auf den Host...</p>`}
      </div>
    `;
    document.getElementById('setup-content').innerHTML = html;
  },

  toggleCategory(key) {
    const idx = this.state.activeCategories.indexOf(key);
    if (idx > -1) {
      if (this.state.activeCategories.length > 1) this.state.activeCategories.splice(idx, 1);
    } else {
      this.state.activeCategories.push(key);
    }
    this.renderSetup();
  },

  startGame() {
    const s = this.state;
    s.phase = 'play';
    s.currentPlayerIndex = 0;
    s.usedCards = [];
    s.drinkCounts = {};
    s.players.forEach(p => {
      const pName = p.name || p;
      s.drinkCounts[pName] = 0;
    });
    
    // Create deck
    s.deck = [];
    s.activeCategories.forEach(key => {
      s.deck = s.deck.concat(this.categories[key].cards);
    });
    this.shuffle(s.deck);
    
    Router.go('play');
    this.nextCard();
  },

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  },

  nextCard() {
    const s = this.state;
    if (s.deck.length === 0) {
      this.endGame();
      return;
    }
    
    s.currentCard = s.deck.pop();
    s.usedCards.push(s.currentCard);
    s.votes = {};
    s.votingOpen = true;
    s.phase = 'play';
    
    if (s.mode === 'klassisch') {
      s.currentPlayerIndex = (s.currentPlayerIndex + 1) % s.players.length;
    } else if (s.mode === 'blitz' && s.phase === 'play') {
      if (s.timeLeft === 60) this.startBlitzTimer();
    }
    
    this.renderCurrentScreen();
    if (s.isOnline && Multiplayer.role === 'host') this.syncGame();
  },

  renderCurrentScreen() {
    const s = this.state;
    const playContent = document.getElementById('play-content');
    if (!playContent) return;
    
    document.getElementById('play-game-name').textContent = "Ich hab noch nie...";

    if (s.mode === 'voting') {
      this.renderVoting();
    } else if (s.mode === 'blitz') {
      this.renderBlitz();
    } else {
      this.renderKlassisch();
    }
  },

  renderKlassisch() {
    const s = this.state;
    const reader = s.players[s.currentPlayerIndex]?.name || s.players[s.currentPlayerIndex];
    const isMeHost = (Multiplayer.role === 'host');

    let html = `
      <div style="text-align:center; padding:20px;">
        <div style="font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; color:var(--primary); font-weight:700; margin-bottom:5px;">An der Reihe</div>
        <div style="font-family:'Abril Fatface', cursive; font-size:2rem; margin-bottom:40px;">${reader}</div>

        <div class="card" style="min-height:200px; display:flex; flex-direction:column; justify-content:center; padding:40px 20px; background:white; position:relative; overflow:hidden; animation: pop 0.4s both;">
          <div style="position:absolute; top:10px; left:10px; font-size:clamp(3rem, 15vw, 4rem); opacity:0.1; font-family:'Abril Fatface';">"</div>
          <div style="font-size:1.4rem; color:var(--text-muted); margin-bottom:10px;">Ich hab noch nie...</div>
          <div style="font-size:1.8rem; font-weight:bold; color:#2c3e50; line-height:1.2;">${s.currentCard}</div>
        </div>

        <div style="margin-top:40px;">
           <div style="display:flex; gap:10px; justify-content:center;">
             ${(!s.isOnline || isMeHost) ? `<button class="btn-primary" onclick="window.IchHabNochNie.nextCard()">Nächste Karte</button>` : `<p style="color:var(--primary); font-weight:bold;">Warte auf den Host...</p>`}
             ${isMeHost ? `<button class="btn-primary" style="background:var(--surface2); color:var(--text); width:auto;" onclick="hostReturnToLobby()">Lobby</button>` : ''}
           </div>
        </div>
      </div>
    `;
    document.getElementById('play-content').innerHTML = html;
  },

  renderVoting() {
    const s = this.state;
    const myId = Multiplayer.myId || 'host-1';
    const hasVoted = s.votes[myId] !== undefined;

    let html = `
      <div style="text-align:center; padding:20px;">
        <div class="card" style="min-height:160px; display:flex; flex-direction:column; justify-content:center; padding:30px 20px; background:white; margin-bottom:30px; animation: pop 0.4s both;">
          <div style="font-size:1.2rem; color:var(--text-muted); margin-bottom:10px;">Ich hab noch nie...</div>
          <div style="font-size:1.6rem; font-weight:bold;">${s.currentCard}</div>
        </div>

        ${s.phase !== 'reveal' ? `
           <div style="display:grid; grid-template-columns:1fr; gap:15px;">
              <button class="btn-primary" onclick="window.IchHabNochNie.sendVote(true)" ${hasVoted ? 'disabled' : ''}>✅ Hab ich gemacht</button>
              <button class="btn-primary btn-outline" onclick="window.IchHabNochNie.sendVote(false)" ${hasVoted ? 'disabled' : ''}>❌ Nie gemacht</button>
           </div>
           <p style="margin-top:20px; color:var(--text-muted);">${Object.keys(s.votes).length} / ${s.players.length} Stimmen</p>
        ` : `
           <div id="ihn-results" style="animation: fadeIn 0.5s both;">
              ${this.calcResultsHTML()}
              <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
                ${(!s.isOnline || Multiplayer.role === 'host') ? `<button class="btn-primary" onclick="window.IchHabNochNie.nextCard()">Weiter</button>` : ''}
                ${Multiplayer.role === 'host' ? `<button class="btn-primary" style="background:var(--surface2); color:var(--text); width:auto;" onclick="hostReturnToLobby()">Lobby</button>` : ''}
              </div>
           </div>
        `}
      </div>
    `;
    document.getElementById('play-content').innerHTML = html;
    
    if (Object.keys(s.votes).length >= s.players.length && s.phase !== 'reveal' && s.players.length > 0) {
       this.revealVotes();
    }
  },

  sendVote(val) {
    const s = this.state;
    const myId = Multiplayer.myId || 'host-1';
    s.votes[myId] = val;
    this.renderCurrentScreen();
    if (s.isOnline) {
      if (Multiplayer.role === 'host') this.syncGame();
      else Multiplayer.sendToHost({ type: 'ihn_vote', val: val });
    }
  },

  revealVotes() {
    this.state.phase = 'reveal';
    this.renderCurrentScreen();
    if (this.state.isOnline && Multiplayer.role === 'host') this.syncGame();
  },

  calcResultsHTML() {
    const s = this.state;
    const total = Object.keys(s.votes).length || 1;
    const yesCount = Object.values(s.votes).filter(v => v === true).length;
    const yesPct = Math.round((yesCount / total) * 100);

    return `
      <div style="margin-top:20px;">
        <h3 style="margin-bottom:20px;">Ergebnis Anonym</h3>
        <div style="height:30px; background:rgba(0,0,0,0.1); border-radius:15px; overflow:hidden; display:flex;">
          <div style="width:${yesPct}%; background:var(--green); height:100%; transition: width 1s;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:10px; font-weight:bold;">
          <span style="color:var(--green);">${yesPct}% Habens getan</span>
          <span>${100-yesPct}% Noch nie</span>
        </div>
        <p style="margin-top:20px; font-size:1.1rem; font-weight:bold; color:var(--primary);">Alle die mit "Ja" gestimmt haben: TRINKEN! 🍺</p>
      </div>
    `;
  },

  renderBlitz() {
    const s = this.state;
    let html = `
      <div style="text-align:center; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
            <div style="font-size:1.5rem; font-weight:bold; color:${s.timeLeft < 10 ? 'var(--primary)' : 'inherit'}">⏱️ ${s.timeLeft}s</div>
            <div style="font-weight:bold;">Karten: ${s.usedCards.length}</div>
        </div>

        <div class="card" style="min-height:200px; display:flex; flex-direction:column; justify-content:center; padding:40px 20px; background:white; animation: pop 0.2s both;">
          <div style="font-size:1.3rem; color:var(--text-muted); margin-bottom:10px;">Ich hab noch nie...</div>
          <div style="font-size:1.6rem; font-weight:bold; line-height:1.2;">${s.currentCard}</div>
        </div>

        <div style="margin-top:40px; display:grid; grid-template-columns:1fr; gap:15px;">
           <button class="btn-primary" onclick="window.IchHabNochNie.blitzYes()">🍺 GETAN! (+1 Punkt)</button>
           <button class="btn-primary btn-outline" onclick="window.IchHabNochNie.nextCard()">Skip / Nie gemacht</button>
           ${Multiplayer.role === 'host' ? `<button class="btn-primary" style="background:var(--surface2); color:var(--text);" onclick="hostReturnToLobby()">🏁 Spiel abbrechen & Lobby</button>` : ''}
        </div>
      </div>
    `;
    document.getElementById('play-content').innerHTML = html;
  },

  blitzYes() {
    const s = this.state;
    let name = 'Unbekannt';
    if (s.isOnline) {
      name = Multiplayer.players.find(p => p.id === (Multiplayer.myId || 'host-1'))?.name || 'Unbekannt';
    } else {
      // In offline Blitz, we assume the person holding the device is the 'active' one 
      // or we just track it as a general 'Trinker' count if no specific player is selected
      name = s.players[0]?.name || s.players[0] || 'Spieler 1';
    }
    if (name) s.drinkCounts[name] = (s.drinkCounts[name] || 0) + 1;
    this.nextCard();
  },

  startBlitzTimer() {
    const s = this.state;
    if (this.blitzInterval) clearInterval(this.blitzInterval);
    this.blitzInterval = setInterval(() => {
      s.timeLeft--;
      if (s.timeLeft <= 0) {
        clearInterval(this.blitzInterval);
        this.endGame();
      }
      this.renderCurrentScreen();
    }, 1000);
  },

  endGame() {
    this.state.phase = 'gameover';
    Router.go('play');
    this.renderGameOver();
  },

  renderGameOver() {
    const s = this.state;
    let rankHTML = '';
    if (s.mode === 'blitz') {
      const sorted = Object.entries(s.drinkCounts).sort((a,b) => b[1] - a[1]);
      rankHTML = `
        <h3 style="margin-bottom:20px;">Trink-Ranking</h3>
        <div style="text-align:left; max-width:300px; margin:0 auto;">
          ${sorted.map(([name, count], i) => `
            <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
              <span>${i+1}. ${name}</span>
              <span style="font-weight:bold;">${count} Schlucke</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    document.getElementById('play-content').innerHTML = `
      <div style="text-align:center; padding:40px 20px;">
        <h1 style="font-family:'Abril Fatface', cursive; font-size:clamp(2rem, 8vw, 3rem); color:var(--primary); margin-bottom:20px;">Ende!</h1>
        <div style="font-size:clamp(3.5rem, 20vw, 5rem); margin-bottom:30px;">🏁</div>
        <p style="font-size:1.2rem; margin-bottom:40px;">Die Wahrheit ist raus... oder?</p>
        
        ${rankHTML}

        <div style="margin-top:40px; display:flex; flex-direction:column; gap:10px;">
          <button class="btn-primary" onclick="window.IchHabNochNie.open()">Nochmal spielen</button>
          <button class="btn-primary btn-outline" onclick="location.reload()">Hauptmenü</button>
        </div>
      </div>
    `;
  },

  /* ONLINE HOOKS */
  renderHostSetup() { return this.renderSetup(); },
  
  collectOnlineSettings() {
    return {
      mode: this.state.mode,
      activeCategories: this.state.activeCategories
    };
  },

  onOnlineGameStart(settings) {
    this.state.isOnline = true;
    this.state.players = settings.players || [];
    Object.assign(this.state, settings);
    this.startGame();
  },

  returnToLobby() {
    if (Multiplayer.role === 'host') {
      hostReturnToLobby();
    }
  },

  syncSetup() {
    Multiplayer.sendGameState({ type: 'setup_sync', settings: this.collectOnlineSettings() });
  },

  syncGame() {
    const s = this.state;
    Multiplayer.sendGameState({ type: 'sync', state: s });
  },

  handleOnlineData(data) {
    const s = this.state;
    if (data.type === 'setup_sync') {
      Object.assign(s, data.settings);
      this.renderSetup();
    } else if (data.type === 'sync') {
      Object.assign(s, data.state);
      this.renderCurrentScreen();
    } else if (data.type === 'ihn_vote' && Multiplayer.role === 'host') {
      s.votes[data.senderId] = data.val;
      this.syncGame();
      this.renderCurrentScreen();
    }
  }
};
