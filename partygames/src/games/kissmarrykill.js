/* ===================================================
   Kiss Marry Kill - Logik (Off- und Online)
   Nutzt UnifiedLobby v2 für Online-Modus
=================================================== */

const KmkGame = {
  name: 'Kiss Marry Kill',
  state: {
    mode: 'offline',
    activePackages: ['Cartoon', 'Celebrities'],
    currentImages: [],
    usedImages: [],
    myAnswers: [null, null, null],

    // Online & Logic
    players: [],
    myName: '',
    round: 0,
    maxRounds: 5,
    roundTime: 30,
    resultViewMode: 'podium', // 'podium' or 'segmented'
    timeLeft: 30,
    timerInterval: null,
    submissions: 0,
    roundData: [],
    rankings: [],
    totalPlayers: 0,
    isLocked: false
  },

  /* =================================================
     MODUS-AUSWAHL
  ================================================= */
  openModeSelection() {
    this.stopTimer();
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Kiss Marry Kill 💋🔪💍';

    setHTML('play-content', `
      <div class="kmk-mode-container">
        <h2 style="text-align:center; color:#fff;">Wie willst du spielen?</h2>
        <div class="kmk-mode-btn" onclick="KmkGame.startOfflineSetup()">
          🏠 Offline spielen
          <div class="kmk-mode-desc">An einem Gerät gemeinsam diskutieren & entscheiden.</div>
        </div>
        <div class="kmk-mode-btn" onclick="UnifiedLobby.open(KmkGame)">
          🌍 Online spielen
          <div class="kmk-mode-desc">Jeder wählt heimlich, dann Gruppen-Ranking!</div>
        </div>
      </div>
    `);
  },

  /* =================================================
     OFFLINE SETUP
  ================================================= */
  startOfflineSetup() {
    this.state.mode = 'offline';
    Router.go('setup');
    document.getElementById('setup-title').textContent = 'Kiss Marry Kill - Setup';

    setHTML('setup-content', `
      <div class="card">
        <div class="card-label">📦 Wähle deine Pakete</div>
        <div class="packages-grid" id="kmk-packages-grid"></div>
      </div>
      <div id="kmk-setup-warn"></div>
      <button class="btn-primary" id="start-btn" onclick="KmkGame.startOfflineGame()">
        🚀 Spiel starten
      </button>
    `);
    this.renderPackages();
  },

  /* =================================================
     ONLINE LOBBY HOOKS (für UnifiedLobby v2)
  ================================================= */

  renderHostSetup() {
    return `
      <div class="card">
        <div class="card-label">📦 Wähle deine Pakete</div>
        <div class="packages-grid" id="kmk-packages-grid"></div>
      </div>
      <div class="card">
        <div class="card-label">📊 Auswertungs-Stil</div>
        <div class="packages-grid">
          <div class="pkg-card ${this.state.resultViewMode === 'podium' ? 'active' : ''}" 
            onclick="KmkGame.state.resultViewMode = 'podium'; UnifiedLobby._updateHostLobby();">
            <span class="pkg-check">✓</span>
            <div class="pkg-emoji">🏆</div>
            <div class="pkg-name">Community Urteil</div>
            <div class="pkg-count">Podest-Platzierung</div>
          </div>
          <div class="pkg-card ${this.state.resultViewMode === 'segmented' ? 'active' : ''}" 
            onclick="KmkGame.state.resultViewMode = 'segmented'; UnifiedLobby._updateHostLobby();">
            <span class="pkg-check">✓</span>
            <div class="pkg-emoji">📈</div>
            <div class="pkg-name">Detail Analyse</div>
            <div class="pkg-count">Prozentuale Verteilung</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-label">🔄 Rundenanzahl</div>
        <div style="display:flex; align-items:center; gap:10px;">
          <input type="range" class="styled-range" min="1" max="21" step="1" value="${this.state.maxRounds > 20 ? 21 : this.state.maxRounds}"
            style="--pct: ${(( (this.state.maxRounds > 20 ? 21 : this.state.maxRounds) - 1) / (21 - 1)) * 100}%"
            oninput="
              const val = parseInt(this.value);
              document.getElementById('kmk-rounds-val').textContent = val > 20 ? 'Endlos' : val;
              KmkGame.state.maxRounds = val > 20 ? 999 : val;
              this.style.setProperty('--pct', ((val - this.min) / (this.max - this.min)) * 100 + '%');
            ">
          <span id="kmk-rounds-val" style="font-weight:bold; width: 60px; text-align:right;">${this.state.maxRounds > 20 ? 'Endlos' : this.state.maxRounds}</span>
        </div>
      </div>
      <div class="card">
        <div class="card-label">⏱️ Abstimmzeit pro Runde (Sekunden)</div>
        <div style="display:flex; align-items:center; gap:10px;">
          <input type="range" class="styled-range" min="5" max="120" step="5" value="${this.state.roundTime}"
            style="--pct: ${((this.state.roundTime - 5) / (120 - 5)) * 100}%"
            oninput="
              document.getElementById('kmk-timer-val').textContent = this.value + 's';
              KmkGame.state.roundTime = parseInt(this.value);
              this.style.setProperty('--pct', ((this.value - this.min) / (this.max - this.min)) * 100 + '%');
            ">
          <span id="kmk-timer-val" style="font-weight:bold; width: 50px; text-align:right;">${this.state.roundTime}s</span>
        </div>
      </div>
    `;
  },

  onHostLobbyRendered() {
    this.renderPackages();
  },

  collectOnlineSettings() {
    return {
      activePackages: [...this.state.activePackages],
      roundTime: this.state.roundTime,
      maxRounds: this.state.maxRounds,
      resultViewMode: this.state.resultViewMode
    };
  },

  onOnlineGameStart(settings) {
    this.state.mode = 'online';
    this.state.activePackages = settings.activePackages || ['Cartoon', 'Celebrities'];
    this.state.roundTime = settings.roundTime || 30;
    this.state.maxRounds = settings.maxRounds || 5;
    this.state.resultViewMode = settings.resultViewMode || 'podium';
    this.state.round = 0;
    this.state.usedImages = [];

    document.getElementById('play-game-name').textContent = 'Kiss Marry Kill 💋🔪💍';
    Router.go('play');

    if (Multiplayer.role === 'host') {
      this._nextOnlineRoundHost();
    } else {
      setHTML('play-content', `
        <div class="card" style="text-align:center; padding:40px;">
          <h3>⏳ Warte auf den Host...</h3>
          <p class="muted">Gleich geht's los!</p>
        </div>
      `);
    }
  },

  handleOnlineData(data, conn) {
    if (Multiplayer.role === 'host') {
      if (data.type === 'kmk_vote') {
        this.state.submissions = (this.state.submissions || 0) + 1;
        this.state.roundData.push(data.answers);
        const statusEl = document.getElementById('kmk-online-status');
        if (statusEl) statusEl.textContent = `Warte auf Spieler... (${this.state.submissions}/${this.state.totalPlayers})`;
        if (this.state.submissions >= this.state.totalPlayers) {
          this._evaluateAndBroadcast();
        }
      }
    } else {
      if (data.type === 'kmk_turn') {
        this.state.currentImages = data.images;
        this.state.round = data.round;
        this.state.maxRounds = data.maxRounds || 5;
        this.state.myAnswers = [null, null, null];
        this.state.roundTime = data.roundTime || 30;
        this.state.isLocked = false;
        this.renderPlayArea();
        this.startTimer();
      } else if (data.type === 'kmk_results') {
        this.stopTimer();
        this.state.rankings = data.rankings;
        this._showResultBars();
      } else if (data.type === 'kmk_end') {
        this.renderGameOver();
      }
    }
  },

  /* =================================================
     TIMER LOGIC
  ================================================= */
  startTimer() {
    this.stopTimer();
    this.state.timeLeft = this.state.roundTime;
    const updateUI = () => {
      const bar = document.getElementById('kmk-timer-bar');
      const text = document.getElementById('kmk-timer-text');
      if (bar) bar.style.width = (this.state.timeLeft / this.state.roundTime) * 100 + '%';
      if (text) text.textContent = Math.ceil(this.state.timeLeft) + 's';
    };
    updateUI();

    this.state.timerInterval = setInterval(() => {
      this.state.timeLeft -= 1;
      updateUI();
      if (this.state.timeLeft <= 0) {
        this.stopTimer();
        if (!this.state.isLocked) this._lockOnlineAnswers();
      }
    }, 1000);
  },

  stopTimer() {
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);
    this.state.timerInterval = null;
  },

  /* =================================================
     LOGIC & UI
  ================================================= */
  renderPackages() {
    const pkgGrid = document.getElementById('kmk-packages-grid');
    if (!pkgGrid) return;
    const available = ['Cartoon', 'Celebrities'];
    let html = '';
    available.forEach(pkg => {
      const isActive = this.state.activePackages.includes(pkg);
      let count = (typeof KMK_DATA !== 'undefined' && KMK_DATA[pkg]) ? KMK_DATA[pkg].length : 0;
      html += `
        <div class="pkg-card ${isActive ? 'active' : ''}" onclick="KmkGame.togglePackage('${pkg}')">
          <span class="pkg-check">✓</span>
          <div class="pkg-emoji">${pkg === 'Cartoon' ? '🧜‍♀️' : '🌟'}</div>
          <div class="pkg-name">${pkg}</div>
          <div class="pkg-count">${count} Bilder</div>
        </div>
      `;
    });
    setHTML('kmk-packages-grid', html);
    const btn = document.getElementById('start-btn');
    if (btn) btn.disabled = this.state.activePackages.length === 0;
  },

  togglePackage(pkg) {
    const idx = this.state.activePackages.indexOf(pkg);
    if (idx > -1) {
      if (this.state.activePackages.length > 1) this.state.activePackages.splice(idx, 1);
    } else {
      this.state.activePackages.push(pkg);
    }
    this.renderPackages();
  },

  startOfflineGame() {
    Router.go('play');
    document.getElementById('play-game-name').textContent = 'Kiss Marry Kill 💋🔪💍';
    this.nextOfflineRound();
  },

  generateRandomImages() {
    if (typeof KMK_DATA === 'undefined') return null;
    let pool = [];
    this.state.activePackages.forEach(pkg => {
      if (KMK_DATA[pkg]) KMK_DATA[pkg].forEach(f => pool.push({ category: pkg, file: f }));
    });
    if (pool.length < 3) return null;
    let availablePool = pool.filter(item => !this.state.usedImages.includes(item.category + '/' + item.file));
    if (availablePool.length < 3) {
      this.state.usedImages = [];
      availablePool = pool;
    }
    let selected = [];
    for (let i = 0; i < 3; i++) {
      let rIndex = Math.floor(Math.random() * availablePool.length);
      selected.push(availablePool[rIndex]);
      this.state.usedImages.push(availablePool[rIndex].category + '/' + availablePool[rIndex].file);
      availablePool.splice(rIndex, 1);
    }
    return selected;
  },

  nextOfflineRound() {
    const imgs = this.generateRandomImages();
    if (!imgs) return setHTML('play-content', '<div style="color:white; text-align:center;">Nicht genug Bilder verfügbar!</div>');
    this.state.currentImages = imgs;
    this.state.myAnswers = [null, null, null];
    this.renderPlayArea();
  },

  _nextOnlineRoundHost() {
    if (Multiplayer.role !== 'host') return;
    if (this.state.round >= this.state.maxRounds) {
      this.broadcastEnd();
      this.renderGameOver();
      return;
    }
    this.state.round++;
    this.state.submissions = 0;
    this.state.roundData = [];
    this.state.totalPlayers = this.state.players.length;
    this.state.isLocked = false;
    const imgs = this.generateRandomImages();
    if (!imgs) return alert('Fehler: Keine Bilder verfügbar!');
    this.state.currentImages = imgs;
    Multiplayer.sendGameState({
      type: 'kmk_turn',
      images: imgs,
      round: this.state.round,
      maxRounds: this.state.maxRounds,
      roundTime: this.state.roundTime
    });
    this.state.myAnswers = [null, null, null];
    this.renderPlayArea();
    this.startTimer();
  },

  formatName(filename) {
    return filename
      .replace(/\.webp|\.png|\.jpg|\.jpeg/gi, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  },

  renderPlayArea() {
    const images = this.state.currentImages;
    let html = '';

    if (this.state.mode === 'online') {
      html += `
        <div class="kmk-timer-text" id="kmk-timer-text">${this.state.roundTime}s</div>
        <div class="kmk-timer-container"><div class="kmk-timer-bar" id="kmk-timer-bar"></div></div>
        <div style="text-align:center; color:var(--text-muted); margin-bottom:15px; font-weight:bold;">
          Runde ${this.state.round} ${this.state.maxRounds > 20 ? '' : `von ${this.state.maxRounds}`}
        </div>
      `;
    }

    html += '<div class="kmk-play-container">';
    images.forEach((imgObj, i) => {
      let pathStr = 'Pictures/' + imgObj.category + '/' + imgObj.file;
      let nameStr = this.formatName(imgObj.file);
      html += `
        <div class="kmk-card">
          <div class="kmk-name">${nameStr}</div>
          <div class="kmk-image-wrapper">
             <img src="${pathStr}" class="kmk-image-blur-bg" />
             <img src="${pathStr}" class="kmk-image" alt="${nameStr}" />
          </div>
          <div class="kmk-actions" id="kmk-actions-${i}">
            <button class="kmk-btn btn-kiss" onclick="KmkGame.setChoice(${i}, 'kiss')">💋</button>
            <button class="kmk-btn btn-marry" onclick="KmkGame.setChoice(${i}, 'marry')">💍</button>
            <button class="kmk-btn btn-kill" onclick="KmkGame.setChoice(${i}, 'kill')">🔪</button>
          </div>
          <div id="kmk-results-${i}" class="kmk-results" style="display:none;"></div>
        </div>
      `;
    });
    html += '</div><div id="kmk-next-wrapper" style="text-align:center; margin-top:20px;"></div>';
    
    if (Multiplayer.role === 'host') {
      html += `
        <div style="text-align:center; margin-top:15px;">
          <button class="btn-primary" style="background:var(--surface2); color:var(--text); width:auto; font-size:0.8rem; padding:8px 20px;" onclick="hostReturnToLobby()">🏠 Lobby</button>
        </div>
      `;
    }

    setHTML('play-content', html);
    this.updateButtons();
  },

  setChoice(personIndex, choiceStr) {
    if (this.state.isLocked) return;
    for (let i = 0; i < 3; i++) {
        if (this.state.myAnswers[i] === choiceStr && i !== personIndex) this.state.myAnswers[i] = null;
    }
    if (this.state.myAnswers[personIndex] === choiceStr) this.state.myAnswers[personIndex] = null;
    else this.state.myAnswers[personIndex] = choiceStr;
    this.updateButtons();
  },

  updateButtons() {
    let allAssigned = true;
    for (let i = 0; i < 3; i++) {
      let selected = this.state.myAnswers[i];
      if (!selected) allAssigned = false;
      let btns = document.getElementById('kmk-actions-' + i);
      if (!btns) continue;
      let btnK = btns.querySelector('.btn-kiss');
      let btnM = btns.querySelector('.btn-marry');
      let btnL = btns.querySelector('.btn-kill');
      btnK.className = 'kmk-btn btn-kiss' + (selected === 'kiss' ? ' active-kiss' : (this.state.myAnswers.includes('kiss') ? ' taken' : ''));
      btnM.className = 'kmk-btn btn-marry' + (selected === 'marry' ? ' active-marry' : (this.state.myAnswers.includes('marry') ? ' taken' : ''));
      btnL.className = 'kmk-btn btn-kill' + (selected === 'kill' ? ' active-kill' : (this.state.myAnswers.includes('kill') ? ' taken' : ''));
    }
    if (allAssigned) {
      if (this.state.mode === 'offline') {
        setHTML('kmk-next-wrapper', '<button class="btn-next" style="width: 200px;" onclick="KmkGame.nextOfflineRound()">Nächste Runde ➡️</button>');
      } else if (!this.state.isLocked) {
        setHTML('kmk-next-wrapper', '<button class="btn-next" style="width: 200px;" onclick="KmkGame._lockOnlineAnswers()">Antworten absenden 🚀</button>');
      }
    } else {
      setHTML('kmk-next-wrapper', '');
    }
  },

  _lockOnlineAnswers() {
    this.state.isLocked = true;
    this.stopTimer();
    const ansMap = { 0: this.state.myAnswers[0], 1: this.state.myAnswers[1], 2: this.state.myAnswers[2] };
    for (let i = 0; i < 3; i++) {
      var el = document.getElementById('kmk-actions-' + i);
      if (el) { el.style.pointerEvents = 'none'; el.style.opacity = '0.5'; }
    }
    setHTML('kmk-next-wrapper', '<div style="font-weight:bold; color:var(--primary);" id="kmk-online-status">Warte auf andere Spieler...</div>');
    if (Multiplayer.role === 'host') {
      this.state.submissions = (this.state.submissions || 0) + 1;
      this.state.roundData.push(ansMap);
      const statusEl = document.getElementById('kmk-online-status');
      if (statusEl) statusEl.textContent = `Warte auf Spieler... (${this.state.submissions}/${this.state.totalPlayers})`;
      if (this.state.submissions >= this.state.totalPlayers) this._evaluateAndBroadcast();
    } else {
      Multiplayer.sendToHost({ type: 'kmk_vote', answers: ansMap });
    }
  },

  _evaluateAndBroadcast() {
    const total = this.state.roundData.length;
    let rankings = [];
    for (let i = 0; i < 3; i++) {
      let counts = { kiss: 0, marry: 0, kill: 0 };
      this.state.roundData.forEach(ans => { if (ans[i]) counts[ans[i]]++; });
      rankings.push({
        kiss: Math.round((counts.kiss / total) * 100) || 0,
        marry: Math.round((counts.marry / total) * 100) || 0,
        kill: Math.round((counts.kill / total) * 100) || 0
      });
    }
    this.state.rankings = rankings;
    Multiplayer.sendGameState({ type: 'kmk_results', rankings: rankings });
    this._showResultBars();
  },

  _showResultBars() {
    this.stopTimer();
    const rankings = this.state.rankings;
    const images = this.state.currentImages;

    let html = `
      <div style="text-align:center; margin-bottom: 20px;">
        <div style="font-weight:bold; color:var(--text-muted); margin-bottom: 5px;">Runde ${this.state.round} ${this.state.maxRounds > 20 ? '' : `von ${this.state.maxRounds}`}</div>
        <h2 style="color:var(--primary); font-size: 2rem;">Das Community-Urteil</h2>
      </div>
      <div class="kmk-podium-container">
    `;

    if (this.state.resultViewMode === 'segmented') {
      // MODE 2: SEGMENTED BARS (Specific Analysis)
      images.forEach((imgObj, i) => {
        const pathStr = 'Pictures/' + imgObj.category + '/' + imgObj.file;
        const nameStr = this.formatName(imgObj.file);
        const data = rankings[i];
        
        html += `
          <div class="kmk-podium-slot">
            <div class="kmk-podium-winner-name">${nameStr}</div>
            <div class="kmk-podium-winner-pct">Einzelauswertung</div>
            <div class="kmk-podium-winner-img-wrapper">
               <img src="${pathStr}" class="kmk-podium-winner-img" />
            </div>
            <div class="kmk-segmented-bar">
               <div class="kmk-segment marry" style="height: ${data.marry}%">${data.marry > 15 ? '💍 ' + data.marry + '%' : ''}</div>
               <div class="kmk-segment kiss" style="height: ${data.kiss}%">${data.kiss > 15 ? '💋 ' + data.kiss + '%' : ''}</div>
               <div class="kmk-segment kill" style="height: ${data.kill}%">${data.kill > 15 ? '🔪 ' + data.kill + '%' : ''}</div>
            </div>
          </div>
        `;
      });
    } else {
      // MODE 1: PODIUM (Winner Priority)
      let availableIndices = [0, 1, 2];
      let winners = { marry: -1, kiss: -1, kill: -1 };
      winners.marry = availableIndices.reduce((prev, curr) => rankings[curr].marry > rankings[prev].marry ? curr : prev);
      availableIndices = availableIndices.filter(i => i !== winners.marry);
      winners.kiss = availableIndices.reduce((prev, curr) => rankings[curr].kiss > rankings[prev].kiss ? curr : prev);
      availableIndices = availableIndices.filter(i => i !== winners.kiss);
      winners.kill = availableIndices[0];

      const getWinnerHTML = (idx, type, label, emoji) => {
        const imgObj = images[idx];
        const pathStr = 'Pictures/' + imgObj.category + '/' + imgObj.file;
        const nameStr = this.formatName(imgObj.file);
        const pct = rankings[idx][type];
        return `
          <div class="kmk-podium-slot ${type}">
            <div class="kmk-podium-winner-name">${nameStr}</div>
            <div class="kmk-podium-winner-pct">${pct}% Zustimmung</div>
            <div class="kmk-podium-winner-img-wrapper">
               <img src="${pathStr}" class="kmk-podium-winner-img" />
            </div>
            <div class="kmk-podium-bar">
              <span class="kmk-podium-label">${label}</span>
              <span class="kmk-podium-emoji">${emoji}</span>
            </div>
          </div>
        `;
      };
      html += getWinnerHTML(winners.kiss, 'kiss', 'Kiss', '💋');
      html += getWinnerHTML(winners.marry, 'marry', 'Marry', '💍');
      html += getWinnerHTML(winners.kill, 'kill', 'Kill', '🔪');
    }

    html += `</div><div id="kmk-podium-actions" style="text-align:center; margin-top:30px;">`;

    if (Multiplayer.role === 'host') {
      const isEnd = this.state.round >= this.state.maxRounds;
      const btnText = isEnd ? 'Finales Ergebnis 📊' : 'Nächste Runde starten ➡️';
      html += `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
          <button class="btn-next" style="width: 280px;" onclick="KmkGame._nextOnlineRoundHost()">${btnText}</button>
          <button class="btn-primary" style="background:var(--surface2); color:var(--text); width:280px;" onclick="hostReturnToLobby()">🏠 Zurück zur Lobby</button>
        </div>
      `;
      if (this.state.maxRounds > 20) {
        html += `<br><button class="btn-secondary" style="width: 280px; border-color:var(--danger); color:var(--danger);" onclick="KmkGame.broadcastEnd(); KmkGame.renderGameOver();">Spiel beenden 🛑</button>`;
      }
    } else {
      html += '<div style="font-weight:bold; color:var(--text-muted);">Warte auf den Host...</div>';
    }

    html += '</div>';
    setHTML('play-content', html);
  },

  broadcastEnd() {
    Multiplayer.sendGameState({ type: 'kmk_end' });
  },

  renderGameOver() {
    this.stopTimer();
    setHTML('play-content', `
      <div class="card kmk-game-over">
        <h1 style="color:var(--primary); font-size: 2.5rem;">Spiel Beendet!</h1>
        <p class="muted">Alle Runden wurden gespielt.</p>
        <div class="kmk-final-stats">
          <h3>Danke fürs Mitspielen!</h3>
          <p>Hoffentlich haben alle überlebt... 🔪</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${Multiplayer.role === 'host' ? `
            <button class="btn-primary" onclick="KmkGame.onOnlineGameStart(KmkGame.collectOnlineSettings())">Nochmal spielen 🔄</button>
          ` : ''}
          <button class="btn-primary" style="${Multiplayer.role === 'host' ? 'background:var(--surface2); color:var(--text);' : ''}" onclick="KmkGame.returnToLobby()">Lobby 🏠</button>
          <button class="btn-secondary" onclick="Router.go('home')">Hauptmenü 🚪</button>
        </div>
      </div>
    `);
  },

  returnToLobby() {
    this.stopTimer();
    hostReturnToLobby();
  },

  _updateHostLobby() {
    if (typeof UnifiedLobby !== 'undefined') {
      UnifiedLobby._updateHostLobby();
    }
  }
};
