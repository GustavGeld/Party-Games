const GAMES = [
  {
    id:      'strafe',
    name:    'Strafe',
    emoji:   '\u26A1',
    tagline: 'Aufgaben. Strafen. Chaos.',
    color:   '#ff3366',
    shadow:  'rgba(255,51,102,.25)',
    glow:    'rgba(255,51,102,.12)',
    open() {
      Router.go('setup');
      StrafenGame.renderSetup();
    },
    module: StrafenGame,
    supportsOnline: false
  },
  {
    id:      'kritzelkette',
    name:    'Kritzel-Kette',
    emoji:   '\u270F\uFE0F',
    tagline: 'Wie Stille Post, nur gemalt!',
    color:   '#00e5ff',
    shadow:  'rgba(0,229,255,.25)',
    glow:    'rgba(0,229,255,.12)',
    open() {
      KritzelGame.open();
    },
    module: KritzelGame,
    supportsOnline: true
  },
  {
    id:      'spektrum',
    name:    'Spektrum',
    emoji:   '\uD83C\uDF08',
    tagline: 'Skala. Tipp. Synchronisieren.',
    color:   '#7c3aed',
    shadow:  'rgba(124,58,237,.25)',
    glow:    'rgba(124,58,237,.12)',
    open() {
      Spektrum.open();
    },
    module: Spektrum,
    supportsOnline: true
  },

  {
    id:      'kissmarrykill',
    name:    'Kiss Marry Kill',
    emoji:   '💋',
    tagline: 'Triff die harte Wahl.',
    color:   '#ff0066',
    shadow:  'rgba(255,0,102,.25)',
    glow:    'rgba(255,0,102,.12)',
    open() {
      if (typeof KmkGame !== 'undefined') {
        KmkGame.openModeSelection();
      } else {
        alert('Spielmodul nicht geladen!');
      }
    },
    module: typeof KmkGame !== 'undefined' ? KmkGame : null,
    supportsOnline: false
  },
  {
    id:      'wortorakel',
    name:    'Wort-Orakel',
    emoji:   '🔮',
    tagline: 'Wer bin ich? Errate deinen geheimen Begriff!',
    color:   '#a855f7',
    shadow:  'rgba(168, 85, 247, 0.4)',
    glow:    'rgba(168, 85, 247, 0.2)',
    open() {
      WortOrakel.open();
    },
    module: WortOrakel,
    supportsOnline: true
  },
  {
    id:      'limitzocker',
    name:    'Grenz-Gänger',
    emoji:   '🧗',
    tagline: 'Pokere hoch: Wer schafft am meisten?',
    color:   '#f59e0b',
    shadow:  'rgba(245, 158, 11, 0.4)',
    glow:    'rgba(245, 158, 11, 0.2)',
    open() {
      GrenzGaenger.open();
    },
    module: GrenzGaenger,
    supportsOnline: true
  },
  {
    id:      'schuldspruch',
    name:    'Schuldspruch',
    emoji:   '⚖️',
    tagline: 'Wer würde am ehesten...?',
    color:   '#ff3b30',
    shadow:  'rgba(255, 59, 48, 0.4)',
    glow:    'rgba(255, 59, 48, 0.2)',
    open() {
      Schuldspruch.open();
    },
    module: Schuldspruch,
    supportsOnline: true
  },
  {
    id:      'koenigscup',
    name:    'Königs-Cup',
    emoji:   '👑',
    tagline: 'Gießen. Ziehen. Leeren.',
    color:   '#f59e0b',
    shadow:  'rgba(245, 158, 11, 0.4)',
    glow:    'rgba(245, 158, 11, 0.2)',
    open() {
      KoenigsCup.open();
    },
    module: KoenigsCup,
    supportsOnline: true
  },
  {
    id:      'busfahrer',
    name:    'Busfahrer',
    emoji:   '🚌',
    tagline: 'Die ultimative Mutprobe am Fließband.',
    color:   '#ff3366',
    shadow:  'rgba(255, 51, 102, 0.4)',
    glow:    'rgba(255, 51, 102, 0.2)',
    open() {
      Busfahrer.open();
    },
    module: Busfahrer,
    supportsOnline: true
  },
  {
    id:      'ihn',
    name:    'Ich hab noch nie',
    emoji:   '🤐',
    tagline: 'Wahrheit oder Trinken. Sag die Wahrheit!',
    color:   '#8e44ad',
    shadow:  'rgba(142, 68, 173, 0.4)',
    glow:    'rgba(142, 68, 173, 0.2)',
    open() {
      IchHabNochNie.open();
    },
    module: IchHabNochNie,
    supportsOnline: true
  }
];