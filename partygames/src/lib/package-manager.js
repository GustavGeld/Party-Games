/**
 * Universal Package Manager for Party Games
 * Handles package selection UI and logic for multiple games.
 */
const PackageManager = {
  /**
   * Renders a package grid into a target element.
   * @param {Object} options 
   *   targetId: ID of grid container
   *   packages: Array of package objects {id, name, emoji, tasks}
   *   activeId: Currently selected ID (for single select)
   *   activeIds: Currently selected IDs (for multi select)
   *   onToggle: Callback function(id)
   *   isMulti: Boolean, if true allows multiple selection
   */
  renderGrid(options) {
    const grid = document.getElementById(options.targetId);
    if (!grid) return;

    const isMulti = !!options.isMulti;
    const activeIds = isMulti ? (options.activeIds || []) : [options.activeId];

    const countSuffix = options.countSuffix || 'Begriffe';
    grid.className = 'packages-grid';
    grid.innerHTML = options.packages.map(pkg => {
      const isActive = activeIds.includes(pkg.id);
      return `
        <div class="pkg-card ${isActive ? 'active' : ''}" onclick="PackageManager._handleToggle('${options.namespace}', '${pkg.id}')">
          <span class="pkg-check">✓</span>
          <div class="pkg-emoji">${pkg.emoji}</div>
          <div class="pkg-name">${pkg.name}</div>
          <div class="pkg-count">${pkg.tasks.length} ${countSuffix}</div>
        </div>
      `;
    }).join('');

    // Store callback and options for the internal handler
    this._registry = this._registry || {};
    this._registry[options.namespace] = options;
  },

  _handleToggle(namespace, id) {
    const options = this._registry[namespace];
    if (!options || !options.onToggle) return;
    options.onToggle(id);
  }
};

window.PackageManager = PackageManager;
