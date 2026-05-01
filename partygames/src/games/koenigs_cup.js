const KoenigsCup = {
  name: "Königs-Cup",
  tagline: "Klassisches Kartenspiel mit Trinkregeln.",
  color: "#f59e0b",
  shadow: "rgba(245, 158, 11, 0.4)",
  glow: "rgba(245, 158, 11, 0.2)",
  emoji: "👑",

  state: {
    mode: 'offline',
    players: [],
    deck: [],
    drawnCards: [],
    currentCard: null,
    currentPlayerIndex: 0,
    kingsDrawn: 0,
    activeRules: [],
    daumenmaster: null,
    mates: {}, // { spielerIndex: [partnerIndices] }
    phase: 'setup',
    ruleAddedForThisCard: false,
    mateAddedForThisCard: false,
    enabledRanks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
    bonusCardCounts: {}, // { 'B1': 1, 'B2': 0 }
    customCards: [], // [{ name, desc, emoji, count: 1 }]
    myName: ''
  },

  rules: {
    'A': { name: 'Wasserfall', desc: 'Alle trinken gleichzeitig – niemand darf aufhören, bevor die Person links aufhört.', emoji: '🌊' },
    '2': { name: 'Du', desc: 'Du darfst jemanden bestimmen, der trinken muss.', emoji: '👉' },
    '3': { name: 'Ich', desc: 'Du musst selbst trinken.', emoji: '🍺' },
    '4': { name: 'Frauen', desc: 'Alle Frauen in der Runde trinken.', emoji: '♀️' },
    '5': { name: 'Daumenmeister', desc: 'Du bist jetzt Daumenmeister. Legst du deinen Daumen auf den Tisch, müssen alle folgen. Der Letzte trinkt.', emoji: '👍' },
    '6': { name: 'Männer', desc: 'Alle Männer in der Runde trinken.', emoji: '♂️' },
    '7': { name: 'Himmel', desc: 'Alle müssen die Hand heben. Der Letzte trinkt.', emoji: '☁️' },
    '8': { name: 'Mate', desc: 'Wähle einen Trinkkumpan. Immer wenn einer trinkt, trinkt der andere mit.', emoji: '🔗' },
    '9': { name: 'Reim', desc: 'Nenne ein Wort. Reihum muss gereimt werden. Wer stockt, trinkt.', emoji: '🎤' },
    '10': { name: 'Kategorien', desc: 'Nenne eine Kategorie (z.B. Automarken). Reihum Begriffe nennen – wer stockt, trinkt.', emoji: '📊' },
    'J': { name: 'Regel', desc: 'Erfinde eine neue Regel, die bis zum nächsten Buben gilt.', emoji: '📜' },
    'Q': { name: 'Fragen', desc: 'Stelle eine Frage. Man darf nur mit einer Gegenfrage antworten. Wer normal antwortet, trinkt.', emoji: '❓' },
    'K': { name: 'Königs-Cup', desc: 'Gieße etwas in den Cup. Wer den 4. König zieht, muss ihn leeren!', emoji: '👑' }
  },

  bonusRules: {
    'B1': { name: 'T-Rex', desc: 'Deine Oberarme müssen an deinem Körper festkleben. Du darfst nur mit den Unterarmen agieren. Verstoß = Trinken!', emoji: '🦖' },
    'B2': { name: 'DJ', desc: 'Du darfst das nächste Lied wählen. Wenn es jemand kritisiert, muss die Person trinken.', emoji: '🎧' },
    'B3': { name: 'Mimik-Master', desc: 'Du darfst nicht mehr lächeln. Wer dich zum Lachen bringt, darf 2 verteilen. Lachst du, trinkst du 3.', emoji: '🤡' },
    'B4': { name: 'Zeitmaschine', desc: 'Die Zeit steht still. Niemand darf sich bewegen, bis du "Go" sagst. Wer zuckt, trinkt.', emoji: '⏳' },
    'B5': { name: 'Draufgänger', desc: 'Mache einen Handstand oder Purzelbaum – oder trinke 5 Schlucke zur Strafe.', emoji: '🦁' },
    'B6': { name: 'Medusa', desc: 'Wenn du jemanden starr anblickst, muss dieser erstarren. Wer sich zuerst bewegt, trinkt.', emoji: '🐍' },
    'B7': { name: 'Stummer Diener', desc: 'Du darfst bis zur nächsten Karte nicht mehr sprechen. Jedes Wort kostet einen Schluck.', emoji: '😶' },
    'B8': { name: 'Flüsterpost', desc: 'Ab jetzt darf nur noch geflüstert werden. Wer laut spricht oder lacht, trinkt einen Strafschluck.', emoji: '🤫' },
    'B9': { name: 'Linkshänder', desc: 'Alle müssen mit ihrer schwächeren Hand trinken. Bei Benutzung der starken Hand: Trinken!', emoji: '✍️' },
    'B10': { name: 'Wikinger', desc: 'Setzt du dir die "Hörner" auf, müssen alle rudern. Der letzte Ruderer muss trinken.', emoji: '🛶' },
    'B11': { name: 'Blaublütig', desc: 'Du bist adelig. Man darf dich nur mit "Eure Majestät" ansprechen. Wer es vergisst, trinkt.', emoji: '💎' }
  },

  open() {
    this.state.players = this.state.players.map(p => typeof p === 'object' ? (p.name || p.id || 'Spieler') : p);
    this.state.isOnline = !!(window.Multiplayer && (Multiplayer.role || SharedRoom.isActive));
    Router.go('setup');
    document.getElementById('setup-title').textContent = this.name;
    this.renderSetup();
  },

  renderSetup() {
    if (this.state.players.length === 0) {
      this.state.players = ['Spieler 1', 'Spieler 2'];
    }

    document.getElementById('setup-content').innerHTML = `
      <div class="card">
        <div class="card-label">Modus wählen</div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
           <button class="btn-primary" style="margin:0; background:${this.state.mode === 'offline' ? 'var(--primary)' : 'var(--surface2)'};" onclick="KoenigsCup.state.mode='offline'; KoenigsCup.renderSetup();">Offline</button>
           <button class="btn-primary" style="margin:0; background:${this.state.mode === 'online' ? 'var(--primary)' : 'var(--surface2)'};" onclick="UnifiedLobby.open(KoenigsCup)">Online</button>
        </div>
      </div>

      <div class="card">
        <div class="card-label">👥 Spieler (2-10)</div>
        <div class="players-list" id="kc-players-list"></div>
        <button class="btn-add" onclick="KoenigsCup.addPlayer()">＋ Spieler hinzufügen</button>
      </div>

      <!-- Settings Toggle -->
      <div class="card" id="kc-settings-card">
        <div class="card-label">⚙️ Karten & Regeln</div>
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin:0;" onclick="KoenigsCup.toggleSettingsUI()">Einstellungen bearbeiten ⚒️</button>
      </div>

      <button class="btn-primary" onclick="KoenigsCup.startGame()">Spiel starten 🚀</button>
    `;
    this.renderPlayersList();
  },

  toggleSettingsUI() {
    const s = this.state;
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const div = document.createElement('div');
    div.className = 'overlay-selection';
    div.id = 'kc-settings-overlay';
    div.style = 'position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:110; display:flex; align-items:center; justify-content:center; padding:20px; color:#fff; overflow-y:auto;';
    
    let rankTogglesHTML = ranks.map(r => {
      const isEnabled = s.enabledRanks.includes(r);
      const rule = this.rules[r];
      return `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border: 1px solid ${isEnabled ? 'var(--primary)' : 'var(--border)'}; opacity: ${isEnabled ? 1 : 0.5}; margin-bottom:5px;">
           <div style="display:flex; align-items:center; gap:10px;">
             <span style="font-size:1.4rem; flex-shrink:0;">${rule.emoji}</span>
             <div style="text-align:left; padding-right:10px;">
               <div style="font-weight:bold; font-size:1rem; color:var(--primary);">${r}: ${rule.name}</div>
               <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.3;">${rule.desc}</div>
             </div>
           </div>
           <button class="btn-icon" style="flex-shrink:0;" onclick="KoenigsCup.toggleRank('${r}')">${isEnabled ? '✅' : '❌'}</button>
        </div>
      `;
    }).join('');

    let bonusTogglesHTML = Object.entries(this.bonusRules).map(([r, rule]) => {
      const count = s.bonusCardCounts[r] || 0;
      return `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border: 1px solid ${count > 0 ? 'var(--secondary)' : 'var(--border)'}; opacity: ${count > 0 ? 1 : 0.6}; margin-bottom:5px; background: ${count > 0 ? 'var(--sec-dim)' : 'transparent'}">
           <div style="display:flex; align-items:center; gap:10px; flex:1;">
             <span style="font-size:1.4rem; flex-shrink:0;">${rule.emoji}</span>
             <div style="text-align:left; padding-right:10px;">
               <div style="font-weight:bold; font-size:1rem; color:var(--secondary);">${rule.name}</div>
               <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.3;">${rule.desc}</div>
             </div>
           </div>
           <div style="display:flex; align-items:center; gap:10px; background:rgba(0,0,0,0.3); padding:5px 10px; border-radius:30px;">
              <button class="btn-icon" style="font-size:1rem; padding:0; width:25px; height:25px;" onclick="KoenigsCup.updateBonusCount('${r}', -1)">-</button>
              <span style="font-weight:bold; min-width:15px; text-align:center;">${count}</span>
              <button class="btn-icon" style="font-size:1rem; padding:0; width:25px; height:25px;" onclick="KoenigsCup.updateBonusCount('${r}', 1)">+</button>
           </div>
        </div>
      `;
    }).join('');

    let customCardsHTML = s.customCards.map((c, i) => `
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:5px; background:var(--primary-dim); border:1px solid ${c.count > 0 ? 'var(--primary)' : 'var(--border)'}; opacity:${c.count > 0 ? 1 : 0.6}">
         <div style="display:flex; align-items:center; gap:10px; flex:1;">
            <span style="font-size:1.4rem;">${c.emoji}</span>
            <div style="text-align:left;">
              <div style="font-weight:bold; font-size:0.9rem;">${c.name}</div>
              <div style="font-size:0.75rem;">${c.desc.substring(0,40)}...</div>
            </div>
         </div>
         <div style="display:flex; align-items:center; gap:8px;">
            <div style="display:flex; align-items:center; gap:5px; background:rgba(0,0,0,0.3); padding:3px 8px; border-radius:20px;">
               <button class="btn-icon" style="font-size:0.8rem; width:20px; height:20px;" onclick="KoenigsCup.updateCustomCount(${i}, -1)">-</button>
               <span style="font-size:0.9rem; font-weight:bold;">${c.count}</span>
               <button class="btn-icon" style="font-size:0.8rem; width:20px; height:20px;" onclick="KoenigsCup.updateCustomCount(${i}, 1)">+</button>
            </div>
            <button class="btn-icon" style="color:var(--primary);" onclick="KoenigsCup.removeCustomCard(${i})">✕</button>
         </div>
      </div>
    `).join('');

    div.innerHTML = `
      <div class="card" style="width:100%; max-width:500px; max-height:90vh; overflow-y:auto; position:relative;">
        <h2 style="margin-bottom:20px;">⚙️ Karten-Einstellungen</h2>
        
        <div class="card-label">Standard-Karten</div>
        <div style="display:grid; grid-template-columns: 1fr; max-height:350px; overflow-y:auto; margin-bottom:20px; padding-right:5px; background:rgba(0,0,0,0.2); border-radius:10px; padding:10px;">
          ${rankTogglesHTML}
        </div>

        <div class="card-label" style="color:var(--secondary);">✨ Bonus-Karten (Ganz am Ende ins Deck gemischt)</div>
        <div style="display:grid; grid-template-columns: 1fr; max-height:280px; overflow-y:auto; margin-bottom:20px; padding-right:5px; background:rgba(0,0,0,0.2); border-radius:10px; padding:10px;">
          ${bonusTogglesHTML}
        </div>

        <div class="card-label">Eigene Karte hinzufügen</div>
        <div class="card" style="background:var(--surface2); padding:15px; margin-bottom:20px; border:1px solid var(--border);">
           <div style="display:grid; grid-template-columns: 80px 1fr; gap:10px; margin-bottom:10px;">
             <input type="text" id="cc-emoji" class="player-input" placeholder="🎨" style="margin:0; text-align:center;">
             <input type="text" id="cc-name" class="player-input" placeholder="Karten-Name" style="margin:0; width:100%; box-sizing:border-box;">
           </div>
           <textarea id="cc-desc" class="player-input" placeholder="Was passiert bei dieser Karte?" style="margin-bottom:12px; width:100%; box-sizing:border-box; min-height:60px;"></textarea>
           <button class="btn-primary" style="margin:0; width:100%;" onclick="KoenigsCup.addCustomCard()">+ Hinzufügen</button>
        </div>

        ${s.customCards.length > 0 ? `
          <div class="card-label">Deine Extra-Karten</div>
          <div style="max-height:200px; overflow-y:auto; margin-bottom:20px;">
            ${customCardsHTML}
          </div>
        ` : ''}

        <button class="btn-primary" onclick="document.getElementById('kc-settings-overlay').remove()">Fertig ✅</button>
      </div>
    `;
    document.body.appendChild(div);
  },

  toggleRank(r) {
    const s = this.state;
    if (s.enabledRanks.includes(r)) {
      if (s.enabledRanks.length + s.customCards.filter(c => c.count > 0).length > 2) {
        s.enabledRanks = s.enabledRanks.filter(rank => rank !== r);
      } else {
        alert("Du brauchst mindestens 2 verschiedene Karten-Typen!");
      }
    } else {
      s.enabledRanks.push(r);
    }
    this.refreshSettingsUI();
  },

  updateBonusCount(r, delta) {
    const s = this.state;
    if (!s.bonusCardCounts[r]) s.bonusCardCounts[r] = 0;
    s.bonusCardCounts[r] = Math.max(0, Math.min(99, s.bonusCardCounts[r] + delta));
    this.refreshSettingsUI();
  },

  updateCustomCount(idx, delta) {
    const s = this.state;
    if (s.customCards[idx]) {
      s.customCards[idx].count = Math.max(0, Math.min(99, (s.customCards[idx].count || 0) + delta));
      this.refreshSettingsUI();
    }
  },

  addCustomCard() {
    const emoji = document.getElementById('cc-emoji').value.trim() || '🃏';
    const name = document.getElementById('cc-name').value.trim();
    const desc = document.getElementById('cc-desc').value.trim();

    if (name && desc) {
      this.state.customCards.push({ emoji, name, desc, count: 1 });
      this.refreshSettingsUI();
    } else {
      alert("Bitte Name und Beschreibung eingeben!");
    }
  },

  removeCustomCard(idx) {
    this.state.customCards.splice(idx, 1);
    this.refreshSettingsUI();
  },

  refreshSettingsUI() {
    const overlay = document.getElementById('kc-settings-overlay');
    if (overlay) overlay.remove();
    this.toggleSettingsUI();
  },

  renderPlayersList() {
    const list = document.getElementById('kc-players-list');
    if (!list) return;
    list.innerHTML = this.state.players.map((p, i) => {
      const pName = typeof p === 'object' ? (p.name || p.id || 'Spieler') : p;
      return `
        <div class="player-row">
          <div class="player-avatar" style="background:var(--primary);">${i + 1}</div>
          <input type="text" class="player-input" value="${pName}" onchange="KoenigsCup.updatePlayer(${i}, this.value)">
          ${this.state.players.length > 2 ? `<button class="btn-icon" onclick="KoenigsCup.removePlayer(${i})">✕</button>` : ''}
        </div>
      `;
    }).join('');
  },

  addPlayer() {
    if (this.state.players.length < 10) {
      this.state.players.push(`Spieler ${this.state.players.length + 1}`);
      this.renderPlayersList();
    }
  },

  removePlayer(idx) {
    if (this.state.players.length > 2) {
      this.state.players.splice(idx, 1);
      this.renderPlayersList();
    }
  },

  updatePlayer(idx, val) {
    if (val.trim()) this.state.players[idx] = val.trim();
  },

  startGame() {
    this.state.phase = 'game';
    this.state.currentPlayerIndex = 0;
    this.state.kingsDrawn = 0;
    this.state.activeRules = [];
    this.state.daumenmaster = null;
    this.state.mates = {};
    this.state.drawnCards = [];
    this.state.ruleAddedForThisCard = false;
    this.state.mateAddedForThisCard = false;
    this.state.bonusCardCounts = this.state.bonusCardCounts || {};
    this.initDeck();
    
    Router.go('play');
    document.getElementById('play-game-name').textContent = this.name;
    this.renderGame();
    
    if (this.state.mode === 'online') {
       this.syncState();
    }
  },

  initDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    if (!this.state.enabledRanks || this.state.enabledRanks.length === 0) {
      this.state.enabledRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    }
    const ranks = this.state.enabledRanks;
    this.state.deck = [];
    
    // Add standard cards
    for (const s of suits) {
      for (const r of ranks) {
        this.state.deck.push({ 
          suit: s, 
          rank: r, 
          color: (s === '♥' || s === '♦') ? '#ff3366' : '#2d3436' 
        });
      }
    }

    // Add bonus cards based on count
    Object.entries(this.state.bonusCardCounts || {}).forEach(([rank, count]) => {
       if (count <= 0) return;
       const rule = this.bonusRules[rank];
       for (let i = 0; i < count; i++) {
         this.state.deck.push({
            suit: '✨',
            rank: 'B',
            name: rule.name,
            desc: rule.desc,
            emoji: rule.emoji,
            color: 'var(--secondary)'
         });
       }
    });

    // Add custom cards based on count
    this.state.customCards.forEach(c => {
       const loopCount = c.count || 0;
       if (loopCount <= 0) return;
       for (let i = 0; i < loopCount; i++) {
         this.state.deck.push({
           suit: '⭐',
           rank: 'C',
           name: c.name,
           desc: c.desc,
           emoji: c.emoji,
           color: 'var(--primary)'
         });
       }
    });
    this.shuffleDeck();
  },

  shuffleDeck() {
    for (let i = this.state.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.deck[i], this.state.deck[j]] = [this.state.deck[j], this.state.deck[i]];
    }
  },

  drawCard() {
    if (this.state.phase === 'gameover' || this.state.deck.length === 0) return;
    
    const card = this.state.deck.pop();
    this.state.currentCard = card;
    this.state.drawnCards.push(card);

    if (card.rank === 'K') {
      this.state.kingsDrawn++;
      if (this.state.kingsDrawn === 4) {
        this.state.phase = 'gameover';
      }
    }

    if (card.rank === '5') {
       this.state.daumenmaster = this.state.players[this.state.currentPlayerIndex];
    }
    
    // Rule updates
    if (card.rank === 'J') {
       this.state.activeRules = []; 
    }

    this.renderGame();

    // Trigger overlays ONLY once when card is drawn
    if (card.rank === 'J') {
       this.renderRuleInput();
    }
    if (card.rank === '8') {
       this.renderMateSelection();
    }

    if (this.state.mode === 'online') this.syncState();
  },

  nextPlayer() {
    this.state.currentCard = null;
    this.state.ruleAddedForThisCard = false;
    this.state.mateAddedForThisCard = false;
    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
    this.renderGame();
    if (this.state.mode === 'online') this.syncState();
  },

  renderGame() {
    const s = this.state;
    let content = '';

    if (s.phase === 'gameover') {
      return this.renderGameOver();
    }

    const currentPlayer = s.players[s.currentPlayerIndex];
    let currentPlayerName = 'Unbekannt';
    if (currentPlayer) {
      if (typeof currentPlayer === 'string') currentPlayerName = currentPlayer;
      else if (currentPlayer.name) currentPlayerName = currentPlayer.name;
      else if (currentPlayer.id) currentPlayerName = currentPlayer.id;
    }
    
    let rule = null;
    if (s.currentCard) {
      if (s.currentCard.rank === 'C') {
        rule = { name: s.currentCard.name, desc: s.currentCard.desc, emoji: s.currentCard.emoji };
      } else if (s.currentCard.rank === 'B') {
        // Find bonus rule by name (simpler than storing rank index)
        rule = Object.values(this.bonusRules).find(br => br.name === s.currentCard.name);
      } else {
        rule = this.rules[s.currentCard.rank];
      }
    }

    // Online indicators
    const isOffline = s.mode === 'offline';
    const isHost = (typeof Multiplayer !== 'undefined' && Multiplayer.role === 'host') || SharedRoom.isActive;
    const myId = isHost ? 'host-1' : (typeof Multiplayer !== 'undefined' ? Multiplayer.myId : null);
    const isMyTurn = isOffline || (s.players[s.currentPlayerIndex] && s.players[s.currentPlayerIndex].id === myId);

    content = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <div class="card-label" style="margin:0;">🎴 Stapel: ${s.deck.length}</div>
        <div style="display:flex; gap:5px;">
           ${Array(4).fill(0).map((_, i) => `
             <span style="font-size:1.4rem; filter: ${i < s.kingsDrawn ? 'none' : 'grayscale(1) opacity(0.3)'}; transition:all 0.3s;">❤️</span>
           `).join('')}
        </div>
      </div>

      <div style="text-align:center; min-height: 380px; display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative;">
        
        ${!s.currentCard ? `
          <div class="card-back" onclick="${isMyTurn ? 'KoenigsCup.drawCard()' : ''}" style="width:220px; height:310px; background:linear-gradient(135deg, ${isMyTurn ? '#1e293b, #0f172a' : '#475569, #1e293b'}); border-radius:15px; border:8px solid #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor:${isMyTurn ? 'pointer' : 'default'}; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; opacity:${isMyTurn?1:0.6};">
             <div style="position:absolute; inset:0; opacity:0.1; background-image: radial-gradient(#fff 2px, transparent 2px); background-size: 20px 20px;"></div>
             <span style="font-size:clamp(3.5rem, 20vw, 5rem); text-shadow: 0 0 20px rgba(245,158,11,0.5); z-index:1;">👑</span>
          </div>
          <div style="margin-top:20px; font-weight:900; font-size:1.5rem; color:var(--primary);">
            ${isMyTurn ? 'Du bist dran!' : currentPlayerName + ' ist dran!'}
          </div>
          ${isMyTurn ? `
            <button class="btn-primary" style="margin-top:15px; width:auto; padding: 10px 30px;" onclick="KoenigsCup.drawCard()">Karte ziehen 🎴</button>
          ` : `
            <p style="color:var(--text-muted); font-size:1.1rem; font-weight:bold;">Bitte warten...</p>
          `}
        ` : `
          <div style="margin-bottom:15px; font-weight:900; font-size:1.3rem; color:var(--primary);">
            Aktion für: ${isMyTurn ? 'Dich' : currentPlayerName}
          </div>
          <div class="card-front" style="width:220px; height:310px; background:#fff; color:#000; border-radius:15px; border:2px solid #e1e1e1; box-shadow: 0 15px 40px rgba(0,0,0,0.2); display:flex; flex-direction:column; justify-content:space-between; padding:15px; animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position:relative; overflow:hidden;">
             <!-- Detail corners -->
             <div style="display:flex; justify-content:space-between; font-size:1.8rem; font-weight:bold; color:${s.currentCard.color}">
               <div style="display:flex; flex-direction:column; align-items:center; line-height:1;">
                 <span>${s.currentCard.rank}</span>
                 <span style="font-size:1.2rem;">${s.currentCard.suit}</span>
               </div>
               <div style="display:flex; flex-direction:column; align-items:center; line-height:1;">
                 <span>${s.currentCard.rank}</span>
                 <span style="font-size:1.2rem;">${s.currentCard.suit}</span>
               </div>
             </div>

             <!-- Center Illustration -->
             <div style="text-align:center; position:relative; z-index:2;">
               <div style="font-size:clamp(3.5rem, 20vw, 5rem); filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${rule.emoji || s.currentCard.suit}</div>
               ${['J','Q','K'].includes(s.currentCard.rank) ? `
                 <div style="font-size:1.5rem; opacity:0.1; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(4); z-index:-1; color:${s.currentCard.color}">${s.currentCard.suit}</div>
               ` : ''}
               ${s.currentCard.rank === 'C' ? `<div style="font-size:1.2rem; font-weight:bold; opacity:0.2; margin-top:10px;">CUSTOM</div>` : ''}
             </div>

             <!-- bottom corners -->
             <div style="display:flex; justify-content:space-between; font-size:1.8rem; font-weight:bold; color:${s.currentCard.color}; transform:rotate(180deg);">
               <div style="display:flex; flex-direction:column; align-items:center; line-height:1;">
                 <span>${s.currentCard.rank}</span>
                 <span style="font-size:1.2rem;">${s.currentCard.suit}</span>
               </div>
               <div style="display:flex; flex-direction:column; align-items:center; line-height:1;">
                 <span>${s.currentCard.rank}</span>
                 <span style="font-size:1.2rem;">${s.currentCard.suit}</span>
               </div>
             </div>
          </div>
          
          <div style="margin-top:25px; text-align:center; animation: slideIn 0.4s both;">
            <div style="display:inline-block; font-size:0.8rem; font-weight:900; background:${s.currentCard.rank === 'B' ? 'var(--sec-dim)' : 'var(--primary-dim)'}; color:${s.currentCard.rank === 'B' ? 'var(--secondary)' : 'var(--primary)'}; padding:2px 10px; border-radius:20px; text-transform:uppercase; margin-bottom:8px;">${s.currentCard.rank === 'C' ? 'EXTRA' : (s.currentCard.rank === 'B' ? 'BONUS' : s.currentCard.rank)} - AKTION</div>
            <h2 style="font-family:'Abril Fatface', cursive; font-size:clamp(1.5rem, 6vw, 2.2rem); color:${s.currentCard.rank === 'B' ? 'var(--secondary)' : 'var(--primary)'}; margin:0 0 10px 0; line-height:1;">${rule.name}</h2>
            <p style="font-size:1.1rem; line-height:1.4; color:var(--text); max-width:300px; margin:0 auto; opacity:0.9;">${rule.desc}</p>
          </div>

          ${isMyTurn ? `<button class="btn-primary" style="margin-top:25px; width:auto; padding: 12px 40px; box-shadow: 0 4px 15px var(--shadow);" onclick="KoenigsCup.nextPlayer()">Erledigt ✅</button>` : `<div style="margin-top:20px; color:var(--text-muted); font-weight:bold; font-size:1.2rem;">Warte auf ${currentPlayerName}...</div>`}
        `}
      </div>

      </div>

      <!-- Sonderanzeigen -->
      <div style="margin-top:30px;">
        ${s.daumenmaster ? `
          <div class="card" style="background:var(--primary-dim); border:1px solid var(--primary); padding:10px 15px; display:flex; align-items:center; gap:10px; margin-bottom:10px; animation: slideIn 0.3s;">
             <span style="font-size:1.5rem;">👍</span>
             <div>
               <div style="font-size:0.7rem; font-weight:900; text-transform:uppercase; opacity:0.7;">Daumenmaster</div>
               <div style="font-weight:bold;">${s.daumenmaster.name || s.daumenmaster}</div>
             </div>
          </div>
        ` : ''}

        ${Object.keys(s.mates).length > 0 ? `
           <div class="card-label">Trinkkumpane</div>
           <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${Object.entries(s.mates).map(([p1, p2]) => `
                <div class="p-chip" style="background:var(--sec-dim); color:var(--secondary);">🔗 ${(p1.name || p1)} & ${(p2.name || p2)}</div>
              `).join('')}
           </div>
        ` : ''}

        ${s.activeRules.length > 0 ? `
           <div class="card-label" style="margin-top:15px;">Aktive Regeln</div>
           <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${s.activeRules.map(r => `
                <div class="p-chip">📜 ${r}</div>
              `).join('')}
           </div>
        ` : ''}
      </div>
    `;

    document.getElementById('play-content').innerHTML = content;

    // Add Host Lobby Button
    if ((typeof Multiplayer !== 'undefined' && Multiplayer.role === 'host') || SharedRoom.isActive) {
      const lobbyBtn = document.createElement('button');
      lobbyBtn.className = 'btn-primary';
      lobbyBtn.style = 'background:var(--surface2); color:var(--text); width:auto; margin: 20px auto 0; display:block;';
      lobbyBtn.textContent = '🏠 Lobby';
      lobbyBtn.onclick = () => hostReturnToLobby();
      document.getElementById('play-content').appendChild(lobbyBtn);
    }
  },

  renderMateSelection() {
    const s = this.state;
    const others = s.players.filter(p => (p.id || p) !== (s.players[s.currentPlayerIndex].id || s.players[s.currentPlayerIndex]));
    
    const div = document.createElement('div');
    div.className = 'overlay-selection';
    div.id = 'kc-mate-overlay';
    div.style = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px;';
    div.innerHTML = `
      <div class="card" style="width:100%; max-width:400px; text-align:center;">
        <h2 style="margin-bottom:20px;">Wähle deinen Mate!</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
          ${others.map(p => {
            const pName = p.name || p;
            return `<button class="btn-primary" style="margin:0; font-size:0.9rem;" onclick="KoenigsCup.addMate('${pName}')">${pName}</button>`;
          }).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(div);
  },

  addMate(mateName) {
    const s = this.state;
    const current = s.players[s.currentPlayerIndex].name || s.players[s.currentPlayerIndex];
    s.mates[current] = mateName;
    const overlay = document.getElementById('kc-mate-overlay');
    if (overlay) overlay.remove();
    this.renderGame();
    if (s.mode === 'online') this.syncState();
  },

  renderRuleInput() {
    const div = document.createElement('div');
    div.className = 'overlay-selection';
    div.id = 'kc-rule-overlay';
    div.style = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px;';
    div.innerHTML = `
      <div class="card" style="width:100%; max-width:400px; text-align:center;">
        <h2 style="margin-bottom:20px;">Erfinde eine Regel</h2>
        <input type="text" id="kc-new-rule" class="player-input" placeholder="z.B. Nicht mit dem Namen ansprechen" style="margin-bottom:15px;">
        <button class="btn-primary" onclick="KoenigsCup.addRule(document.getElementById('kc-new-rule').value)">Bestätigen</button>
      </div>
    `;
    document.body.appendChild(div);
  },

  addRule(text) {
    if (text.trim()) {
      this.state.activeRules.push(text.trim());
    }
    const overlay = document.getElementById('kc-rule-overlay');
    if (overlay) overlay.remove();
    this.renderGame();
    if (this.state.mode === 'online') this.syncState();
  },

  renderGameOver() {
    const s = this.state;
    const loser = s.players[s.currentPlayerIndex].name || s.players[s.currentPlayerIndex];

    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:50px 20px; animation: pop 0.6s both;">
        <div style="font-size:clamp(3.5rem, 20vw, 5rem); margin-bottom:20px;">🤮</div>
        <h1 style="font-family:'Abril Fatface', cursive; font-size:clamp(2rem, 8vw, 3rem); color:var(--primary); line-height:1.1; margin-bottom:10px;">PROST!</h1>
        <h2 style="margin-bottom:30px;">${loser} muss den Cup leeren!</h2>
        
        <div style="background:var(--primary-dim); border:2px dashed var(--primary); padding:20px; border-radius:15px; margin-bottom:40px;">
          <p style="font-weight:bold; color:var(--text);">Der 4. König wurde gezogen.</p>
          <p style="font-size:0.9rem; color:var(--text-muted);">Spiel vorbei.</p>
        </div>

        ${s.mode === 'offline' || Multiplayer.role === 'host' ? `
           <button class="btn-primary" onclick="KoenigsCup.startGame()">Nochmal spielen</button>
        ` : '<p style="color:var(--text-muted);">Warte auf den Host für eine neue Runde...</p>'}
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin-top:10px;" onclick="location.reload()">Hauptmenü</button>
      </div>
    `;
  },

  /* ===== ONLINE HOOKS ===== */
  renderHostSetup() {
    return `
      <div class="card">
        <div class="card-label">⚙️ Spiel-Optionen</div>
        <button class="btn-primary" style="background:var(--surface2); color:var(--text); margin:0;" onclick="KoenigsCup.toggleSettingsUI()">Karten bearbeiten ⚒️</button>
      </div>
    `;
  },

  collectOnlineSettings() {
    return {
      enabledRanks: this.state.enabledRanks,
      bonusCardCounts: this.state.bonusCardCounts,
      customCards: this.state.customCards
    };
  },

  onOnlineGameStart(settings) {
    const s = this.state;
    s.phase = 'game';
    s.players = settings.players || s.players;
    s.enabledRanks = settings.enabledRanks || s.enabledRanks;
    s.bonusCardCounts = settings.bonusCardCounts || {};
    s.customCards = settings.customCards || [];
    
    s.currentPlayerIndex = 0;
    s.kingsDrawn = 0;
    s.activeRules = [];
    s.daumenmaster = null;
    s.mates = {};
    s.drawnCards = [];
    s.currentCard = null;
    
    // Only host inits deck
    if (Multiplayer.role === 'host') {
      this.initDeck();
    }
    
    Router.go('play');
    document.getElementById('play-game-name').textContent = this.name;
    this.renderGame();
  },

  syncState() {
    const data = {
      type: 'sync',
      state: {
        deck: this.state.deck,
        currentCard: this.state.currentCard,
        drawnCards: this.state.drawnCards,
        currentPlayerIndex: this.state.currentPlayerIndex,
        kingsDrawn: this.state.kingsDrawn,
        activeRules: this.state.activeRules,
        daumenmaster: this.state.daumenmaster,
        mates: this.state.mates,
        phase: this.state.phase,
        bonusCardCounts: this.state.bonusCardCounts
      }
    };

    if (Multiplayer.role === 'host') {
      Multiplayer.sendGameState(data);
    } else if (Multiplayer.role === 'guest') {
      Multiplayer.sendToHost(data);
    }
  },

  handleOnlineData(data) {
    if (data.type === 'sync') {
      // Basic state update
      Object.assign(this.state, data.state);
      this.renderGame();

      // If I am host, I must relay this guest update to all OTHER guests
      if (Multiplayer.role === 'host') {
        this.syncState();
      }
    }
  }
};
