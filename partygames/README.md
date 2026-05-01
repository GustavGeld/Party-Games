# Party Games - Modulares Build-System

Dieses Projekt ermöglicht die Entwicklung von Party Games in modularen Dateien, die dann zu einer einzigen, verteilbaren HTML-Datei zusammengebaut werden.

## 🎯 Ziel

- **Entwicklung**: Übersichtliche, modulare Dateistruktur
- **Verteilung**: Eine einzelne HTML-Datei, die ohne Server/Abhängigkeiten funktioniert

## 📁 Verzeichnisstruktur

```
partygames/
├── src/                    # Quellcode-Module
│   ├── head.html          # HTML Head mit Meta-Tags
│   ├── styles/            # CSS-Dateien
│   │   └── main.css
│   ├── lib/               # Externe Bibliotheken
│   │   └── peerjs.min.js
│   ├── multiplayer.js     # P2P Networking
│   ├── games/             # Spiel-Module
│   │   ├── games-array.js # GAMES Konstante
│   │   ├── strafe.js      # Strafe Spiel
│   │   ├── kritzelkette.js # Kritzel-Kette Spiel
│   │   ├── lobby.js       # Unified Lobby
│   │   ├── spektrum-data.js # Spektrum Base64
│   │   └── spektrum.js    # Spektrum Embed
│   ├── html/              # HTML-Komponenten
│   │   ├── home.html      # Startseite
│   │   ├── setup.html     # Setup-Bildschirm
│   │   ├── lobby.html     # Lobby-Bildschirm
│   │   ├── play.html      # Spiel-Bildschirm
│   │   └── spektrum-embed.html
│   └── main.js            # Router & Initialisierung
├── build.js               # Build-Script
├── index.html       # Output (generiert)
└── README.md              # Diese Datei
```

## 🚀 Nutzung

### Build ausführen

```bash
node build.js
```

Dies erstellt `index.html` aus allen Modulen.

### Watch-Modus (automatischer Rebuild bei Änderungen)

```bash
node build.js --watch
```

### Hilfe anzeigen

```bash
node build.js --help
```

## 🛠️ Entwicklung

### Neues Spiel hinzufügen

1. Erstelle eine neue Datei in `src/games/` (z.B. `mein-spiel.js`)
2. Füge das Spiel zum `GAMES` Array in `src/games/games-array.js` hinzu
3. Führe `node build.js` aus

Beispiel für ein Spiel-Modul:
```javascript
const MeinSpiel = {
  id: 'meinspiel',
  name: 'Mein Spiel',
  emoji: '🎮',
  tagline: 'Beschreibung hier',
  color: '#ff3366',
  shadow: 'rgba(255,51,102,.25)',
  glow: 'rgba(255,51,102,.12)',
  open() {
    Router.go('setup');
    this.renderSetup();
  },
  renderSetup() {
    // Setup-UI rendern
  },
  start() {
    // Spiel starten
  }
};
```

### CSS bearbeiten

Styles werden aus `src/styles/` kombiniert. Du kannst mehrere CSS-Dateien erstellen:
- `main.css` - Hauptstyles
- `components.css` - UI-Komponenten
- `animations.css` - Animationen

### HTML-Komponenten bearbeiten

Die Bildschirme sind in `src/html/` als separate Dateien organisiert:
- `home.html` - Startseite mit Spielauswahl
- `setup.html` - Spiel-Setup
- `lobby.html` - Multiplayer-Lobby
- `play.html` - Aktives Spiel

## 📦 Verteilung

Nach dem Build ist `index.html` bereit zum Teilen:
- Per E-Mail versenden
- Auf einem einfachen Webserver hosten
- Als Datei direkt im Browser öffnen (einige Features erfordern einen Server)

## 🔧 Technische Details

### Build-Prozess

1. **Head**: HTML Head wird aus `src/head.html` kopiert
2. **CSS**: Alle CSS-Dateien werden in einen `<style>`-Block kombiniert
3. **Libraries**: PeerJS und andere Bibliotheken werden eingefügt
4. **JavaScript**: Module werden in `<script>`-Tags zusammengefügt
5. **HTML**: Body-Komponenten werden eingefügt
6. **Main**: Router und Initialisierung werden am Ende eingefügt

### Spektrum-Embed

Das Spektrum-Spiel ist als Base64-kodierte Data-URL in `src/games/spektrum-data.js` eingebettet. Diese wird von `src/games/spektrum.js` geladen.

## 📝 Tipps

- Immer `node build.js` ausführen, bevor du die HTML-Datei testest
- Bei Fehlern: Prüfe, ob alle Module in `src/` vorhanden sind
- Die generierte Datei ist groß (ca. 800KB) - das ist normal wegen eingebetteter Bibliotheken

## 🐛 Fehlerbehebung

**Build schlägt fehl:**
- Prüfe, ob alle Verzeichnisse in `src/` existieren
- Stelle sicher, dass `index.html` nicht gerade geöffnet ist

**Spiel funktioniert nicht nach Build:**
- Prüfe die Browser-Konsole auf Fehler
- Vergewissere dich, dass alle Module korrekt zusammengebaut wurden

**Änderungen werden nicht übernommen:**
- Stelle sicher, dass du `node build.js` ausgeführt hast
- Bei `--watch`: Prüfe die Konsolenausgabe auf Build-Fehler
