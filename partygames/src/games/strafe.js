const StrafenPackages = [
  /* ────────────────────────────────────────────────
     PAKET 1: KLASSIKER
  ──────────────────────────────────────────────── */
  {
    id: 'classic',
    name: 'Klassiker',
    emoji: '🍺',
    description: 'Die bewährten Partyklassiker',
    tasks: [
      // — MAJORITY —
      { type: 'majority', question: 'Was gibt es häufiger im Raum: Bier- oder Weinliebhaber?', options: ['🍺 Bier', '🍷 Wein'] },
      { type: 'majority', question: 'Was hört ihr lieber: Pop oder Hip-Hop?', options: ['🎵 Pop', '🎤 Hip-Hop'] },
      { type: 'majority', question: 'Was ist besser: Netflix-Abend oder Kinobesuch?', options: ['📺 Netflix', '🎬 Kino'] },
      { type: 'majority', question: 'Sommer oder Winter?', options: ['☀️ Sommer', '❄️ Winter'] },
      { type: 'majority', question: 'Hund oder Katze?', options: ['🐶 Hund', '🐱 Katze'] },
      { type: 'majority', question: 'Frühaufsteher oder Langschläfer?', options: ['🌅 Frühaufsteher', '😴 Langschläfer'] },
      { type: 'majority', question: 'Stadt oder Land wohnen?', options: ['🏙️ Stadt', '🌾 Land'] },

      // — DUEL —
      { type: 'duel', text: '⚔️ Duell! {p1} gegen {p2} – wer kennt mehr Hauptstädte? 30 Sekunden abwechselnd nennen. Wer zuerst stoppt: {penalty} Strafen!' },
      { type: 'duel', text: '⚔️ {p1} vs. {p2}: Daumen drücken – wer aufgibt: {penalty} Strafen!' },
      { type: 'duel', text: '⚔️ Schere, Stein, Papier – Best of 3! {p1} vs. {p2}. Verlierer: {penalty} Strafen!' },
      { type: 'duel', text: '⚔️ {p1} und {p2}: Wer hält länger auf einem Bein? Verlierer: {penalty} Strafen!' },
      { type: 'duel', text: '⚔️ Speed-Battle! {p1} vs. {p2}: 5 Länder mit gleichem Anfangsbuchstaben – wer zuerst nicht mehr weiterkommt: {penalty} Strafen!' },

      // — GROUP —
      { type: 'group', text: '👥 Alle, die gerade Socken tragen: {penalty} Strafen!' },
      { type: 'group', text: '👥 Alle, die heute ihr Handy schon mehr als 5× gecheckt haben: {penalty} Strafen!' },
      { type: 'group', text: '👥 Alle, die gerade schwarz tragen: {penalty} Strafen!' },
      { type: 'group', text: '👥 Alle, die schon mal auf einer Party eingeschlafen sind: {penalty} Strafen!' },
      { type: 'group', text: '👥 Alle, die ein Tattoo haben: {penalty} Strafen!' },
      { type: 'group', text: '👥 Alle, die jünger als 25 sind: {penalty} Strafen!' },
      { type: 'group', text: '👥 Alle, die einen Führerschein haben: {penalty} Strafen!' },
      { type: 'group', text: '👥 Alle, die gerade Schmuck tragen: {penalty} Strafen!' },

      // — SINGLE —
      { type: 'single', text: '🎯 {p1} macht {penalty} Liegestütze – die Gruppe zählt laut mit!' },
      { type: 'single', text: '🎯 {p1} muss einen Witz erzählen. Lacht niemand: {penalty} Strafen!' },
      { type: 'single', text: '🎯 {p1} macht {penalty} Kniebeugen.' },
      { type: 'single', text: '🎯 {p1} zeigt sein Handy-Hintergrundbild. Für jede Reaktion im Raum: +1 Strafe!' },
      { type: 'single', text: '🎯 {p1} hält 45 Sekunden Planke – schafft er/sie es nicht: {penalty} Strafen!' },
      { type: 'single', text: '🎯 {p1} imitiert eine Berühmtheit. Rät die Gruppe falsch: {penalty} Strafen für alle!' },
      { type: 'single', text: '🎯 {p1} sagt 5× schnell: „Blaukraut bleibt Blaukraut". Klappt\'s nicht: {penalty} Strafen!' },

      // — MULTI —
      { type: 'multi', count: 2, text: '🎲 {p1} und {p2}: Wer als Erstes 10 Kniebeugen fertig hat, verteilt {penalty} Strafen an wen er will!' },
      { type: 'multi', count: 2, text: '🎲 Augenkontakt-Contest! {p1} vs. {p2} – wer zuerst wegschaut: {penalty} Strafen!' },
      { type: 'multi', count: 3, text: '🎲 {players} – wer als Letztes die Hand hebt, bekommt {penalty} Strafen!' },
    ]
  },

  /* ────────────────────────────────────────────────
     PAKET 2: WÜRZIG 🌶️
  ──────────────────────────────────────────────── */
  {
    id: 'spicy',
    name: 'Würzig',
    emoji: '🌶️',
    description: 'Freche Fragen & mutige Aufgaben',
    tasks: [
      { type: 'majority', question: 'Was ist peinlicher: falsch singen oder falsch tanzen?', options: ['🎵 Falsch singen', '💃 Falsch tanzen'] },
      { type: 'majority', question: 'Was ist schlimmer: Ghosted werden oder zu viel Drama?', options: ['👻 Ghosting', '🎭 Zu viel Drama'] },
      { type: 'majority', question: 'Würdet ihr eher: immer die Wahrheit sagen oder sanft lügen können?', options: ['😇 Immer Wahrheit', '🤫 Sanft lügen'] },

      { type: 'group', text: '🌶️ Alle, die gerade einen Crush haben: {penalty} Strafen!' },
      { type: 'group', text: '🌶️ Alle, die schon mal jemanden ge-ghostet haben: {penalty} Strafen!' },
      { type: 'group', text: '🌶️ Alle, die schon mal ein Date über soziale Medien hatten: {penalty} Strafen!' },
      { type: 'group', text: '🌶️ Alle, die bei einem Liebesfilm geweint haben: {penalty} Strafen!' },

      { type: 'single', text: '🔥 {p1} zeigt das peinlichste Foto aus der Galerie. Gruppe bewertet 1–10 – für jeden Punkt unter 5: 1 extra Strafe!' },
      { type: 'single', text: '🔥 {p1} schreibt einer Person, mit der er/sie länger nicht gesprochen hat, eine Nachricht. Keine Nachricht = {penalty} Strafen!' },
      { type: 'single', text: '🔥 {p1} macht {penalty} Strafen ODER verrät seinen letzten Google-Suchbegriff!' },
      { type: 'single', text: '🔥 {p1} muss seinen Handybildschirm 10 Sekunden zeigen. Für jede Benachrichtigung: 1 Strafe!' },

      { type: 'duel', text: '🔥 {p1} vs. {p2}: Staring Contest – wer zuerst blinzelt: {penalty} Strafen!' },
      { type: 'duel', text: '🔥 {p1} und {p2}: Wer traut sich, der ganzen Gruppe ein Geheimnis zu verraten? Wer zuerst redet, ist frei – der andere: {penalty} Strafen!' },
    ]
  },

  /* ────────────────────────────────────────────────
     PAKET 3: WISSEN 🧠
  ──────────────────────────────────────────────── */
  {
    id: 'wissen',
    name: 'Wissen',
    emoji: '🧠',
    description: 'Trivia & Denkaufgaben',
    tasks: [
      // Fun fact: Berlin (52.5°N) liegt nördlicher als London (51.5°N)
      { type: 'majority', question: 'Was liegt weiter nördlich: Berlin oder London?', options: ['🇩🇪 Berlin', '🇬🇧 London'] },
      // Europa (~10,5 Mio km²) ist größer als Australien (~7,7 Mio km²)
      { type: 'majority', question: 'Ist Australien größer als Europa?', options: ['✅ Ja', '❌ Nein'] },
      // Haie können Tausende Zähne haben
      { type: 'majority', question: 'Hat ein Hai mehr Zähne als ein Mensch (32)?', options: ['✅ Ja', '❌ Nein'] },

      { type: 'single', text: '🧠 {p1}: Wie viele Knochen hat ein erwachsener Mensch? (Antwort: 206). Falsch: {penalty} Strafen!' },
      { type: 'single', text: '🧠 {p1}: In welchem Jahr fiel die Berliner Mauer? (1989). Falsch: {penalty} Strafen!' },
      { type: 'single', text: '🧠 {p1}: Was ist die Hauptstadt Australiens – Sydney oder Canberra? (Canberra). Falsch: {penalty} Strafen!' },
      { type: 'single', text: '🧠 {p1}: Wie viele Spieler hat eine Fußball-Mannschaft auf dem Feld? (11). Falsch: {penalty} Strafen!' },
      { type: 'single', text: '🧠 {p1}: Welches Tier hat das größte Herz auf der Welt? (Blauwal). Falsch: {penalty} Strafen!' },

      { type: 'duel', text: '🧠 Hauptstädte-Battle! {p1} vs. {p2}: Abwechselnd Hauptstädte nennen – keine Wiederholungen. Wer zuerst stoppt: {penalty} Strafen!' },
      { type: 'duel', text: '🧠 {p1} vs. {p2}: Wer kann mehr EU-Länder in 45 Sekunden nennen? Wer weniger nennt: {penalty} Strafen!' },

      { type: 'group', text: '🧠 Alle, die glauben, dass China das bevölkerungsreichste Land der Welt ist (Stand 2023: Indien hat überholt!) – hebt die Hand! Alle mit Hand: {penalty} Strafen!' },
    ]
  }

  /* ────────────────────────────────────────────────
     ↓↓↓ NEUES PAKET HIER HINZUFÜGEN ↓↓↓

  ,{
    id: 'mein-paket',
    name: 'Mein Paket',
    emoji: '🎉',
    description: 'Kurze Beschreibung',
    tasks: [
      { type: 'single', text: '🎯 {p1} muss {penalty} Strafen machen!' },
      // ...weitere Tasks
    ]
  }
  ──────────────────────────────────────────────── */
];


/* ===================================================
   ===================================================
   STRAFE GAME — LOGIC LAYER
   ===================================================
=================================================== */

const StrafenGame = {

  /* ---------- STATE ---------- */
  state: {
    players: ['Anna', 'Bert', 'Clara', 'David'],
    maxPenalty: 5,
    activePackageIds: ['classic'],
    taskPool: [],
    taskIndex: 0,
    currentTask: null,
    majorityVotes: [0, 0],
  },

  /* =================================================
     SETUP – Einstellungs-UI
  ================================================= */

  renderSetup() {
    document.getElementById('setup-title').textContent = 'Strafe – Setup';
    const s = this.state;

    document.getElementById('setup-content').innerHTML = `

      <!-- SPIELER -->
      <div class="card">
        <div class="card-label">👥 Spieler</div>
        <div class="players-list" id="players-list"></div>
        <button class="btn-add" onclick="StrafenGame.addPlayer()">＋ Spieler hinzufügen</button>
      </div>

      <!-- PAKETE -->
      <div class="card">
        <div class="card-label">📦 Inhaltspakete</div>
        <div class="packages-grid" id="packages-grid"></div>
      </div>

      <!-- MAXIMALE STRAFE -->
      <div class="card">
        <div class="card-label">⚡ Maximale Strafe</div>
        <div class="penalty-big" id="penalty-display">${s.maxPenalty}</div>
        <div class="penalty-unit">max. Strafen pro Aufgabe</div>
        <input
          type="range"
          class="styled-range"
          id="penalty-range"
          min="1" max="20"
          value="${s.maxPenalty}"
          oninput="StrafenGame.onPenaltyInput(this)"
        >
      </div>

      <!-- VALIDIERUNGSHINWEIS -->
      <div id="setup-warn"></div>

      <button class="btn-primary" id="start-btn" onclick="StrafenGame.start()">
        🚀 Spiel starten
      </button>
    `;

    this.renderPlayerList();
    this.renderPackages();
    this.syncRangeStyle(document.getElementById('penalty-range'));
    this.validateStart();
  },

  /* Spielerliste rendern */
  renderPlayerList() {
    const { players } = this.state;
    setHTML('players-list', players.map((name, i) => `
      <div class="player-row">
        <div class="player-avatar">${i + 1}</div>
        <input
          class="player-input"
          type="text"
          value="${name}"
          placeholder="Spieler ${i + 1}"
          oninput="StrafenGame.setPlayerName(${i}, this.value)"
        >
        ${players.length > 2
          ? `<button class="btn-icon" title="Entfernen" onclick="StrafenGame.removePlayer(${i})">✕</button>`
          : ''}
      </div>
    `).join(''));
  },

  /* Pakete rendern */
  renderPackages() {
    const { activePackageIds } = this.state;
    setHTML('packages-grid', StrafenPackages.map(pkg => `
      <div
        class="pkg-card ${activePackageIds.includes(pkg.id) ? 'active' : ''}"
        onclick="StrafenGame.togglePackage('${pkg.id}')"
      >
        <span class="pkg-check">✓</span>
        <div class="pkg-emoji">${pkg.emoji}</div>
        <div class="pkg-name">${pkg.name}</div>
        <div class="pkg-count">${pkg.tasks.length} Aufgaben</div>
      </div>
    `).join(''));
  },

  /* Spieler hinzufügen */
  addPlayer() {
    if (this.state.players.length >= 12) return;
    this.state.players.push(`Spieler ${this.state.players.length + 1}`);
    this.renderPlayerList();
    this.validateStart();
  },

  /* Spieler entfernen */
  removePlayer(index) {
    if (this.state.players.length <= 2) return;
    this.state.players.splice(index, 1);
    this.renderPlayerList();
    this.validateStart();
  },

  /* Spielername setzen */
  setPlayerName(index, value) {
    this.state.players[index] = value;
    this.validateStart();
  },

  /* Paket aktivieren / deaktivieren */
  togglePackage(id) {
    const ids = this.state.activePackageIds;
    const idx = ids.indexOf(id);
    if (idx > -1) {
      if (ids.length === 1) return; // Mindestens 1 Paket muss aktiv sein
      ids.splice(idx, 1);
    } else {
      ids.push(id);
    }
    this.renderPackages();
    this.validateStart();
  },

  /* Slider-Event */
  onPenaltyInput(range) {
    this.state.maxPenalty = parseInt(range.value);
    const el = document.getElementById('penalty-display');
    if (el) { el.textContent = range.value; restartAnimation(el); }
    this.syncRangeStyle(range);
  },

  /* Slider-Füllfarbe synchronisieren */
  syncRangeStyle(range) {
    if (!range) return;
    const pct = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty('--pct', pct + '%');
  },

  /* Start-Button freigeben / sperren */
  validateStart() {
    const btn  = document.getElementById('start-btn');
    const warn = document.getElementById('setup-warn');
    const validPlayers  = this.state.players.filter(p => p.trim()).length >= 2;
    const validPackages = this.state.activePackageIds.length > 0;
    const ok = validPlayers && validPackages;

    if (btn)  btn.disabled = !ok;
    if (warn) {
      warn.innerHTML = !ok
        ? `<div class="warn-badge">⚠️ ${!validPlayers ? 'Mindestens 2 Spieler mit Namen erforderlich.' : 'Mindestens 1 Paket muss ausgewählt sein.'}</div>`
        : '';
    }
  },

  /* =================================================
     GAME LOGIC – Task-System
  ================================================= */

  /** Alle Tasks der aktiven Pakete zusammenführen & mischen */
  buildTaskPool() {
    let pool = [];
    for (const pkg of StrafenPackages) {
      if (this.state.activePackageIds.includes(pkg.id)) {
        pool.push(...pkg.tasks);
      }
    }
    this.state.taskPool  = shuffle(pool);
    this.state.taskIndex = 0;
  },

  /** Nächsten Task holen; bei Erschöpfung neu mischen */
  getNextTask() {
    if (this.state.taskIndex >= this.state.taskPool.length) {
      this.state.taskPool  = shuffle(this.state.taskPool);
      this.state.taskIndex = 0;
    }
    return this.state.taskPool[this.state.taskIndex++];
  },

  /** n Spieler zufällig auswählen (ohne leere Namen) */
  getRandomPlayers(n) {
    const valid = this.state.players.filter(p => p.trim());
    return sample(valid, Math.min(n, valid.length));
  },

  /**
   * Platzhalter im Task-Text ersetzen:
   * {p1} {p2} {p3}  → Spielernamen (farbig)
   * {players}       → Kommagetrennte Liste aller gewählten Spieler
   * {penalty}       → Animierte Strafen-Pill
   */
  resolveText(text, players, penalty) {
    // Hilfsfunktion für farbige Spielernamen
    const hi = (name, cls = 'hi') => `<span class="${cls}">${name}</span>`;
    const pill = `<span class="penalty-pill">${penalty}</span>`;

    const clsMap = ['hi', 'hi2', 'hi3'];

    return text
      .replace(/\{p1\}/g,      hi(players[0] || '?', clsMap[0]))
      .replace(/\{p2\}/g,      hi(players[1] || '?', clsMap[1]))
      .replace(/\{p3\}/g,      hi(players[2] || '?', clsMap[2]))
      .replace(/\{players\}/g, players.map((p, i) => hi(p, clsMap[i % 3])).join(', '))
      .replace(/\{penalty\}/g, pill);
  },

  /* =================================================
     GAME FLOW – Start & Navigation
  ================================================= */

  start() {
    this.buildTaskPool();
    document.getElementById('play-game-name').textContent = 'Strafe ⚡';
    Router.go('play');
    this.showNextTask();
  },

  showNextTask() {
    const task    = this.getNextTask();
    this.state.currentTask      = task;
    this.state.majorityVotes    = [0, 0];
    const penalty = randomInt(1, this.state.maxPenalty);

    let html = '';

    switch (task.type) {
      case 'majority':
        html = this.buildMajorityHTML(task, penalty);
        break;
      case 'duel':
        html = this.buildStandardHTML(task, penalty, '⚔️ Duell', 'type-duel');
        break;
      case 'group':
        html = this.buildStandardHTML(task, penalty, '👥 Gruppenaufgabe', 'type-group');
        break;
      case 'single':
        html = this.buildStandardHTML(task, penalty, '🎯 Einzelaufgabe', 'type-single');
        break;
      case 'multi':
        html = this.buildStandardHTML(task, penalty, '🎲 Teamaufgabe', 'type-multi');
        break;
      default:
        html = this.buildStandardHTML(task, penalty, '🃏 Aufgabe', '');
    }

    const content = setHTML('play-content', html);
    // Task-Card-Animation neu starten
    if (content) restartAnimation(content.querySelector('.task-card'));
  },

  /* =================================================
     HTML BUILDER – Standard Task
  ================================================= */

  buildStandardHTML(task, penalty, badgeLabel, typeClass) {
    const count   = task.count || 2;
    const players = this.getRandomPlayers(count);
    const text    = this.resolveText(task.text, players, penalty);

    return `
      <div class="task-card ${typeClass}">
        <div class="task-badge">${badgeLabel}</div>
        <div class="task-text">${text}</div>
      </div>
      <button class="btn-next" onclick="StrafenGame.showNextTask()">
        Nächste Aufgabe &nbsp;→
      </button>
    `;
  },

  /* =================================================
     HTML BUILDER – Majority (Abstimmung)
  ================================================= */

  buildMajorityHTML(task, penalty) {
    return `
      <div class="task-card type-majority">
        <div class="task-badge">🗳️ Mehrheitsfrage</div>
        <div class="majority-q">${task.question}</div>

        <div class="vote-row">
          <div class="vote-opt" id="vopt-0">
            <div class="vote-label">${task.options[0]}</div>
            <div class="vote-num"  id="vnum-0">0</div>
            <div class="vote-btns">
              <button class="btn-minus" onclick="StrafenGame.vote(0, -1)">−</button>
              <button class="btn-plus"  onclick="StrafenGame.vote(0,  1)">＋</button>
            </div>
          </div>
          <div class="vote-opt" id="vopt-1">
            <div class="vote-label">${task.options[1]}</div>
            <div class="vote-num"  id="vnum-1">0</div>
            <div class="vote-btns">
              <button class="btn-minus" onclick="StrafenGame.vote(1, -1)">−</button>
              <button class="btn-plus"  onclick="StrafenGame.vote(1,  1)">＋</button>
            </div>
          </div>
        </div>

        <p class="vote-hint">Tippt ＋ für jeden Spieler der sich entscheidet</p>

        <button class="btn-eval" id="btn-eval" onclick="StrafenGame.evaluateMajority(${penalty})">
          ⚖️ Auswerten
        </button>

        <div id="majority-result"></div>
      </div>

      <div id="next-wrapper"></div>
    `;
  },

  /* Stimme hinzufügen / abziehen */
  vote(optIdx, delta) {
    this.state.majorityVotes[optIdx] =
      Math.max(0, this.state.majorityVotes[optIdx] + delta);

    const numEl  = document.getElementById(`vnum-${optIdx}`);
    const optEl  = document.getElementById(`vopt-${optIdx}`);
    if (numEl) {
      numEl.textContent = this.state.majorityVotes[optIdx];
      restartAnimation(numEl);
    }
    if (optEl) {
      optEl.classList.toggle('has-votes', this.state.majorityVotes[optIdx] > 0);
    }
  },

  /* Abstimmung auswerten */
  evaluateMajority(penalty) {
    const [v0, v1] = this.state.majorityVotes;
    const task = this.state.currentTask;
    let resultHTML = '';

    if (v0 === 0 && v1 === 0) {
      setHTML('majority-result', `
        <div class="majority-result">
          <div class="result-icon">🤔</div>
          <div class="result-text">Bitte erst abstimmen!</div>
        </div>`);
      return;
    }

    if (v0 === v1) {
      resultHTML = `
        <div class="majority-result">
          <div class="result-icon">🤝</div>
          <div class="result-text">Gleichstand! <strong>Alle</strong> bekommen <span class="pen">${penalty}</span> Strafen!</div>
        </div>`;
    } else {
      const minIdx  = v0 < v1 ? 0 : 1;
      const majIdx  = 1 - minIdx;
      const minOpt  = task.options[minIdx];
      const majOpt  = task.options[majIdx];
      const minVote = this.state.majorityVotes[minIdx];
      const majVote = this.state.majorityVotes[majIdx];

      resultHTML = `
        <div class="majority-result">
          <div class="result-icon">🎉</div>
          <div class="result-text">
            Mehrheit: <strong>${majOpt}</strong> (${majVote} Stimmen)<br>
            Minderheit: <strong>${minOpt}</strong> (${minVote} Stimmen)<br><br>
            → <strong>${minOpt}</strong>-Fraktion bekommt <span class="pen">${penalty}</span> Strafen!
          </div>
        </div>`;
    }

    setHTML('majority-result', resultHTML);

    // "Weiter"-Button einblenden
    setHTML('next-wrapper', `
      <button class="btn-next" style="margin-top:14px;" onclick="StrafenGame.showNextTask()">
        Nächste Aufgabe &nbsp;→
      </button>`);

    // Auswerten-Button deaktivieren
    const evalBtn = document.getElementById('btn-eval');
    if (evalBtn) { evalBtn.disabled = true; evalBtn.textContent = '✓ Ausgewertet'; }
  },
};

