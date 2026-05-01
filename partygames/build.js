/**
 * Party Games Build System
 * Combines modular source files into a single distributable HTML file
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  srcDir: './src',
  outputFile: './index.html',
  encoding: 'utf8'
};

// Helper: Read file or return empty string if not exists
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, CONFIG.encoding);
  } catch (e) {
    console.warn(`Warning: Could not read ${filePath}`);
    return '';
  }
}

// Helper: Read all files from directory
function readDirFiles(dirPath, extension = '') {
  try {
    const files = fs.readdirSync(dirPath);
    return files
      .filter(f => !extension || f.endsWith(extension))
      .map(f => ({
        name: f,
        content: fs.readFileSync(path.join(dirPath, f), CONFIG.encoding)
      }));
  } catch (e) {
    return [];
  }
}

// Build the HTML file
function build() {
  console.log('🎮 Building Party Games...\n');

  let output = '';

  // 1. HTML Head
  console.log('📄 Adding HTML head...');
  output += readFile(path.join(CONFIG.srcDir, 'head.html'));

  // 2. CSS Styles
  console.log('🎨 Adding CSS styles...');
  const cssFiles = readDirFiles(path.join(CONFIG.srcDir, 'styles'), '.css');
  if (cssFiles.length > 0) {
    output += '<style>\n';
    cssFiles.forEach(file => {
      console.log(`   - ${file.name}`);
      output += `/* === ${file.name} === */\n${file.content}\n`;
    });
    output += '</style>\n';
  }

  // 3. External Libraries (PeerJS & Utils)
  console.log('📚 Adding external libraries...');
  const libFiles = readDirFiles(path.join(CONFIG.srcDir, 'lib'), '.js');
  libFiles.forEach(file => {
    console.log(`   - ${file.name}`);
    output += `<script>\n/* === ${file.name} === */\n${file.content}</script>\n`;
  });

  // 4. Multiplayer System
  console.log('🌐 Adding multiplayer system...');
  const mpContent = readFile(path.join(CONFIG.srcDir, 'multiplayer.js'));
  if (mpContent) {
    output += `<script>\n${mpContent}</script>\n`;
  }

  // 4.5 Image Data for Kiss Marry Kill
  console.log('📸 Adding KMK image data...');
  try {
    const picturesDir = path.join(__dirname, 'Pictures');
    const cartoonFiles = fs.existsSync(path.join(picturesDir, 'Cartoon')) ? fs.readdirSync(path.join(picturesDir, 'Cartoon')).filter(f => f.match(/\.(webp|png|jpg|jpeg)$/i)) : [];
    const celebFiles = fs.existsSync(path.join(picturesDir, 'Celebrities')) ? fs.readdirSync(path.join(picturesDir, 'Celebrities')).filter(f => f.match(/\.(webp|png|jpg|jpeg)$/i)) : [];
    
    // Inject as a script string
    output += `<script>\n/* === KMK Data === */\nconst KMK_DATA = { Cartoon: ${JSON.stringify(cartoonFiles)}, Celebrities: ${JSON.stringify(celebFiles)} };\n</script>\n`;
    console.log(`   - Found ${cartoonFiles.length} Cartoon images and ${celebFiles.length} Celebrities images`);
  } catch (e) {
    console.warn('   - Warning: Could not read Pictures directory for KMK_DATA. ' + e.message);
    output += `<script>\n/* === KMK Data === */\nconst KMK_DATA = { Cartoon: [], Celebrities: [] };\n</script>\n`;
  }

  // 5. Game Modules
  console.log('🎯 Adding game modules...');
  let gameFiles = readDirFiles(path.join(CONFIG.srcDir, 'games'), '.js');
  
  // Ensure games-array.js is included LAST to avoid ReferenceErrors for game modules
  gameFiles.sort((a, b) => {
    if (a.name === 'games-array.js') return 1;
    if (b.name === 'games-array.js') return -1;
    return a.name.localeCompare(b.name);
  });

  gameFiles.forEach(file => {
    console.log(`   - ${file.name}`);
    output += `<script>\n/* === ${file.name} === */\n${file.content}</script>\n`;
  });

  // 6. HTML Body Structure
  console.log('🏗️  Adding HTML body...');
  output += '</head>\n<body>\n';

  // HTML Components
  const htmlDir = path.join(CONFIG.srcDir, 'html');
  const htmlFiles = [
    'home.html',
    'setup.html',
    'lobby.html',
    'play.html',
    'spektrum-embed.html'
  ];

  htmlFiles.forEach(file => {
    const content = readFile(path.join(htmlDir, file));
    if (content) {
      console.log(`   - ${file}`);
      output += content + '\n';
    }
  });

  // 7. Main App Logic (Router, Utils, Init)
  console.log('⚡ Adding main app logic...');
  const mainContent = readFile(path.join(CONFIG.srcDir, 'main.js'));
  if (mainContent) {
    output += `<script>\n${mainContent}</script>\n`;
  }

  // Close HTML
  output += '</body>\n</html>';

  // Write output
  fs.writeFileSync(CONFIG.outputFile, output, CONFIG.encoding);

  const stats = fs.statSync(CONFIG.outputFile);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log(`\n✅ Build complete!`);
  console.log(`📦 Output: ${CONFIG.outputFile}`);
  console.log(`📊 Size: ${sizeKB} KB`);
}

// Watch mode
function watch() {
  console.log('👀 Watching for changes...');
  const dirs = [
    CONFIG.srcDir,
    path.join(CONFIG.srcDir, 'styles'),
    path.join(CONFIG.srcDir, 'games'),
    path.join(CONFIG.srcDir, 'html'),
    path.join(CONFIG.srcDir, 'lib')
  ];

  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && !filename.startsWith('.')) {
          console.log(`\n📝 ${filename} changed, rebuilding...`);
          try {
            build();
          } catch (e) {
            console.error('❌ Build error:', e.message);
          }
        }
      });
    }
  });
}

// CLI
const args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
  build();
  watch();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Party Games Build System

Usage:
  node build.js           Build once
  node build.js --watch   Build and watch for changes
  node build.js --help    Show this help

Structure:
  src/
    head.html         # HTML head template
    styles/           # CSS files
    lib/              # External libraries (peerjs.min.js)
    multiplayer.js    # P2P networking layer
    games/            # Game modules (strafe.js, kritzelkette.js, etc.)
    html/             # HTML components (home.html, setup.html, etc.)
    main.js           # App initialization & router
  `);
} else {
  build();
}
