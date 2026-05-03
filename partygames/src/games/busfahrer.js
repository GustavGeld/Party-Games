const Busfahrer = {
  name: "Busfahrer",
  tagline: "Die ultimative Mutprobe am Fließband.",
  color: "#ff3366",
  shadow: "rgba(255, 51, 102, 0.4)",
  glow: "rgba(255, 51, 102, 0.2)",
  emoji: "🚌",

  state: {
    phase: 'setup',
    players: [],
    currentPlayerIndex: 0,
    playerCards: {},        // { spielerName: [karten] }
    playerHand: [],         // aktuelle 4 Karten des Spielers
    questionIndex: 0,       // 0–3
    busfahrer: null,
    busRoute: [],           // 5 verdeckte Karten
    busPosition: 0,
    deck: [],
    feedback: null,         // { type: 'success'|'error', text: '...' }
    giveawaySips: {},       // { spielerName: count }
    difficulty: 'hard',     // 'hard' (klassisch) oder 'easy' (entspannt)
    cheatMode: false,
    cheatClicks: 0,
    candidates: [],         // Aktuelle Spieler im Stechen (leer = alle)
    stechenRound: 0,
    // New Feature Flags
    schicksalTausch: true,
    betting: true,
    geisterbus: false,
    timerRates: { passenger: 5, bus: 5 },
    doppeldecker: true,
    mode: 'offline', // 'offline' or 'online'
    myName: 'Spieler 1',
    // Dynamic State
    currentTimer: 0,
    busAttempts: 0,
    activeBet: null, // { proId, value, stake, contraIds: [] }
    busDrivers: [],  // For Doppeldecker
    currentDriverIndex: 0,
    showResult: false,
    lastCard: null
  },

  suits: ['♠', '♥', '♦', '♣'],
  ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
  rankValues: { '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'J':11, 'Q':12, 'K':13, 'A':14 },

  open() {
    this.state.cheatClicks = 0;
    this.state.mode = 'offline';
    Router.go('setup');
    const title = document.getElementById('setup-title');
    title.innerHTML = `Busfahre<span onclick="Busfahrer.countCheatClick()" style="cursor:default; -webkit-user-select:none; user-select:none;">r</span>`;
    this.renderSetup();
  },

  countCheatClick() {
    this.state.cheatClicks++;
    if (this.state.cheatClicks === 5) {
      this.state.cheatMode = !this.state.cheatMode;
      this.state.cheatClicks = 0;
      this.renderSetup();
    }
  },

  renderSetup() {
    if (this.state.players.length === 0) {
      this.state.players = ['Spieler 1', 'Spieler 2'];
    }

    document.getElementById('setup-content').innerHTML = `
      <div class="card">
        <div class="card-label">${this.state.cheatMode ? '👤' : '👥'} Spieler</div>
        <div class="players-list" id="bf-players-list"></div>
        <button class="btn-add" onclick="Busfahrer.addPlayer()">＋ Spieler hinzufügen</button>
      </div>

      ${this.renderOptionsHTML()}

      <button class="btn-primary" onclick="Busfahrer.startPassengerPhase()">Lokal spielen 🍺</button>
      <button class="btn-primary" style="background:#ff3366;" onclick="UnifiedLobby.open(Busfahrer)">Online spielen 🌐</button>
    `;
    this.renderPlayersList();
  },

  renderOptionsHTML(isOnline = false) {
    const s = this.state;
    const updateCmd = isOnline ? 'refreshLobby()' : 'Busfahrer.renderSetup()';
    
    return `
      <div class="card">
        <div class="card-label">⚙️ Schwierigkeit</div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
           <button class="btn-primary" style="margin:0; background:${s.difficulty === 'hard' ? 'var(--primary)' : 'var(--surface2)'};" 
                   onclick="Busfahrer.state.difficulty='hard'; ${updateCmd}">Klassisch</button>
           <button class="btn-primary" style="margin:0; background:${s.difficulty === 'easy' ? 'var(--primary)' : 'var(--surface2)'};" 
                   onclick="Busfahrer.state.difficulty='easy'; ${updateCmd}">Checkpoints</button>
        </div>
      </div>

      <!-- Zusatz-Optionen -->
      <div class="card">
        <div class="card-label">🔥 Zusatz-Optionen</div>
        <div class="packages-grid">
          <div class="pkg-card ${this.state.schicksalTausch ? 'active' : ''}" onclick="Busfahrer.state.schicksalTausch = !Busfahrer.state.schicksalTausch; ${updateCmd}">
            <div class="pkg-emoji">✨</div>
            <div class="pkg-name">Glücks-Bonus</div>
            <div class="pkg-count">4/4 richtig = 5 Schlucke</div>
            <div class="pkg-check">✓</div>
          </div>

          <div class="pkg-card ${this.state.doppeldecker ? 'active' : ''}" onclick="Busfahrer.state.doppeldecker = !Busfahrer.state.doppeldecker; ${updateCmd}">
            <div class="pkg-emoji">🚌</div>
            <div class="pkg-name">Doppeldecker</div>
            <div class="pkg-count">Team-Busfahrt bei Gleichstand</div>
            <div class="pkg-check">✓</div>
          </div>

          <div class="pkg-card ${this.state.betting ? 'active' : ''}" onclick="Busfahrer.state.betting = !Busfahrer.state.betting; ${updateCmd}">
            <div class="pkg-emoji">⚖️</div>
            <div class="pkg-name">Wetten</div>
            <div class="pkg-count">Einsätze auf den Busfahrer</div>
            <div class="pkg-check">✓</div>
          </div>

          <div class="pkg-card ${this.state.geisterbus ? 'active' : ''}" onclick="Busfahrer.state.geisterbus = !Busfahrer.state.geisterbus; ${updateCmd}">
            <div class="pkg-emoji">⏱️</div>
            <div class="pkg-name">Geisterbus (Timer)</div>
            <div class="pkg-count">Spiele unter Zeitdruck</div>
            <div class="pkg-check">✓</div>
          </div>
        </div>

        ${this.state.geisterbus ? `
          <div style="margin-top:20px; animation: slideIn 0.3s both;">
            <div style="margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:700; font-size:0.8rem; color:var(--text-muted);">
                <span>PASSIERE SAMMELN</span>
                <span style="color:var(--primary);">${this.state.timerRates.passenger}s</span>
              </div>
              <input type="range" class="styled-range" min="1" max="15" value="${this.state.timerRates.passenger}" 
                     style="--pct:calc(${(this.state.timerRates.passenger - 1) / 14 * 100}% + ${-((this.state.timerRates.passenger - 1) / 14 - 0.5) * 26}px)"
                     oninput="Busfahrer.state.timerRates.passenger = parseInt(this.value); const p=(this.value-1)/14; this.style.setProperty('--pct', \`calc(\${p*100}% + \${-(p-0.5)*26}px)\`); this.parentNode.querySelector('span:last-child').textContent = this.value + 's'">
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:700; font-size:0.8rem; color:var(--text-muted);">
                <span>BUSFAHRT</span>
                <span style="color:var(--primary);">${this.state.timerRates.bus}s</span>
              </div>
              <input type="range" class="styled-range" min="1" max="15" value="${this.state.timerRates.bus}" 
                     style="--pct:calc(${(this.state.timerRates.bus - 1) / 14 * 100}% + ${-((this.state.timerRates.bus - 1) / 14 - 0.5) * 26}px)"
                     oninput="Busfahrer.state.timerRates.bus = parseInt(this.value); const p=(this.value-1)/14; this.style.setProperty('--pct', \`calc(\${p*100}% + \${-(p-0.5)*26}px)\`); this.parentNode.querySelector('span:last-child').textContent = this.value + 's'">
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },


  renderPlayersList() {
    const list = document.getElementById('bf-players-list');
    if (!list) return;
    list.innerHTML = this.state.players.map((p, i) => `
      <div class="player-row">
        <div class="player-avatar">${i + 1}</div>
        <input type="text" class="player-input" value="${p}" onchange="Busfahrer.updatePlayer(${i}, this.value)">
        ${this.state.players.length > 2 ? `<button class="btn-icon" onclick="Busfahrer.removePlayer(${i})">✕</button>` : ''}
      </div>
    `).join('');
  },

  addPlayer() {
    if (this.state.players.length < 12) {
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

  initDeck() {
    this.state.deck = [];
    for (const s of this.suits) {
      for (const r of this.ranks) {
        this.state.deck.push({ 
          suit: s, 
          rank: r, 
          color: (s === '♥' || s === '♦') ? 'red' : 'black',
          value: this.rankValues[r]
        });
      }
    }
    this.shuffleDeck();
  },

  shuffleDeck() {
    for (let i = this.state.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.deck[i], this.state.deck[j]] = [this.state.deck[j], this.state.deck[i]];
    }
  },

  startPassengerPhase(subset = null) {
    this.state.phase = 'passenger';
    const isHost = this.state.mode !== 'online' || Multiplayer.role === 'host';
    
    if (isHost) {
      this.state.candidates = subset || [...this.state.players];
      // Shuffle order ONLY on host for deterministic sync
      if (!subset) {
        for (let i = this.state.candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.state.candidates[i], this.state.candidates[j]] = [this.state.candidates[j], this.state.candidates[i]];
        }
      }
      
      // Reset game progression state
      this.state.currentPlayerIndex = 0; 
      this.state.questionIndex = 0;
      this.state.playerHand = [];
      this.state.playerCards = {};
      this.state.showResult = false;
      this.state.feedback = null;
      this.state.lastCard = null;
      this.state.wasTimeout = false;
      this.state.busAttempts = 0;
      this.state.stechenRound = subset ? this.state.stechenRound : 0;
      
      this.state.candidates.forEach(p => {
        const pName = typeof p === 'string' ? p : p.name;
        this.state.playerCards[pName] = [];
        this.state.giveawaySips[pName] = 0;
      });
      this.initDeck();
    } else {
      // Guest: Initialize candidates & reset visual state to avoid "stale" screens
      this.state.candidates = subset || [...this.state.players];
      this.state.showResult = false;
      this.state.feedback = null;
      this.state.lastCard = null;
      this.state.wasTimeout = false;
    }

    Router.go('play');
    document.getElementById('play-game-name').textContent = subset ? `Stechen (Runde ${this.state.stechenRound})` : "Passagiere sammeln";
    this.renderPassengerPhase();
    
    if (this.state.geisterbus && isHost) this.startTimer('passenger');
    if (this.state.mode === 'online' && isHost) this.syncState();
  },

  startTimer(phase) {
    this.stopTimer();
    const s = this.state;
    const isHost = (s.mode !== 'online' || Multiplayer.role === 'host');
    const rate = (phase === 'passenger' ? s.timerRates.passenger : s.timerRates.bus) || 5;
    s.currentTimer = rate;
    let totalMs = rate * 1000;
    
    // Safety sync for reset
    if (isHost && s.mode === 'online') this.syncState();

    let lastSync = Date.now();
    
    this.timerInterval = setInterval(() => {
      totalMs -= 100;
      s.currentTimer = totalMs / 1000;

      if (totalMs <= 0) {
        s.currentTimer = 0;
        this.stopTimer();
        if (isHost) this.handleTimeout();
      }
      
      const now = Date.now();
      if (isHost && s.mode === 'online') {
        // Only sync every 1s or on finish to save bandwidth
        if (now - lastSync >= 1000 || totalMs <= 0) {
          this.syncState();
          lastSync = now;
        }
      }
      
      const bar = document.getElementById('bf-timer-bar-fill');
      const num = document.getElementById('bf-timer-num');
      if (bar) bar.style.width = Math.max(0, (s.currentTimer / rate) * 100) + '%';
      if (num) num.textContent = Math.ceil(s.currentTimer);

    }, 100);
  },

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
  },

  handleTimeout() {
    const s = this.state;
    const currentPlayer = s.candidates[s.currentPlayerIndex] || { name: '...', id: null };
    const playerName = typeof currentPlayer === 'string' ? currentPlayer : (currentPlayer.name || '...');
    
    s.feedback = { type: 'error', text: `Zu langsam! ⏱️ ${playerName} muss 2 Schlucke trinken.` };
    s.showResult = true;
    
    if (s.phase === 'passenger') {
      s.wasTimeout = true;
      this.renderPassengerPhase();
    } else if (s.phase === 'busfahrt') {
      const currentDriver = s.busDrivers[s.currentDriverIndex] || { name: '...', id: null };
      const driverName = typeof currentDriver === 'string' ? currentDriver : (currentDriver.name || '...');
      
      const penalty = Math.floor(s.busPosition / s.busDrivers.length) + 1;
      if (s.difficulty === 'hard') {
        s.busPosition = 0;
        s.currentDriverIndex = 0;
        this.initDeck();
        const routeLen = s.busRoute.length;
        s.busRoute = [];
        for(let i=0; i<routeLen; i++) s.busRoute.push(s.deck.pop());
        s.feedback.text = `Zu langsam! ⏱️ ${driverName} muss ${penalty} Schlucke trinken und zurück zum Start!`;
      } else {
        this.shufflePassedCards();
        if (s.deck.length === 0) this.initDeck();
        s.busRoute[s.busPosition] = s.deck.pop();
        s.feedback.text = `Zu langsam! ⏱️ ${driverName} muss ${penalty} Schlucke trinken.`;
      }
      this.renderBusfahrt();
    }
    if (s.mode === 'online') this.syncState();
  },

  shufflePassedCards() {
    const s = this.state;
    if (s.busPosition <= 0) return;
    // Shuffle all cards BEFORE current position
    for (let i = 0; i < s.busPosition; i++) {
      if (s.deck.length === 0) this.initDeck();
      s.busRoute[i] = s.deck.pop();
    }
  },

  renderCurrentPhase() {
    const p = this.state.phase;
    if (p === 'passenger') this.renderPassengerPhase();
    else if (p === 'busfahrt' || p === 'gameover') this.renderBusfahrt();
    else if (p === 'busfahrer_reveal') this.renderBusfahrerReveal();
    else if (p === 'busfahrer_reveal_group') this.renderGroupReveal();
    else if (p === 'stechen_reveal') {
      this.renderStechenReveal(s.stechenLosers || this.getLosers()); 
    }
  },

  getLosers() {
    const s = this.state;
    // Recalculate losers based on sips for sync fallback
    const names = Object.keys(s.playerCards);
    const penalties = {};
    names.forEach(name => {
      penalties[name] = (s.playerCards[name] || []).filter(c => 
        (c.color === 'red' && ['♦','♥'].includes(c.suit)) || 
        (c.color === 'black' && ['♠','♣'].includes(c.suit))
      ).length;
    });
    let max = -1; let losers = [];
    Object.entries(penalties).forEach(([n, c]) => {
      if (c > max) { max = c; losers = [n]; }
      else if (c === max) losers.push(n);
    });
    return losers;
  },

  handleAnswer(answer) {
    const s = this.state;
    const isHost = (Multiplayer.role === 'host');
    const isOffline = s.mode === 'offline';

    const currentPlayer = s.candidates[s.currentPlayerIndex];
    if (!currentPlayer || s.showResult) return;

    if (!isOffline && !isHost) {
      // Guest: Check if it's my turn before sending to host
      const currentId = (typeof currentPlayer === 'object') ? currentPlayer.id : null;
      const myId = Multiplayer.myId;
      if (currentId && currentId !== myId) return;
      
      Multiplayer.sendToHost({ type: 'passenger_answer', answer: answer });
      return;
    }

    this.stopTimer();
    const checkCorrect = (c, qIdx, ans, hand) => {
      if (qIdx === 0) return c.color === ans;
      if (qIdx === 1) {
        if (!hand || hand.length < 1) return false;
        const prev = hand[0].value;
        if (ans === 'higher') return c.value > prev;
        if (ans === 'lower') return c.value < prev;
        return c.value === prev;
      }
      if (qIdx === 2) {
        if (!hand || hand.length < 2) return false;
        const v1 = hand[0].value; const v2 = hand[1].value;
        const min = Math.min(v1, v2); const max = Math.max(v1, v2);
        if (ans === 'inside') return (c.value > min && c.value < max);
        return (c.value < min || c.value > max);
      }
      if (qIdx === 3) return c.suit === ans;
      return false;
    };

    const playerName = typeof currentPlayer === 'string' ? currentPlayer : currentPlayer.name;
    let card = s.deck.pop();
    
    // Cheat Mode Precise Manipulation for Host (Player at index 0)
    const p1 = s.players[0];
    const p1Name = typeof p1 === 'string' ? p1 : p1.name;
    const isCheatPlayer = (playerName === p1Name);

    if (s.cheatMode && isCheatPlayer) {
       // Host stays at 0 or 1 error to avoid being Busfahrer.
       const isActuallyCorrect = checkCorrect(card, s.questionIndex, answer, s.playerHand);
       const wrongSoFar = s.questionIndex - (s.giveawaySips[playerName] || 0);
       
       if (wrongSoFar >= 1 || s.questionIndex >= 2) {
          if (!isActuallyCorrect) {
              const swapIdx = s.deck.findIndex(c => checkCorrect(c, s.questionIndex, answer, s.playerHand) === true);
              if (swapIdx !== -1) {
                 const replacement = s.deck.splice(swapIdx, 1)[0];
                 s.deck.push(card);
                 card = replacement;
              }
          }
       }
    }

    this.stopTimer();
    let correct = checkCorrect(card, s.questionIndex, answer, s.playerHand);

    s.playerHand.push(card);
    s.playerCards[playerName].push(card);

    if (correct) {
      s.giveawaySips[playerName]++;
      s.feedback = { type: 'success', text: `Richtig! ${playerName} darf +1 Schluck verteilen` };
    } else {
      s.feedback = { type: 'error', text: `Falsch! ${playerName} muss trinken` };
    }

    s.showResult = true;
    s.lastCard = card;

    this.renderPassengerPhase();
    if (s.mode === 'online') this.syncState();
  },

  nextQuestion() {
    const s = this.state;
    if (s.mode === 'online' && Multiplayer.role !== 'host') {
      Multiplayer.sendToHost({ type: 'next_question' });
      return;
    }
    
    s.showResult = false;
    s.lastCard = null;
    s.feedback = null;
    
    if (s.wasTimeout) {
      s.wasTimeout = false;
    } else {
      s.questionIndex++;
    }
    
    if (s.questionIndex > 3) {
      const currentPlayer = s.candidates[s.currentPlayerIndex];
      const playerName = typeof currentPlayer === 'string' ? currentPlayer : (currentPlayer ? currentPlayer.name : 'Unknown');
      // Glücks-Bonus Check
      if (s.schicksalTausch && s.giveawaySips[playerName] === 4) {
        s.giveawaySips[playerName] = 5;
        s.schicksalWinner = playerName;
        if (s.mode === 'online') this.syncState();
        return; // Wait for state sync to show overlay on all clients
      }
      this.finishPassengerTurn();
    } else {
      this.renderPassengerPhase();
      if (s.geisterbus) this.startTimer('passenger');
      if (s.mode === 'online' && Multiplayer.role === 'host') this.syncState();
    }
  },

  finishPassengerTurn() {
    const s = this.state;
    s.questionIndex = 0;
    s.playerHand = [];
    s.currentPlayerIndex++;
    if (s.currentPlayerIndex >= s.candidates.length) {
      this.selectBusfahrer();
    } else {
      this.renderPassengerPhase();
      if (s.geisterbus) this.startTimer('passenger');
      if (s.mode === 'online') this.syncState();
    }
  },

  renderPassengerPhase(showResult = false, lastCard = null) {
    const s = this.state;
    const currentPlayer = s.candidates[s.currentPlayerIndex] || { name: '...', id: null };
    const playerName = typeof currentPlayer === 'string' ? currentPlayer : (currentPlayer.name || '...');
    const currentId = typeof currentPlayer === 'object' ? currentPlayer.id : null;
    const isMeHost = (typeof Multiplayer !== 'undefined' && Multiplayer.role === 'host') || (typeof SharedRoom !== 'undefined' && SharedRoom.isActive && SharedRoom.isLocalHost);
    const myId = isMeHost ? 'host-1' : (typeof Multiplayer !== 'undefined' ? Multiplayer.myId : null);
    
    // Improved identity check for "Host" name
    const isHost = (currentId === 'host-1' || playerName.toLowerCase() === 'host' || playerName.toLowerCase() === 'host (du)');
    const isMyTurn = (s.mode === 'offline') || (isMeHost && isHost) || (currentId === myId);

    let ht = `
      <div style="text-align:center; margin-bottom:30px; animation: fadeInDown 0.5s both;">
        <div style="font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; color:var(--primary); font-weight:bold; margin-bottom:5px;">Aktueller Spieler</div>
        <div style="font-family:'Abril Fatface', cursive; font-size:2.4rem; color:#fff; text-shadow: 0 4px 10px rgba(0,0,0,0.5); line-height:1.1;">${playerName}</div>
        
        <div style="display:flex; justify-content:center; gap:12px; margin-top:20px;">
          ${s.playerHand.map((c, i) => `
            <div style="width:45px; height:65px; background:#fff; border-radius:8px; border:1px solid #ccc; display:flex; flex-direction:column; align-items:center; justify-content:center; color:${c.color === 'red' ? '#ff3366' : '#000'}; font-size:1.1rem; font-weight:bold; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
              <span style="font-size:1.2rem; line-height:1;">${c.suit}</span>
              <span style="font-size:1rem; line-height:1;">${c.rank}</span>
            </div>
          `).join('')}
          ${Array(Math.max(0, 4 - s.playerHand.length)).fill(0).map(() => `
            <div style="width:45px; height:65px; background:rgba(255,255,255,0.05); border:2px dashed rgba(255,255,255,0.2); border-radius:8px;"></div>
          `).join('')}
        </div>
      </div>
    `;

    // Timer Bar & Numbers
    if (s.geisterbus && !showResult) {
      const rate = s.phase === 'passenger' ? s.timerRates.passenger : s.timerRates.bus;
      const pct = Math.max(0, (s.currentTimer / rate) * 100);
      ht = `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:25px; animation: fadeIn 0.4s both;">
          <div style="flex:1; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
            <div id="bf-timer-bar-fill" style="width:${pct}%; height:100%; background:var(--primary); transition: width 0.1s linear;"></div>
          </div>
          <div id="bf-timer-num" style="font-family:'Abril Fatface', cursive; font-size:1.5rem; color:var(--primary); width:40px; text-align:right;">${Math.ceil(s.currentTimer)}</div>
        </div>
      ` + ht;
    }

    if (s.showResult) {
      ht += `
        <div style="text-align:center; animation: pop 0.4s both;">
          ${s.lastCard ? `
            <div style="width:140px; height:200px; background:#fff; border-radius:12px; margin: 0 auto 20px; display:flex; flex-direction:column; justify-content:center; align-items:center; color:${s.lastCard.color === 'red' ? '#ff3366' : '#000'}; border:2px solid ${(s.feedback && s.feedback.type === 'success') ? 'var(--green)' : 'var(--primary)'}; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
               <div style="font-size:clamp(3rem, 15vw, 4rem);">${s.lastCard.suit}</div>
               <div style="font-size:2rem; font-weight:900;">${s.lastCard.rank}</div>
            </div>
          ` : '<div style="font-size:clamp(3.5rem, 20vw, 5rem); margin-bottom:20px;">⏱️</div>'}
          <h2 style="color:${(s.feedback && s.feedback.type === 'success') ? 'var(--green)' : 'var(--primary)'}; margin-bottom:20px; font-family:'Abril Fatface', cursive;">
            ${isMyTurn ? (s.feedback ? s.feedback.text : '').replace(playerName, 'Du').replace('muss', 'musst').replace('darf', 'darfst') : (s.feedback ? s.feedback.text : '')}
          </h2>
          ${(s.mode === 'offline' || isMyTurn) ? `
            <button class="btn-primary" onclick="Busfahrer.nextQuestion()">Weiter</button>
          ` : `<p style="color:var(--text-muted); font-style:italic;">Warte auf ${isMyTurn ? 'dich' : playerName}...</p>`}
        </div>
      `;
    } else {
      const questions = [
        "Rot oder Schwarz?",
        "Höher oder Niedriger?",
        "Innen oder Außen?",
        "Welche Farbe? (Symbol)"
      ];
      ht += `
        <div class="card" style="text-align:center; padding:30px 20px; background:var(--primary-dim); border:2px solid var(--primary);">
          <div class="card-label">Frage ${s.questionIndex + 1}/4</div>
          <h2 style="font-size:1.8rem; margin-bottom:30px;">${questions[s.questionIndex]}</h2>
          
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap:10px;">
            ${isMyTurn ? this.renderQuestionButtons(s.questionIndex) : `<p style="grid-column:1/-1; color:var(--text-muted); padding:20px;">Warte auf <b>${playerName}</b>...</p>`}
          </div>
        </div>
        <p style="text-align:center; color:var(--text-muted); margin-top:20px; font-size:0.9rem;">
          Schlucke zum Verteilen: <b>${s.giveawaySips[playerName]}</b>
        </p>
      `;
    }
    document.getElementById('play-content').innerHTML = ht;
    
    if (Multiplayer.role === 'host') {
      const lobbyBtn = document.createElement('button');
      lobbyBtn.className = 'btn-primary';
      lobbyBtn.style = 'background:var(--surface2); color:var(--text); width:auto; margin: 20px auto 0; display:block;';
      lobbyBtn.textContent = '🏠 Lobby';
      lobbyBtn.onclick = () => hostReturnToLobby();
      document.getElementById('play-content').appendChild(lobbyBtn);
    }

    // Schicksal-Tausch Overlay for everyone
    if (s.schicksalWinner) {
      const isMeWinner = (s.mode === 'offline') || (s.schicksalWinner === s.myName);
      const isMeHost = (Multiplayer.role === 'host');
      const div = document.createElement('div');
      div.style = 'position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:200; display:flex; align-items:center; justify-content:center; animation: pop 0.4s both;';
      div.innerHTML = `
        <div class="card" style="text-align:center; padding:40px;">
          <h1 style="color:#ffd700; font-family:'Abril Fatface', cursive; font-size:clamp(1.8rem, 8vw, 2.8rem); margin-bottom:20px;">✨ Glücks-Bonus! ✨</h1>
          <p style="font-size:1.3rem; margin-bottom:30px;">
            ${isMeWinner ? `<b>Du</b> hast 4/4 richtig!<br>Du darfst jetzt <b>5 Schlucke</b> verteilen.` : 
                           `<b>${s.schicksalWinner}</b> hat 4/4 richtig!<br>Er darf jetzt <b>5 Schlucke</b> verteilen.`}
          </p>
          ${(s.mode === 'offline' || isMeHost) ? `
            <button class="btn-primary" onclick="Busfahrer.closeSchicksal()">Sensationell! 🚀</button>
          ` : `<p style="color:var(--text-muted);">Warte auf den Host...</p>`}
        </div>
      `;
      document.getElementById('play-content').appendChild(div);
    }
  },

  closeSchicksal() {
    this.state.schicksalWinner = null;
    this.finishPassengerTurn();
  },

  renderQuestionButtons(index) {
    if (index === 0) {
      return `
        <button class="btn-primary" style="background:#ff3366; color:#fff;" onclick="Busfahrer.handleAnswer('red')">ROT</button>
        <button class="btn-primary" style="background:#000; color:#fff; border:1px solid #333;" onclick="Busfahrer.handleAnswer('black')">SCHWARZ</button>
      `;
    } else if (index === 1) {
      return `
        <button class="btn-primary" onclick="Busfahrer.handleAnswer('higher')">HÖHER</button>
        <button class="btn-primary" onclick="Busfahrer.handleAnswer('lower')">NIEDRIGER</button>
      `;
    } else if (index === 2) {
      return `
        <button class="btn-primary" onclick="Busfahrer.handleAnswer('inside')">INNEN</button>
        <button class="btn-primary" onclick="Busfahrer.handleAnswer('outside')">AUSSEN</button>
      `;
    } else if (index === 3) {
      return this.suits.map(s => `
        <button class="btn-primary" style="font-size:1.5rem; padding: 10px;" onclick="Busfahrer.handleAnswer('${s}')">${s}</button>
      `).join('');
    }
  },

  selectBusfahrer() {
    const s = this.state;
    // Only check penalties of the CURRENT round's candidates
    const penalties = {};
    s.candidates.forEach(p => {
      const pName = typeof p === 'string' ? p : p.name;
      penalties[pName] = 4 - (s.giveawaySips[pName] || 0);
    });

    let maxPenalties = -1;
    let losersNames = [];
    
    Object.entries(penalties).forEach(([name, count]) => {
      if (count > maxPenalties) {
        maxPenalties = count;
        losersNames = [name];
      } else if (count === maxPenalties) {
        losersNames.push(name);
      }
    });

    // Map back to full player objects for ID stability
    const fullLosers = losersNames.map(name => s.candidates.find(p => (typeof p === 'string' ? p : p.name) === name));
    const losers = fullLosers.map(p => typeof p === 'string' ? p : {id: p.id, name: p.name});

    if (losers.length > 1 && s.doppeldecker) {
      // DOPPELDECKER MODE!
      s.busDrivers = losers;
      s.phase = 'busfahrer_reveal_group';
      this.renderGroupReveal();
    } else if (losers.length > 1) {
      // STECHEN!
      s.phase = 'stechen_reveal';
      s.stechenLosers = losers;
      this.state.stechenRound++;
      this.renderStechenReveal(losers);
    } else {
      // Unique loser found
      s.busfahrer = losers[0];
      s.busDrivers = [losers[0]];
      s.phase = 'busfahrer_reveal';
      this.renderBusfahrerReveal();
    }
    if (s.mode === 'online') this.syncState();
  },

  renderGroupReveal() {
    const s = this.state;
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:50px 20px; animation: pop 0.6s both;">
        <div style="font-size:clamp(3.5rem, 20vw, 5rem); margin-bottom:20px;">🚌🚌</div>
        <h1 style="font-family:'Abril Fatface', cursive; font-size:clamp(1.8rem, 8vw, 2.5rem); color:var(--primary); line-height:1.1; margin-bottom:20px;">DOPPELDECKER-MODE!</h1>
        <p style="margin-bottom:20px;">Es gibt mehrere Busfahrer:</p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:30px;">
          ${s.busDrivers.map(d => {
            const name = typeof d === 'string' ? d : (d.name || '...');
            return `<div style="font-size:1.5rem; font-weight:bold; color:#fff;">👤 ${name}</div>`;
          }).join('')}
        </div>
        <p style="color:var(--text-muted); margin-bottom:40px;">Die Strecke ist jetzt <b>${s.busDrivers.length * 5}</b> Karten lang!</p>
        ${(s.mode === 'offline' || Multiplayer.role === 'host') ? `
          <button class="btn-primary" onclick="Busfahrer.startBusfahrt()">Fahrt starten 🏁</button>
        ` : `<p style="color:var(--text-muted);">Warte auf den Host...</p>`}
      </div>
    `;
  },

  renderStechenReveal(losers) {
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:40px 20px; animation: pop 0.5s both;">
        <h1 style="font-family:'Abril Fatface', cursive; font-size:clamp(2rem, 8vw, 3rem); color:var(--primary); margin-bottom:10px;">Unentschieden!</h1>
        <div style="font-size:clamp(3rem, 15vw, 4rem); margin-bottom:20px;">⚔️</div>
        <p style="margin-bottom:20px; font-size:1.1rem;">Es steht Gleichstand zwischen:</p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:30px;">
          ${losers.map(l => {
            const name = typeof l === 'string' ? l : (l.name || '...');
            return `<div class="card" style="padding:10px; background:rgba(255,255,255,0.1); font-weight:bold; font-size:1.4rem;">${name}</div>`;
          }).join('')}
        </div>
        <p style="color:var(--text-muted); margin-bottom:30px;">Ihr müsst ins Stechen. Nochmal 4 Karten rufen!</p>
        ${(this.state.mode === 'offline' || Multiplayer.role === 'host') ? `
          <button class="btn-primary" onclick="Busfahrer.startPassengerPhase(${JSON.stringify(losers).replace(/"/g, '&quot;')})">Stechen starten 🚀</button>
        ` : `<p style="color:var(--text-muted);">Warte auf den Host...</p>`}
      </div>
    `;
  },

  renderBusfahrerReveal() {
    const s = this.state;
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:50px 20px; animation: pop 0.6s both;">
        <div style="font-size:clamp(3.5rem, 20vw, 5rem); margin-bottom:20px;">🚌</div>
        <h1 style="font-family:'Abril Fatface', cursive; font-size:clamp(1.8rem, 8vw, 2.5rem); color:var(--primary); line-height:1.1; margin-bottom:20px;">Wir haben einen Busfahrer!</h1>
        <h2 style="font-size:2rem; margin-bottom:30px;">${typeof s.busfahrer === 'string' ? s.busfahrer : (s.busfahrer?.name || '...')}</h2>
        <p style="color:var(--text-muted); margin-bottom:40px;">Halt dich fest, es wird eine holprige Fahrt...</p>
        ${(s.mode === 'offline' || Multiplayer.role === 'host') ? `
          <button class="btn-primary" onclick="Busfahrer.startBusfahrt()">Busfahrt starten 🏁</button>
        ` : `<p style="color:var(--text-muted);">Warte auf den Host...</p>`}
      </div>
    `;
  },

  startBusfahrt() {
    const s = this.state;
    s.phase = 'busfahrt';
    s.busPosition = 0;
    s.busAttempts = 0;
    s.currentDriverIndex = 0;
    s.activeBet = null;
    this.initDeck(); // New deck for busfahrt
    s.busRoute = [];
    const routeLen = (s.busDrivers && s.busDrivers.length > 0) ? s.busDrivers.length * 5 : 5;
    for(let i=0; i<routeLen; i++) s.busRoute.push(s.deck.pop());
    s.questionIndex = 0;
    s.feedback = null;
    
    document.getElementById('play-game-name').textContent = s.busDrivers.length > 1 ? "Doppeldecker-Fahrt" : "Busfahrt";
    this.renderBusfahrt();
    if (s.geisterbus) this.startTimer('bus');
    if (s.mode === 'online') this.syncState();
  },

  handleBusAnswer(answer) {
    const s = this.state;
    const isHost = (Multiplayer.role === 'host');
    const isOffline = s.mode === 'offline';

    const currentDriver = s.busDrivers[s.currentDriverIndex];
    if (!currentDriver || s.feedback) return;

    if (!isOffline && !isHost) {
      // Guest: Check turn before sending
      const currentId = (typeof currentDriver === 'object') ? currentDriver.id : null;
      const myId = Multiplayer.myId;
      if (currentId && currentId !== myId) return;

      Multiplayer.sendToHost({ type: 'bus_answer', answer: answer, turnIndex: s.currentDriverIndex });
      return;
    }

    this.stopTimer();
    const currentDriverObj = s.busDrivers[s.currentDriverIndex] || { name: '...', id: null };
    const driverName = typeof currentDriverObj === 'string' ? currentDriverObj : (currentDriverObj.name || '...');
    
    s.busAttempts++;
    const card = s.busRoute[s.busPosition];
    let correct = false;

    // Logic for questions
    const qIndex = s.busPosition % 4;
    if (qIndex === 0) correct = card.color === answer;
    else if (qIndex === 1) {
      const prev = s.busRoute[s.busPosition - 1].value;
      if (answer === 'higher') correct = card.value > prev;
      else if (answer === 'lower') correct = card.value < prev;
      else correct = card.value === prev;
    } else if (qIndex === 2) {
      const v1 = s.busRoute[s.busPosition - 2].value;
      const v2 = s.busRoute[s.busPosition - 1].value;
      const min = Math.min(v1, v2); const max = Math.max(v1, v2);
      if (answer === 'inside') correct = (card.value > min && card.value < max);
      else correct = (card.value < min || card.value > max);
    } else if (qIndex === 3) correct = card.suit === answer;

    if (correct) {
      s.busPosition++;
      s.currentDriverIndex = (s.currentDriverIndex + 1) % s.busDrivers.length;
      s.feedback = { type: 'success', text: `Richtig! ${driverName} kommt zur nächsten Station.` };
      if (s.busPosition >= s.busRoute.length) {
        s.phase = 'gameover';
        this.renderBusfahrt(true);
        if (s.mode === 'online') this.syncState();
        return;
      }
      
      // Auto-Resume after 1.5s for success
      if (isHost) {
        if (this.autoResumeTimeout) clearTimeout(this.autoResumeTimeout);
        this.autoResumeTimeout = setTimeout(() => {
          if (this.state.feedback && this.state.feedback.type === 'success' && this.state.phase === 'busfahrt') {
            this.resumeBusfahrt();
          }
        }, 1500);
      }
    } else {
      const penalty = Math.floor(s.busPosition / s.busDrivers.length) + 1;
      if (s.difficulty === 'easy') {
        s.feedback = { type: 'error', text: `Falsch! ${driverName} muss ${penalty} Schlucke trinken.` };
        if (s.deck.length === 0) this.initDeck();
        s.busRoute[s.busPosition] = s.deck.pop();
      } else {
        s.feedback = { type: 'error', text: `Falsch! ${driverName} muss ${penalty} Schlucke trinken und zurück zum Start!` };
        s.busPosition = 0;
        s.currentDriverIndex = 0;
        this.initDeck();
        const routeLen = s.busDrivers.length * 5;
        s.busRoute = [];
        for(let i=0; i<routeLen; i++) s.busRoute.push(s.deck.pop());
      }
    }

    this.renderBusfahrt(true, card);
    if (s.mode === 'online') this.syncState();
  },

  renderBusfahrt() {
    const s = this.state;
    if (s.phase === 'gameover') return this.renderGameOver();

    const titleEl = document.getElementById('play-game-name');
    if (titleEl) titleEl.textContent = s.busDrivers.length > 1 ? "Doppeldecker-Fahrt" : "Busfahrt";

    const showFeedback = !!s.feedback;

    const currentDriver = s.busDrivers[s.currentDriverIndex] || { name: '...', id: null };
    const driverName = typeof currentDriver === 'string' ? currentDriver : (currentDriver.name || '...');
    const currentId = typeof currentDriver === 'object' ? currentDriver.id : null;
    const myId = Multiplayer.role === 'host' ? 'host-1' : Multiplayer.myId;
    
    const isHost = (currentId === 'host-1' || driverName.toLowerCase() === 'host');
    const isMeHost = (Multiplayer.role === 'host');
    const isOnline = s.mode === 'online';
    const isMyTurn = (s.mode === 'offline') || (isMeHost && isHost) || (currentId === myId);
    const isAnyDriver = s.busDrivers.some(d => (typeof d === 'string' ? d : (d.id || null)) === myId);
    
    let ht = `
      <div style="text-align:center; margin-bottom:20px;">
        <div class="card-label">Aktueller Fahrer: <b>${driverName}</b></div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">Versuche: ${s.busAttempts}</div>
    `;

    // Timer
    if (s.geisterbus && !showFeedback) {
      const pct = Math.max(0, (s.currentTimer / s.timerRates.bus) * 100);
      ht += `
        <div style="display:flex; align-items:center; gap:8px; margin: 15px 0;">
          <div style="flex:1; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
            <div id="bf-timer-bar-fill" style="width:${pct}%; height:100%; background:var(--primary); transition: width 0.1s linear;"></div>
          </div>
          <div id="bf-timer-num" style="font-family:'Abril Fatface', cursive; color:var(--primary); font-size:1.1rem; width:30px; text-align:right;">${Math.ceil(s.currentTimer)}</div>
        </div>
      `;
    }

    ht += `
        <div style="display:flex; justify-content:center; gap:5px; margin-top:15px; flex-wrap:wrap;">
          ${s.busRoute.map((c, i) => `
            <div style="width:40px; height:60px; border-radius:6px; display:flex; align-items:center; justify-content:center; transition:all 0.4s;
                        ${i < s.busPosition ? `background:#fff; color:${c.color === 'red'?'#ff3366':'#000'}; border:1px solid var(--green); font-weight:bold; font-size:0.9rem;` : 
                          i === s.busPosition ? 'background:var(--primary); border:2px solid #fff; box-shadow:0 0 10px var(--primary-glow); font-size:1.2rem;' : 
                          'background:var(--surface2); border:1px solid var(--border); opacity:0.4; font-size:1rem;'}">
              ${i < s.busPosition ? c.rank + c.suit : i === s.busPosition ? '❓' : ''}
            </div>
          `).join('')}
        </div>
      </div>
      <style>
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      </style>
    `;

    if (showFeedback) {
      ht += `
        <div style="text-align:center; animation: ${(s.feedback && s.feedback.type === 'success') ? 'pop 0.4s' : 'shake 0.4s'} both;">
           <h2 style="color:${(s.feedback && s.feedback.type === 'success') ? 'var(--green)' : 'var(--primary)'}; margin-bottom:25px; line-height:1.2;">
             ${isMyTurn ? (s.feedback ? s.feedback.text : '').replace(driverName, 'Du').replace('muss', 'musst').replace('kommt', 'kommst') : (s.feedback ? s.feedback.text : '')}
           </h2>
           ${(s.mode === 'offline' || isMyTurn) ? 
              `<button class="btn-primary" onclick="Busfahrer.resumeBusfahrt()">Weiter</button>` : 
              `<p style="color:var(--text-muted); margin-top:15px;">Warte auf ${isMyTurn ? 'dich' : driverName}...</p>`}
            ${s.feedback.type === 'success' ? `<p style="color:var(--text-muted); font-size:0.8rem; margin-top:8px; opacity:0.8;">(Automatischer Umbruch in 1.5s)</p>` : ''}
        </div>
      `;
    } else {
      const qIndex = s.busPosition % 4;
      const questions = ["Rot oder Schwarz?", "Höher oder Niedriger?", "Innen oder Außen?", "Welche Farbe?"];
      ht += `
        <div class="card" style="text-align:center; padding:20px 15px; background:var(--primary-dim); border:2px solid var(--primary);">
          <div class="card-label">Station ${s.busPosition + 1}/${s.busRoute.length}</div>
          <h2 style="font-size:1.4rem; margin-bottom:20px;">${questions[qIndex]}</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap:10px;">
            ${isMyTurn ? this.renderBusButtons(qIndex) : `<p style="grid-column:1/-1; color:var(--text-muted);">Warte auf ${currentDriver.name || currentDriver}...</p>`}
          </div>
        </div>
      `;

      // Betting UI: Only for spectators (not in busDrivers list)
      if (s.betting && isOnline && !isAnyDriver) {
        ht += this.renderBettingInterface();
      }
    }

    document.getElementById('play-content').innerHTML = ht;

    if (Multiplayer.role === 'host') {
      const lobbyBtn = document.createElement('button');
      lobbyBtn.className = 'btn-primary';
      lobbyBtn.style = 'background:var(--surface2); color:var(--text); width:auto; margin: 20px auto 0; display:block;';
      lobbyBtn.textContent = '🏠 Lobby';
      lobbyBtn.onclick = () => hostReturnToLobby();
      document.getElementById('play-content').appendChild(lobbyBtn);
    }
  },

  resumeBusfahrt() {
    if (this.autoResumeTimeout) clearTimeout(this.autoResumeTimeout);
    this.autoResumeTimeout = null;

    if (this.state.mode === 'online' && Multiplayer.role !== 'host') {
      Multiplayer.sendToHost({ type: 'resume_bus' });
      return;
    }
    this.state.feedback = null;
    this.renderBusfahrt();
    if (this.state.geisterbus) this.startTimer('bus');
    if (this.state.mode === 'online') this.syncState();
  },

  renderBettingInterface() {
    const s = this.state;
    const currentDriver = s.busDrivers[s.currentDriverIndex] || { name: '...', id: null };
    const driverName = typeof currentDriver === 'string' ? currentDriver : (currentDriver.name || '...');
    
    const isBettor = s.activeBet && (s.activeBet.proId === Multiplayer.myId);
    const isContra = s.activeBet && s.activeBet.contraIds.includes(Multiplayer.myId);

    let html = `
      <div class="card" style="margin-top:20px; background:var(--surface2); border:1px solid var(--border);">
        <div class="card-label">🎲 Wetten dass...</div>
    `;

    if (!s.activeBet) {
      html += `
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">Wette, dass ${driverName} den Bus in weniger als X Versuchen schafft!</p>
        <div style="display:flex; gap:8px;">
          <input type="number" id="bet-input" class="player-input" placeholder="Anzahl Versuche" style="flex:1;">
          <button class="btn-primary" style="font-size:0.8rem; width:auto; padding:0 20px;" onclick="Busfahrer.placeBet(document.getElementById('bet-input').value)">Wetten!</button>
        </div>
      `;
    } else {
      html += `
        <div style="background:var(--primary-dim); padding:10px; border-radius:8px; margin-bottom:10px;">
          <div style="font-weight:bold; color:var(--primary); font-size:1.1rem;">Ziel: Unter ${s.activeBet.value} Versuche</div>
          <p style="font-size:0.75rem; margin-top:4px;">${driverName} muss den Bus in maximal ${s.activeBet.value-1} Versuchen verlassen.</p>
          <div style="margin-top:8px; font-weight:700;">Einsatz: ${s.activeBet.stake} Schlucke</div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
          <button class="btn-primary" style="margin:0; font-size:0.8rem;" onclick="Busfahrer.toppen()" ${isBettor ? 'disabled' : ''}>Toppen (-1 Auf, +1 Schl)</button>
          <button class="btn-primary" style="margin:0; font-size:0.8rem; background:var(--secondary);" onclick="Busfahrer.contra()" ${isContra ? 'disabled' : ''}>Dagegen (${s.activeBet.contraIds.length})</button>
        </div>
      `;
    }
    html += `</div>`;
    return html;
  },

  placeBet(val) {
    const v = parseInt(val);
    if (isNaN(v) || v <= 0) return;
    Multiplayer.sendToHost({ type: 'place_bet', value: v, proId: Multiplayer.myId });
  },
  toppen() {
    Multiplayer.sendToHost({ type: 'toppen', myId: Multiplayer.myId });
  },
  contra() {
    Multiplayer.sendToHost({ type: 'contra', myId: Multiplayer.myId });
  },

  resolveBets() {
    const s = this.state;
    if (!s.activeBet) return "";

    const won = s.busAttempts < s.activeBet.value;
    const stake = s.activeBet.stake;
    const contraCount = s.activeBet.contraIds.length;
    const proPlayer = s.players.find(p => p.id === s.activeBet.proId) || { name: 'Unbekannt' };
    
    let report = `<div class="card" style="margin-top:20px; border:2px solid gold;">
      <h3 style="color:gold;">📊 Wett-Ergebnisse</h3>
      <p>Wette: <b>Unter ${s.activeBet.value}</b> (Tatsächlich: ${s.busAttempts})</p>
    `;

    if (won) {
      const drinkAmt = stake * contraCount;
      report += `<p style="color:var(--green);"><b>Gewonnen!</b> ${proPlayer.name} liegt richtig.</p>`;
      report += `<p>Alle Contra-Wetter müssen trinken: <b>${stake} Schlucke</b>.</p>`;
    } else {
      const drinkAmt = stake * contraCount;
      report += `<p style="color:var(--primary);"><b>Verloren!</b> ${proPlayer.name} liegt daneben.</p>`;
      report += `<p>${proPlayer.name} muss trinken: <b>${drinkAmt} Schlucke</b>.</p>`;
    }
    report += `</div>`;
    return report;
  },

  renderBusButtons(index) {
    if (index === 0) {
      return `
        <button class="btn-primary" style="background:#ff3366; color:#fff;" onclick="Busfahrer.handleBusAnswer('red')">ROT</button>
        <button class="btn-primary" style="background:#000; color:#fff; border:1px solid #333;" onclick="Busfahrer.handleBusAnswer('black')">SCHWARZ</button>
      `;
    } else if (index === 1) {
      return `
        <button class="btn-primary" onclick="Busfahrer.handleBusAnswer('higher')">HÖHER</button>
        <button class="btn-primary" onclick="Busfahrer.handleBusAnswer('lower')">NIEDRIGER</button>
      `;
    } else if (index === 2) {
      return `
        <button class="btn-primary" onclick="Busfahrer.handleBusAnswer('inside')">INNEN</button>
        <button class="btn-primary" onclick="Busfahrer.handleBusAnswer('outside')">AUSSEN</button>
      `;
    } else if (index === 3) {
      return this.suits.map(s => `
        <button class="btn-primary" style="font-size:1.5rem; padding: 10px;" onclick="Busfahrer.handleBusAnswer('${s}')">${s}</button>
      `).join('');
    }
  },

  renderGameOver() {
    const betReport = this.resolveBets();
    document.getElementById('play-content').innerHTML = `
      <div class="card" style="text-align:center; padding:30px 20px; animation: pop 0.6s both;">
        <div style="font-size:clamp(3.5rem, 20vw, 5rem); margin-bottom:20px;">🎉</div>
        <h1 style="font-family:'Abril Fatface', cursive; font-size:clamp(1.8rem, 8vw, 2.8rem); color:var(--green); line-height:1.1; margin-bottom:15px;">Fahrt beendet!</h1>
        <h2 style="margin-bottom:15px;">Der Bus wurde sicher verlassen!</h2>
        <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:20px;">Benötigte Versuche: ${this.state.busAttempts}</div>
        
        ${betReport}

        <div style="display:flex; flex-direction:column; gap:10px; margin-top:30px;">
          ${(this.state.mode !== 'online' || Multiplayer.role === 'host') ? `
            <button class="btn-primary" onclick="Busfahrer.startPassengerPhase()">Nochmal spielen 🚀</button>
            <button class="btn-primary" style="background:var(--surface2); color:var(--text);" onclick="Busfahrer.backToLobby()">🏠 Zurück zur Lobby</button>
          ` : `
            <p style="color:var(--text-muted); font-size:1.1rem; margin-bottom:10px;">Warte auf den Host...</p>
          `}
          <button class="btn-primary" style="background:var(--surface2); color:var(--text); opacity:0.8; font-size:0.9rem;" onclick="location.reload()">Spiel verlassen 👋</button>
        </div>
      </div>
    `;
  },

  returnToLobby() {
    if (Multiplayer.role === 'host') {
      Multiplayer.sendGameState({ type: 'back_to_lobby' });
      hostReturnToLobby();
    }
  },

  /* ===== ONLINE HOOKS ===== */
  renderHostSetup() {
    return this.renderOptionsHTML(true);
  },

  collectOnlineSettings() {
    return {
      difficulty: this.state.difficulty,
      schicksalTausch: this.state.schicksalTausch,
      doppeldecker: this.state.doppeldecker,
      geisterbus: this.state.geisterbus,
      timerRates: this.state.timerRates,
      betting: this.state.betting,
      cheatMode: this.state.cheatMode
    };
  },

  onOnlineGameStart(settings) {
    Object.assign(this.state, settings);
    this.state.mode = 'online';
    this.startPassengerPhase();
  },

  syncState() {
    if (Multiplayer.role === 'host') {
      // Create a clean copy for network transmission (remove circular connection objects)
      const sanitizedState = { ...this.state };
      
      const sanitizePlayer = (p) => {
        if (typeof p === 'object' && p !== null) return { id: p.id, name: p.name };
        return p;
      };

      sanitizedState.players = this.state.players.map(sanitizePlayer);
      sanitizedState.candidates = this.state.candidates.map(sanitizePlayer);
      sanitizedState.busDrivers = this.state.busDrivers.map(sanitizePlayer);

      Multiplayer.sendGameState({ type: 'sync', state: sanitizedState });
    }
  },

  backToLobby() {
    hostReturnToLobby();
  },

  handleOnlineData(data) {
    const s = this.state;
    if (data.type === 'sync') {
      if (Multiplayer.role === 'host') return; // Host ignores syncs from guests to prevent state corruption
      Object.assign(s, data.state);
      this.renderCurrentPhase();
    } else if (data.type === 'back_to_lobby') {
      if (typeof UnifiedLobby !== 'undefined') UnifiedLobby.open(this);
      else location.reload();
    } else if (Multiplayer.role === 'host') {
      if (data.type === 'passenger_answer') {
        this.handleAnswer(data.answer);
      } else if (data.type === 'bus_answer') {
        // Only process if it matches the current turn index
        if (data.turnIndex === s.currentDriverIndex) {
          this.handleBusAnswer(data.answer);
        } else {
          console.warn("Ignored out-of-sync bus answer");
          this.syncState(); // Force Resync
        }
      } else if (data.type === 'next_question') {
        this.nextQuestion();
      } else if (data.type === 'resume_bus') {
        this.resumeBusfahrt();
      } else if (data.type === 'place_bet') {
        if (!s.activeBet && s.betting) {
          s.activeBet = { proId: data.proId, value: data.value, stake: 2, contraIds: [] };
          this.syncState();
        }
      } else if (data.type === 'toppen') {
        if (s.activeBet && s.activeBet.proId !== data.myId) {
          s.activeBet.proId = data.myId;
          s.activeBet.value = Math.max(1, s.activeBet.value - 1);
          s.activeBet.stake++;
          this.syncState();
        }
      } else if (data.type === 'contra') {
        if (s.activeBet && !s.activeBet.contraIds.includes(data.myId) && s.activeBet.proId !== data.myId) {
          s.activeBet.contraIds.push(data.myId);
          this.syncState();
        }
      }
    }
  }
};
