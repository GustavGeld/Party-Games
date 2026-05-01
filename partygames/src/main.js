/* ===================================================
   MAIN APP - Core functionality only
   Games are loaded from separate modules
   =================================================== */

// Utility Functions
function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
  return el;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Alias for backwards compatibility
var shuffle = shuffleArr;

// Sample n random items from array
function sample(arr, n) {
  const shuffled = shuffleArr([...arr]);
  return shuffled.slice(0, n);
}

function restartAnimation(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // trigger reflow
  const anim = el.dataset.anim || el.classList.contains('pop') ? 'pop' :
               el.classList.contains('slide') ? 'slide' : 'pop';
  el.style.animation = '';
}

// Router
const Router = {
  current: 'home',

  init() {
    try { history.replaceState({ screen: 'home' }, '', ''); } catch(e) {}
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.screen) {
        this.go(e.state.screen, true);
      } else {
        this.go('home', true);
      }
    });
  },

  go(screenId, isPop = false) {
    if (!isPop && screenId !== this.current) {
      try { history.pushState({ screen: screenId }, '', ''); } catch(e) {}
    }

    if (screenId === 'home') {
      try {
        if (typeof Multiplayer !== 'undefined' && Multiplayer.disconnect) {
          Multiplayer.disconnect();
        }
      } catch (err) { console.error('Disconnect error', err); }
    }

    // Alten Screen ausblenden
    const old = document.getElementById(`screen-${this.current}`);
    if (old) old.classList.remove('active');

    // Neuen Screen einblenden + Animation neu starten
    const next = document.getElementById(`screen-${screenId}`);
    if (next) {
      next.classList.add('active');
      restartAnimation(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    this.current = screenId;
  }
};

// Spektrum Embed
const SpektrumEmbed = {
  loaded: false,
  open(config = {}) {
    Router.go('spektrum-embed');
    const iframe = document.getElementById('spektrum-iframe');
    if (!iframe) return;

    // Use srcdoc instead of src data: URL because data: URLs disable localStorage for security.
    if (typeof SPEKTRUM_DATA_URL !== 'undefined' && SPEKTRUM_DATA_URL.startsWith('data:')) {
      try {
        const base64 = SPEKTRUM_DATA_URL.split(',')[1];
        const html = decodeURIComponent(escape(atob(base64)));
        iframe.srcdoc = html;
      } catch (e) {
        console.error('Failed to decode Spektrum data:', e);
        iframe.src = SPEKTRUM_DATA_URL;
      }
    } else if (typeof SPEKTRUM_DATA_URL !== 'undefined') {
      iframe.src = SPEKTRUM_DATA_URL;
    }
    
    iframe.onload = () => {
      iframe.contentWindow.postMessage({ type: 'init-game', config: config }, '*');
    };

    this.loaded = true;
  }
};

// Initialize app when DOM is ready
function initApp() {
  Router.init();
  const grid = document.getElementById('games-grid');
  if (!grid) {
    console.error('games-grid not found!');
    return;
  }

  // Spielkarten aus GAMES-Array generieren
  grid.innerHTML = GAMES.map(game => `
    <button
      class="game-card"
      style="
        --gc-color:  ${game.color};
        --gc-shadow: ${game.shadow};
        --gc-glow:   ${game.glow};
      "
      onclick="GAMES.find(g => g.id === '${game.id}').open()"
    >
      <span class="gc-icon">${game.emoji}</span>
      <div class="gc-info">
        <div class="gc-name">${game.name}</div>
        <div class="gc-tagline">${game.tagline}</div>
      </div>
      <span class="gc-arrow">&rarr;</span>
    </button>
  `).join('');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Listen for signals from embedded game iframes (e.g. Spektrum)
window.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'game-ended') {
    if (event.data.action === 'return-to-lobby') {
      if (typeof SharedRoom !== 'undefined' && SharedRoom.isActive) {
        SharedRoom.returnToLobby();
      } else {
        Router.go('home');
      }
    }
  }

  if (event.data.type === 'mp-data') {
    // Forward data from Spektrum iframe to other network players
    if (typeof Multiplayer !== 'undefined' && Multiplayer.isConnected) {
      if (Multiplayer.role === 'host') {
        Multiplayer.sendGameState(event.data.data);
      } else {
        Multiplayer.sendToHost(event.data.data);
      }
    }
  }
});

// Global helper to refresh the active lobby (SharedRoom or UnifiedLobby)
window.refreshLobby = function() {
  if (typeof SharedRoom !== 'undefined' && SharedRoom.isActive) {
    if (SharedRoom.isInLobby) {
      if (Multiplayer.role === 'host') SharedRoom._renderHostLobby();
      else SharedRoom._renderGuestLobby();
    } else {
      // If we are in a game but want to refresh the UI, the game's render method handles it
    }
  } else if (typeof UnifiedLobby !== 'undefined' && UnifiedLobby.isInLobby) {
    if (Multiplayer.role === 'host') UnifiedLobby._updateHostLobby();
    else UnifiedLobby._renderGuestLobby();
  }
};

window.hostReturnToLobby = function() {
  if (typeof SharedRoom !== 'undefined' && SharedRoom.isActive) {
    SharedRoom.returnToLobby();
  } else {
    // Check if there is an active game with a returnToLobby method
    const activeGames = [
      'WortOrakel', 'KritzelKette', 'Schuldspruch', 'Busfahrer', 
      'IchHabNochNie', 'KoenigsCup', 'KissMarryKill'
    ];
    for (const g of activeGames) {
      if (window[g] && typeof window[g].returnToLobby === 'function') {
        window[g].returnToLobby();
        return;
      }
    }
    location.reload();
  }
};
