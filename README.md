# ⚔️ Console RPG Adventure ⚔️

A unique turn-based RPG game played entirely in your browser's **Developer Console**! Explore a pixel-art world, battle enemies, recruit party members, and defeat the final boss. Inspired by classic Final Fantasy games with a programming/tech theme.

**Created by Alexander Richkov** | [Website](https://arich-software.co.il) | [LinkedIn](https://www.linkedin.com/in/arich-software)

---

## 🎮 How to Play

### Setup
1. Open the game in a **desktop browser** (Chrome, Firefox, Edge, Safari)
2. Press **F12** to open Developer Tools
3. In the Console tab, **turn OFF "Preserve log"**
4. **Dock DevTools to the side** (~70% width)
5. Click **"Start Adventure"**
6. Select your hero and skin color
7. Keep mouse hovering over the page for keyboard controls to work

> ⚠️ **Note**: This game requires desktop browsers. Mobile browsers are not supported.

---

## 🎯 Game Features

### Core Gameplay
- **Turn-based combat** with strategic depth
- **Exploration** of a 25x15 procedurally generated map
- **Level progression** with stat increases (up to level 10)
- **Party recruitment** - hire up to 2 party members (50 gold each)
- **Inn system** - rest and heal for 20 gold
- **Boss battle** - defeat the 🐛 Bug in Production at level 10!
- **Progressive difficulty** - enemies level up from 1-10

### Character System
- **8 unique heroes** with different stat distributions
- **44 party member types** with hilarious tech-themed backstories
- **Relative stat scaling** - all characters scale from base stats
- **5 skin color variations** for each character
- **Character-specific animations** - each hero has unique attack/magic/special emojis

### Battle System
- **Turn-based combat** with hero → party → enemies rotation
- **5 battle actions**: Attack, Magic, Defend, Run, Special Attack
- **Special meter system** - builds up to 100% for ultimate attacks
- **10 unique special attack animations** - CONVERGE, SPIRAL, WAVE, RAIN, CROSS, CIRCLE, LIGHTNING, BARRAGE, VORTEX, METEOR
- **Enemy groups** - face 1-3 enemies at once with coordinated levels
- **Party member permadeath** - dead members are removed after battle
- **Battle animations** - smooth attack/magic/special animations with large emojis

### Audio System
- **Background music** - exploration, battle, game over themes
- **Battle sounds** - 3 randomized attack sounds
- **Magic effects** - 2 randomized spell sounds
- **Enemy hurt sounds** - different sounds for Slimes, Shadows, Giants, Ogres
- **UI sounds** - level up, victory, inn rest, coin collection
- **Audio controls** - toggle music, effects, or all sounds (top-right icons)

### Professional Features
- **Info screen** (Press [I]) - displays developer portfolio with:
  - Full resume and contact information
  - Tech stack and experience
  - Scannable QR code linking to arich-software.co.il
  - Social media links (LinkedIn, Facebook, WhatsApp)

---

## 🎮 Controls

### Exploration Mode
- **Arrow Keys** (↑↓←→) - Move around the map
- **I** - View developer info & credits
- Walk into enemies to start battles
- Walk into 🏠 Inn to rest (20 gold)
- Walk into ⚔️🔮🏹🛡️ Recruits to hire party members (50 gold)

### Battle Mode
- **1** - Attack (physical damage)
- **2** - Magic (costs 5 MP, deals magic damage -80% from base)
- **3** - Defend (reduces incoming damage by 50%)
- **4** - Run (50% chance to escape, can't run from boss)
- **5** - Special Attack (when meter reaches 100%, hits ALL enemies)
- **Tab** - Switch target enemy

### Shop/Inn Mode
- **Y** - Accept (case insensitive)
- **N** - Decline (case insensitive)

### Game Over
- **R** - Restart game

---

## 🎭 Characters

### Heroes (Playable)
1. **🧑‍💻 The Code Warrior** - Balanced stats, high HP and attack
2. **🧑‍🔬 The Algorithm Alchemist** - Magic specialist
3. **🧑‍🎨 The Color Sorcerer** - High magic, low defense
4. **🥷 Dark-Mode Ninja** - Extremely high attack, stealth build
5. **🧑‍🚀 The Visionary** - Balanced with good magic
6. **🧑‍🍳 The CSS Chef** - High attack and magic
7. **🧑‍🏭 The Pipeline Worker** - Tank build with high HP and defense
8. **🧑‍🚒 The Firefighter** - Highest HP and defense, lowest magic

### Party Members (44 Total)
Including: Code Doctors, Junior Devs, Syntax Senseis, Data Farmers, Patch Mechanics, Feature Priests, Firewall Guardians, Build Lords, Legal Debuggers, API Rockstars, Cloud Captains, Debug Detectives, Gate Keepers, Code Royalty, Scroll Keepers, Cipher Sages, Formal Functions, and more!

Each with:
- Unique emoji and story
- Custom stat multipliers
- Special attack/magic/super emojis
- Funny tech-themed backstories

---

## ⚔️ Battle System Details

### Special Meter
- Builds by **5-20%** per action (attack/magic/defend)
- When it reaches **100%**, Special Attack becomes available
- **Resets to 0** after using Special Attack
- Deals **3x attack damage** to **ALL enemies** at once

### Special Attack Animations (10 Patterns)
Each character gets a random pattern assigned:
1. **CONVERGE** - Attacks from all 4 sides
2. **SPIRAL** - Rotating spiral inward
3. **WAVE** - Sine wave across screen
4. **RAIN** - Falls from above
5. **CROSS** - X-pattern diagonal slashes
6. **CIRCLE** - Expanding circle
7. **LIGHTNING** - Zigzag bolt
8. **BARRAGE** - Multiple projectiles
9. **VORTEX** - Spiraling vortex
10. **METEOR** - 3 meteors in sequence

### Enemy Mechanics
- **Group spawning** - 1-3 enemies per encounter
- **Level coordination** - enemies in same group are within 1 level
- **Progressive difficulty** - each victory increases next enemy level by 1 (capped at 10)
- **Special attacks** - enemies also build special meters and use ultimates
- **Boss spawn** - 🐛 appears at player level 10

### Victory Screen
Shows detailed battle results:
- 💰 Gold gained
- ⭐ EXP gained
- 🎉 Who leveled up
- 💀 Which party members died (if any)

---

## 🎨 Visual Design

### Battle Arena
- **Large emoji display** (28-32px) for characters and animations
- **20-character wide arena** for animations
- **5-line height** for special attacks
- **Color-coded UI** - enemies (red), party (green), stats (cyan/yellow)

### Map Display
- **25x15 tile grid** with emoji terrain
- 🧙 You | 🟩 Grass | 🌲 Forest | ⛰️ Mountain (blocked)
- 👾 Enemies | ⚔️🔮🏹🛡️ Recruits | 🏠 Inn
- Real-time party following system

### UI/UX
- **Utility functions** for consistent borders and styling
- **Border functions** - `createBorder()`, `createBorderedLine()`, `createSeparator()`
- **Smart text wrapping** with `breakTextIntoLines()`
- **Error messages** for invalid key presses
- **Audio controls** - floating top-right with mute/unmute icons

---

## 🔧 Technical Implementation

### Architecture
- **Single-file implementation** (`script.js` - ~3,500 lines)
- **No external dependencies** - pure vanilla JavaScript
- **Console-based rendering** using `console.log()` with CSS styling
- **Event-driven input** with mode-specific handlers

### Key Systems

#### Audio System
- **Persistent audio state** - saved in localStorage
- **Multiple music tracks** - map, battle, game over, victory
- **Rich sound effects** - 30+ different sounds
- **Type-specific sounds** - different hurt sounds per enemy type
- **Toggle controls** - music, effects, or all audio

#### Stat Scaling System
```javascript
BASE_PLAYER_STATS = {
    hp: 100,
    attack: 10,
    defense: 6,
    magic: 12
}
```
- All heroes scale from base using multipliers
- All party members scale from base using multipliers
- Change base stats → everything scales proportionally

#### Animation System
- **Attack animations** - projectiles travel between attacker and target
- **Magic animations** - growing spell effects
- **Special attack animations** - 5-line, 10-pattern epic animations
- **Fixed positioning** - handles compound emoji string lengths
- **Error recovery** - try-catch blocks prevent stuck animations

### Code Quality
- **Refactored utility functions** - eliminates code duplication
- **Destructuring** - uses `const { player } = gameState` for clarity
- **Consistent styling** - all UI uses utility functions
- **Error handling** - animations never get stuck
- **Safe math operations** - `Math.max(0, ...)` prevents negative values

---

## 📊 Game Balance

### Base Stats Template
- **HP**: 100
- **Attack**: 10
- **Defense**: 6
- **Magic**: 12

### Hero Multipliers (Examples)
- **Code Warrior**: 1.2 HP, 1.2 Attack, 1.0 Defense, 1.25 Magic
- **Dark-Mode Ninja**: 1.1 HP, 1.8 Attack, 1.35 Defense, 0.85 Magic
- **Firefighter**: 1.25 HP, 1.6 Attack, 1.65 Defense, 0.65 Magic

### Party Member Multipliers (Examples)
- **Junior Dev**: 0.65 HP, 0.5 Attack, 0.5 Defense, 1.0 Magic (weak but cheap)
- **Firewall Guardian**: 1.0 HP, 1.0 Attack, 1.65 Defense, 0.65 Magic (tank)
- **Sovereign of Syntax**: 1.15 HP, 1.25 Attack, 1.65 Defense, 1.5 Magic (expensive but powerful)

### Damage Calculations
- **Attack**: `attack + random(0-5) - enemy.defense`
- **Magic**: `(magic × 0.4 + random(0-2)) × 2 - enemy.defense` (80% reduction from base)
- **Special**: `attack × 3 + random(0-20)` (hits ALL enemies)
- **Enemy attack**: `enemy.attack + random(0-5) - player.defense`
- **Enemy special**: `enemy.attack × 2.5 + random(0-15)`
- **Defend**: Reduces damage by 50%

---

## 🎵 Audio Files

### Music (5 files)
- `map music.mp3` - Exploration theme
- `battel music.mp3` - Battle theme
- `game over music.mp3` - Defeat theme
- `level up sound.mp3` - Level up fanfare
- `battle victory sound.mp3` - Victory celebration

### Sound Effects (28 files)
- **Attacks**: swing.wav, swing2.wav, swing3.wav, sword-unsheathe.wav
- **Magic**: magic1.wav, spell.wav
- **UI**: interface1-6.wav (menus, escapes, specials)
- **Enemy hurt**: mnstr5/7/9.wav, ogre2.wav, slime3.wav, shade5.wav, giant3.wav
- **Items**: coin.wav, coin2.wav, coin3.wav, bottle.wav, cloth.wav, bubble.wav
- **Defense**: chainmail1.wav, armor-light.wav
- **World**: door.wav, enenmy encounter sound.mp3, spend mony sound.mp3, inn rest sound.mp3

---

## 🌟 Special Features

### Developer Portfolio Integration
Press **[I]** during gameplay to view:


### Social Media Ready
- **Open Graph meta tags** for rich previews
- **Social sharing image** included
- Professional presentation for portfolio purposes

---

## 🎯 Game Progression

### Early Game (Level 1-3)
- Fight level 1-3 enemies
- Recruit first party member
- Learn battle mechanics
- Save gold for inn rests

### Mid Game (Level 4-7)
- Recruit second party member
- Face level 4-7 enemy groups
- Build special meters
- Master special attack patterns

### Late Game (Level 8-10)
- Fight level 8-10 enemies
- Prepare for boss battle
- Max out your party
- **Level 10**: 🐛 Final Boss spawns!

### Victory
- Defeat the Bug in Production
- See final stats (level, gold, enemies defeated)
- Restart to try different heroes

---

## 💡 Tips & Strategies

1. **Magic is expensive** - Only use when you need the damage (80% weaker than before)
2. **Defend is powerful** - Use when low on HP (50% damage reduction)
3. **Special attacks** are devastating - Save for tough battles or boss
4. **Party synergy** - Mix tank (Firewall Guardian) with damage dealers
5. **Dead members** are permanent - Keep them healed at inns
6. **Enemy levels increase** - Each victory makes next enemies 1 level higher
7. **Gold management** - Balance between recruits (50g) and inn rests (20g)

---

## 🛠️ Technical Details

### Technology Stack
- **Pure Vanilla JavaScript** (ES6+)
- **HTML5** with semantic markup
- **CSS3** with custom styling
- **Browser Console API** for rendering
- **localStorage** for audio preferences
- **No external libraries** - completely self-contained

### File Structure
```
Console RPG/
├── index.html              # Main HTML page with instructions
├── script.js               # Complete game logic (~3,500 lines)
├── style.css               # UI styling
├── social image.png        # Open Graph preview image
├── icon.png               # Favicon
└── sound/                 # Audio files (33 total)
    ├── *.mp3             # Music tracks (5)
    └── *.wav             # Sound effects (28)
```

### Code Highlights
- **Modular utility functions** - `createBorder()`, `createBorderedLine()`, etc.
- **Destructuring for clarity** - `const { player, enemies } = gameState`
- **Error handling** - Try-catch blocks in animations
- **Safe math operations** - Prevents negative values and overflows
- **Compound emoji support** - Fixed-position animations

### Base Player Stats
```javascript
const BASE_PLAYER_STATS = {
    hp: 100,
    attack: 10,
    defense: 6,
    magic: 12
};
```
All heroes and party members scale from these values using multipliers.

---

## 🚀 Performance

### Optimizations
- **Efficient rendering** - Only redraws on state changes
- **Sound pooling** - Reuses Audio objects
- **Smart animation** - Fixed 10-15 frame animations
- **Minimal DOM manipulation** - Console-based for speed

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ❌ Mobile browsers (not supported)

---

## 📱 Social Media & SEO

### Open Graph Tags
- Optimized for Facebook, LinkedIn, Twitter sharing
- Custom preview image (`social image.png`)
- Professional description and metadata
- Links to developer portfolio

### Meta Tags
- SEO optimized title and description
- Author and keywords metadata
- Proper locale settings (en_US)

---

### Contact
- 📧 **Email**: alexander@arich-software.co.il
- 🌐 **Website**: [arich-software.co.il](https://arich-software.co.il)
- 💼 **LinkedIn**: [arich-software](https://www.linkedin.com/in/arich-software)
- 📘 **Facebook**: [arichsoftware](https://www.facebook.com/arichsoftware)
- 💬 **WhatsApp**: [+972545690911](https://wa.me/+972545690911)

---

## 🤝 Available For

- ✅ Freelance Projects & Contract Work
- ✅ Full-Time Positions
- ✅ Technical Consulting & System Optimization

**Let's build something amazing together!**

---

## 📝 License

Created by **Alexander Richkov**. This project showcases creative game development and modern web technologies.

---

## 🎮 Play Now!

Simply open `index.html` in your browser and press F12 to start your adventure!

**Ready to save the codebase from the ultimate bug? Start your adventure now!** 🚀⚔️
