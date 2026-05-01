const Spektrum = {
  name: "Spektrum",
  tagline: "Skala. Tipp. Synchronisieren.",
  color: "#7c3aed",
  shadow: "rgba(124, 58, 237, 0.4)",
  glow: "rgba(124, 58, 237, 0.2)",
  emoji: "🌈",

  state: {
    players: [],
    mode: 'offline', // 'offline' or 'online'
    myName: 'Host'
  },

  open() {
    this.state.mode = 'offline';
    Router.go('setup');
    document.getElementById('setup-title').textContent = 'Spektrum';
    this.renderSetup();
  },

  renderSetup() {
    document.getElementById('setup-content').innerHTML = `
      <div class="card" style="position:relative; text-align:center; padding: 40px 20px;">
        <button class="btn-icon" style="position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.05);" onclick="Router.go('home')">✕</button>
        <div style="font-size: 4rem; margin-bottom: 20px;">🌈</div>
        <h2 style="margin-bottom: 30px; font-family: 'Syne', sans-serif;">Wähle deinen Spielmodus</h2>
        <button class="btn-primary" onclick="Spektrum.startLocal()">Lokal spielen (Ein Gerät) 📱</button>
        <button class="btn-primary" style="background:#7c3aed; margin-top: 15px;" onclick="UnifiedLobby.open(Spektrum)">Online spielen 🌐</button>
        <p style="margin-top: 30px; color: var(--text-muted); font-size: 0.9rem;">
            <b>Hinweis:</b> Im Online-Modus nutzt Spektrum jetzt das allgemeine Raumsystem.
        </p>
      </div>
    `;
  },

  startLocal() {
    this.state.mode = 'offline';
    SpektrumEmbed.open({ mode: 'offline' });
  },

  // UnifiedLobby Integration
  onOnlineGameStart(settings) {
    this.state.mode = 'online';
    
    // Clean players array to avoid DataCloneError during postMessage
    settings.players = this.state.players.map(p => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost || p.id === Multiplayer.hostId
    }));
    
    SpektrumEmbed.open({ mode: 'online', settings: settings });
  },

  // This handles data received from other players via the parent's Multiplayer object
  handleOnlineData(data, conn) {
    const iframe = document.getElementById('spektrum-iframe');
    if (iframe && iframe.contentWindow) {
      // Forward the data to the iframe
      iframe.contentWindow.postMessage({ type: 'mp-data', data: data }, '*');
    }
  },
  
  // These are for the host lobby settings (if we want to add them later)
  renderHostSetup() {
    return `
      <div class="card col" style="gap: 1.5rem;">
        <div class="card-label">⚙️ Spektrum Einstellungen</div>
        
        <div>
            <label style="display:block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600;">Spielmodus</label>
            <select id="sp-gamemode" class="input-field" style="width:100%; padding: 10px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text);" onchange="document.getElementById('sp-create-timer-container').style.display = (this.value === 'custom-words' ? 'block' : 'none')">
                <option value="classic" selected>🎯 Klassisch (vorgefertigte Paare)</option>
                <option value="custom-words">✍️ Eigene Wörter (Spieler erstellen Paare)</option>
            </select>
        </div>

        <div>
            <label style="display:block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600;">Rundenanzahl (pro Spieler)</label>
            <div style="display:flex; align-items:center; gap: 12px;">
                <input type="range" id="sp-rounds" min="1" max="10" value="3" style="flex:1;" oninput="document.getElementById('sp-rounds-val').textContent = this.value">
                <span id="sp-rounds-val" style="min-width: 25px; font-weight:bold; color:#7c3aed;">3</span>
            </div>
        </div>

        <div>
            <label style="display:flex; align-items:center; gap:10px; font-size: 0.9rem; font-weight: 600; cursor:pointer; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                <input type="checkbox" id="sp-endless" style="width:18px; height:18px;">
                ♾️ Endlos-Modus (Host beendet manuell)
            </label>
        </div>

        <div>
            <label style="display:block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600;">⏱️ Zeit zum Tippen (Sekunden)</label>
            <div style="display:flex; align-items:center; gap: 12px;">
                <input type="range" id="sp-clue-timer" min="15" max="180" step="15" value="60" style="flex:1;" oninput="document.getElementById('sp-clue-timer-val').textContent = this.value">
                <span id="sp-clue-timer-val" style="min-width: 25px; font-weight:bold; color:#7c3aed;">60</span>
            </div>
        </div>

        <div id="sp-create-timer-container" style="display: none;">
            <label style="display:block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600;">⏱️ Zeit zum Wörter erstellen (Sekunden)</label>
            <div style="display:flex; align-items:center; gap: 12px;">
                <input type="range" id="sp-create-timer" min="15" max="180" step="15" value="60" style="flex:1;" oninput="document.getElementById('sp-create-timer-val').textContent = this.value">
                <span id="sp-create-timer-val" style="min-width: 25px; font-weight:bold; color:#7c3aed;">60</span>
            </div>
        </div>

        <div>
            <label style="display:block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600;">⏱️ Zeit zum Raten (Sekunden)</label>
            <div style="display:flex; align-items:center; gap: 12px;">
                <input type="range" id="sp-guess-timer" min="15" max="120" step="15" value="30" style="flex:1;" oninput="document.getElementById('sp-guess-timer-val').textContent = this.value">
                <span id="sp-guess-timer-val" style="min-width: 25px; font-weight:bold; color:#7c3aed;">30</span>
            </div>
        </div>

        <div>
            <label style="display:block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600;">Schwierigkeitsgrad</label>
            <select id="sp-difficulty" class="input-field" style="width:100%; padding: 10px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text);">
                <option value="easy">Einfach (Größere Zonen)</option>
                <option value="normal" selected>Normal</option>
                <option value="hard">Schwer (Kleinere Zonen)</option>
            </select>
        </div>

        <div>
            <label style="display:block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600;">Pakete auswählen</label>
            <div id="sp-packages-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem;">
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-general" checked> 🎯 Allgemein</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-essen" checked> 🍽️ Essen</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-filme" checked> 🎬 Medien</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-menschen" checked> 👥 Eigenschaften</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-spicy"> 🔥 Spicy</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-animation" checked> 🎨 Cartoons</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-schule-v2" checked> 📖 Schule/Wissen</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-sport-v2" checked> 🏆 Sport</label>
                <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="sp-pkg-cb" value="preset-alltag" checked> 🏠 Alltag</label>
            </div>
            <div style="margin-top: 8px; display: flex; gap: 10px;">
                <button type="button" class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="document.querySelectorAll('.sp-pkg-cb').forEach(cb => cb.checked = true)">Alle</button>
                <button type="button" class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="document.querySelectorAll('.sp-pkg-cb').forEach(cb => cb.checked = false)">Keine</button>
            </div>
        </div>
      </div>
    `;
  },
  
  onHostLobbyRendered() {
    const modeSelect = document.getElementById('sp-gamemode');
    const createTimer = document.getElementById('sp-create-timer-container');
    if (modeSelect && createTimer) {
      createTimer.style.display = (modeSelect.value === 'custom-words' ? 'block' : 'none');
    }
  },
  
  collectOnlineSettings() {
    const pkgs = Array.from(document.querySelectorAll('.sp-pkg-cb'))
                      .filter(cb => cb.checked)
                      .map(cb => cb.value);
    return {
      gameMode: document.getElementById('sp-gamemode')?.value || 'classic',
      roundsPerPlayer: parseInt(document.getElementById('sp-rounds')?.value || 3),
      endlessMode: document.getElementById('sp-endless')?.checked || false,
      clueTimeSec: parseInt(document.getElementById('sp-clue-timer')?.value || 60),
      createTimeSec: parseInt(document.getElementById('sp-create-timer')?.value || 60),
      guessTimeSec: parseInt(document.getElementById('sp-guess-timer')?.value || 30),
      difficulty: document.getElementById('sp-difficulty')?.value || 'normal',
      activePackages: pkgs.length > 0 ? pkgs : ['preset-general']
    };
  }
};
