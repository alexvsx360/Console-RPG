(() => {
    'use strict';

    /* =========================
       Console RPG – Fantasy Style
       Enhanced with visible enemies, shops, and animations
       ========================= */

    const startBtn = document.getElementById("start-btn");
    const statusEl = document.getElementById("status");
    const container = document.getElementById("container");
    const statsDisplay = document.getElementById("stats-display");
    
    // Audio control elements
    const toggleMusicBtn = document.getElementById("toggle-music");
    const toggleEffectsBtn = document.getElementById("toggle-effects");
    const toggleAllBtn = document.getElementById("toggle-all");

    /* ---------- DevTools detection ---------- */
    let devtoolsOpen = false;
    let gameStarted = false;
    function checkDevTools() {
        const threshold = 160;
        const open =
            (window.outerWidth - window.innerWidth > threshold) ||
            (window.outerHeight - window.innerHeight > threshold);
        if (open !== devtoolsOpen) {
            devtoolsOpen = open;
            if (!gameStarted) {
                showStatus(open ? "✅ DevTools detected! Ready to adventure!" : "Waiting for DevTools to open...", open ? "success" : "info");
            } else if (!open) {
                showStatus("❌ DevTools closed! Reopen to continue.", "error");
            }
        }
    }
    setInterval(checkDevTools, 800);

    function showStatus(msg, kind = "info") {
        statusEl.textContent = msg;
        statusEl.className = kind;
    }

    /* ===================================================
       AUDIO SYSTEM
       =================================================== */
    
    const audioFiles = {
        // Music (existing)
        mapMusic: new Audio('sound/map music.mp3'),
        battleMusic: new Audio('sound/battel music.mp3'),
        encounterSound: new Audio('sound/enenmy encounter sound.mp3'),
        gameOverMusic: new Audio('sound/game over music.mp3'),
        spendSound: new Audio('sound/spend mony sound.mp3'),
        
        // New sounds
        levelUpSound: new Audio('sound/level up sound.mp3'),
        innRestSound: new Audio('sound/inn rest sound.mp3'),
        battleVictorySound: new Audio('sound/battle victory sound.mp3'),
        
        // Attack sounds (multiple for variety)
        swing1: new Audio('sound/swing.wav'),
        swing2: new Audio('sound/swing2.wav'),
        swing3: new Audio('sound/swing3.wav'),
        swordUnsheathe: new Audio('sound/sword-unsheathe.wav'),
        
        // Magic sounds
        magic1: new Audio('sound/magic1.wav'),
        spell: new Audio('sound/spell.wav'),
        
        // Special/Interface sounds
        interface1: new Audio('sound/interface1.wav'),
        interface2: new Audio('sound/interface2.wav'),
        interface3: new Audio('sound/interface3.wav'),
        interface4: new Audio('sound/interface4.wav'),
        interface5: new Audio('sound/interface5.wav'),
        interface6: new Audio('sound/interface6.wav'),
        
        // Enemy hurt sounds (variety by type)
        monsterHurt1: new Audio('sound/mnstr5.wav'),
        monsterHurt2: new Audio('sound/mnstr7.wav'),
        monsterHurt3: new Audio('sound/mnstr9.wav'),
        ogreHurt: new Audio('sound/ogre2.wav'),
        slimeHurt: new Audio('sound/slime3.wav'),
        shadeHurt: new Audio('sound/shade5.wav'),
        giantHurt: new Audio('sound/giant3.wav'),
        
        // Inventory/Collection sounds
        coin1: new Audio('sound/coin.wav'),
        coin2: new Audio('sound/coin2.wav'),
        coin3: new Audio('sound/coin3.wav'),
        bottle: new Audio('sound/bottle.wav'),
        cloth: new Audio('sound/cloth.wav'),
        
        // Defend/Armor sounds
        chainmail: new Audio('sound/chainmail1.wav'),
        armorLight: new Audio('sound/armor-light.wav'),
        
        // World sounds
        door: new Audio('sound/door.wav'),
        
        // Misc
        bubble: new Audio('sound/bubble.wav')
    };
    
    // Configure audio settings
    audioFiles.mapMusic.loop = true;
    audioFiles.mapMusic.volume = 0.3;
    audioFiles.battleMusic.loop = true;
    audioFiles.battleMusic.volume = 0.4;
    audioFiles.encounterSound.volume = 0.5;
    audioFiles.gameOverMusic.loop = true;
    audioFiles.gameOverMusic.volume = 0.3;
    audioFiles.spendSound.volume = 0.4;
    
    // New sounds
    audioFiles.levelUpSound.volume = 0.5;
    audioFiles.innRestSound.volume = 0.5;
    audioFiles.battleVictorySound.volume = 0.5;
    
    // Attack sounds
    audioFiles.swing1.volume = 0.35;
    audioFiles.swing2.volume = 0.35;
    audioFiles.swing3.volume = 0.35;
    audioFiles.swordUnsheathe.volume = 0.3;
    
    // Magic sounds
    audioFiles.magic1.volume = 0.4;
    audioFiles.spell.volume = 0.4;
    
    // Interface sounds
    audioFiles.interface1.volume = 0.5; // Level up
    audioFiles.interface2.volume = 0.3;
    audioFiles.interface3.volume = 0.6; // Special
    audioFiles.interface4.volume = 0.3;
    audioFiles.interface5.volume = 0.4; // Player hurt
    audioFiles.interface6.volume = 0.3;
    
    // Enemy hurt sounds
    audioFiles.monsterHurt1.volume = 0.3;
    audioFiles.monsterHurt2.volume = 0.3;
    audioFiles.monsterHurt3.volume = 0.3;
    audioFiles.ogreHurt.volume = 0.35;
    audioFiles.slimeHurt.volume = 0.3;
    audioFiles.shadeHurt.volume = 0.3;
    audioFiles.giantHurt.volume = 0.4;
    
    // Inventory sounds
    audioFiles.coin1.volume = 0.3;
    audioFiles.coin2.volume = 0.3;
    audioFiles.coin3.volume = 0.3;
    audioFiles.bottle.volume = 0.3;
    audioFiles.cloth.volume = 0.3;
    
    // Defend sounds
    audioFiles.chainmail.volume = 0.35;
    audioFiles.armorLight.volume = 0.3;
    
    // World sounds
    audioFiles.door.volume = 0.4;
    
    // Misc
    audioFiles.bubble.volume = 0.3;
    
    let currentMusic = null;
    
    // Audio settings state (load from localStorage or defaults)
    const audioSettings = {
        musicEnabled: localStorage.getItem('audioMusic') !== 'false',
        effectsEnabled: localStorage.getItem('audioEffects') !== 'false',
        allEnabled: localStorage.getItem('audioAll') !== 'false'
    };
    
    function updateAudioUI() {
        // Update music button
        toggleMusicBtn.querySelector('.icon').textContent = audioSettings.musicEnabled ? '🎵' : '🔇';
        toggleMusicBtn.title = audioSettings.musicEnabled ? 'Music: ON (Click to mute)' : 'Music: OFF (Click to unmute)';
        if (audioSettings.musicEnabled) {
            toggleMusicBtn.classList.remove('muted');
        } else {
            toggleMusicBtn.classList.add('muted');
        }
        
        // Update effects button
        toggleEffectsBtn.querySelector('.icon').textContent = audioSettings.effectsEnabled ? '🔔' : '🔕';
        toggleEffectsBtn.title = audioSettings.effectsEnabled ? 'Effects: ON (Click to mute)' : 'Effects: OFF (Click to unmute)';
        if (audioSettings.effectsEnabled) {
            toggleEffectsBtn.classList.remove('muted');
        } else {
            toggleEffectsBtn.classList.add('muted');
        }
        
        // Update all button
        toggleAllBtn.querySelector('.icon').textContent = audioSettings.allEnabled ? '🔊' : '🔇';
        toggleAllBtn.title = audioSettings.allEnabled ? 'All Audio: ON (Click to mute)' : 'All Audio: OFF (Click to unmute)';
        if (audioSettings.allEnabled) {
            toggleAllBtn.classList.remove('muted');
        } else {
            toggleAllBtn.classList.add('muted');
        }
        
        // If all is disabled, disable individual settings too
        if (!audioSettings.allEnabled) {
            if (currentMusic) {
                currentMusic.pause();
                currentMusic.currentTime = 0;
                currentMusic = null;
            }
        }
    }
    
    // Audio control event listeners
    toggleMusicBtn.addEventListener('click', () => {
        audioSettings.musicEnabled = !audioSettings.musicEnabled;
        localStorage.setItem('audioMusic', audioSettings.musicEnabled);
        updateAudioUI();
        
        if (!audioSettings.musicEnabled && currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
            currentMusic = null;
        }
    });
    
    toggleEffectsBtn.addEventListener('click', () => {
        audioSettings.effectsEnabled = !audioSettings.effectsEnabled;
        localStorage.setItem('audioEffects', audioSettings.effectsEnabled);
        updateAudioUI();
    });
    
    toggleAllBtn.addEventListener('click', () => {
        audioSettings.allEnabled = !audioSettings.allEnabled;
        localStorage.setItem('audioAll', audioSettings.allEnabled);
        
        // When toggling all, sync the individual settings
        if (!audioSettings.allEnabled) {
            audioSettings.musicEnabled = false;
            audioSettings.effectsEnabled = false;
            localStorage.setItem('audioMusic', "false");
            localStorage.setItem('audioEffects', "false");
        } else {
            audioSettings.musicEnabled = true;
            audioSettings.effectsEnabled = true;
            localStorage.setItem('audioMusic', "true");
            localStorage.setItem('audioEffects', "true");
        }
        
        updateAudioUI();
    });
    
    // Initialize UI on load
    updateAudioUI();
    
    function playMusic(musicType) {
        // Check if music is enabled
        if (!audioSettings.allEnabled || !audioSettings.musicEnabled) {
            return;
        }
        
        // Stop current music if playing
        if (currentMusic && currentMusic !== audioFiles[musicType]) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }
        
        // Play new music
        const music = audioFiles[musicType];
        if (music && currentMusic !== music) {
            music.currentTime = 0;
            music.play().catch(e => console.log('Audio play prevented:', e));
            currentMusic = music;
        }
    }
    
    function playSound(soundType) {
        // Check if effects are enabled
        if (!audioSettings.allEnabled || !audioSettings.effectsEnabled) {
            return;
        }
        
        const sound = audioFiles[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play prevented:', e));
        }
    }
    
    function stopAllAudio() {
        Object.values(audioFiles).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        currentMusic = null;
    }
    
    // Helper functions for random sound variations
    function playRandomAttackSound() {
        const sounds = ['swing1', 'swing2', 'swing3'];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        playSound(randomSound);
    }
    
    function playEnemyHurtSound(enemyName) {
        // Map enemy types to specific sound sets
        let soundSet;
        
        if (enemyName.includes('Slime') || enemyName.includes('Blob')) {
            soundSet = ['slimeHurt'];
        } else if (enemyName.includes('Shadow') || enemyName.includes('Ghost') || enemyName.includes('Phantom')) {
            soundSet = ['shadeHurt'];
        } else if (enemyName.includes('Giant') || enemyName.includes('Titan') || enemyName.includes('Golem')) {
            soundSet = ['giantHurt'];
        } else if (enemyName.includes('Ogre') || enemyName.includes('Troll') || enemyName.includes('Brute')) {
            soundSet = ['ogreHurt'];
        } else {
            // Default monster sounds for generic enemies
            soundSet = ['monsterHurt1', 'monsterHurt2', 'monsterHurt3'];
        }
        
        const randomSound = soundSet[Math.floor(Math.random() * soundSet.length)];
        playSound(randomSound);
    }
    
    function playEnemyAttackSound(enemyName) {
        // Different attack sounds for different enemy types
        let soundSet;
        
        if (enemyName.includes('Slime') || enemyName.includes('Blob')) {
            soundSet = ['bubble'];
        } else if (enemyName.includes('Bug') || enemyName.includes('Squasher')) {
            soundSet = ['monsterHurt1', 'monsterHurt2']; // Screechy sounds
        } else {
            // Regular swing sounds for most enemies
            soundSet = ['swing1', 'swing2', 'swing3'];
        }
        
        const randomSound = soundSet[Math.floor(Math.random() * soundSet.length)];
        playSound(randomSound);
    }
    
    function playRandomCoin() {
        const sounds = ['coin1', 'coin2', 'coin3'];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        playSound(randomSound);
    }
    
    function playRandomMagic() {
        const sounds = ['magic1', 'spell'];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        playSound(randomSound);
    }

    /* ===================================================
       RPG GAME ENGINE
       =================================================== */

    const MAP_WIDTH = 25;
    const MAP_HEIGHT = 15;
    const INN_COST = 100;
    const PARTY_MEMBER_COST = 50;

    // Game modes
    const MODE_EXPLORE = 'explore';
    const MODE_BATTLE = 'battle';
    const MODE_SHOP = 'shop';
    const MODE_INN = 'inn';
    const MODE_CHARACTER_SELECT = 'character_select';

    // Base player stats template (all heroes scale from this)
    const BASE_PLAYER_STATS = {
        hp: 100,
        attack: 10,
        defense: 6,
        magic: 12
    };
    

    function printEmojiQR() {
      let  QR64 = 'data:image/png;base64,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nK5bZU7XuefDzXNsg/+YxV16u7DbbxXn3ovr3DnTzj1f2rnnc116Tref69w5XbfKnK5zz4eb59gGTwghhJCXy/nSDEIIIYSQTcMLECGEEEJeLmyDL8HprOzcbc2uc+fc3bn36Tp3Tte5c67i3HtZxbn34jp3Ttw8xzb4EpzOys7d1uw6d87dnXufrnPndJ075yrOvZdVnHsvrnPnxM1z3auSs00Vh6vP/jjnbmt2nTvn7s69T9e5c7rOnXMV597LKs69F9e5c+Kmuf4FyNimisMNz/4w11przrbmZjp3zt1dM++zmc6d03XNnLMt4tx7WcU1816a6dw5cfNceQE6dmnUDapX21RxuPrsT3O//TP090+qxnPunLs79z5d587pOnfOVZx7L6s4915c586Jm+fKH4E9dmmcV92misNd1U9w7rZm17lz7u7c+3SdO6fr3DlXce69rOLce3GdOydunpO/AL2JLaqPer9486rP4nA/wbV2H7Yz11L/h+Y6d87dnXufrnPndJ075yrOvZdVnHsvrnPnxM1zw98BOt6Uxi2qj6rbVHG4+uxPc0fqz9GqVOozqvq4c+7ujtS7U6VSn1HVx53TdUfqTKpU6jOqVOozqlTqM6r6uPeyijtS70CVSn1GVR93Ttw8N/wC9NVtqjhcffanubu5rdl1N3PO3Z17n667mXO6zp1zFXcz72UV596L627mnLh5rnsBcrap4nD12Z/mbua2Zte5c+7u3Pt0nTun69w5V3Huvazi3HtxnTsnbp5jG/zH4LrPn1ncuduaXefOubtz79N17pyuc+dcxbn3sopz78V17py4eY5t8IQQQgh5uZwvzSCEEEII2TS8ABFCCCHk5cI2+JKZzt0S7Dp3Ttel51yln+vcOXHaud9D2qXPt0o/16XndPu5zp0TNzq2wZfMdO6WYNe5c7ouPecq/VznzonTzv0e0i59vlX6uS49p9vPde6cuNF1r0rONlXchXO3BLvOndN16TlX6ec6d06cdu73kHbp863Sz3XpOd1+rnPnxA2ufwEytqnizl1rzdoS3Eznzum6Fp6zLdKvmc6dE6ddM7+HFnbp863Sz3UtPGcz+zXTuXPiRldegI5dGnWD6tU2Vdy5++2fP79/UjWec+d0XXrOVfq5zp0Tp537PaRd+nyr9HNdek63n+vcOXGjK38E9tilcV51myru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'
        console.log(
            "%c ",
            "font-size: 10px; " +
            "padding: 200px 200px; " + 
            "background-size: contain; " + 
            "background-repeat: no-repeat; " +
            `background-image: url('${QR64}');`) 
        }

    
    // Character database
    const CHARACTERS = [
        { emoji: "🧑‍💻", title: "The Code Warrior", nickname: "Full-Stack Fury", story: "Wields multiple keyboards and fixes bugs by introducing smaller ones.", attack: "💻", magic: "🧠", super: "🧨", attackName: "Code Slash", magicName: "Brain Blast", specialName: "Stack Explosion", skins: ["🧑🏻‍💻","🧑🏼‍💻","🧑🏽‍💻","🧑🏾‍💻","🧑🏿‍💻"], isHero: true, hpMult: 1.2, attackMult: 1.2, defenseMult: 1.0, magicMult: 1.25 },
        { emoji: "🧑‍🔬", title: "The Algorithm Alchemist", nickname: "Data Whisperer", story: "Summons charts from spreadsheets with rituals that occasionally break reality.", attack: "🧪", magic: "🧫", super: "🔬", attackName: "Potion Toss", magicName: "Data Transmutation", specialName: "Scientific Breakthrough", skins: ["🧑🏻‍🔬","🧑🏼‍🔬","🧑🏽‍🔬","🧑🏾‍🔬","🧑🏿‍🔬"], isHero: true, hpMult: 1.0, attackMult: 1.0, defenseMult: 0.85, magicMult: 1.65 },
        { emoji: "🧑‍🎨", title: "The Color Sorcerer", nickname: "UI Mage", story: "Communicates via Figma boards and vibes; claims hex #FF5733 'feels arrogant'.", attack: "🎨", magic: "🖌️", super: "🌈", attackName: "Palette Strike", magicName: "Gradient Wave", specialName: "Rainbow Overflow", skins: ["🧑🏻‍🎨","🧑🏼‍🎨","🧑🏽‍🎨","🧑🏾‍🎨","🧑🏿‍🎨"], isHero: true, hpMult: 0.9, attackMult: 0.8, defenseMult: 0.65, magicMult: 1.85 },
        { emoji: "🥷", title: "Dark-Mode Ninja", nickname: "Silent Committer", story: "Appears from the shadows and drops PRs that mysteriously fix everything.", attack: "🗡️", magic: "💨", super: "💀", attackName: "Shadow Strike", magicName: "Smoke Bomb", specialName: "Assassination", skins: ["🥷🏻","🥷🏼","🥷🏽","🥷🏾","🥷🏿"], isHero: true, hpMult: 1.1, attackMult: 1.8, defenseMult: 1.35, magicMult: 0.85 },
        { emoji: "🧑‍🚀", title: "The Visionary", nickname: "Space Dev", story: "Writes code nobody understands, convinced it will disrupt the galaxy.", attack: "🚀", magic: "🪐", super: "🌌", attackName: "Rocket Launch", magicName: "Planet Crush", specialName: "Galactic Disruption", skins: ["🧑🏻‍🚀","🧑🏼‍🚀","🧑🏽‍🚀","🧑🏾‍🚀","🧑🏿‍🚀"], isHero: true, hpMult: 1.05, attackMult: 1.1, defenseMult: 1.15, magicMult: 1.5 },
        { emoji: "🧑‍🍳", title: "The CSS Chef", nickname: "Frontend Gourmet", story: "Seasons everything with gradients and refuses to serve raw HTML.", attack: "🔪", magic: "🍲", super: "🔥", attackName: "Knife Slice", magicName: "Recipe Cast", specialName: "Kitchen Fire", skins: ["🧑🏻‍🍳","🧑🏼‍🍳","🧑🏽‍🍳","🧑🏾‍🍳","🧑🏿‍🍳"], isHero: true, hpMult: 0.95, attackMult: 1.3, defenseMult: 0.85, magicMult: 1.4 },
        { emoji: "🧑‍🏭", title: "The Pipeline Worker", nickname: "DevOps Dynamo", story: "Treats CI/CD like molten metal and sleeps next to Kubernetes logs.", attack: "🛠️", magic: "🧯", super: "🏭", attackName: "Wrench Smash", magicName: "Fire Suppression", specialName: "Factory Meltdown", skins: ["🧑🏻‍🏭","🧑🏼‍🏭","🧑🏽‍🏭","🧑🏾‍🏭","🧑🏿‍🏭"], isHero: true, hpMult: 1.15, attackMult: 1.4, defenseMult: 1.5, magicMult: 1.0 },
        { emoji: "🧑‍🚒", title: "The Firefighter", nickname: "Incident Responder", story: "Lives for 2 AM production fires. Slack status: '🔥 Still burning'.", attack: "🧯", magic: "🔥", super: "🌋", attackName: "Extinguisher Blast", magicName: "Fireball", specialName: "Volcanic Eruption", skins: ["🧑🏻‍🚒","🧑🏼‍🚒","🧑🏽‍🚒","🧑🏾‍🚒","🧑🏿‍🚒"], isHero: true, hpMult: 1.25, attackMult: 1.6, defenseMult: 1.65, magicMult: 0.65 },
        
        { emoji: "🧑‍⚕️", title: "The Code Doctor", nickname: "Patch Master", story: "Heals production with a fresh dose of sudo. Medical degree from Stack Overflow University. Diagnoses bugs with a stethoscope pressed against the server. Prescriptions written exclusively in terminal commands. Office hours are 3 AM during production incidents. Hippocratic Oath modified to 'First, do not break prod.' Has broken prod 47 times.", attack: "💉", magic: "🧪", super: "🫀", attackName: "Injection", magicName: "Potion Brew", specialName: "Surgery", skins: ["🧑🏻‍⚕️","🧑🏼‍⚕️","🧑🏽‍⚕️","🧑🏾‍⚕️","🧑🏿‍⚕️"], isParty: true, hpMult: 0.8, attackMult: 0.7, defenseMult: 0.8, magicMult: 1.5 },
        { emoji: "👨‍⚕️", title: "The Code Doctor", nickname: "Patch Master", story: "Writes prescriptions on JIRA tickets. Believes every error can be cured with more logging. Surgery performed with vim commands. Anesthesia is commenting out painful code. Once performed emergency open-source surgery on a failing API. Patient survived but has permanent scars in the form of technical debt. Malpractice insurance very expensive.", attack: "💉", magic: "🧪", super: "🫀", attackName: "Injection", magicName: "Potion Brew", specialName: "Surgery", skins: ["👨🏻‍⚕️","👨🏼‍⚕️","👨🏽‍⚕️","👨🏾‍⚕️","👨🏿‍⚕️"], isParty: true, hpMult: 0.8, attackMult: 0.7, defenseMult: 0.8, magicMult: 1.5 },
        { emoji: "👩‍⚕️", title: "The Code Doctor", nickname: "Patch Master", story: "Administers hotfix drips to dying servers. ICU is the server room. Life support machine runs on deprecated dependencies. Bedside manner includes passive-aggressive code comments. Diagnosed a database with chronic performance issues and prescribed indexing therapy. Recovery rate: 60%. Side effects include increased complexity and mysterious warnings. Refuses to make house calls unless paid in cryptocurrency.", attack: "💉", magic: "🧪", super: "🫀", attackName: "Injection", magicName: "Potion Brew", specialName: "Surgery", skins: ["👩🏻‍⚕️","👩🏼‍⚕️","👩🏽‍⚕️","👩🏾‍⚕️","👩🏿‍⚕️"], isParty: true, hpMult: 0.8, attackMult: 0.7, defenseMult: 0.8, magicMult: 1.5 },
        { emoji: "🧑‍🎓", title: "The Junior Dev", nickname: "Stack Apprentice", story: "Believes console.log fixes everything. Currently on their 47th debugging session using only print statements. Resume claims 'proficient in all languages' after completing one JavaScript tutorial. Asks 'what's a closure?' in every interview. Got hired anyway because they were cheap. Copies code from Stack Overflow without reading it. Surprised when it doesn't work. Blames the language.", attack: "📚", magic: "💡", super: "🧠", attackName: "Book Slam", magicName: "Light Bulb", specialName: "Brain Storm", skins: ["🧑🏻‍🎓","🧑🏼‍🎓","🧑🏽‍🎓","🧑🏾‍🎓","🧑🏿‍🎓"], isParty: true, hpMult: 0.65, attackMult: 0.5, defenseMult: 0.5, magicMult: 1.0 },
        { emoji: "👨‍🎓", title: "The Junior Dev", nickname: "Stack Apprentice", story: "Graduated from Tutorial Hell with honors. Spent three years watching YouTube coding videos. Built 47 TODO apps. Portfolio showcases calculator in React with 300 dependencies. First day on job asked where to download more RAM. Senior dev cried. Still employed somehow. Coffee consumption exceeds code production.", attack: "📚", magic: "💡", super: "🧠", attackName: "Book Slam", magicName: "Light Bulb", specialName: "Brain Storm", skins: ["👨🏻‍🎓","👨🏼‍🎓","👨🏽‍🎓","👨🏾‍🎓","👨🏿‍🎓"], isParty: true, hpMult: 0.65, attackMult: 0.5, defenseMult: 0.5, magicMult: 1.0 },
        { emoji: "👩‍🎓", title: "The Junior Dev", nickname: "Stack Apprentice", story: "Still thinks TODO comments are magic spells. Writes them in ALL CAPS hoping the compiler listens better. Codebase contains 2,847 unresolved TODOs dating back to 2019. When asked about them, claims they're 'documentation of future intentions.' Git commit messages all say 'fixed stuff'. Nobody knows what stuff. She doesn't either.", attack: "📚", magic: "💡", super: "🧠", attackName: "Book Slam", magicName: "Light Bulb", specialName: "Brain Storm", skins: ["👩🏻‍🎓","👩🏼‍🎓","👩🏽‍🎓","👩🏾‍🎓","👩🏿‍🎓"], isParty: true, hpMult: 0.65, attackMult: 0.5, defenseMult: 0.5, magicMult: 1.0 },
        { emoji: "🧑‍🏫", title: "The Syntax Sensei", nickname: "Senior Mentor", story: "Tells parables about tabs vs spaces that last three hours. Remembers writing COBOL in the beforetimes. Survived the Great Y2K Panic. Seen every framework rise and fall. Witnessed JavaScript become a backend language and didn't blink. Meditation involves staring at perfectly formatted code. Inner peace achieved through proper indentation. Has transcended the need for Stack Overflow.", attack: "🖊️", magic: "📘", super: "🧾", attackName: "Pen Strike", magicName: "Knowledge Beam", specialName: "Receipt Storm", skins: ["🧑🏻‍🏫","🧑🏼‍🏫","🧑🏽‍🏫","🧑🏾‍🏫","🧑🏿‍🏫"], isParty: true, hpMult: 0.9, attackMult: 0.85, defenseMult: 1.0, magicMult: 1.3 },
        { emoji: "👨‍🏫", title: "The Syntax Sensei", nickname: "Senior Mentor", story: "Grades your PRs with red pen and puns. Every code review comment is a dad joke wrapped in constructive criticism. Rejected 47 pull requests for 'lack of elegance.' Believes code should be poetry. His own code reads like tax law written by someone having a stroke. Students fear his feedback. Seniors respect his wisdom. Juniors cry in the bathroom.", attack: "🖊️", magic: "📘", super: "🧾", attackName: "Pen Strike", magicName: "Knowledge Beam", specialName: "Receipt Storm", skins: ["👨🏻‍🏫","👨🏼‍🏫","👨🏽‍🏫","👨🏾‍🏫","👨🏿‍🏫"], isParty: true, hpMult: 0.9, attackMult: 0.85, defenseMult: 1.0, magicMult: 1.3 },
        { emoji: "👩‍🏫", title: "The Syntax Sensei", nickname: "Senior Mentor", story: "Lectures enemies until they pass out from knowledge overload. Once gave a 6-hour presentation on proper variable naming conventions. Attendees learned nothing but gained PTSD. Teaching style combines Socratic method with existential dread. Pop quizzes involve live coding interviews. No one has ever passed. She doesn't expect them to. Character building, she says.", attack: "🖊️", magic: "📘", super: "🧾", attackName: "Pen Strike", magicName: "Knowledge Beam", specialName: "Receipt Storm", skins: ["👩🏻‍🏫","👩🏼‍🏫","👩🏽‍🏫","👩🏾‍🏫","👩🏿‍🏫"], isParty: true, hpMult: 0.9, attackMult: 0.85, defenseMult: 1.0, magicMult: 1.3 },
        { emoji: "🧑‍🌾", title: "The Data Farmer", nickname: "SQLtivator", story: "Plants queries and harvests insights from fields of tables. Fertilizes databases with proper indexing. Crop rotation involves moving data between staging and production. Scarecrow keeps away junior devs who want to SELECT *. Weather forecast predicts heavy query load. Barn contains backup tapes from 1987. Tractor runs on diesel and optimized joins. Prize-winning pumpkin was actually a perfectly normalized schema.", attack: "🌾", magic: "🌱", super: "🧬", attackName: "Wheat Whip", magicName: "Seed Grow", specialName: "DNA Splice", skins: ["🧑🏻‍🌾","🧑🏼‍🌾","🧑🏽‍🌾","🧑🏾‍🌾","🧑🏿‍🌾"], isParty: true, hpMult: 0.8, attackMult: 0.75, defenseMult: 0.85, magicMult: 1.2 },
        { emoji: "👨‍🌾", title: "The Data Farmer", nickname: "SQLtivator", story: "Cries when someone says 'NoSQL' like they insulted his ancestors. Three generations of SQL farmers before him. Grandpa wrote queries on punch cards uphill both ways. Still using same WHERE clauses from 2003. They still work. Tried MongoDB once. Barn caught fire. Coincidence? He thinks not. Prefers his data relational and his relationships complicated.", attack: "🌾", magic: "🌱", super: "🧬", attackName: "Wheat Whip", magicName: "Seed Grow", specialName: "DNA Splice", skins: ["👨🏻‍🌾","👨🏼‍🌾","👨🏽‍🌾","👨🏾‍🌾","👨🏿‍🌾"], isParty: true, hpMult: 0.8, attackMult: 0.75, defenseMult: 0.85, magicMult: 1.2 },
        { emoji: "👩‍🌾", title: "The Data Farmer", nickname: "SQLtivator", story: "Keeps seed packets labeled 'SELECT * FROM crops WHERE season = spring'. Planting schedule determined by cron jobs. Irrigation system controlled by Python scripts. Once grew a carrot shaped like a foreign key. Sold it on eBay. Chickens are named after database engines: MySQL, PostgreSQL, and Barbara. Barbara doesn't follow any conventions. Barbara is chaos.", attack: "🌾", magic: "🌱", super: "🧬", attackName: "Wheat Whip", magicName: "Seed Grow", specialName: "DNA Splice", skins: ["👩🏻‍🌾","👩🏼‍🌾","👩🏽‍🌾","👩🏾‍🌾","👩🏿‍🌾"], isParty: true, hpMult: 0.8, attackMult: 0.75, defenseMult: 0.85, magicMult: 1.2 },
        { emoji: "🧑‍🔧", title: "The Patch Mechanic", nickname: "Bug Fixer", story: "Lives under the server rack, smells like WD-40 and caffeine. Haven't seen daylight since 2019. Bed is a sleeping bag between two blade servers. Diet consists of energy drinks and regret. Fixes hardware with percussive maintenance. Fixes software by turning it off and on again. Once repaired critical database server using duct tape and prayer. Prayer didn't work. Duct tape did.", attack: "🔧", magic: "⚙️", super: "🧰", attackName: "Wrench Hit", magicName: "Gear Spin", specialName: "Toolbox Slam", skins: ["🧑🏻‍🔧","🧑🏼‍🔧","🧑🏽‍🔧","🧑🏾‍🔧","🧑🏿‍🔧"], isParty: true, hpMult: 0.85, attackMult: 0.95, defenseMult: 1.15, magicMult: 0.8 },
        { emoji: "👨‍🔧", title: "The Patch Mechanic", nickname: "Bug Fixer", story: "Motto: 'If it compiles, it ships.' Quality assurance is optional. Testing is for the weak. Debugging is for production. Shipped code with 47 known issues. Received promotion. Logic doesn't apply here. Emergency contact is Stack Overflow. Carries lucky wrench that has never been used for its intended purpose. It's for intimidation.", attack: "🔧", magic: "⚙️", super: "🧰", attackName: "Wrench Hit", magicName: "Gear Spin", specialName: "Toolbox Slam", skins: ["👨🏻‍🔧","👨🏼‍🔧","👨🏽‍🔧","👨🏾‍🔧","👨🏿‍🔧"], isParty: true, hpMult: 0.85, attackMult: 0.95, defenseMult: 1.15, magicMult: 0.8 },
        { emoji: "👩‍🔧", title: "The Patch Mechanic", nickname: "Bug Fixer", story: "Hotfixes delivered with socket wrench flair and unnecessary sparks. Every repair comes with theatrical performance. Wears safety goggles indoors for dramatic effect. Toolbox contains more zip ties than tools. Solved authentication bug by hitting server with hammer. Server worked. Nobody asks questions. Documentation consists of one Post-it note that says 'good luck'.", attack: "🔧", magic: "⚙️", super: "🧰", attackName: "Wrench Hit", magicName: "Gear Spin", specialName: "Toolbox Slam", skins: ["👩🏻‍🔧","👩🏼‍🔧","👩🏽‍🔧","👩🏾‍🔧","👩🏿‍🔧"], isParty: true, hpMult: 0.85, attackMult: 0.95, defenseMult: 1.15, magicMult: 0.8 },
        { emoji: "🧑‍💼", title: "The Feature Priest", nickname: "PM of Destiny", story: "Can say 'synergy' 17 times per sprint without breathing. Vocabulary consists entirely of business buzzwords. Actual meaning unknown. Communicates via JIRA tickets and inspirational LinkedIn posts. Calendar is 47 back-to-back meetings. Productivity measured in coffee consumed not work completed. Asked engineers to 'move fast and break things.' Engineers moved fast. Everything broke. Called it 'agile innovation'.", attack: "🗂️", magic: "📊", super: "💼", attackName: "File Throw", magicName: "Chart Attack", specialName: "Briefcase Bomb", skins: ["🧑🏻‍💼","🧑🏼‍💼","🧑🏽‍💼","🧑🏾‍💼","🧑🏿‍💼"], isParty: true, hpMult: 0.75, attackMult: 0.6, defenseMult: 0.65, magicMult: 1.25 },
        { emoji: "👨‍💼", title: "The Feature Priest", nickname: "PM of Destiny", story: "Wields PowerPoints like ancient weapons of mass confusion. Each slide contains more animations than information. Presentations last exactly forever. Bullet points reproduce asexually. Requested simple login page. Delivered 200-slide deck on authentication philosophy. Timeline: 'as soon as possible' which means never. Budget: three pizzas and broken dreams.", attack: "🗂️", magic: "📊", super: "💼", attackName: "File Throw", magicName: "Chart Attack", specialName: "Briefcase Bomb", skins: ["👨🏻‍💼","👨🏼‍💼","👨🏽‍💼","👨🏾‍💼","👨🏿‍💼"], isParty: true, hpMult: 0.75, attackMult: 0.6, defenseMult: 0.65, magicMult: 1.25 },
        { emoji: "👩‍💼", title: "The Feature Priest", nickname: "PM of Destiny", story: "Schedules meetings about meetings about scheduling meetings. Outlook calendar is a war crime. Double-booked every hour including lunch and existential crisis time. Sends 'quick sync' invites at 4:58 PM Friday. 'This could have been an email' is tattooed backwards on her forehead so she sees it in mirror every morning. She doesn't.", attack: "🗂️", magic: "📊", super: "💼", attackName: "File Throw", magicName: "Chart Attack", specialName: "Briefcase Bomb", skins: ["👩🏻‍💼","👩🏼‍💼","👩🏽‍💼","👩🏾‍💼","👩🏿‍💼"], isParty: true, hpMult: 0.75, attackMult: 0.6, defenseMult: 0.65, magicMult: 1.25 },
        { emoji: "👮", title: "Firewall Guardian", nickname: "Security Team", story: "Blocks everything including updates, developers, and common sense. Motto: 'Better safe than functional.' Port 80 is forbidden. Port 443 requires three forms of ID and blood sample. Once blocked CEO from accessing company website. No exceptions. Security through obscurity and paranoia. VPN connects to another VPN. Nobody knows why. Nobody asks.", attack: "🚨", magic: "🔒", super: "🧱", attackName: "Siren Blast", magicName: "Lock Down", specialName: "Wall Crash", skins: ["👮🏻","👮🏼","👮🏽","👮🏾","👮🏿"], isParty: true, hpMult: 1.0, attackMult: 1.0, defenseMult: 1.65, magicMult: 0.65 },
        { emoji: "👮‍♂️", title: "Firewall Guardian", nickname: "Security Team", story: "Asks 'Have you tried logging out?' for every single problem. Printer jammed? Log out. Server on fire? Log out. Existential crisis? Believe it or not, also log out. Password requirements include hieroglyphics. Changes security policy daily. Nobody can keep up. That's the point. Trust no one not even yourself. Especially not yourself.", attack: "🚨", magic: "🔒", super: "🧱", attackName: "Siren Blast", magicName: "Lock Down", specialName: "Wall Crash", skins: ["👮🏻‍♂️","👮🏼‍♂️","👮🏽‍♂️","👮🏾‍♂️","👮🏿‍♂️"], isParty: true, hpMult: 1.0, attackMult: 1.0, defenseMult: 1.65, magicMult: 0.65 },
        { emoji: "👮‍♀️", title: "Firewall Guardian", nickname: "Security Team", story: "Hands out 2FA like parking tickets at a police convention. You need 2FA to access 2FA setup page. Three different authenticator apps required. Backup codes require notarization. Once implemented 47-factor authentication. System became sentient and locked itself out. She considered it a feature. Security is working as intended.", attack: "🚨", magic: "🔒", super: "🧱", attackName: "Siren Blast", magicName: "Lock Down", specialName: "Wall Crash", skins: ["👮🏻‍♀️","👮🏼‍♀️","👮🏽‍♀️","👮🏾‍♀️","👮🏿‍♀️"], isParty: true, hpMult: 1.0, attackMult: 1.0, defenseMult: 1.65, magicMult: 0.65 },
        { emoji: "👷", title: "Build Lord", nickname: "Infra Engineer", story: "Builds Docker castles in the cloud made of microservices and broken dreams. Moat filled with deprecated dependencies. Drawbridge controlled by Jenkins. Once built entire architecture out of containers nested 47 levels deep. Nobody knows what's at the bottom. Probably another container. Crown made of ethernet cables. Scepter is a Server rack mounted on stick.", attack: "🧱", magic: "🔩", super: "🏗️", attackName: "Brick Toss", magicName: "Bolt Strike", specialName: "Building Collapse", skins: ["👷🏻","👷🏼","👷🏽","👷🏾","👷🏿"], isParty: true, hpMult: 0.95, attackMult: 1.1, defenseMult: 1.35, magicMult: 0.75 },
        { emoji: "👷‍♂️", title: "Build Lord", nickname: "Infra Engineer", story: "'Works on my machine' is his life philosophy and legal defense. Has 47 different environments: dev, staging, pre-prod, prod, prod-prod, prod-but-actually, and the-real-prod-i-promise. All behave differently. All contain different bugs. Refuses to believe environment variables are the problem. They always are. Machine is a laptop from 2009 running duct-taped Linux. It's perfect.", attack: "🧱", magic: "🔩", super: "🏗️", attackName: "Brick Toss", magicName: "Bolt Strike", specialName: "Building Collapse", skins: ["👷🏻‍♂️","👷🏼‍♂️","👷🏽‍♂️","👷🏾‍♂️","👷🏿‍♂️"], isParty: true, hpMult: 0.95, attackMult: 1.1, defenseMult: 1.35, magicMult: 0.75 },
        { emoji: "👷‍♀️", title: "Build Lord", nickname: "Infra Engineer", story: "Lays pipelines like LEGO but instructions are in ancient Sumerian. CI/CD flows through 47 stages. Each stage has stages. Takes 6 hours to deploy Hello World. Considers it optimized. Blueprint tattoo on arm shows infrastructure that hasn't existed since 2015. Still references it in meetings. Nobody corrects her. Fear.", attack: "🧱", magic: "🔩", super: "🏗️", attackName: "Brick Toss", magicName: "Bolt Strike", specialName: "Building Collapse", skins: ["👷🏻‍♀️","👷🏼‍♀️","👷🏽‍♀️","👷🏾‍♀️","👷🏿‍♀️"], isParty: true, hpMult: 0.95, attackMult: 1.1, defenseMult: 1.35, magicMult: 0.75 },
        
        { emoji: "🧑‍⚖️", title: "The Legal Debugger", nickname: "Terms & Conditions", story: "Once read an entire EULA. Twice. For fun. Now uses legalese to confuse enemies into surrendering. Argues with compiler errors in court. Won three cases against segmentation faults. Lost one to a null pointer but appealed successfully.", attack: "⚖️", magic: "📜", super: "🔨", attackName: "Scale Slam", magicName: "Contract Curse", specialName: "Gavel Strike", skins: ["🧑🏻‍⚖️","🧑🏼‍⚖️","🧑🏽‍⚖️","🧑🏾‍⚖️","🧑🏿‍⚖️"], isParty: true, hpMult: 0.85, attackMult: 0.85, defenseMult: 1.35, magicMult: 1.4 },
        { emoji: "👨‍⚖️", title: "The Legal Debugger", nickname: "Terms & Conditions", story: "Believes every bug is guilty until proven innocent. Files lawsuits against poorly written code. Has a restraining order against goto statements. Once prosecuted a recursive function for identity theft. The function lost but immediately appealed to itself.", attack: "⚖️", magic: "📜", super: "🔨", attackName: "Scale Slam", magicName: "Contract Curse", specialName: "Gavel Strike", skins: ["👨🏻‍⚖️","👨🏼‍⚖️","👨🏽‍⚖️","👨🏾‍⚖️","👨🏿‍⚖️"], isParty: true, hpMult: 0.85, attackMult: 0.85, defenseMult: 1.35, magicMult: 1.4 },
        { emoji: "👩‍⚖️", title: "The Legal Debugger", nickname: "Terms & Conditions", story: "Charges by the semicolon. Won a landmark case establishing that commenting code is not defamation. Represented a for-loop in divorce proceedings from its while-loop partner. The settlement was messy but well-documented.", attack: "⚖️", magic: "📜", super: "🔨", attackName: "Scale Slam", magicName: "Contract Curse", specialName: "Gavel Strike", skins: ["👩🏻‍⚖️","👩🏼‍⚖️","👩🏽‍⚖️","👩🏾‍⚖️","👩🏿‍⚖️"], isParty: true, hpMult: 0.85, attackMult: 0.85, defenseMult: 1.35, magicMult: 1.4 },
        
        { emoji: "🧑‍🎤", title: "The API Rockstar", nickname: "Endpoint Elvis", story: "Performs live debugging sessions to sold-out crowds of rubber ducks. Every error message is a power ballad. Stage dives into production on Fridays. Their greatest hit: '500 Internal Server (Love) Error'. Encore always breaks something in staging.", attack: "🎤", magic: "🎸", super: "🎵", attackName: "Mic Drop", magicName: "Guitar Solo", specialName: "Sound Wave", skins: ["🧑🏻‍🎤","🧑🏼‍🎤","🧑🏽‍🎤","🧑🏾‍🎤","🧑🏿‍🎤"], isParty: true, hpMult: 0.7, attackMult: 0.75, defenseMult: 0.65, magicMult: 1.6 },
        { emoji: "👨‍🎤", title: "The API Rockstar", nickname: "Endpoint Elvis", story: "Writes code lyrics that actually compile. Tours the world teaching REST vs SOAP through interpretive dance. Once crowd-surfed over a router. Autographs are signed in hexadecimal. Groupies include three load balancers and a confused printer.", attack: "🎤", magic: "🎸", super: "🎵", attackName: "Mic Drop", magicName: "Guitar Solo", specialName: "Sound Wave", skins: ["👨🏻‍🎤","👨🏼‍🎤","👨🏽‍🎤","👨🏾‍🎤","👨🏿‍🎤"], isParty: true, hpMult: 0.7, attackMult: 0.75, defenseMult: 0.65, magicMult: 1.6 },
        { emoji: "👩‍🎤", title: "The API Rockstar", nickname: "Endpoint Elvis", story: "Headlined Coachella's Tech Stage. Smashes keyboards instead of guitars. Riders demand LAN cables and artisanal cold brew. Once performed a three-hour jazz odyssey about asynchronous callbacks. Nobody understood it but everyone cried.", attack: "🎤", magic: "🎸", super: "🎵", attackName: "Mic Drop", magicName: "Guitar Solo", specialName: "Sound Wave", skins: ["👩🏻‍🎤","👩🏼‍🎤","👩🏽‍🎤","👩🏾‍🎤","👩🏿‍🎤"], isParty: true, hpMult: 0.7, attackMult: 0.75, defenseMult: 0.65, magicMult: 1.6 },
        
        { emoji: "🧑‍✈️", title: "Cloud Captain", nickname: "AWS Aviator", story: "Navigates AWS regions like airspace. Turbulence is just high latency. Emergency landing procedure involves migrating to Azure mid-flight. Black box is actually just verbose logging. Co-pilot is a Lambda function that occasionally times out during takeoff.", attack: "✈️", magic: "☁️", super: "🛩️", attackName: "Propeller Strike", magicName: "Cloud Burst", specialName: "Jet Stream", skins: ["🧑🏻‍✈️","🧑🏼‍✈️","🧑🏽‍✈️","🧑🏾‍✈️","🧑🏿‍✈️"], isParty: true, hpMult: 0.85, attackMult: 0.95, defenseMult: 1.0, magicMult: 1.35 },
        { emoji: "👨‍✈️", title: "Cloud Captain", nickname: "AWS Aviator", story: "Earned pilot license by completing AWS certification exams. In-flight announcement: 'We've reached cruising altitude of S3 bucket layer 7.' Once flew through a data storm and emerged with corrupted memory. Still trying to remember their own name.", attack: "✈️", magic: "☁️", super: "🛩️", attackName: "Propeller Strike", magicName: "Cloud Burst", specialName: "Jet Stream", skins: ["👨🏻‍✈️","👨🏼‍✈️","👨🏽‍✈️","👨🏾‍✈️","👨🏿‍✈️"], isParty: true, hpMult: 0.85, attackMult: 0.95, defenseMult: 1.0, magicMult: 1.35 },
        { emoji: "👩‍✈️", title: "Cloud Captain", nickname: "AWS Aviator", story: "Believes all problems can be solved by going serverless. Tried to refuel plane with cloud credits. Failed. Passengers are microservices. Lost luggage is always in a different region. Flight path determined by load balancer algorithms.", attack: "✈️", magic: "☁️", super: "🛩️", attackName: "Propeller Strike", magicName: "Cloud Burst", specialName: "Jet Stream", skins: ["👩🏻‍✈️","👩🏼‍✈️","👩🏽‍✈️","👩🏾‍✈️","👩🏿‍✈️"], isParty: true, hpMult: 0.85, attackMult: 0.95, defenseMult: 1.0, magicMult: 1.35 },
        
        { emoji: "🕵️", title: "The Debug Detective", nickname: "Stack Trace Sleuth", story: "Solves mysteries that never existed. Once tracked a bug for six months only to discover it was a feature. Wears trench coat to standup meetings. Magnifying glass reveals hidden console warnings. Detective notebook is full of cryptic variable names and conspiracy theories about semicolons.", attack: "🔍", magic: "📰", super: "🎩", attackName: "Magnify Beam", magicName: "News Flash", specialName: "Hat Trick", skins: ["🕵🏻","🕵🏼","🕵🏽","🕵🏾","🕵🏿"], isParty: true, hpMult: 0.8, attackMult: 1.0, defenseMult: 1.15, magicMult: 1.1 },
        { emoji: "🕵️‍♂️", title: "The Debug Detective", nickname: "Stack Trace Sleuth", story: "Interrogates variables under harsh fluorescent lighting. Suspects every function of being suspicious. Once went undercover as a comment to infiltrate legacy code. Cover was blown when someone actually read the documentation. Now in witness protection as TODO.txt.", attack: "🔍", magic: "📰", super: "🎩", attackName: "Magnify Beam", magicName: "News Flash", specialName: "Hat Trick", skins: ["🕵🏻‍♂️","🕵🏼‍♂️","🕵🏽‍♂️","🕵🏾‍♂️","🕵🏿‍♂️"], isParty: true, hpMult: 0.8, attackMult: 1.0, defenseMult: 1.15, magicMult: 1.1 },
        { emoji: "🕵️‍♀️", title: "The Debug Detective", nickname: "Stack Trace Sleuth", story: "Maintains a conspiracy wall connecting JIRA tickets with red string. Discovered that all bugs lead back to a Tuesday deployment in 2007. Nobody believes her. She's right. Carries a briefcase full of print statements and existential dread.", attack: "🔍", magic: "📰", super: "🎩", attackName: "Magnify Beam", magicName: "News Flash", specialName: "Hat Trick", skins: ["🕵🏻‍♀️","🕵🏼‍♀️","🕵🏽‍♀️","🕵🏾‍♀️","🕵🏿‍♀️"], isParty: true, hpMult: 0.8, attackMult: 1.0, defenseMult: 1.15, magicMult: 1.1 },
        
        { emoji: "💂", title: "The Gate Keeper", nickname: "Merge Blocker", story: "Guards the main branch with ceremonial intensity. Will not merge PRs that lack exactly three reviewers, two unit tests, and a haiku. Has never moved during a deploy. Not even once. Some say they're still standing there from the last release. They are.", attack: "🗡️", magic: "🛡️", super: "👑", attackName: "Sword Slash", magicName: "Shield Wall", specialName: "Royal Decree", skins: ["💂🏻","💂🏼","💂🏽","💂🏾","💂🏿"], isParty: true, hpMult: 1.1, attackMult: 1.2, defenseMult: 2.0, magicMult: 0.5 },
        { emoji: "💂‍♂️", title: "The Gate Keeper", nickname: "Merge Blocker", story: "Changed guard duty once. Production went down immediately. Coincidence? He thinks not. Requires blood oath before approving hotfixes. Favorite phrase: 'Not on my watch.' Has 47 watches. All synchronized to production server time.", attack: "🗡️", magic: "🛡️", super: "👑", attackName: "Sword Slash", magicName: "Shield Wall", specialName: "Royal Decree", skins: ["💂🏻‍♂️","💂🏼‍♂️","💂🏽‍♂️","💂🏾‍♂️","💂🏿‍♂️"], isParty: true, hpMult: 1.1, attackMult: 1.2, defenseMult: 2.0, magicMult: 0.5 },
        { emoji: "💂‍♀️", title: "The Gate Keeper", nickname: "Merge Blocker", story: "Once stood completely still for 72 hours during a critical deployment freeze. When asked if she needed a break, replied: 'I AM the break...statement.' Nobody understood but everybody was too afraid to ask follow-up questions.", attack: "🗡️", magic: "🛡️", super: "👑", attackName: "Sword Slash", magicName: "Shield Wall", specialName: "Royal Decree", skins: ["💂🏻‍♀️","💂🏼‍♀️","💂🏽‍♀️","💂🏾‍♀️","💂🏿‍♀️"], isParty: true, hpMult: 1.1, attackMult: 1.2, defenseMult: 2.0, magicMult: 0.5 },
        
        { emoji: "🫅", title: "The Sovereign of Syntax", nickname: "Codebase Monarch", story: "Inherited the repository from their ancestors. Rules with an iron semicolon. Royal decree: all variables must be named after Shakespearean characters. Treasury is measured in GitHub stars. Knights developers who write clean code. Beheads merge conflicts.", attack: "👑", magic: "💎", super: "🏰", attackName: "Crown Strike", magicName: "Gem Blast", specialName: "Castle Siege", skins: ["🫅🏻","🫅🏼","🫅🏽","🫅🏾","🫅🏿"], isParty: true, hpMult: 1.15, attackMult: 1.25, defenseMult: 1.65, magicMult: 1.5 },
        { emoji: "🤴", title: "The Code Prince", nickname: "Heir to Production", story: "Next in line for senior dev position. Trained since birth in the ancient art of git rebase. Royal advisor is Stack Overflow. Crown jewels include three mechanical keyboards and a signed Linus Torvalds photo. Waiting for current king to retire (he won't).", attack: "👑", magic: "💎", super: "🏰", attackName: "Crown Strike", magicName: "Gem Blast", specialName: "Castle Siege", skins: ["🤴🏻","🤴🏼","🤴🏽","🤴🏾","🤴🏿"], isParty: true, hpMult: 1.1, attackMult: 1.2, defenseMult: 1.5, magicMult: 1.4 },
        { emoji: "👸", title: "The Code Princess", nickname: "Duchess of Deployment", story: "Refuses to touch code written before ES6. Royal carriage is a Herman Miller chair with RGB lighting. Holds court in the executive conference room. Wave consists of deploying to production. Subjects love her except during merge conflicts.", attack: "👑", magic: "💎", super: "🏰", attackName: "Crown Strike", magicName: "Gem Blast", specialName: "Castle Siege", skins: ["👸🏻","👸🏼","👸🏽","👸🏾","👸🏿"], isParty: true, hpMult: 1.1, attackMult: 1.2, defenseMult: 1.5, magicMult: 1.4 },
        
        { emoji: "👲", title: "The Scroll Keeper", nickname: "Ancient Documentation", story: "Maintains documentation older than the company. Speaks in commit messages from 1997. Knows where all the bodies are buried (in deprecated_old_code_do_not_touch folder). Enlightenment achieved through reading 10,000-line legacy files without crying. Almost succeeded twice.", attack: "📜", magic: "🔮", super: "☯️", attackName: "Scroll Whip", magicName: "Crystal Vision", specialName: "Zen Strike", skins: ["👲🏻","👲🏼","👲🏽","👲🏾","👲🏿"], isParty: true, hpMult: 0.75, attackMult: 0.7, defenseMult: 1.0, magicMult: 1.65 },
        { emoji: "🧕", title: "The Cipher Sage", nickname: "Encryption Oracle", story: "Encrypts everything including grocery lists. Password is 47 characters and contains symbols not found on standard keyboards. Speaks only in hash values. Once encrypted their own memories. Forgot the key. Now communicates via interpretive mime about public-key infrastructure.", attack: "🔐", magic: "🗝️", super: "🔒", attackName: "Lock Throw", magicName: "Key Blast", specialName: "Vault Slam", skins: ["🧕🏻","🧕🏼","🧕🏽","🧕🏾","🧕🏿"], isParty: true, hpMult: 0.75, attackMult: 0.6, defenseMult: 1.35, magicMult: 1.75 },
        
        { emoji: "🤵", title: "The Formal Function", nickname: "Black-Tie Backend", story: "Attends every API call in full tuxedo. Believes casual Fridays are destroying code quality. RSVP to pull requests with embossed invitations. Refuses to work with loosely-typed languages. Once white-gloved slapped JavaScript across the face and demanded satisfaction.", attack: "🎩", magic: "🥂", super: "💐", attackName: "Hat Trick", magicName: "Champagne Spray", specialName: "Bouquet Toss", skins: ["🤵🏻","🤵🏼","🤵🏽","🤵🏾","🤵🏿"], isParty: true, hpMult: 0.7, attackMult: 0.75, defenseMult: 0.85, magicMult: 1.35 },
        { emoji: "🤵‍♂️", title: "The Formal Function", nickname: "Black-Tie Backend", story: "Code review attire: bow tie, cufflinks, and judgment. Insists on proper etiquette in commit messages. 'Please' and 'thank you' are mandatory in function names. Once challenged someone to a duel over missing Oxford comma in documentation. Nobody came.", attack: "🎩", magic: "🥂", super: "💐", attackName: "Hat Trick", magicName: "Champagne Spray", specialName: "Bouquet Toss", skins: ["🤵🏻‍♂️","🤵🏼‍♂️","🤵🏽‍♂️","🤵🏾‍♂️","🤵🏿‍♂️"], isParty: true, hpMult: 0.7, attackMult: 0.75, defenseMult: 0.85, magicMult: 1.35 },
        { emoji: "🤵‍♀️", title: "The Formal Function", nickname: "Black-Tie Backend", story: "Pairs well with evening gowns and GraphQL queries. Wedding planner by day, schema designer by night. Can coordinate complex distributed systems while organizing seating charts. Same skill set. Actually attended a function's wedding to a method. Ceremony was beautiful.", attack: "🎩", magic: "🥂", super: "💐", attackName: "Hat Trick", magicName: "Champagne Spray", specialName: "Bouquet Toss", skins: ["🤵🏻‍♀️","🤵🏼‍♀️","🤵🏽‍♀️","🤵🏾‍♀️","🤵🏿‍♀️"], isParty: true, hpMult: 0.7, attackMult: 0.75, defenseMult: 0.85, magicMult: 1.35 },
        
        { emoji: "👰", title: "The Commitment Issues", nickname: "Git Matrimony", story: "Married to the codebase. For better or worse, mostly worse. Honeymoon was a weekend hackathon. Anniversary gifts include versioned backups. Vows included 'to merge and to push, till death do us deploy.' Relationship status with bugs: complicated.", attack: "💐", magic: "💍", super: "💒", attackName: "Bouquet Bash", magicName: "Ring Fling", specialName: "Chapel Crush", skins: ["👰🏻","👰🏼","👰🏽","👰🏾","👰🏿"], isParty: true, hpMult: 0.85, attackMult: 0.85, defenseMult: 1.15, magicMult: 1.25 },
        { emoji: "👰‍♂️", title: "The Commitment Issues", nickname: "Git Matrimony", story: "Proposed to main branch with a diamond-encrusted mechanical keyboard. She said yes but required code review first. Still waiting. Three years later. Planning bachelor party debugging session. Groomsmen are all deprecated functions.", attack: "💐", magic: "💍", super: "💒", attackName: "Bouquet Bash", magicName: "Ring Fling", specialName: "Chapel Crush", skins: ["👰🏻‍♂️","👰🏼‍♂️","👰🏽‍♂️","👰🏾‍♂️","👰🏿‍♂️"], isParty: true, hpMult: 0.85, attackMult: 0.85, defenseMult: 1.15, magicMult: 1.25 },
        { emoji: "👰‍♀️", title: "The Commitment Issues", nickname: "Git Matrimony", story: "Something old: legacy code. Something new: latest framework. Something borrowed: Stack Overflow solution. Something blue: screen of death. Wedding registry exclusively at ThinkGeek. Received four different versions of 'Clean Code' as gifts.", attack: "💐", magic: "💍", super: "💒", attackName: "Bouquet Bash", magicName: "Ring Fling", specialName: "Chapel Crush", skins: ["👰🏻‍♀️","👰🏼‍♀️","👰🏽‍♀️","👰🏾‍♀️","👰🏿‍♀️"], isParty: true, hpMult: 0.85, attackMult: 0.85, defenseMult: 1.15, magicMult: 1.25 },
        
        { emoji: "🧖", title: "The Relaxation Error", nickname: "Spa Day Survivor", story: "Tried to take vacation once. Server went down immediately. Now vacations in monitoring dashboard. Spa treatments include: hot stone debugging, aromatherapy log analysis, and deep-tissue code massage. Meditation mantra: 'It's not my fault. It's not my fault.' It usually is.", attack: "💆", magic: "🧘", super: "🛀", attackName: "Massage Slam", magicName: "Zen Blast", specialName: "Bath Bomb", skins: ["🧖🏻","🧖🏼","🧖🏽","🧖🏾","🧖🏿"], isParty: true, hpMult: 0.7, attackMult: 0.5, defenseMult: 0.65, magicMult: 1.15 },
        { emoji: "🧖‍♂️", title: "The Relaxation Error", nickname: "Spa Day Survivor", story: "Attempted work-life balance. Life won. Work demanded a rematch. Now they fight constantly while he sits in a sauna reading error logs. Steam is nice. Clarity is elusive. Inner peace replaced with inner rage against poorly indented code.", attack: "💆", magic: "🧘", super: "🛀", attackName: "Massage Slam", magicName: "Zen Blast", specialName: "Bath Bomb", skins: ["🧖🏻‍♂️","🧖🏼‍♂️","🧖🏽‍♂️","🧖🏾‍♂️","🧖🏿‍♂️"], isParty: true, hpMult: 0.7, attackMult: 0.5, defenseMult: 0.65, magicMult: 1.15 },
        { emoji: "🧖‍♀️", title: "The Relaxation Error", nickname: "Spa Day Survivor", story: "Books spa appointments between deployments. Always gets cancelled. Has permanent reservation she's never used. Face mask made from crushed syntax errors. Cucumber slices on eyes while reviewing pull requests. Self-care routine interrupted by Slack 47 times per session.", attack: "💆", magic: "🧘", super: "🛀", attackName: "Massage Slam", magicName: "Zen Blast", specialName: "Bath Bomb", skins: ["🧖🏻‍♀️","🧖🏼‍♀️","🧖🏽‍♀️","🧖🏾‍♀️","🧖🏿‍♀️"], isParty: true, hpMult: 0.7, attackMult: 0.5, defenseMult: 0.65, magicMult: 1.15 }
    ];
    
    // Get hero and party character lists
    const HERO_CHARACTERS = CHARACTERS.filter(c => c.isHero);
    const PARTY_CHARACTERS = CHARACTERS.filter(c => c.isParty);

    // Character selection state
    let selectedHeroIndex = 0;
    let selectedSkinIndex = 0;
    let characterSelected = false;

    // Game state
    let gameState = {
        mode: MODE_CHARACTER_SELECT,
        player: {
            x: 20,
            y: 7,
            level: 1,
            hp: BASE_PLAYER_STATS.hp,
            maxHp: BASE_PLAYER_STATS.hp,
            currentHp: BASE_PLAYER_STATS.hp,
            mp: BASE_PLAYER_STATS.magic,
            maxMp: BASE_PLAYER_STATS.magic,
            currentMp: BASE_PLAYER_STATS.magic,
            exp: 0,
            nextLevel: 10,
            attack: BASE_PLAYER_STATS.attack,
            defense: BASE_PLAYER_STATS.defense,
            magic: BASE_PLAYER_STATS.magic,
            gold: 100,
            specialMeter: 0,
            specialReady: false,
            party: [],
            symbol: '🧙' // Default symbol before character selection
        },
        party: [],
        enemies: [], // Multiple enemies in battle
        battleLog: [],
        gameOver: false,
        steps: 0,
        map: [],
        enemiesOnMap: [],
        shopsOnMap: [],
        innsOnMap: [],
        positionTrail: [], // Track player positions for party following
        enemiesDefeated: 0,
        battlesCount: 0,
        nextEnemyLevel: 1, // Progressive enemy difficulty
        animationFrame: 0,
        isAnimating: false,
        pendingAction: null,
        shopOffer: null,
        innOffer: false,
        bossDefeated: false,
        bossSpawned: false,
        gameWon: false,
        currentEnemyIndex: 0,
        currentEnemyOnMap: null,
        currentAttackingEnemy: null,
        currentPlayerIndex: 0,
        playerTurnComplete: false
    };

    // Enemy types
    const ENEMY_TYPES = [
        { name: 'Grumpy Reviewer', symbol: '😾', hp: 15, attack: 5, defense: 2, exp: 6, gold: 4, attackEmoji: '🗨️', attackName: 'Harsh Comment', magicName: 'Code Shame', specialName: 'PR Rejection Storm', story: 'Rejected your PR for "inconsistent spacing"' },
        { name: 'Angry Ogre', symbol: '👹', hp: 28, attack: 9, defense: 3, exp: 15, gold: 12, attackEmoji: '👊', attackName: 'Merge Smash', magicName: 'Conflict Curse', specialName: 'Branch Destruction', story: 'Your merge conflicts awakened this beast' },
        { name: 'Code Demon', symbol: '👺', hp: 22, attack: 7, defense: 2, exp: 10, gold: 8, attackEmoji: '🔥', attackName: 'Hellfire Code', magicName: 'Spaghetti Spell', specialName: 'Demon Overflow', story: 'Born from spaghetti code and broken promises' },
        { name: 'Bug Clown', symbol: '🤡', hp: 18, attack: 6, defense: 2, exp: 8, gold: 6, attackEmoji: '🎈', attackName: 'Balloon Pop', magicName: 'Circus Chaos', specialName: 'Joke Overflow', story: 'Makes your tests fail randomly for fun' },
        { name: 'Legacy Poop', symbol: '💩', hp: 12, attack: 4, defense: 1, exp: 5, gold: 3, attackEmoji: '💨', attackName: 'Stink Bomb', magicName: 'Toxic Fumes', specialName: 'Code Rot', story: 'Nobody wants to touch this codebase' },
        { name: 'Grumpy Reviewer', symbol: '😾', hp: 15, attack: 5, defense: 2, exp: 6, gold: 4, attackEmoji: '🗨️', attackName: 'Harsh Comment', magicName: 'Code Shame', specialName: 'PR Rejection Storm', story: 'Rejected your PR for "inconsistent spacing"' },
        { name: 'Angry Ogre', symbol: '👹', hp: 28, attack: 9, defense: 3, exp: 15, gold: 12, attackEmoji: '👊', attackName: 'Merge Smash', magicName: 'Conflict Curse', specialName: 'Branch Destruction', story: 'Your merge conflicts awakened this beast' },
        { name: 'Code Demon', symbol: '👺', hp: 22, attack: 7, defense: 2, exp: 10, gold: 8, attackEmoji: '🔥', attackName: 'Hellfire Code', magicName: 'Spaghetti Spell', specialName: 'Demon Overflow', story: 'Born from spaghetti code and broken promises' },
        { name: 'Bug Clown', symbol: '🤡', hp: 18, attack: 6, defense: 2, exp: 8, gold: 6, attackEmoji: '🎈', attackName: 'Balloon Pop', magicName: 'Circus Chaos', specialName: 'Joke Overflow', story: 'Makes your tests fail randomly for fun' },
        { name: 'Legacy Poop', symbol: '💩', hp: 12, attack: 4, defense: 1, exp: 5, gold: 3, attackEmoji: '💨', attackName: 'Stink Bomb', magicName: 'Toxic Fumes', specialName: 'Code Rot', story: 'Nobody wants to touch this codebase' },
        { name: 'Ghost Process', symbol: '👻', hp: 10, attack: 3, defense: 0, exp: 4, gold: 2, attackEmoji: '👻', attackName: 'Phantom Strike', magicName: 'Haunting', specialName: 'Undead Process', story: 'Still running after you killed it 3 times' },
        { name: 'Deadline Reaper', symbol: '💀', hp: 25, attack: 8, defense: 2, exp: 12, gold: 10, attackEmoji: '⏰', attackName: 'Time Slice', magicName: 'Clock Drain', specialName: 'Final Deadline', story: 'Sprints end when this enemy says so' },
        { name: 'Fatal Error', symbol: '☠️', hp: 20, attack: 7, defense: 2, exp: 9, gold: 7, attackEmoji: '💀', attackName: 'Death Strike', magicName: 'Crash Wave', specialName: 'Fatal Exception', story: 'Your app just crashed in production' },
        { name: 'Alien Bug', symbol: '👽', hp: 16, attack: 6, defense: 2, exp: 7, gold: 5, attackEmoji: '🛸', attackName: 'Probe Attack', magicName: 'Abduction', specialName: 'UFO Invasion', story: 'Nobody knows where this bug came from' },
        { name: 'Retro Game Over', symbol: '👾', hp: 14, attack: 5, defense: 1, exp: 6, gold: 4, attackEmoji: '🕹️', attackName: 'Pixel Blast', magicName: '8-Bit Curse', specialName: 'Game Over Screen', story: 'Your app looks like it\'s from 1985' },
        { name: 'AI Uprising', symbol: '🤖', hp: 30, attack: 10, defense: 4, exp: 16, gold: 13, attackEmoji: '⚡', attackName: 'Robot Punch', magicName: 'Neural Net', specialName: 'Singularity', story: 'Your ML model became self-aware and angry' },
        { name: 'Spooky Sprint', symbol: '🎃', hp: 18, attack: 6, defense: 2, exp: 8, gold: 6, attackEmoji: '🍬', attackName: 'Candy Crush', magicName: 'Halloween Hex', specialName: 'Pumpkin Bomb', story: 'October deployment nightmares' },
        { name: 'Brain Drain', symbol: '🧠', hp: 24, attack: 8, defense: 3, exp: 12, gold: 9, attackEmoji: '💭', attackName: 'Mind Blast', magicName: 'Knowledge Drain', specialName: 'Brain Freeze', story: 'Senior dev quit mid-sprint' },
        { name: 'Heartbleed', symbol: '🫀', hp: 22, attack: 7, defense: 2, exp: 10, gold: 8, attackEmoji: '💉', attackName: 'Injection', magicName: 'Blood Leak', specialName: 'Cardiac Arrest', story: 'Critical security vulnerability detected' },
        { name: 'Server Lung', symbol: '🫁', hp: 20, attack: 6, defense: 3, exp: 9, gold: 7, attackEmoji: '💨', attackName: 'Wind Slash', magicName: 'Breath Drain', specialName: 'Suffocation', story: 'Your server is gasping for air (memory)' },
        { name: 'Biting Bug', symbol: '🦷', hp: 8, attack: 3, defense: 1, exp: 3, gold: 2, attackEmoji: '🦷', attackName: 'Tooth Bite', magicName: 'Cavity Curse', specialName: 'Root Canal', story: 'Small but it really hurts' },
        { name: 'Broken Skeleton', symbol: '🦴', hp: 12, attack: 4, defense: 1, exp: 5, gold: 3, attackEmoji: '🦴', attackName: 'Bone Throw', magicName: 'Skeleton Key', specialName: 'Framework Collapse', story: 'Framework documentation is dead' },
        { name: 'Watching Eyes', symbol: '👀', hp: 16, attack: 5, defense: 2, exp: 7, gold: 5, attackEmoji: '👁️', attackName: 'Glare', magicName: 'Surveillance', specialName: 'Big Brother', story: 'Your manager monitoring your screen' },
        { name: 'Evil Eye', symbol: '👁️', hp: 14, attack: 5, defense: 1, exp: 6, gold: 4, attackEmoji: '👁️', attackName: 'Stare Down', magicName: 'Evil Gaze', specialName: 'Death Stare', story: 'The stakeholder staring at your demo' },
        { name: 'Lip Service', symbol: '🫦', hp: 10, attack: 3, defense: 2, exp: 4, gold: 2, attackEmoji: '💋', attackName: 'Kiss Off', magicName: 'Sweet Talk', specialName: 'Empty Promise', story: 'Says "we should refactor" but never does' },
        { name: 'Salty Tongue', symbol: '👅', hp: 12, attack: 4, defense: 1, exp: 5, gold: 3, attackEmoji: '💬', attackName: 'Verbal Lash', magicName: 'Toxic Comment', specialName: 'Flame War', story: 'Code review comments that burn' },
        { name: 'Big Mouth', symbol: '👄', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '💭', attackName: 'Over Promise', magicName: 'Hype Wave', specialName: 'Vaporware', story: 'Promises features that can\'t be delivered' },
        { name: 'Demon Boss', symbol: '😈', hp: 32, attack: 11, defense: 4, exp: 18, gold: 14, attackEmoji: '🔱', attackName: 'Trident Strike', magicName: 'Hell Portal', specialName: 'Demonic Rage', story: 'Middle management with impossible demands' },
        { name: 'Devil Manager', symbol: '👿', hp: 35, attack: 12, defense: 4, exp: 20, gold: 16, attackEmoji: '🔥', attackName: 'Fire Slash', magicName: 'Scope Creep', specialName: 'Weekend Overtime', story: 'Asks for "one small change" at 5 PM Friday' },
        { name: 'Rage Quit', symbol: '😡', hp: 20, attack: 7, defense: 2, exp: 9, gold: 7, attackEmoji: '💢', attackName: 'Anger Burst', magicName: 'Fury Wave', specialName: 'Ragequit Storm', story: 'Teammate left after seeing the codebase' },
        { name: 'Swear Storm', symbol: '🤬', hp: 18, attack: 6, defense: 2, exp: 8, gold: 6, attackEmoji: '⚡', attackName: 'Profanity Bolt', magicName: 'Curse Words', specialName: 'Expletive Explosion', story: 'Console logs filled with profanity' },
        { name: 'Bug Vomit', symbol: '🤢', hp: 16, attack: 5, defense: 1, exp: 7, gold: 5, attackEmoji: '🤮', attackName: 'Nausea Wave', magicName: 'Sick Code', specialName: 'Vomit Comet', story: 'Code so bad it makes you physically sick' },
        { name: 'Toxic Release', symbol: '🤮', hp: 22, attack: 8, defense: 2, exp: 11, gold: 8, attackEmoji: '☢️', attackName: 'Toxic Spray', magicName: 'Poison Cloud', specialName: 'Nuclear Meltdown', story: 'This deployment poisoned production' },
        { name: 'Money Grabber', symbol: '🤑', hp: 24, attack: 7, defense: 3, exp: 12, gold: 20, attackEmoji: '💰', attackName: 'Cash Grab', magicName: 'Budget Cut', specialName: 'Bankruptcy', story: 'Sales promised features for $$$ you can\'t deliver' },
        { name: 'Fake Expert', symbol: '🥸', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '🎭', attackName: 'Fake News', magicName: 'Bluff', specialName: 'Exposed Fraud', story: 'Consultant who Googles everything during meetings' },
        { name: 'Toxic Mushroom', symbol: '🍄', hp: 18, attack: 6, defense: 2, exp: 8, gold: 6, attackEmoji: '☠️', attackName: 'Spore Spray', magicName: 'Fungal Growth', specialName: 'Mushroom Cloud', story: 'Legacy code that spreads through your system' },
        { name: 'Spike Cactus', symbol: '🌵', hp: 20, attack: 7, defense: 4, exp: 9, gold: 7, attackEmoji: '🌵', attackName: 'Needle Jab', magicName: 'Desert Curse', specialName: 'Cactus Storm', story: 'Touching this code hurts' },
        { name: 'Evil Eye Curse', symbol: '🧿', hp: 16, attack: 5, defense: 2, exp: 7, gold: 5, attackEmoji: '👁️', attackName: 'Evil Glare', magicName: 'Jinx', specialName: 'Curse Overload', story: 'Someone jinxed your deployment' },
        { name: 'Bad Luck Charm', symbol: '🪬', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '✨', attackName: 'Misfortune', magicName: 'Bad Karma', specialName: 'Murphy\'s Law', story: 'Everything breaks when you touch it' },
        { name: 'Server Storm', symbol: '⛈️', hp: 28, attack: 9, defense: 3, exp: 14, gold: 11, attackEmoji: '⚡', attackName: 'Lightning Strike', magicName: 'Thunder Crash', specialName: 'Perfect Storm', story: 'Your AWS bill just tripled' },
        { name: 'Thunder Strike', symbol: '🌩️', hp: 26, attack: 8, defense: 2, exp: 13, gold: 10, attackEmoji: '⚡', attackName: 'Thunder Bolt', magicName: 'Storm Call', specialName: 'Lightning Storm', story: 'Lightning-fast crashes' },
        { name: 'Freeze Bug', symbol: '❄️', hp: 18, attack: 5, defense: 3, exp: 8, gold: 6, attackEmoji: '🧊', attackName: 'Ice Shard', magicName: 'Blizzard', specialName: 'Deep Freeze', story: 'Your app is frozen and unresponsive' },
        { name: 'Snowman Server', symbol: '☃️', hp: 20, attack: 6, defense: 4, exp: 9, gold: 7, attackEmoji: '❄️', attackName: 'Snowball', magicName: 'Frost Wave', specialName: 'Avalanche', story: 'Cold storage that never warms up' },
        { name: 'Frosty VM', symbol: '⛄', hp: 22, attack: 7, defense: 3, exp: 10, gold: 8, attackEmoji: '🧊', attackName: 'Freeze Ray', magicName: 'Ice Beam', specialName: 'Eternal Winter', story: 'Virtual machine frozen in time' },
        { name: 'Production Fire', symbol: '🌋', hp: 40, attack: 14, defense: 5, exp: 25, gold: 20, attackEmoji: '🔥', attackName: 'Lava Burst', magicName: 'Eruption', specialName: 'Volcanic Apocalypse', story: 'Everything is burning and customers are calling' },
        { name: 'Logic Bomb', symbol: '💣', hp: 25, attack: 10, defense: 2, exp: 13, gold: 10, attackEmoji: '💥', attackName: 'Detonate', magicName: 'Explosive Code', specialName: 'Nuclear Detonation', story: 'Timed to explode during the demo' },
        { name: 'Rain Delay', symbol: '☔', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '💧', attackName: 'Water Drop', magicName: 'Rain Dance', specialName: 'Monsoon', story: 'Weather-dependent APIs are down' },
        { name: 'Data Flood', symbol: '🌊', hp: 24, attack: 8, defense: 2, exp: 12, gold: 9, attackEmoji: '💧', attackName: 'Wave Crash', magicName: 'Tidal Wave', specialName: 'Tsunami', story: 'Logs overflow and crash everything' },
        { name: 'Cloud Fog', symbol: '🌫️', hp: 16, attack: 5, defense: 3, exp: 7, gold: 5, attackEmoji: '☁️', attackName: 'Mist Spray', magicName: 'Fog Bank', specialName: 'Confusion Cloud', story: 'Nobody understands how the cloud works' },
        { name: 'UFO Bug', symbol: '🛸', hp: 22, attack: 7, defense: 2, exp: 10, gold: 8, attackEmoji: '🛸', attackName: 'Abduction Beam', magicName: 'Probe', specialName: 'Alien Invasion', story: 'Unidentified Failing Object in your code' },
        { name: 'Satellite Crash', symbol: '🛰️', hp: 20, attack: 6, defense: 3, exp: 9, gold: 7, attackEmoji: '📡', attackName: 'Signal Jam', magicName: 'Orbital Strike', specialName: 'Satellite Fall', story: 'API connection lost in orbit' },
        { name: 'Magic Bug', symbol: '🪄', hp: 18, attack: 6, defense: 2, exp: 8, gold: 6, attackEmoji: '✨', attackName: 'Wand Wave', magicName: 'Spell Cast', specialName: 'Magic Overflow', story: 'Disappears when you try to debug it' },
        { name: 'Hook Error', symbol: '🪝', hp: 12, attack: 4, defense: 1, exp: 5, gold: 3, attackEmoji: '🪝', attackName: 'Hook Snag', magicName: 'Dependency Pull', specialName: 'Hook Chain', story: 'React hooks used incorrectly' },
        { name: 'Chopper Crash', symbol: '🚁', hp: 24, attack: 8, defense: 3, exp: 12, gold: 9, attackEmoji: '💥', attackName: 'Rotor Blade', magicName: 'Propeller Spin', specialName: 'Crash Landing', story: 'Your deployment helicopter went down' },
        { name: 'Flight Delay', symbol: '✈️', hp: 20, attack: 6, defense: 2, exp: 9, gold: 7, attackEmoji: '✈️', attackName: 'Wing Strike', magicName: 'Turbulence', specialName: 'Emergency Landing', story: 'Release delayed indefinitely' },
        { name: 'Police Audit', symbol: '🚓', hp: 22, attack: 7, defense: 4, exp: 10, gold: 8, attackEmoji: '🚨', attackName: 'Siren Blast', magicName: 'Compliance Check', specialName: 'Full Audit', story: 'Compliance checking your code' },
        { name: 'Security Patrol', symbol: '🚔', hp: 24, attack: 8, defense: 4, exp: 12, gold: 9, attackEmoji: '🚨', attackName: 'Badge Flash', magicName: 'Security Scan', specialName: 'Code Arrest', story: 'Found 47 vulnerabilities in your dependencies' },
        { name: 'Taxi Meter', symbol: '🚕', hp: 16, attack: 5, defense: 2, exp: 7, gold: 5, attackEmoji: '💰', attackName: 'Fare Charge', magicName: 'Meter Run', specialName: 'Surge Pricing', story: 'Cloud costs running up fast' },
        { name: 'Uber Surge', symbol: '🚖', hp: 18, attack: 6, defense: 2, exp: 8, gold: 12, attackEmoji: '💸', attackName: 'Price Spike', magicName: 'Demand Wave', specialName: 'Peak Surge', story: 'AWS charges during peak hours' },
        { name: 'Traffic Bug', symbol: '🚗', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '🚦', story: 'Network congestion slowing everything' },
        { name: 'Crash Car', symbol: '🚘', hp: 20, attack: 7, defense: 2, exp: 9, gold: 7, attackEmoji: '💥', story: 'Application crashed on the highway' },
        { name: 'Deploy Truck', symbol: '🚚', hp: 28, attack: 9, defense: 4, exp: 14, gold: 11, attackEmoji: '📦', story: 'Shipping broken builds to production' },
        { name: 'Tech Debt Hauler', symbol: '🚛', hp: 32, attack: 10, defense: 5, exp: 16, gold: 13, attackEmoji: '⚖️', story: 'Carrying years of technical debt' },
        { name: 'Farm Tractor', symbol: '🚜', hp: 26, attack: 8, defense: 4, exp: 13, gold: 10, attackEmoji: '🌾', story: 'Planting bugs in the field' },
        { name: 'Manual Override', symbol: '🦽', hp: 18, attack: 5, defense: 3, exp: 8, gold: 6, attackEmoji: '🔧', story: 'Disabled automated testing' },
        { name: 'Rolling Failure', symbol: '🦼', hp: 20, attack: 6, defense: 3, exp: 9, gold: 7, attackEmoji: '⚙️', story: 'Rolling back your deployment... again' },
        { name: 'Rickshaw Code', symbol: '🛺', hp: 12, attack: 4, defense: 1, exp: 5, gold: 3, attackEmoji: '🚧', story: 'Barely functional but somehow still running' },
        { name: 'Bike Messenger', symbol: '🚲', hp: 10, attack: 3, defense: 1, exp: 4, gold: 2, attackEmoji: '📨', story: 'Delivers bugs faster than you can fix' },
        { name: 'Scooter Deploy', symbol: '🛵', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '💨', story: 'Quick and dirty releases' },
        { name: 'Motorcycle Merge', symbol: '🏍️', hp: 22, attack: 8, defense: 2, exp: 10, gold: 8, attackEmoji: '💥', story: 'Fast merges that break everything' },
        { name: 'Pickup Problem', symbol: '🛻', hp: 24, attack: 7, defense: 3, exp: 11, gold: 9, attackEmoji: '🔨', story: 'Hauling issues from ticket to ticket' },
        
        // Fitness & Activity Enemies
        { name: 'Heavy Lifter', symbol: '🏋️', hp: 30, attack: 12, defense: 5, exp: 16, gold: 12, attackEmoji: '🏋️', story: 'Lifting production servers with bare hands' },
        { name: 'Gym Bro Dev', symbol: '🏋️‍♂️', hp: 32, attack: 13, defense: 6, exp: 17, gold: 13, attackEmoji: '💪', story: 'Flexes on your weak error handling' },
        { name: 'Crossfit Coder', symbol: '🏋️‍♀️', hp: 28, attack: 11, defense: 5, exp: 15, gold: 11, attackEmoji: '🏋️', story: 'Does pull requests AND pull-ups' },
        { name: 'Wrestling Match', symbol: '🤼', hp: 26, attack: 10, defense: 4, exp: 14, gold: 10, attackEmoji: '👊', story: 'Your APIs wrestling for resources' },
        { name: 'Code Wrestler', symbol: '🤼‍♂️', hp: 28, attack: 11, defense: 5, exp: 15, gold: 11, attackEmoji: '🤜', story: 'Grappling with your architecture' },
        { name: 'Debug Wrestler', symbol: '🤼‍♀️', hp: 26, attack: 10, defense: 4, exp: 14, gold: 10, attackEmoji: '🤛', story: 'Throws exceptions like wrestling moves' },
        { name: 'Acrobatic Bug', symbol: '🤸', hp: 18, attack: 7, defense: 2, exp: 8, gold: 6, attackEmoji: '🤸', story: 'Flips between environments unpredictably' },
        { name: 'Gymnast Error', symbol: '🤸‍♂️', hp: 20, attack: 8, defense: 3, exp: 9, gold: 7, attackEmoji: '🏃', story: 'Tumbles through your test suite' },
        { name: 'Flip Flop Bug', symbol: '🤸‍♀️', hp: 18, attack: 7, defense: 2, exp: 8, gold: 6, attackEmoji: '💫', story: 'Changes behavior every deployment' },
        { name: 'Basketball Dev', symbol: '⛹️', hp: 22, attack: 8, defense: 3, exp: 10, gold: 8, attackEmoji: '🏀', story: 'Shoots and misses every sprint goal' },
        { name: 'Dunk Master', symbol: '⛹️‍♂️', hp: 24, attack: 9, defense: 3, exp: 12, gold: 9, attackEmoji: '🏀', story: 'Slams your server into the ground' },
        { name: 'Hoops Handler', symbol: '⛹️‍♀️', hp: 22, attack: 8, defense: 3, exp: 10, gold: 8, attackEmoji: '🏀', story: 'Bouncing between microservices' },
        { name: 'Fencing Tester', symbol: '🤺', hp: 20, attack: 9, defense: 4, exp: 9, gold: 7, attackEmoji: '⚔️', story: 'Parries all your unit tests' },
        { name: 'Handball Bug', symbol: '🤾', hp: 18, attack: 7, defense: 2, exp: 8, gold: 6, attackEmoji: '🤾', story: 'Throws exceptions left and right' },
        { name: 'Ball Thrower', symbol: '🤾‍♂️', hp: 20, attack: 8, defense: 3, exp: 9, gold: 7, attackEmoji: '⚽', story: 'Passes bugs to other teams' },
        { name: 'Goal Scorer', symbol: '🤾‍♀️', hp: 18, attack: 7, defense: 2, exp: 8, gold: 6, attackEmoji: '🥅', story: 'Scores own goals in production' },
        { name: 'Golf Bug', symbol: '🏌️', hp: 16, attack: 6, defense: 3, exp: 7, gold: 5, attackEmoji: '⛳', story: 'Takes 18 tries to fix one issue' },
        { name: 'Swing Coder', symbol: '🏌️‍♂️', hp: 18, attack: 7, defense: 3, exp: 8, gold: 6, attackEmoji: '🏌️', story: 'Swings and misses at optimization' },
        { name: 'Fairway Fail', symbol: '🏌️‍♀️', hp: 16, attack: 6, defense: 3, exp: 7, gold: 5, attackEmoji: '⛳', story: 'Always in the rough with deadlines' },
        
        // Standing & Walking Enemies
        { name: 'Idle Process', symbol: '🧍', hp: 8, attack: 2, defense: 1, exp: 3, gold: 2, attackEmoji: '😴', story: 'Just standing there consuming CPU' },
        { name: 'Standing Man', symbol: '🧍‍♂️', hp: 10, attack: 3, defense: 2, exp: 4, gold: 3, attackEmoji: '🛑', story: 'Blocking the deployment pipeline' },
        { name: 'Waiting Woman', symbol: '🧍‍♀️', hp: 8, attack: 2, defense: 1, exp: 3, gold: 2, attackEmoji: '⏰', story: 'Waiting for approvals forever' },
        { name: 'Slow Walker', symbol: '🚶', hp: 12, attack: 3, defense: 2, exp: 5, gold: 3, attackEmoji: '🐌', story: 'Your app loading speed' },
        { name: 'Walking Bug', symbol: '🚶‍♂️', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '🚶', story: 'Slowly corrupting your database' },
        { name: 'Stroll Error', symbol: '🚶‍♀️', hp: 12, attack: 3, defense: 2, exp: 5, gold: 3, attackEmoji: '👣', story: 'Casually breaking things as it passes' },
        { name: 'Blind Spot', symbol: '🧑‍🦯', hp: 10, attack: 3, defense: 1, exp: 4, gold: 2, attackEmoji: '🦯', story: 'Bug you couldn\'t see coming' },
        { name: 'Cane Coder', symbol: '👨‍🦯', hp: 12, attack: 4, defense: 2, exp: 5, gold: 3, attackEmoji: '🦯', story: 'Legacy dev who refuses to retire' },
        { name: 'Vision Issue', symbol: '👩‍🦯', hp: 10, attack: 3, defense: 1, exp: 4, gold: 2, attackEmoji: '👓', story: 'Can\'t see the obvious bugs' },
        { name: 'Wheelchair Workstation', symbol: '🧑‍🦼', hp: 16, attack: 5, defense: 3, exp: 7, gold: 5, attackEmoji: '⚙️', story: 'Immobile monolith that won\'t scale' },
        { name: 'Powered Chair', symbol: '👨‍🦼', hp: 18, attack: 6, defense: 3, exp: 8, gold: 6, attackEmoji: '🔋', story: 'Draining all your battery life' },
        { name: 'Chair Error', symbol: '👩‍🦼', hp: 16, attack: 5, defense: 3, exp: 7, gold: 5, attackEmoji: '🪑', story: 'Seat licenses expired' },
        { name: 'Manual Mode', symbol: '🧑‍🦽', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '✋', story: 'Disabled all automation' },
        { name: 'Push Force', symbol: '👨‍🦽', hp: 16, attack: 5, defense: 3, exp: 7, gold: 5, attackEmoji: '💪', story: 'Force pushing to main branch' },
        { name: 'Rolling Back', symbol: '👩‍🦽', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '⏪', story: 'Always rolling back deployments' },
        { name: 'Sprint Runner', symbol: '🏃', hp: 18, attack: 7, defense: 2, exp: 8, gold: 6, attackEmoji: '💨', story: 'Running from technical debt' },
        { name: 'Rush Deploy', symbol: '🏃‍♂️', hp: 20, attack: 8, defense: 2, exp: 9, gold: 7, attackEmoji: '🚀', story: 'Rushing releases before testing' },
        { name: 'Fast Break', symbol: '🏃‍♀️', hp: 18, attack: 7, defense: 2, exp: 8, gold: 6, attackEmoji: '💥', story: 'Breaking things at lightning speed' },
        { name: 'Dance Party', symbol: '💃', hp: 16, attack: 6, defense: 2, exp: 7, gold: 5, attackEmoji: '💃', story: 'Celebrating before the tests pass' },
        { name: 'Disco Deploy', symbol: '🕺', hp: 18, attack: 7, defense: 3, exp: 8, gold: 6, attackEmoji: '🕺', story: 'Deploying with style but no substance' },
        { name: 'Floating Bug', symbol: '🕴️', hp: 14, attack: 5, defense: 2, exp: 6, gold: 4, attackEmoji: '👔', story: 'Levitating above your debugging attempts' },
        { name: 'Party Bug', symbol: '👯', hp: 20, attack: 6, defense: 2, exp: 9, gold: 7, attackEmoji: '🎉', story: 'Duplicated errors everywhere' },
        { name: 'Twin Trouble', symbol: '👯‍♂️', hp: 22, attack: 7, defense: 3, exp: 10, gold: 8, attackEmoji: '👯', story: 'Same bug appearing twice' },
        { name: 'Mirror Error', symbol: '👯‍♀️', hp: 20, attack: 6, defense: 2, exp: 9, gold: 7, attackEmoji: '🪞', story: 'Identical issues in both environments' },
        
        // Food Enemies
        { name: 'Cold Code', symbol: '🥶', hp: 16, attack: 5, defense: 3, exp: 7, gold: 5, attackEmoji: '❄️', story: 'Frozen assets in production' },
        { name: 'Coconut Crash', symbol: '🥥', hp: 18, attack: 6, defense: 4, exp: 8, gold: 6, attackEmoji: '🥥', story: 'Hard shell, harder to crack bugs' },
        { name: 'Avocado Error', symbol: '🥑', hp: 14, attack: 4, defense: 2, exp: 6, gold: 8, attackEmoji: '🥑', story: 'Expensive bug that provides no value' },
        { name: 'Eggplant Exception', symbol: '🍆', hp: 16, attack: 5, defense: 2, exp: 7, gold: 5, attackEmoji: '🍆', story: 'Purple deploy causing confusion' },
        { name: 'Potato Server', symbol: '🥔', hp: 20, attack: 5, defense: 4, exp: 9, gold: 7, attackEmoji: '🥔', story: 'Running on potato hardware' },
        { name: 'Carrot Cache', symbol: '🥕', hp: 12, attack: 3, defense: 2, exp: 5, gold: 3, attackEmoji: '🥕', story: 'Dangling cache pointers' },
        { name: 'Corn Kernel', symbol: '🌽', hp: 14, attack: 4, defense: 2, exp: 6, gold: 4, attackEmoji: '🌽', story: 'Kernel panic in your Linux server' },
        { name: 'Hot Pepper', symbol: '🌶️', hp: 18, attack: 8, defense: 1, exp: 8, gold: 6, attackEmoji: '🔥', story: 'Spicy bugs that burn production' },
        { name: 'Bell Pepper', symbol: '🫑', hp: 14, attack: 4, defense: 3, exp: 6, gold: 4, attackEmoji: '🔔', story: 'Alerts ringing non-stop' },
        { name: 'Pickle Process', symbol: '🥒', hp: 12, attack: 3, defense: 2, exp: 5, gold: 3, attackEmoji: '🥒', story: 'Serialization errors everywhere' },
        { name: 'Lettuce Leak', symbol: '🥬', hp: 10, attack: 2, defense: 1, exp: 4, gold: 2, attackEmoji: '💧', story: 'Slow memory leak, layer by layer' },
        { name: 'Broccoli Block', symbol: '🥦', hp: 16, attack: 5, defense: 3, exp: 7, gold: 5, attackEmoji: '🌳', story: 'Tree-structured blocking calls' },
        { name: 'Garlic Guard', symbol: '🧄', hp: 14, attack: 6, defense: 2, exp: 6, gold: 4, attackEmoji: '🧄', story: 'Keeps vampires AND developers away' },
        { name: 'Onion Layers', symbol: '🧅', hp: 18, attack: 5, defense: 4, exp: 8, gold: 6, attackEmoji: '😢', story: 'Makes you cry peeling back abstractions' },
        { name: 'Toxic Mushroom', symbol: '🍄', hp: 20, attack: 7, defense: 2, exp: 9, gold: 7, attackEmoji: '☠️', story: 'Poisonous code spreading like spores' },
        { name: 'Peanut Panic', symbol: '🥜', hp: 10, attack: 3, defense: 1, exp: 4, gold: 2, attackEmoji: '🥜', story: 'Small bug causing allergic reactions' },
        { name: 'Chestnut Crash', symbol: '🌰', hp: 14, attack: 4, defense: 3, exp: 6, gold: 4, attackEmoji: '🌰', story: 'Nutty behavior in edge cases' },
        { name: 'Bread Crumb', symbol: '🍞', hp: 8, attack: 2, defense: 1, exp: 3, gold: 2, attackEmoji: '🍞', story: 'Following broken trail in logs' },
        { name: 'Croissant Code', symbol: '🥐', hp: 12, attack: 3, defense: 2, exp: 5, gold: 3, attackEmoji: '🥐', story: 'French developers on strike' },
        { name: 'Baguette Bug', symbol: '🥖', hp: 14, attack: 5, defense: 2, exp: 6, gold: 4, attackEmoji: '🥖', story: 'Long and hard to handle' },
        { name: 'Flatbread Fail', symbol: '🫓', hp: 10, attack: 3, defense: 1, exp: 4, gold: 2, attackEmoji: '🫓', story: 'Flat performance metrics' },
        { name: 'Pretzel Logic', symbol: '🥨', hp: 18, attack: 6, defense: 3, exp: 8, gold: 6, attackEmoji: '🥨', story: 'Twisted business logic' },
        { name: 'Bagel Blocker', symbol: '🥯', hp: 14, attack: 4, defense: 3, exp: 6, gold: 4, attackEmoji: '🥯', story: 'Circular dependencies blocking everything' },
        { name: 'Pancake Stack', symbol: '🥞', hp: 16, attack: 5, defense: 2, exp: 7, gold: 5, attackEmoji: '🥞', story: 'Stack overflow from too many layers' },
        { name: 'Waffle Warrior', symbol: '🧇', hp: 18, attack: 6, defense: 3, exp: 8, gold: 6, attackEmoji: '🧇', story: 'Grid-locked in endless loops' },
        { name: 'Cheese Overflow', symbol: '🧀', hp: 20, attack: 7, defense: 2, exp: 9, gold: 7, attackEmoji: '🧀', story: 'Too cheesy, code smells bad' },
        { name: 'Meat Bug', symbol: '🍖', hp: 22, attack: 8, defense: 3, exp: 10, gold: 8, attackEmoji: '🍖', story: 'Meaty error logs to chew through' },
        { name: 'Drumstick Deploy', symbol: '🍗', hp: 20, attack: 7, defense: 3, exp: 9, gold: 7, attackEmoji: '🍗', story: 'Half-baked releases' },
        { name: 'Steak Server', symbol: '🥩', hp: 28, attack: 10, defense: 4, exp: 14, gold: 11, attackEmoji: '🔪', story: 'Well-done server that\'s overcooked' },
        { name: 'Bacon Bit', symbol: '🥓', hp: 12, attack: 4, defense: 1, exp: 5, gold: 3, attackEmoji: '🥓', story: 'Crispy fried circuits' },
        { name: 'Burger Bug', symbol: '🍔', hp: 24, attack: 8, defense: 3, exp: 12, gold: 9, attackEmoji: '🍔', story: 'Layered problems stacked high' },
        { name: 'French Fry Fail', symbol: '🍟', hp: 14, attack: 4, defense: 1, exp: 6, gold: 4, attackEmoji: '🧂', story: 'Salty responses from code review' },
        { name: 'Pizza Deploy', symbol: '🍕', hp: 26, attack: 9, defense: 3, exp: 13, gold: 10, attackEmoji: '🍕', story: 'Delivered in 30 minutes or it\'s broken' },
        { name: 'Hot Dog Handler', symbol: '🌭', hp: 16, attack: 5, defense: 2, exp: 7, gold: 5, attackEmoji: '🌭', story: 'Franken-code stitched together' },
        { name: 'Sandwich Stack', symbol: '🥪', hp: 20, attack: 7, defense: 3, exp: 9, gold: 7, attackEmoji: '🥪', story: 'Layered architecture collapse' }
    ];
    
    // Connection sentences for linking enemy encounters
    const CONNECTION_SENTENCES = [
        "Meanwhile", "In the meantime", "Suddenly", "At the same time", "Just then",
        "At that moment", "Right then", "Just as", "While this happens", "During this",
        "Simultaneously", "Concurrently", "In parallel", "At the same instant", "Right after",
        "Following this", "As a result", "Consequently", "Therefore", "Meanwhile",
        "In the background", "Behind the scenes", "Unbeknownst to you", "Secretly", "Quietly",
        "From another direction", "From the shadows", "From behind", "From above", "From below",
        "Out of nowhere", "Without warning", "Unexpectedly", "Surprisingly", "Shockingly",
        "Amazingly", "Incredibly", "Remarkably", "Strangely", "Curiously"
    ];

    // First part of stories - discovery/setting
    const STORY_STARTS = [
        "You found {enemy1} and {enemy2} chewing the network cables in the server room!",
        "You discovered {enemy1} and {enemy2} arguing about tabs vs spaces in the code review!",
        "You stumbled upon {enemy1} and {enemy2} plotting to crash the production server!",
        "You caught {enemy1} and {enemy2} stealing coffee from the break room!",
        "You found {enemy1} and {enemy2} corrupting the database with malicious queries!",
        "You discovered {enemy1} and {enemy2} breaking the CI/CD pipeline!",
        "You stumbled upon {enemy1} and {enemy2} arguing about which framework is better!",
        "You caught {enemy1} and {enemy2} trying to turn your code into spaghetti!",
        "You found {enemy1} and {enemy2} planning to make your app load slower than a turtle!",
        "You discovered {enemy1} and {enemy2} seeking to break your authentication system!",
        "You stumbled upon {enemy1} and {enemy2} plotting to make your code unmaintainable!",
        "You caught {enemy1} and {enemy2} trying to consume all available disk space!",
        "You found {enemy1} and {enemy2} arguing about REST vs GraphQL!",
        "You discovered {enemy1} and {enemy2} planning to break your error logging!",
        "You stumbled upon {enemy1} and {enemy2} trying to make your code undocumented!",
        "You caught {enemy1} and {enemy2} corrupting your configuration files!",
        "You found {enemy1} and {enemy2} planning to break your monitoring system!",
        "You discovered {enemy1} and {enemy2} trying to make your app leak memory!",
        "You stumbled upon {enemy1} and {enemy2} plotting to break your backup system!",
        "You caught {enemy1} and {enemy2} trying to make your code untestable!",
        "You found {enemy1} and {enemy2} planning to break your development environment!",
        "You discovered {enemy1} and {enemy2} trying to consume all available bandwidth!",
        "You stumbled upon {enemy1} and {enemy2} arguing about React vs Vue!",
        "You caught {enemy1} and {enemy2} planning to break your error handling!",
        "You found {enemy1} and {enemy2} trying to make your code uncommented!",
        "You discovered {enemy1} and {enemy2} corrupting your environment variables!",
        "You stumbled upon {enemy1} and {enemy2} planning to break your logging system!",
        "You caught {enemy1} and {enemy2} trying to consume all available CPU!",
        "You found {enemy1} and {enemy2} plotting to break your version control!",
        "You discovered {enemy1} and {enemy2} trying to break your development process!"
    ];

    // Single enemy first stories
    const SINGLE_ENEMY_FIRST_STORIES = [
        "A wild {enemy} appears! It's been debugging for 3 days straight and is very cranky!",
        "Oh no! A {enemy} has escaped from the test environment and is wreaking havoc!",
        "A {enemy} materializes from the digital void, muttering about 'undefined is not a function'!",
        "A {enemy} emerges from behind a stack of coffee cups, looking for revenge!",
        "A {enemy} has been summoned by the ancient ritual of 'git push --force'!",
        "A {enemy} appears, still traumatized from the last code review!",
        "A {enemy} materializes, complaining about the lack of documentation!",
        "A {enemy} emerges from the shadows, seeking to corrupt your clean code!",
        "A {enemy} appears, still angry about being deprecated!",
        "A {enemy} materializes, muttering about 'it works on my machine'!",
        "A {enemy} appears from the depths of Stack Overflow, still confused about the accepted answer!",
        "A {enemy} materializes from the void, complaining that 'this should be a simple fix'!",
        "A {enemy} emerges from behind a mountain of empty energy drink cans!",
        "A {enemy} appears, still traumatized from the last all-nighter!",
        "A {enemy} materializes, muttering about 'it was working yesterday'!",
        "A {enemy} emerges from the shadows, seeking to add more technical debt!",
        "A {enemy} appears, still angry about being assigned to legacy code!",
        "A {enemy} materializes, complaining about the lack of unit tests!",
        "A {enemy} emerges, planning to make your code as complex as possible!",
        "A {enemy} appears, seeking revenge for being refactored!"
    ];

    // Single enemy second stories
    const SINGLE_ENEMY_SECOND_STORIES = [
        "A {enemy} emerges from the void, planning to create total destruction in the server!",
        "A {enemy} materializes, seeking to corrupt your entire codebase!",
        "A {enemy} appears, plotting to break your entire infrastructure!",
        "A {enemy} emerges, planning to make your app completely unusable!",
        "A {enemy} materializes, seeking to crash your production environment!",
        "A {enemy} appears, plotting to corrupt your entire database!",
        "A {enemy} emerges, planning to break your entire security system!",
        "A {enemy} materializes, seeking to make your code completely unreadable!",
        "A {enemy} appears, plotting to break your entire deployment process!",
        "A {enemy} emerges, planning to corrupt your entire project!",
        "A {enemy} materializes, seeking to make your app completely unstable!",
        "A {enemy} appears, plotting to break your entire development workflow!",
        "A {enemy} emerges, planning to corrupt your entire system!",
        "A {enemy} materializes, seeking to make your code completely unmaintainable!",
        "A {enemy} appears, plotting to break your entire architecture!",
        "A {enemy} emerges, planning to corrupt your entire digital existence!",
        "A {enemy} materializes, seeking to make your app completely unreliable!",
        "A {enemy} appears, plotting to break your entire technological empire!",
        "A {enemy} emerges, planning to corrupt your entire digital legacy!",
        "A {enemy} materializes, seeking to make your app completely and utterly unusable!"
    ];

    // Single enemy third stories
    const SINGLE_ENEMY_THIRD_STORIES = [
        "A {enemy} appears from the shadows, planning to consume all available memory!",
        "A {enemy} materializes, seeking to break your entire testing framework!",
        "A {enemy} emerges, plotting to corrupt your entire data structure!",
        "A {enemy} appears, planning to make your app completely unresponsive!",
        "A {enemy} materializes, seeking to break your entire service architecture!",
        "A {enemy} emerges, plotting to make your code completely incomprehensible!",
        "A {enemy} appears, planning to break your entire CI/CD system!",
        "A {enemy} materializes, seeking to corrupt your entire application!",
        "A {enemy} emerges, plotting to make your app completely vulnerable!",
        "A {enemy} appears, planning to break your entire cloud infrastructure!",
        "A {enemy} materializes, seeking to corrupt your entire software architecture!",
        "A {enemy} emerges, plotting to make your app completely insecure!",
        "A {enemy} appears, planning to break your entire development methodology!",
        "A {enemy} materializes, seeking to corrupt your entire project structure!",
        "A {enemy} emerges, plotting to make your app completely broken!",
        "A {enemy} appears, planning to break your entire digital universe!",
        "A {enemy} materializes, seeking to corrupt your entire technological infrastructure!",
        "A {enemy} emerges, plotting to make your app completely dysfunctional!",
        "A {enemy} appears, planning to break your entire development ecosystem!",
        "A {enemy} materializes, seeking to corrupt your entire digital world!"
    ];

    // Story endings that connect to a reasonable conclusion
    const STORY_ENDINGS = [
        "They decided together to make your life a living nightmare!",
        "When they saw you, they immediately started plotting your downfall!",
        "They all turned to face you with malicious intent!",
        "Together, they formed an alliance against you!",
        "They realized you were the only thing standing in their way!",
        "They all looked at you and said 'It's time to end this!'",
        "They decided to team up and destroy everything you've built!",
        "When they noticed you, they immediately started their attack!",
        "They all turned towards you with evil grins!",
        "Together, they vowed to make your code completely unusable!",
        "They realized you were the target of their destruction!",
        "They all looked at you and said 'Prepare for battle!'",
        "They decided to combine their powers against you!",
        "When they saw you, they immediately began their assault!",
        "They all turned to face you with determination!",
        "Together, they planned to make your development life hell!",
        "They realized you were the obstacle to their success!",
        "They all looked at you and said 'This ends now!'",
        "They decided to work together to defeat you!",
        "When they noticed you, they immediately started their plan!",
        "They all turned towards you with sinister smiles!",
        "Together, they vowed to corrupt your entire system!",
        "They realized you were the one they needed to eliminate!",
        "They all looked at you and said 'Time to face the consequences!'",
        "They decided to join forces and attack you!",
        "When they saw you, they immediately began their mission!",
        "They all turned to face you with malicious glee!",
        "Together, they planned to make your app completely broken!",
        "They realized you were the only thing preventing their chaos!",
        "They all looked at you and said 'Prepare for the ultimate battle!'",
        "They decided to combine their evil powers!",
        "When they noticed you, they immediately started their destruction!",
        "They all turned towards you with evil intentions!",
        "Together, they vowed to make your code a nightmare!",
        "They realized you were the target of their wrath!",
        "They all looked at you and said 'This is where it ends!'",
        "They decided to work as a team to destroy you!",
        "When they saw you, they immediately began their assault!",
        "They all turned to face you with determination!",
        "Together, they planned to make your development process hell!"
    ];

    // FINAL BOSS
    const FINAL_BOSS = {
        name: 'BUG IN PRODUCTION',
        symbol: '🐛',
        hp: 300,
        attack: 25,
        defense: 10,
        exp: 500,
        gold: 500,
        level: 10,
        isBoss: true
    };

    /* ---------- Map Generation ---------- */
    function generateMap() {
        const map = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                const rand = Math.random();
                if (rand < 0.15) {
                    row.push('🌲');
                } else if (rand < 0.25) {
                    row.push('⛰️');
                } else {
                    row.push('🟩');
                }
            }
            map.push(row);
        }
        map[gameState.player.y][gameState.player.x] = '🟩';
        return map;
    }

    function spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            const pos = findRandomPosition(3, (x, y) => {
                return !gameState.enemiesOnMap.some(e => e.x === x && e.y === y) &&
                       !gameState.shopsOnMap.some(s => s.x === x && s.y === y);
            });
            
            if (pos.found) {
                // Progressive enemy level: starts at 1, increases with each defeat, capped at 10
                const enemyLevel = Math.min(10, gameState.nextEnemyLevel);
                const enemyIndex = Math.floor(Math.random() * ENEMY_TYPES.length);
                const baseEnemy = ENEMY_TYPES[enemyIndex];
                
                gameState.enemiesOnMap.push({
                    x: pos.x,
                    y: pos.y,
                    name: baseEnemy.name,
                    symbol: baseEnemy.symbol,
                    attackEmoji: baseEnemy.attackEmoji,
                    attackName: baseEnemy.attackName,
                    magicName: baseEnemy.magicName,
                    specialName: baseEnemy.specialName,
                    hp: baseEnemy.hp + (enemyLevel - 1) * 5,
                    attack: baseEnemy.attack + (enemyLevel - 1) * 2,
                    defense: baseEnemy.defense + (enemyLevel - 1),
                    exp: baseEnemy.exp,
                    gold: baseEnemy.gold,
                    level: enemyLevel,
                    groupLevel: enemyLevel // Store the group level for battle consistency
                });
            }
        }
    }

    function spawnRecruits() {
        // Select 4 random party characters from the PARTY_CHARACTERS array
        const numRecruits = 4;
        const selectedRecruits = [];
        const availableParty = [...PARTY_CHARACTERS]; // Copy array
        
        for (let i = 0; i < numRecruits && availableParty.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableParty.length);
            const selected = availableParty.splice(randomIndex, 1)[0];
            
            // Pick random skin for this recruit
            const randomSkinIndex = Math.floor(Math.random() * selected.skins.length);
            const randomSkin = selected.skins[randomSkinIndex];
            
            selectedRecruits.push({
                name: selected.title,
                symbol: randomSkin,
                price: PARTY_MEMBER_COST,
                hpMult: selected.hpMult,
                attackMult: selected.attackMult,
                defenseMult: selected.defenseMult,
                magicMult: selected.magicMult,
                story: selected.story,
                nickname: selected.nickname,
                attackEmoji: selected.attack,
                magicEmoji: selected.magic,
                superEmoji: selected.super,
                attackName: selected.attackName,
                magicName: selected.magicName,
                specialName: selected.specialName
            });
        }
        
        const recruitTypes = selectedRecruits;
        
        // Now spawn the selected recruits on the map
        for (let i = 0; i < recruitTypes.length; i++) {
            const pos = findRandomPosition(5, (x, y) => {
                return !gameState.shopsOnMap.some(s => s.x === x && s.y === y);
            });
            
            if (pos.found) {
                const recruitType = recruitTypes[i];
                gameState.shopsOnMap.push({ 
                    x: pos.x,
                    y: pos.y, 
                    type: 'recruit',
                    recruitType: recruitType
                });
                gameState.map[pos.y][pos.x] = recruitType.symbol;
            }
        }
    }

    function spawnInns() {
        const numInns = 2;
        
        for (let i = 0; i < numInns; i++) {
            const pos = findRandomPosition(5, (x, y) => {
                return gameState.map[y][x] === '🟩' &&
                       !gameState.innsOnMap.some(inn => inn.x === x && inn.y === y);
            });
            
            if (pos.found) {
                gameState.innsOnMap.push({
                    x: pos.x,
                    y: pos.y,
                    symbol: '🏨'
                });
                gameState.map[pos.y][pos.x] = '🏨';
            }
        }
    }

    /* ---------- Battle System ---------- */

    /**
     * Spread elements with spaces between them
     */
    
    /* ========== UI UTILITY FUNCTIONS ========== */
    
    /**
     * Create a progress bar
     */
    function createBar(value, max, length, filledChar = '█', emptyChar = ' ') {
        const percent = Math.max(0, Math.min(1, value / max));
        const filled = Math.floor(percent * length);
        const empty = length - filled;
        return `[${filledChar.repeat(Math.max(0, filled))}${emptyChar.repeat(Math.max(0, empty))}]`;
    }
    
    /**
     * Create borderlines
     */
    function createBorder(width, position = 'top') {
        const innerWidth = width - 2;
        if (position === 'top') return '╔' + '═'.repeat(innerWidth) + '╗';
        if (position === 'bottom') return '╚' + '═'.repeat(innerWidth) + '╝';
        if (position === 'separator') return '═'.repeat(width);
        return '';
    }
    
    /**
     * Create a bordered line with text (centered, left, or right aligned)
     */
    function createBorderedLine(text, width, align = 'center') {
        const innerWidth = width - 2;
        let content;
        
        // Truncate text if it's too long to prevent negative padding
        const displayText = text.length > innerWidth ? text.substring(0, innerWidth - 3) + '...' : text;
        
        if (align === 'center') {
            const leftPad = Math.max(0, Math.floor((innerWidth - displayText.length) / 2));
            const rightPad = Math.max(0, Math.ceil((innerWidth - displayText.length) / 2));
            content = ' '.repeat(leftPad) + displayText + ' '.repeat(rightPad);
        } else if (align === 'left') {
            content = displayText.padEnd(innerWidth);
        } else if (align === 'right') {
            content = displayText.padStart(innerWidth);
        }
        
        return '║' + content + '║';
    }
    
    /**
     * Log styled text to console
     */
    function logStyled(text, style) {
        console.log(`%c${text}`, style);
    }
    
    /**
     * Create a separator line (returns the line, doesn't log it)
     */
    function createSeparator(width, char = '═') {
        return char.repeat(width);
    }
    

    /**
     * Find a random valid position on map
     */
    function findRandomPosition(minDist = 5, condition = null, maxAttempts = 100) {
        let x, y, attempts = 0;
        let distOk, tileOk, customOk;
        
        do {
            x = Math.floor(Math.random() * MAP_WIDTH);
            y = Math.floor(Math.random() * MAP_HEIGHT);
            attempts++;
            
            distOk = Math.abs(x - gameState.player.x) >= minDist || Math.abs(y - gameState.player.y) >= minDist;
            tileOk = gameState.map[y][x] !== '⛰️';
            customOk = !condition || condition(x, y);
            
        } while ((!distOk || !tileOk || !customOk) && attempts < maxAttempts);
        
        return attempts < maxAttempts ? { x, y, found: true } : { found: false };
    }
    
    /**
     * Create character stat display
     */
    function createStatDisplay(char) {
        const hpPercent = Math.max(0, Math.min(1, char.currentHp / char.maxHp));
        const hpBar = createBar(char.currentHp, char.maxHp, 8);
        
        const specialPercent = Math.max(0, Math.min(1, char.specialMeter / 100));
        const specialBar = createBar(char.specialMeter, 100, 6, '●', '○');
        
        const exp = char.exp || 0;
        const nextLevel = char.nextLevel || 10;
        const expBar = createBar(exp, nextLevel, 8);
        
        return {
            hpBar,
            hpPercent,
            specialBar,
            specialPercent,
            expBar,
            hpText: `${char.currentHp}/${char.maxHp}`,
            mpText: `${char.currentMp}/${char.maxMp}`,
            specialText: `${Math.floor(specialPercent * 100)}%`,
            expText: `${exp}/${nextLevel}`
        };
    }

    
    /* ---------- Battle System ---------- */
    function getCurrentPlayer() {
        if (gameState.currentPlayerIndex === 0) {
            return gameState.player;
        } else if (gameState.player.party && gameState.player.party[gameState.currentPlayerIndex - 1]) {
            return gameState.player.party[gameState.currentPlayerIndex - 1];
        }
        return null;
    }

    /**
     * Spread elements with spaces between them
     * @param {Array} elements - Array of strings to spread
     * @param {number} totalWidth - Total width of the output line
     * @param {string} separator - Character to use between elements (default: ' ')
     * @returns {string} - Formatted string with elements spread with spaces
     */
    function spreadAsSpace(elements, totalWidth = 60, separator = ' ') {
        if (!elements || elements.length === 0) return '';
        
        const totalElementLength = elements.reduce((sum, element) => sum + element.length, 0);
        const totalSeparatorLength = (elements.length - 1) * separator.length;
        const availableSpace = totalWidth - totalElementLength - totalSeparatorLength;
        
        if (availableSpace <= 0) {
            return elements.join(separator);
        }
        
        const spacePerGap = Math.floor(availableSpace / (elements.length - 1));
        const extraSpaces = availableSpace % (elements.length - 1);
        
        let result = elements[0];
        for (let i = 1; i < elements.length; i++) {
            const spaces = spacePerGap + (i <= extraSpaces ? 1 : 0);
            result += separator + ' '.repeat(spaces) + elements[i];
        }
        
        return result;
    }

    /**
     * Spread elements with even spacing across the total width
     * @param {Array} elements - Array of strings to spread
     * @param {number} totalWidth - Total width of the output line
     * @param {string} separator - Character to use between elements (default: ' ')
     * @returns {string} - Formatted string with elements evenly distributed
     */
    function spreadSpaceEvenly(elements, totalWidth = 60, separator = ' ') {
        if (!elements || elements.length === 0) return '';
        if (elements.length === 1) return elements[0];
        
        const totalElementLength = elements.reduce((sum, element) => sum + element.length, 0);
        const totalSeparatorLength = (elements.length - 1) * separator.length;
        const availableSpace = totalWidth - totalElementLength - totalSeparatorLength;
        
        if (availableSpace <= 0) {
            return elements.join(separator);
        }
        
        const spacePerGap = Math.floor(availableSpace / (elements.length - 1));
        
        let result = elements[0];
        for (let i = 1; i < elements.length; i++) {
            result += separator + ' '.repeat(spacePerGap) + elements[i];
        }
        
        return result;
    }

    /**
     * Create a properly aligned dialog border
     * @param {string} title - Title to center in the dialog
     * @param {number} width - Width of the dialog (default: 60)
     * @param {string} color - CSS color for the border (default: '#00ff00')
     * @returns {Array} - Array of console.log strings for the dialog border
     */
    function createDialogBorder(title, width = 60, color = '#00ff00') {
        const topBorder = '╔' + '═'.repeat(width - 2) + '╗';
        const bottomBorder = '╚' + '═'.repeat(width - 2) + '╝';
        
        if (title) {
            const titleLine = '║' + ' '.repeat(Math.floor((width - 2 - title.length) / 2)- 1) + title + ' '.repeat(Math.ceil((width - 2 - title.length

            ) / 2)) + '║';
            return [
                `%c${topBorder}`, `color: ${color}; font-weight: bold`,
                `%c${titleLine}`, `color: ${color}; font-weight: bold`,
                `%c${bottomBorder}`, `color: ${color}; font-weight: bold`
            ];
        } else {
            return [
                `%c${topBorder}`, `color: ${color}; font-weight: bold`,
                `%c${bottomBorder}`, `color: ${color}; font-weight: bold`
            ];
        }
    }

    /**
     * Break long strings into multiple lines by words
     * @param {string} text - Text to break into lines
     * @param {number} maxWidth - Maximum width per line (default: 60)
     * @returns {Array} - Array of lines
     */
    function breakTextIntoLines(text, maxWidth = 60) {
        if (!text || text.length <= maxWidth) {
            return [text];
        }
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (testLine.length <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // Single word is too long, force it
                    lines.push(word);
                    currentLine = '';
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    /**
     * Generate a funny battle story based on the enemies encountered
     * @param {Array} enemies - Array of enemy objects
     * @returns {string} - A funny battle story with enemy names
     */
    function generateBattleStory(enemies) {
        if (!enemies || enemies.length === 0) return "Something mysterious appears!";
        
        const numEnemies = enemies.length;
        let story;
        
        if (numEnemies === 1) {
            // Single enemy - use first story
            const randomStory = SINGLE_ENEMY_FIRST_STORIES[Math.floor(Math.random() * SINGLE_ENEMY_FIRST_STORIES.length)];
            story = randomStory.replace('{enemy}', enemies[0].name);
        } else if (numEnemies === 2) {
            // Two enemies - use story start + ending
            const randomStart = STORY_STARTS[Math.floor(Math.random() * STORY_STARTS.length)];
            const randomEnding = STORY_ENDINGS[Math.floor(Math.random() * STORY_ENDINGS.length)];
            story = randomStart.replace('{enemy1}', enemies[0].name).replace('{enemy2}', enemies[1].name);
            story += ` ${randomEnding.toLowerCase()}`;
        } else {
            // Three or more enemies - build structured story
            // Start with story start for first two enemies
            const randomStart = STORY_STARTS[Math.floor(Math.random() * STORY_STARTS.length)];
            story = randomStart.replace('{enemy1}', enemies[0].name).replace('{enemy2}', enemies[1].name);
            
            // Add remaining enemies with connections and appropriate story parts
            for (let i = 2; i < numEnemies; i++) {
                const connection = CONNECTION_SENTENCES[Math.floor(Math.random() * CONNECTION_SENTENCES.length)];
                let enemyStory;
                
                // Choose story part based on position
                if (i === 2) {
                    // Third enemy - use second stories
                    enemyStory = SINGLE_ENEMY_SECOND_STORIES[Math.floor(Math.random() * SINGLE_ENEMY_SECOND_STORIES.length)];
                } else {
                    // Fourth+ enemy - use third stories
                    enemyStory = SINGLE_ENEMY_THIRD_STORIES[Math.floor(Math.random() * SINGLE_ENEMY_THIRD_STORIES.length)];
                }
                
                const enemyAction = enemyStory.replace('{enemy}', enemies[i].name);
                story += ` ${connection.toLowerCase()}, ${enemyAction.toLowerCase()}`;
            }
            
            // Add story ending
            const randomEnding = STORY_ENDINGS[Math.floor(Math.random() * STORY_ENDINGS.length)];
            story += ` ${randomEnding.toLowerCase()}`;
        }
        
        return story;
    }
    
    function nextPlayerTurn() {
        const totalPlayers = 1 + (gameState.player.party ? gameState.player.party.length : 0);
        gameState.currentPlayerIndex++;
        
        if (gameState.currentPlayerIndex >= totalPlayers) {
            // All players have taken their turn, now it's enemies' turn
            gameState.currentPlayerIndex = 0;
            gameState.playerTurnComplete = true;
            enemiesAttack();
        } else {
            // Next player's turn
            displayGame();
        }
    }
    
    function startBattle(enemyOnMap) {
        gameState.mode = MODE_BATTLE;
        
        // Play encounter sound and battle music
        playSound('encounterSound');
        setTimeout(() => playMusic('battleMusic'), 500);
        
        // Store the original enemy from map for removal later
        gameState.currentEnemyOnMap = enemyOnMap;
        
        // Determine number of enemies (1-3 random, but bosses are alone)
        const numEnemies = enemyOnMap.isBoss ? 1 : (1 + Math.floor(Math.random() * 3));
        
        gameState.enemies = [];
        
        // Get the base level for this enemy group (use groupLevel if available)
        const groupBaseLevel = enemyOnMap.groupLevel || enemyOnMap.level || 1;
        
        if (enemyOnMap.isBoss) {
            // Boss is alone
            const enemy = {
                ...enemyOnMap,
                currentHp: enemyOnMap.hp + (enemyOnMap.level - 1) * 5,
                maxHp: enemyOnMap.hp + (enemyOnMap.level - 1) * 5,
                id: 0,
                specialMeter: 0,
                specialReady: false
            };
            gameState.enemies.push(enemy);
        } else {
            // Create mixed team of different enemy types with similar levels
            const enemyTypes = [...ENEMY_TYPES];
            const usedTypes = new Set();
            
            for (let i = 0; i < numEnemies; i++) {
                let enemyType;
                let attempts = 0;
                
                // Try to get different enemy types for variety
                do {
                    enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                    attempts++;
                } while (usedTypes.has(enemyType.name) && attempts < 10 && usedTypes.size < enemyTypes.length);
                
                usedTypes.add(enemyType.name);
                
                // Each enemy in group has level within 1 of the base level (groupBaseLevel +/- 1)
                const levelVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                const enemyLevel = Math.max(1, Math.min(10, groupBaseLevel + levelVariation));
                
                const enemy = {
                    name: enemyType.name,
                    symbol: enemyType.symbol,
                    attackEmoji: enemyType.attackEmoji,
                    attackName: enemyType.attackName,
                    magicName: enemyType.magicName,
                    specialName: enemyType.specialName,
                    hp: enemyType.hp,
                    attack: enemyType.attack,
                    defense: enemyType.defense,
                    exp: enemyType.exp,
                    gold: enemyType.gold,
                    level: enemyLevel,
                    currentHp: enemyType.hp + (enemyLevel - 1) * 5,
                    maxHp: enemyType.hp + (enemyLevel - 1) * 5,
                    id: i,
                    specialMeter: 0,
                    specialReady: false
                };
                gameState.enemies.push(enemy);
            }
        }
        
        gameState.currentEnemyIndex = 0;
        gameState.currentPlayerIndex = 0;
        gameState.playerTurnComplete = false;
        gameState.battleLog = [];
        gameState.animationFrame = 0;
        
        // Generate a funny battle story
        const battleStory = generateBattleStory(gameState.enemies);
        gameState.battleLog.push(battleStory);
        
        // Battle entry animation
        animateBattleEntry();
    }

    function animateBattleEntry() {
        playSound('swordUnsheathe'); // Battle ready sound
        gameState.isAnimating = true;
        let frame = 0;
        const maxFrames = 10;
        
        const animate = () => {
            if (frame >= maxFrames) {
                gameState.isAnimating = false;
                displayGame();
                return;
            }
            
            console.clear();
            const battleStyle = "color: #ff0000; font-weight: bold";
            logStyled(createBorder(60, 'top'), battleStyle);
            logStyled(createBorderedLine('', 60), battleStyle);
            // Limit animation so text doesn't overflow (max 20 spaces)
            const battleText = "⚔️  BATTLE START!  ⚔️";
            const maxSpaces = 20;
            const spaces = Math.min(Math.floor(frame * 2), maxSpaces);
            const animatedText = " ".repeat(spaces) + battleText;
            logStyled(createBorderedLine(animatedText, 59), battleStyle);
            logStyled(createBorderedLine('', 60), battleStyle);
            logStyled(createBorder(60, 'bottom'), battleStyle);
            
            frame++;
            setTimeout(animate, 100);
        };
        
        animate();
    }

    function playerAttack() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || currentPlayer.currentHp <= 0 || gameState.isAnimating) return;
        
        const { enemies } = gameState;
        const currentEnemy = enemies[gameState.currentEnemyIndex];
        if (!currentEnemy || currentEnemy.currentHp <= 0) return;
        
        gameState.isAnimating = true;
        
        // Increase special meter randomly (5-15%)
        currentPlayer.specialMeter += 5 + Math.floor(Math.random() * 11);
        if (currentPlayer.specialMeter >= 100) {
            currentPlayer.specialMeter = 100;
            currentPlayer.specialReady = true;
        }
        
        animateAttack('player', () => {
            playRandomAttackSound();
            const damage = Math.max(1, currentPlayer.attack + Math.floor(Math.random() * 5) - currentEnemy.defense);
            currentEnemy.currentHp -= damage;
            
            // Play enemy hurt sound after attack (based on enemy type)
            setTimeout(() => playEnemyHurtSound(currentEnemy.name), 200);
            
            const playerName = gameState.currentPlayerIndex === 0 ? 'Hero' : currentPlayer.name;
            const attackName = currentPlayer.heroData?.attackName || currentPlayer.attackName || 'attacks';
            const attackEmoji = currentPlayer.heroData?.attack || currentPlayer.attackEmoji || '⚔️';
            gameState.battleLog.push(`${attackEmoji} ${playerName} uses ${attackName} on ${currentEnemy.name}! Dealt ${damage} damage!`);
            
            checkBattleEnd();
            if (enemies.length > 0) {
                nextPlayerTurn();
            }
        });
    }

    function playerMagic() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || currentPlayer.currentHp <= 0 || gameState.isAnimating) return;
        
        if (currentPlayer.currentMp < 5) {
            gameState.battleLog.push(`❌ Not enough MP!`);
            displayGame();
            return;
        }
        
        const { enemies } = gameState;
        const currentEnemy = enemies[gameState.currentEnemyIndex];
        if (!currentEnemy || currentEnemy.currentHp <= 0) return;
        
        gameState.isAnimating = true;
        currentPlayer.currentMp -= 5;
        
        // Increase special meter
        currentPlayer.specialMeter += 8 + Math.floor(Math.random() * 13);
        if (currentPlayer.specialMeter >= 100) {
            currentPlayer.specialMeter = 100;
            currentPlayer.specialReady = true;
        }
        
        animateMagic(() => {
            playRandomMagic();
            const damage = Math.max(1, Math.floor((currentPlayer.magic * 0.4 + Math.random() * 2) * 2) - currentEnemy.defense);
            currentEnemy.currentHp -= damage;
            
            // Play enemy hurt sound after magic (based on enemy type)
            setTimeout(() => playEnemyHurtSound(currentEnemy.name), 300);
            
            const playerName = gameState.currentPlayerIndex === 0 ? 'Hero' : currentPlayer.name;
            const magicName = currentPlayer.heroData?.magicName || currentPlayer.magicName || 'Magic';
            const magicEmoji = currentPlayer.heroData?.magic || currentPlayer.magicEmoji || '🔥';
            gameState.battleLog.push(`${magicEmoji} ${playerName} casts ${magicName} on ${currentEnemy.name}! Dealt ${damage} magic damage!`);
            
            checkBattleEnd();
            if (enemies.length > 0) {
                nextPlayerTurn();
            }
        });
    }

    function playerDefend() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || currentPlayer.currentHp <= 0 || gameState.isAnimating) return;
        
        // Play defend sound (armor/shield)
        const defendSounds = ['chainmail', 'armorLight'];
        playSound(defendSounds[Math.floor(Math.random() * defendSounds.length)]);
        
        const playerName = gameState.currentPlayerIndex === 0 ? 'Hero' : currentPlayer.name;
        
        // Restore MP when defending (faster MP regeneration)
        const mpRestore = 15 + Math.floor(Math.random() * 6); // 15-20 MP restored
        const oldMp = currentPlayer.currentMp;
        currentPlayer.currentMp = Math.min(currentPlayer.maxMp, currentPlayer.currentMp + mpRestore);
        const actualRestore = currentPlayer.currentMp - oldMp;
        
        gameState.battleLog.push(`🛡️ ${playerName} defends and focuses! (Restored ${actualRestore} MP)`);
        
        // Increase special meter slightly for defending
        currentPlayer.specialMeter += 3;
        if (currentPlayer.specialMeter >= 100) {
            currentPlayer.specialMeter = 100;
            currentPlayer.specialReady = true;
        }
        
        nextPlayerTurn();
    }

    function playerRun() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || currentPlayer.currentHp <= 0 || gameState.isAnimating) return;
        
        const playerName = gameState.currentPlayerIndex === 0 ? 'Hero' : currentPlayer.name;
        
        if (Math.random() < 0.5) {
            playSound('interface2'); // Escape success sound
            gameState.battleLog.push(`💨 ${playerName} escaped!`);
            gameState.mode = MODE_EXPLORE;
            gameState.enemies = [];
            gameState.currentEnemyOnMap = null;
            playMusic('mapMusic');
            displayGame();
        } else {
            playSound('interface4'); // Escape failed sound
            gameState.battleLog.push(`❌ ${playerName} can't escape!`);
            displayGame();
            nextPlayerTurn();
        }
    }
    
    function playerSpecial() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || currentPlayer.currentHp <= 0 || gameState.isAnimating) return;
        
        if (!currentPlayer.specialReady) {
            gameState.battleLog.push(`❌ Special attack not ready! (${currentPlayer.specialMeter}/100)`);
            displayGame();
            return;
        }
        
        const { enemies } = gameState;
        gameState.isAnimating = true;
        currentPlayer.specialMeter = 0;
        currentPlayer.specialReady = false;
        
        animateSpecialAttack('player', () => {
            playSound('interface3'); // Epic special attack sound
            let totalDamage = 0;
            enemies.forEach(enemy => {
                if (enemy.currentHp > 0) {
                    const damage = Math.floor(currentPlayer.attack * 3 + Math.random() * 20);
                    enemy.currentHp -= damage;
                    totalDamage += damage;
                }
            });
            
            // Play multiple enemy hurt sounds for impact
            setTimeout(() => {
                enemies.forEach((enemy, index) => {
                    if (enemy.currentHp > 0 || enemy.currentHp > -50) { // Play even if just killed
                        setTimeout(() => playEnemyHurtSound(enemy.name), index * 100);
                    }
                });
            }, 400);
            
            const playerName = gameState.currentPlayerIndex === 0 ? 'Hero' : currentPlayer.name;
            const specialName = currentPlayer.heroData?.specialName || currentPlayer.specialName || 'ULTIMATE ATTACK';
            const superEmoji = currentPlayer.heroData?.super || currentPlayer.superEmoji || '💥';
            gameState.battleLog.push(`✨${superEmoji} ${playerName}'s ${specialName}! Dealt ${totalDamage} total damage to all enemies!`);
            
            checkBattleEnd();
            if (enemies.length > 0) {
                nextPlayerTurn();
            }
        });
    }

    function checkBattleEnd() {
        const { enemies, player } = gameState;
        
        // Remove dead party members immediately (before checking if battle ends)
        if (player.party && player.party.length > 0) {
            const originalPartyLength = player.party.length;
            player.party = player.party.filter(member => member.currentHp > 0);
            
            // Update position trail if party members died
            const removedCount = originalPartyLength - player.party.length;
            if (removedCount > 0) {
                for (let i = 0; i < removedCount; i++) {
                    gameState.positionTrail.pop();
                }
                
                // Adjust currentPlayerIndex if it's now out of bounds
                const totalPlayers = 1 + player.party.length;
                if (gameState.currentPlayerIndex >= totalPlayers) {
                    gameState.currentPlayerIndex = 0; // Reset to hero
                }
            }
        }
        
        // Check if all enemies are dead
        const allEnemiesDead = enemies.every(e => e.currentHp <= 0);
        
        if (allEnemiesDead) {
            // Store defeated enemies BEFORE filtering (for XP calculation)
            gameState.defeatedEnemies = [...enemies];
            animateBattleExit(() => winBattle());
        } else {
            // Remove dead enemies
            gameState.enemies = enemies.filter(e => e.currentHp > 0);
            
            // Move to next living enemy if current is dead
            if (gameState.currentEnemyIndex >= gameState.enemies.length) {
                gameState.currentEnemyIndex = 0;
            }
            // Don't automatically call enemiesAttack here - let the turn system handle it
        }
    }

    function enemiesAttack(defending = false) {
        const { enemies, player } = gameState;
        
        setTimeout(() => {
            let attackIndex = 0;
            const attackNext = () => {
                if (attackIndex >= enemies.length) {
                    gameState.isAnimating = false;
                    gameState.playerTurnComplete = false;
                    gameState.currentPlayerIndex = 0;
                    // Don't auto-refresh, wait for next player action
                    return;
                }
                
                const enemy = enemies[attackIndex];
                if (enemy.currentHp <= 0) {
                    attackIndex++;
                    attackNext();
                    return;
                }
                
                // Increase enemy special meter
                enemy.specialMeter += 10 + Math.floor(Math.random() * 11);
                if (enemy.specialMeter >= 100) {
                    enemy.specialMeter = 100;
                    enemy.specialReady = true;
                }
                
                // Use special attack if ready (100% chance when full)
                if (enemy.specialReady) {
                    enemySpecialAttack(enemy, () => {
                        if (player.currentHp > 0) {
                            displayGame();
                        }
                        attackIndex++;
                        attackNext();
                    });
                } else {
                    gameState.isAnimating = true;
                    gameState.currentAttackingEnemy = enemy; // Store for animation
                    animateAttack('enemy', () => {
                        playEnemyAttackSound(enemy.name);
                        const totalDefense = player.defense + (player.party ? player.party.reduce((sum, m) => sum + m.defense, 0) : 0);
                        const defenseMultiplier = defending ? 2 : 1;
                        const damage = Math.max(1, Math.floor((enemy.attack + Math.floor(Math.random() * 5) - totalDefense) / defenseMultiplier));
                        player.currentHp -= damage;
                        
                        // Play player hurt sound
                        setTimeout(() => playSound('interface5'), 200);
                        
                        const attackName = enemy.attackName || 'attacks';
                        gameState.battleLog.push(`${enemy.attackEmoji || '💥'} ${enemy.name} uses ${attackName}! You took ${damage} damage!`);
                        
                        if (player.currentHp <= 0) {
                            gameOver();
                            displayGame();
                        } else {
                            displayGame();
                            attackIndex++;
                            attackNext();
                        }
                    });
                }
            };
            attackNext();
        }, 500);
    }
    
    function enemySpecialAttack(enemy, callback) {
        const { player } = gameState;
        
        enemy.specialMeter = 0;
        enemy.specialReady = false;
        gameState.isAnimating = true;
        gameState.currentAttackingEnemy = enemy; // Store for animation
        
        animateSpecialAttack('enemy', () => {
            playSound('interface3'); // Epic special attack sound
            const damage = Math.floor(enemy.attack * 2.5 + Math.random() * 15);
            player.currentHp -= damage;
            
            // Play player hurt sound
            setTimeout(() => playSound('interface5'), 300);
            
            const specialName = enemy.specialName || 'SPECIAL ATTACK';
            gameState.battleLog.push(`🌟${enemy.attackEmoji || '💥'} ${enemy.name} uses ${specialName}! Dealt ${damage} damage!`);
            
            if (player.currentHp <= 0) {
                gameOver();
            }
            callback();
        });
    }

    function animateAttack(attacker, callback) {
        let frame = 0;
        const maxFrames = 10;
        
        const animate = () => {
            try {
                if (frame >= maxFrames) {
                    gameState.isAnimating = false;
                    callback();
                    return;
                }
                
                console.clear();
                displayBattleArena();
                
                if (attacker === 'player') {
                    // Get current attacking player
                    const currentPlayer = getCurrentPlayer();
                    const playerSymbol = currentPlayer === gameState.player ? (gameState.player.symbol || '🧙') : currentPlayer.symbol;
                    
                    // Get attack emoji from character data
                    let attackEmoji = '⚔️'; // Default
                    if (currentPlayer === gameState.player && gameState.player.heroData) {
                        attackEmoji = gameState.player.heroData.attack;
                    } else if (currentPlayer.attackEmoji) {
                        attackEmoji = currentPlayer.attackEmoji;
                    }
                    
                    // Player attack animation - show only enemies and current attacker
                    const enemyGroup = gameState.enemies ? gameState.enemies.map(enemy => enemy.symbol).join('') : '';
                    const partyGroup = playerSymbol; // ONLY the current attacker
                    
                    // Use FIXED positions (emojis = 1 visual char each, regardless of string length)
                    const playerPos = 18;
                    const attackPos = playerPos - (frame * 2);
                    const attackCurrentPos = Math.max(2, attackPos); // Stop at position 2 (near enemy)
                    
                    // Build line with fixed spacing
                    let animationLine = enemyGroup;
                    animationLine += ' '.repeat(Math.max(0, attackCurrentPos - 1));
                    animationLine += attackEmoji;
                    animationLine += ' '.repeat(Math.max(0, playerPos - attackCurrentPos - 1));
                    animationLine += partyGroup;
                    
                    console.log(`%c\n${animationLine}`, "font-size: 32px;");
                } else {
                    // Enemy attack: enemies on left, attack moving right, party on right
                    const enemyGroup = gameState.enemies ? gameState.enemies.map(enemy => enemy.symbol).join('') : '';
                    let partyGroup = gameState.player.symbol || '🧙'; // Hero
                    if (gameState.player.party) {
                        gameState.player.party.forEach(member => {
                            partyGroup += member.symbol;
                        });
                    }
                    
                    // Use FIXED positions (emojis = 1 visual char each, regardless of string length)
                    const playerPos = 18;
                    const attackPos = 2 + (frame * 2); // Start at position 2, move right
                    const attackCurrentPos = Math.min(16, attackPos); // Stop at position 16 (near player)
                    const enemyAttackEmoji = gameState.currentAttackingEnemy?.attackEmoji || '💥';
                    
                    // Build line with fixed spacing
                    let animationLine = enemyGroup;
                    animationLine += ' '.repeat(Math.max(0, attackCurrentPos - 1));
                    animationLine += enemyAttackEmoji;
                    animationLine += ' '.repeat(Math.max(0, playerPos - attackCurrentPos - 1));
                    animationLine += partyGroup;
                    
                    console.log(`%c\n${animationLine}`, "font-size: 32px;");
                }
                
                frame++;
                setTimeout(animate, 100);
            } catch (error) {
                // If animation fails, complete it immediately
                console.error('Attack animation error:', error);
                gameState.isAnimating = false;
                callback();
            }
        };
        
        animate();
    }

    function animateMagic(callback) {
        let frame = 0;
        const maxFrames = 15;
        
        const animate = () => {
            try {
                if (frame >= maxFrames) {
                    gameState.isAnimating = false;
                    callback();
                    return;
                }
                
                console.clear();
                displayBattleArena();
                
            // Get current attacking player
            const currentPlayer = getCurrentPlayer();
            const playerSymbol = currentPlayer === gameState.player ? (gameState.player.symbol || '🧙') : currentPlayer.symbol;
            
            // Get magic emoji from character data
            let magicEmoji = '🔥'; // Default
            if (currentPlayer === gameState.player && gameState.player.heroData) {
                magicEmoji = gameState.player.heroData.magic;
            } else if (currentPlayer.magicEmoji) {
                magicEmoji = currentPlayer.magicEmoji;
            }
            
            // Magic animation: enemies on left, magic moving left, current attacker on right
            const enemyGroup = gameState.enemies ? gameState.enemies.map(enemy => enemy.symbol).join('') : '';
            const partyGroup = playerSymbol; // ONLY the current attacker
                
                // Use FIXED positions for magic animation
                const playerPos = 18;
                const magicSymbols = [magicEmoji, magicEmoji + magicEmoji, magicEmoji + magicEmoji + magicEmoji, magicEmoji + magicEmoji, magicEmoji];
                const currentMagic = magicSymbols[frame % magicSymbols.length];
                
                // Start at position near player, move left toward enemy
                const firePos = playerPos - Math.floor(frame * 1.5);
                const fireCurrentPos = Math.max(2, firePos); // Stop at position 2 (near enemy)
                
                // Build line with fixed spacing
                let animationLine = enemyGroup;
                animationLine += ' '.repeat(Math.max(0, fireCurrentPos - 1));
                animationLine += currentMagic;
                // Calculate remaining space dynamically based on magic symbol visual width (treat as 1-3 emojis)
                const magicVisualWidth = magicSymbols.indexOf(currentMagic) + 1;
                animationLine += ' '.repeat(Math.max(0, playerPos - fireCurrentPos - magicVisualWidth));
                animationLine += partyGroup;
                
                console.log(`%c\n${animationLine}`, "font-size: 32px;");
                
                frame++;
                setTimeout(animate, 80);
            } catch (error) {
                // If animation fails, complete it immediately
                console.error('Magic animation error:', error);
                gameState.isAnimating = false;
                callback();
            }
        };
        
        animate();
    }
    
    function displayBattleArena() {
      
        const battleBorder = createDialogBorder("⚔️  BATTLE!  ⚔️", 59, '#ff0000');
        battleBorder.forEach((line, index) => {
            if (index % 2 === 0) {
                console.log(line, battleBorder[index + 1]);
            }
        });
        console.log("");
        
        // Display enemies with proper spacing
        console.log("%cENEMIES:", "color: #ff4444; font-weight: bold");
        
        // Enemy symbols row
        const enemySymbols = gameState.enemies.map((enemy, index) => {
            const isCurrentTarget = index === gameState.currentEnemyIndex;
            const targetArrow = isCurrentTarget ? "⚔️" : "  ";
            const enemySymbol = enemy.isBoss ? `${enemy.symbol}${enemy.symbol}${enemy.symbol}` : enemy.symbol;
            return `${targetArrow}${enemySymbol}`;
        });
        console.log(`%c${spreadSpaceEvenly(enemySymbols, 20)}`, "font-size: 28px;");
        
        // Enemy names row with level
        const enemyNames = gameState.enemies.map(enemy => `Lv${enemy.level}: ${enemy.name}`);
        console.log(spreadSpaceEvenly(enemyNames, 60));
        
        // Enemy HP bars row
        const enemyHpBars = gameState.enemies.map(enemy => {
            const maxHp = enemy.maxHp || enemy.hp || enemy.currentHp;
            const hpPercent = Math.max(0, Math.min(1, enemy.currentHp / maxHp));
            const hpBars = Math.floor(hpPercent * 8);
            return `HP [${'█'.repeat(Math.max(0, hpBars))}${' '.repeat(Math.max(0, 8 - hpBars))}] ${enemy.currentHp}/${maxHp}`;
        });
        console.log(spreadSpaceEvenly(enemyHpBars, 60));
        
        // Enemy Special meters row
        const enemySpecialBars = gameState.enemies.map(enemy => {
            const specialPercent = Math.max(0, Math.min(1, enemy.specialMeter / 100));
            const specialBars = Math.floor(specialPercent * 6);
            return `SA [${'●'.repeat(Math.max(0, specialBars))}${'○'.repeat(Math.max(0, 6 - specialBars))}] ${Math.floor(specialPercent * 100)}%`;
        });
        console.log(spreadSpaceEvenly(enemySpecialBars, 60));
        console.log();
        
        console.log("%c" + "─".repeat(60), "color: #666");
        console.log();
        
        // Display player and party with proper spacing
        console.log("%cYOUR PARTY:", "color: #44ff44; font-weight: bold");
        
        // Player symbols row
        const playerSymbols = [];
        const isHeroTurn = gameState.currentPlayerIndex === 0;
        playerSymbols.push(`${isHeroTurn ? '✧' : '  '}${gameState.player.symbol || '🧙'}`);
        
        if (gameState.player.party) {
            gameState.player.party.forEach((member, index) => {
                const isMemberTurn = gameState.currentPlayerIndex === index + 1;
                playerSymbols.push(`${isMemberTurn ? '✧' : '  '}${member.symbol}`);
            });
        }
        console.log(`%c${spreadSpaceEvenly(playerSymbols, 20)}`, "font-size: 28px;");
        
        // Player names row with level
        const playerNames = [];
        const heroName = gameState.player.heroData?.title || gameState.player.heroData?.nickname || 'Hero';
        playerNames.push(`Lv${gameState.player.level}: ${heroName}`);
        if (gameState.player.party) {
            gameState.player.party.forEach(member => {
                playerNames.push(`Lv${member.level}: ${member.name}`);
            });
        }
        console.log(spreadSpaceEvenly(playerNames, 60));
        
        // Player HP bars row
        const playerHpBars = [];
        const currentHp = gameState.player.currentHp || gameState.player.hp || 0;
        const maxHp = gameState.player.maxHp || gameState.player.hp || 1;
        const playerHpPercent = Math.max(0, Math.min(1, currentHp / maxHp));
        const playerHpBarsCount = Math.floor(playerHpPercent * 8);
        playerHpBars.push(`HP [${'█'.repeat(Math.max(0, playerHpBarsCount))}${' '.repeat(Math.max(0, 8 - playerHpBarsCount))}] ${currentHp}/${maxHp}`);
        
        if (gameState.player.party) {
            gameState.player.party.forEach(member => {
                const memberCurrentHp = member.currentHp || member.hp || 0;
                const memberMaxHp = member.maxHp || member.hp || 1;
                const memberHpPercent = Math.max(0, Math.min(1, memberCurrentHp / memberMaxHp));
                const memberHpBarsCount = Math.floor(memberHpPercent * 8);
                playerHpBars.push(`HP [${'█'.repeat(Math.max(0, memberHpBarsCount))}${' '.repeat(Math.max(0, 8 - memberHpBarsCount))}] ${memberCurrentHp}/${memberMaxHp}`);
            });
        }
        console.log(spreadSpaceEvenly(playerHpBars, 60));
        
        // Player Special meters row
        const playerSpecialBars = [];
        const playerSpecialPercent = Math.max(0, Math.min(1, gameState.player.specialMeter / 100));
        const playerSpecialBarsCount = Math.floor(playerSpecialPercent * 6);
        playerSpecialBars.push(`SA [${'●'.repeat(Math.max(0, playerSpecialBarsCount))}${'○'.repeat(Math.max(0, 6 - playerSpecialBarsCount))}] ${Math.floor(playerSpecialPercent * 100)}%`);
        
        if (gameState.player.party) {
            gameState.player.party.forEach(member => {
                const memberSpecialPercent = Math.max(0, Math.min(1, member.specialMeter / 100));
                const memberSpecialBarsCount = Math.floor(memberSpecialPercent * 6);
                playerSpecialBars.push(`SA [${'●'.repeat(Math.max(0, memberSpecialBarsCount))}${'○'.repeat(Math.max(0, 6 - memberSpecialBarsCount))}] ${Math.floor(memberSpecialPercent * 100)}%`);
            });
        }
        console.log(spreadSpaceEvenly(playerSpecialBars, 60));
        
        // Display MP row with proper spacing
        const playerMpBars = [];
        const currentMp = gameState.player.currentMp || gameState.player.mp || 0;
        const maxMp = gameState.player.maxMp || gameState.player.mp || 1;
        const playerMpPercent = Math.max(0, Math.min(1, currentMp / maxMp));
        const playerMpBarsCount = Math.floor(playerMpPercent * 8);
        playerMpBars.push(`MP [${'█'.repeat(Math.max(0, playerMpBarsCount))}${' '.repeat(Math.max(0, 8 - playerMpBarsCount))}] ${currentMp}/${maxMp}`);
        
        if (gameState.player.party) {
            gameState.player.party.forEach(member => {
                const memberMp = member.currentMp || 0;
                const memberMaxMp = member.maxMp || 1;
                const memberMpPercent = Math.max(0, Math.min(1, memberMp / memberMaxMp));
                const memberMpBarsCount = Math.floor(memberMpPercent * 8);
                playerMpBars.push(`MP [${'█'.repeat(Math.max(0, memberMpBarsCount))}${' '.repeat(Math.max(0, 8 - memberMpBarsCount))}] ${memberMp}/${memberMaxMp}`);
            });
        }
        console.log(spreadSpaceEvenly(playerMpBars, 60));
        
        // Display EXP row with proper spacing
        const playerExpBars = [];
        const playerExpPercent = Math.max(0, Math.min(1, gameState.player.exp / gameState.player.nextLevel));
        const playerExpBarsCount = Math.floor(playerExpPercent * 8);
        playerExpBars.push(`XP [${'█'.repeat(Math.max(0, playerExpBarsCount))}${' '.repeat(Math.max(0, 8 - playerExpBarsCount))}] ${gameState.player.exp}/${gameState.player.nextLevel}`);
        
        if (gameState.player.party) {
            gameState.player.party.forEach(member => {
                const memberExp = member.exp || 0;
                const memberNextLevel = member.nextLevel || 10;
                const memberExpPercent = Math.max(0, Math.min(1, memberExp / memberNextLevel));
                const memberExpBarsCount = Math.floor(memberExpPercent * 8);
                playerExpBars.push(`XP [${'█'.repeat(Math.max(0, memberExpBarsCount))}${' '.repeat(Math.max(0, 8 - memberExpBarsCount))}] ${memberExp}/${memberNextLevel}`);
            });
        }
        console.log(spreadSpaceEvenly(playerExpBars, 60));
        console.log();
    }
    
    // 10 Different Super Attack Animation Patterns
    const SUPER_ATTACK_PATTERNS = {
        // Pattern 1: Converge from all sides
        CONVERGE: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const progress = frame / 10;
            for (let row = 0; row < 5; row++) {
                let line = '';
                const centerRow = 2;
                if (row === centerRow) {
                    const leftPos = Math.floor(progress * targetX);
                    const rightPos = arenaWidth - Math.floor(progress * (arenaWidth - targetX));
                    line = ' '.repeat(leftPos) + attackEmoji + ' '.repeat(Math.max(0, rightPos - leftPos - 1)) + attackEmoji;
                } else {
                    const dist = Math.abs(row - centerRow);
                    const pos = targetX + (row < centerRow ? -dist : dist) - Math.floor((1 - progress) * 5);
                    const clampedPos = Math.max(0, Math.min(arenaWidth - 1, pos));
                    line = ' '.repeat(clampedPos) + attackEmoji;
                }
                lines.push(line.padEnd(arenaWidth));
            }
            return lines;
        },
        
        // Pattern 2: Spiral inward
        SPIRAL: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const progress = frame / 10;
            const radius = Math.floor((1 - progress) * 8);
            for (let row = 0; row < 5; row++) {
                let line = ' '.repeat(arenaWidth);
                const angle = (row / 5 + frame * 0.1) * Math.PI * 2;
                const x = targetX + Math.floor(Math.cos(angle) * radius);
                if (x >= 0 && x < arenaWidth) {
                    line = ' '.repeat(x) + attackEmoji + ' '.repeat(Math.max(0, arenaWidth - x - 1));
                }
                lines.push(line);
            }
            return lines;
        },
        
        // Pattern 3: Wave attack
        WAVE: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const wavePos = Math.floor((frame / 10) * arenaWidth);
            for (let row = 0; row < 5; row++) {
                const offset = Math.floor(Math.sin((row + frame) * 0.5) * 3);
                const pos = Math.max(0, Math.min(arenaWidth - 1, wavePos + offset));
                const line = ' '.repeat(pos) + attackEmoji;
                lines.push(line.padEnd(arenaWidth));
            }
            return lines;
        },
        
        // Pattern 4: Rain from above
        RAIN: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            for (let row = 0; row < 5; row++) {
                const fallProgress = frame - row * 2;
                if (fallProgress >= 0 && fallProgress < 8) {
                    const positions = [targetX - 2, targetX, targetX + 2].filter(p => p >= 0 && p < arenaWidth);
                    let line = ' '.repeat(arenaWidth);
                    positions.forEach(pos => {
                        line = line.substring(0, pos) + attackEmoji + line.substring(pos + 1);
                    });
                    lines.push(line);
                } else {
                    lines.push(' '.repeat(arenaWidth));
                }
            }
            return lines;
        },
        
        // Pattern 5: Cross slash
        CROSS: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const progress = frame / 10;
            for (let row = 0; row < 5; row++) {
                const diagPos1 = Math.floor(row * (arenaWidth / 5) * progress);
                const diagPos2 = Math.floor((arenaWidth - 1) - (row * (arenaWidth / 5)) * progress);
                let line = ' '.repeat(arenaWidth);
                if (diagPos1 < arenaWidth) {
                    line = line.substring(0, diagPos1) + attackEmoji + line.substring(diagPos1 + 1);
                }
                if (diagPos2 >= 0 && diagPos2 < arenaWidth && diagPos2 !== diagPos1) {
                    line = line.substring(0, diagPos2) + attackEmoji + line.substring(diagPos2 + 1);
                }
                lines.push(line);
            }
            return lines;
        },
        
        // Pattern 6: Circle expand
        CIRCLE: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const radius = Math.floor((frame / 10) * 6);
            const centerY = 2;
            for (let row = 0; row < 5; row++) {
                let line = ' '.repeat(arenaWidth);
                const dy = row - centerY;
                const dx = Math.floor(Math.sqrt(Math.max(0, radius * radius - dy * dy)));
                const pos1 = targetX - dx;
                const pos2 = targetX + dx;
                if (pos1 >= 0 && pos1 < arenaWidth) {
                    line = line.substring(0, pos1) + attackEmoji + line.substring(pos1 + 1);
                }
                if (pos2 >= 0 && pos2 < arenaWidth && pos1 !== pos2) {
                    line = line.substring(0, pos2) + attackEmoji + line.substring(pos2 + 1);
                }
                lines.push(line);
            }
            return lines;
        },
        
        // Pattern 7: Lightning bolt
        LIGHTNING: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const boltProgress = Math.min(4, Math.floor(frame / 2));
            for (let row = 0; row < 5; row++) {
                if (row <= boltProgress) {
                    const zigzag = (row % 2 === 0) ? -1 : 1;
                    const pos = Math.max(0, Math.min(arenaWidth - 1, targetX + zigzag * row));
                    const line = ' '.repeat(pos) + attackEmoji;
                    lines.push(line.padEnd(arenaWidth));
                } else {
                    lines.push(' '.repeat(arenaWidth));
                }
            }
            return lines;
        },
        
        // Pattern 8: Barrage (multiple projectiles)
        BARRAGE: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const numProjectiles = 5;
            for (let row = 0; row < 5; row++) {
                let line = ' '.repeat(arenaWidth);
                for (let i = 0; i < numProjectiles; i++) {
                    const startX = (row === 2) ? 0 : ((row < 2) ? i * 4 : (arenaWidth - 1) - i * 4);
                    const progress = (frame + i * 2) / 10;
                    const currentX = Math.floor(startX + (targetX - startX) * progress);
                    if (currentX >= 0 && currentX < arenaWidth && progress <= 1) {
                        line = line.substring(0, currentX) + attackEmoji + line.substring(currentX + 1);
                    }
                }
                lines.push(line);
            }
            return lines;
        },
        
        // Pattern 9: Vortex
        VORTEX: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            const centerY = 2;
            for (let row = 0; row < 5; row++) {
                const angle = (row / 5 + frame * 0.2) * Math.PI * 2;
                const radius = 6 - Math.floor((frame / 10) * 5);
                const x = targetX + Math.floor(Math.cos(angle) * radius);
                const y = centerY + Math.floor(Math.sin(angle) * (radius / 2));
                if (row === Math.floor(y) && x >= 0 && x < arenaWidth) {
                    const line = ' '.repeat(x) + attackEmoji;
                    lines.push(line.padEnd(arenaWidth));
                } else {
                    lines.push(' '.repeat(arenaWidth));
                }
            }
            return lines;
        },
        
        // Pattern 10: Meteor shower
        METEOR: (attackEmoji, targetX, frame, arenaWidth = 20) => {
            const lines = [];
            for (let row = 0; row < 5; row++) {
                let line = ' '.repeat(arenaWidth);
                const meteorCount = 3;
                for (let m = 0; m < meteorCount; m++) {
                    const startRow = -5 + m * 3;
                    const meteorRow = startRow + frame;
                    if (meteorRow === row) {
                        const xOffset = m * 5 - 5;
                        const pos = Math.max(0, Math.min(arenaWidth - 1, targetX + xOffset));
                        line = line.substring(0, pos) + attackEmoji + line.substring(pos + 1);
                    }
                }
                lines.push(line);
            }
            return lines;
        }
    };
    
    function animateSpecialAttack(attacker, callback) {
        let frame = 0;
        const maxFrames = 15;
        
        // Get attacker info and assign random pattern if not already assigned
        let attackerData, attackEmoji, targetX, pattern;
        
        if (attacker === 'player') {
            const currentPlayer = getCurrentPlayer();
            attackerData = currentPlayer === gameState.player ? gameState.player : currentPlayer;
            
            // Get attack emoji
            if (currentPlayer === gameState.player && gameState.player.heroData) {
                attackEmoji = gameState.player.heroData.attack;
            } else if (currentPlayer.attackEmoji) {
                attackEmoji = currentPlayer.attackEmoji;
            } else {
                attackEmoji = '⚔️';
            }
            
            targetX = 3; // Attack enemies on left
            
            // Assign random pattern if not set
            if (!attackerData.superPattern) {
                const patterns = Object.keys(SUPER_ATTACK_PATTERNS);
                attackerData.superPattern = patterns[Math.floor(Math.random() * patterns.length)];
            }
            pattern = SUPER_ATTACK_PATTERNS[attackerData.superPattern];
            
        } else {
            attackerData = gameState.currentAttackingEnemy || gameState.enemies[0];
            attackEmoji = attackerData?.attackEmoji || '💥';
            targetX = 17; // Attack player on right
            
            // Assign random pattern if not set
            if (!attackerData.superPattern) {
                const patterns = Object.keys(SUPER_ATTACK_PATTERNS);
                attackerData.superPattern = patterns[Math.floor(Math.random() * patterns.length)];
            }
            pattern = SUPER_ATTACK_PATTERNS[attackerData.superPattern];
        }
        
        const animate = () => {
            try {
                if (frame >= maxFrames) {
                    gameState.isAnimating = false;
                    callback();
                    return;
                }
                
                console.clear();
                displayBattleArena();
                
                // Generate the 5-line animation
                const lines = pattern(attackEmoji, targetX, frame);
                
                console.log("\n");
                lines.forEach(line => {
                    console.log(`%c${line}`, "font-size: 32px;");
                });
                
                frame++;
                setTimeout(animate, 100);
            } catch (error) {
                // If animation fails, complete it immediately
                console.error('Special attack animation error:', error);
                gameState.isAnimating = false;
                callback();
            }
        };
        
        animate();
    }

    function animateBattleExit(callback) {
        gameState.isAnimating = true;
        let frame = 0;
        const maxFrames = 5;
        
        const animate = () => {
            if (frame >= maxFrames) {
                gameState.isAnimating = false;
                callback();
                return;
            }
            
            console.clear();
            const victoryStyle = "color: #00ff00; font-weight: bold";
            logStyled(createBorder(60, 'top'), victoryStyle);
            logStyled(createBorderedLine('✨ VICTORY! ✨', 57), victoryStyle);
            logStyled(createBorder(60, 'bottom'), victoryStyle);
            
            frame++;
            setTimeout(animate, 200);
        };
        
        animate();
    }

    function winBattle() {
        const { player, enemies } = gameState;
        
        gameState.enemiesDefeated++;
        gameState.battlesCount++;
        
        // Play victory sound
        playSound('battleVictorySound');
        
        // Calculate total rewards based on ALL enemies
        const numEnemies = enemies.length > 0 ? enemies.length : 1;
        const firstEnemy = enemies[0] || { exp: 0, gold: 0, isBoss: false };
        
        // Sum up XP and gold from all defeated enemies (use defeatedEnemies array)
        const defeatedEnemies = gameState.defeatedEnemies || enemies;
        let totalExp = 0;
        let totalGold = 0;
        defeatedEnemies.forEach(enemy => {
            totalExp += enemy.exp || 0;
            totalGold += enemy.gold || 0;
        });
        
        // Distribute XP to hero and party members
        player.exp += totalExp;
        player.gold += totalGold;
        
        // Play coin sound for gold collection
        if (totalGold > 0) {
            playRandomCoin();
        }
        
        // Give XP to party members too
        if (player.party && player.party.length > 0) {
            player.party.forEach(member => {
                member.exp = (member.exp || 0) + totalExp;
            });
        }
        
        // Increase next enemy level progressively (every battle increases difficulty)
        // Increment by 1 after each battle, capped at 10
        gameState.nextEnemyLevel = Math.min(10, gameState.nextEnemyLevel + 1);
        
        if (numEnemies > 1) {
            gameState.battleLog.push(`✨ Victory! Defeated ${numEnemies} enemies! Gained ${totalExp} EXP and ${totalGold} Gold!`);
        } else {
            gameState.battleLog.push(`✨ Victory! Gained ${totalExp} EXP and ${totalGold} Gold!`);
        }
        
        // Check if defeated BOSS!
        if (firstEnemy.isBoss) {
            gameState.bossDefeated = true;
            gameState.gameWon = true;
            stopAllAudio();
            gameState.battleLog.push(`🎉🎉🎉 YOU DEFEATED THE BUG IN PRODUCTION! 🎉🎉🎉`);
            gameState.battleLog.push(`🏆 YOU WON THE GAME! 🏆`);
            displayGame();
            
            setTimeout(() => {
                startBtn.disabled = false; // Re-enable restart button
                displayVictoryScreen();
            }, 3000);
            return;
        }
        
        // Remove enemy from map
        if (gameState.currentEnemyOnMap && gameState.currentEnemyOnMap.x !== undefined) {
            gameState.enemiesOnMap = gameState.enemiesOnMap.filter(e => 
                !(e.x === gameState.currentEnemyOnMap.x && e.y === gameState.currentEnemyOnMap.y)
            );
            // Clear the map tile
            gameState.map[gameState.currentEnemyOnMap.y][gameState.currentEnemyOnMap.x] = '🟩';
        }
        
        // Check for level ups - Hero
        const leveledUpCharacters = [];
        if (player.exp >= player.nextLevel) {
            levelUp();
            const heroName = player.heroData?.title || player.heroData?.nickname || 'Hero';
            leveledUpCharacters.push(heroName);
        }
        
        // Check for level ups - Party members
        if (player.party && player.party.length > 0) {
            player.party.forEach(member => {
                if (member.exp >= member.nextLevel) {
                    levelUpPartyMember(member);
                    leveledUpCharacters.push(member.name);
                }
            });
        }
        
        // Display level up messages
        if (leveledUpCharacters.length > 0) {
            gameState.battleLog.push(`🎉 LEVEL UP! ${leveledUpCharacters.join(', ')} leveled up!`);
        }
        
        // Check for dead party members and remove them
        const deadMembers = [];
        if (player.party && player.party.length > 0) {
            player.party.forEach(member => {
                if (member.currentHp <= 0) {
                    deadMembers.push(member.name);
                }
            });
            
            // Remove dead members from party
            if (deadMembers.length > 0) {
                const originalPartyLength = player.party.length;
                player.party = player.party.filter(member => member.currentHp > 0);
                
                // Update position trail to match new party size
                const removedCount = originalPartyLength - player.party.length;
                for (let i = 0; i < removedCount; i++) {
                    gameState.positionTrail.pop();
                }
                
                deadMembers.forEach(name => {
                    gameState.battleLog.push(`💀 ${name} has fallen in battle...`);
                });
            }
        }
        
        // Store battle statistics for victory screen
        gameState.lastBattleStats = {
            goldGained: totalGold,
            expGained: totalExp,
            leveledUp: leveledUpCharacters,
            deadMembers: deadMembers
        };
        
        // Spawn new enemies every 2-4 battles
        if (gameState.battlesCount % (2 + Math.floor(Math.random() * 3)) === 0) {
            const newEnemies = 1 + Math.floor(Math.random() * 2); // 1-2 enemies
            spawnEnemies(newEnemies);
            gameState.battleLog.push(`⚠️ ${newEnemies} new enemies appeared on the map!`);
        }
        
        // Display once after victory message
        displayGame();
        
        // Victory countdown animation
        let countdown = 3; // 5-second countdown
        const originalTitle = document.title;
        
        const showCountdown = () => {
            if (countdown >= 0) {
                console.clear();
                const victoryStyle = "color: #ffff00; font-weight: bold";
                const infoStyle = "color: #00ffff";
                const stats = gameState.lastBattleStats || {};
                
                // Victory header
                logStyled(createBorder(60, 'top'), victoryStyle);
                logStyled(createBorderedLine('🎉  VICTORY!  🎉', 59), victoryStyle);
                logStyled(createBorder(60, 'mid'), victoryStyle);
                
                // Battle statistics
                logStyled(createBorderedLine('BATTLE RESULTS', 60), "color: #00ff00; font-weight: bold");
                logStyled(createBorderedLine(`💰 Gold Gained: ${stats.goldGained || 0}`, 60), infoStyle);
                logStyled(createBorderedLine(`⭐ EXP Gained: ${stats.expGained || 0}`, 59), infoStyle);
                
                // Level ups
                if (stats.leveledUp && stats.leveledUp.length > 0) {
                    logStyled(createBorderedLine(`🎉 LEVEL UP: ${stats.leveledUp.join(', ')}!`, 60), "color: #ff00ff; font-weight: bold");
                }
                
                // Dead party members
                if (stats.deadMembers && stats.deadMembers.length > 0) {
                    stats.deadMembers.forEach(name => {
                        logStyled(createBorderedLine(`💀 ${name} has fallen...`, 60), "color: #ff0000");
                    });
                }
                
                // Countdown
                logStyled(createBorderedLine('', 60), victoryStyle);
                logStyled(createBorderedLine(`Returning to map in ${countdown}...`, 60), "color: #ff00ff; font-weight: bold");
                logStyled(createBorder(60, 'bottom'), victoryStyle);
                
                // Update browser title
                document.title = `🎉 Victory! The sprint ended and the code uploaded to the production successfully - Returning in ${countdown}s...`;
                
                countdown--;
                setTimeout(showCountdown, 1000);
            } else {
                document.title = originalTitle;
                if (!gameState.gameWon && !gameState.gameOver) {
                    gameState.mode = MODE_EXPLORE;
                    gameState.enemies = [];
                    gameState.battleLog = [];
                    gameState.currentEnemyOnMap = null;
                    playMusic('mapMusic');
                    displayGame();
                }
            }
        };
        
        setTimeout(showCountdown, 1000); // Start countdown after 1 second
    }
    
    function displayVictoryScreen() {
        const { player } = gameState;
        
        console.clear();
        const winStyle = "color: #ffff00; font-weight: bold; font-size: 20px";
        logStyled(createBorder(60, 'top'), winStyle);
        logStyled(createBorderedLine('', 60), winStyle);
        logStyled(createBorderedLine('🏆  CONGRATULATIONS!  🏆', 60), winStyle);
        logStyled(createBorderedLine('', 60), winStyle);
        logStyled(createBorderedLine('YOU DEFEATED THE BUG IN PRODUCTION!', 60), "color: #00ff00; font-weight: bold; font-size: 18px");
        logStyled(createBorderedLine('', 60), winStyle);
        logStyled(createBorderedLine('🎉 YOU WIN! 🎉', 60), "color: #ff00ff; font-weight: bold; font-size: 20px");
        logStyled(createBorderedLine('', 60), winStyle);
        logStyled(createBorder(60, 'bottom'), winStyle);
        console.log("");
        console.log(`%c${player.symbol || '🧙'} Final Level: ${player.level}`, "color: #00ffff; font-weight: bold; font-size: 16px");
        console.log(`%c⚔️  Enemies Defeated: ${gameState.enemiesDefeated}`, "color: #ff0000; font-weight: bold; font-size: 16px");
        console.log(`%c💰 Gold Collected: ${player.gold}`, "color: #ffff00; font-weight: bold; font-size: 16px");
        if (player.party && player.party.length > 0) {
            console.log(`%c👥 Party Members: ${player.party.map(p => p.name).join(', ')}`, "color: #ff00ff; font-weight: bold; font-size: 16px");
        }
        console.log("");
        console.log("%cPress [R] to restart the game!", "color: #00ff00; font-size: 16px; font-weight: bold");
    }

    function levelUp() {
        const { player } = gameState;
        
        playSound('levelUpSound'); // Level up fanfare
        
        const previousNextLevel = player.nextLevel;
        player.level++;
        player.exp -= previousNextLevel; // Subtract the previous nextLevel, not the new one
        player.nextLevel = Math.floor(previousNextLevel * 1.5);
        
        player.maxHp += 15;
        player.maxMp += 8;
        player.currentHp = player.maxHp;
        player.currentMp = player.maxMp;
        player.attack += 4;
        player.defense += 3;
        player.magic += 3;
        
        // Don't push message here - it's handled in winBattle with all level ups
        
        // Spawn BOSS at level 10!
        if (player.level === 10 && !gameState.bossSpawned) {
            spawnBoss();
        }
        
        // Check for multiple level ups
        if (player.exp >= player.nextLevel) {
            levelUp();
        }
    }
    
    function levelUpPartyMember(member) {
        playSound('levelUpSound'); // Level up fanfare
        
        const previousNextLevel = member.nextLevel;
        member.level++;
        member.exp -= previousNextLevel; // Subtract the previous nextLevel
        member.nextLevel = Math.floor(previousNextLevel * 1.5);
        
        member.maxHp += 10;
        member.maxMp += 5;
        member.currentHp = member.maxHp;
        member.currentMp = member.maxMp;
        member.attack += 3;
        member.defense += 2;
        member.magic += 2;
        
        // Check for multiple level ups
        if (member.exp >= member.nextLevel) {
            levelUpPartyMember(member);
        }
    }
    
    function spawnBoss() {
        gameState.bossSpawned = true;
        
        // Play dramatic boss spawn sound
        playSound('interface6');
        setTimeout(() => playSound('interface3'), 500);
        
        // Find a good spot for the boss
        let x, y, attempts = 0;
        do {
            x = Math.floor(Math.random() * MAP_WIDTH);
            y = Math.floor(Math.random() * MAP_HEIGHT);
            attempts++;
        } while ((Math.abs(x - gameState.player.x) < 8 || Math.abs(y - gameState.player.y) < 8 ||
                 gameState.map[y][x] === '⛰️') && attempts < 100);
        
        if (attempts < 100) {
            gameState.enemiesOnMap.push({
                x, y,
                ...FINAL_BOSS,
                currentHp: FINAL_BOSS.hp,
                maxHp: FINAL_BOSS.hp
            });
            
            // Big announcement!
            gameState.battleLog = [
                '🚨🚨🚨 WARNING! 🚨🚨🚨',
                '🐛 A LEGENDARY BUG IN PRODUCTION HAS APPEARED! 🐛',
                'Defeat it to win the game!'
            ];
            displayGame();
            
            setTimeout(() => {
                gameState.battleLog = [];
                displayGame();
            }, 5000);
        }
    }

    function gameOver() {
        gameState.gameOver = true;
        gameState.battleLog.push(`💀 You were defeated...`);
        playMusic('gameOverMusic');
        startBtn.disabled = false; // Re-enable restart button
    }

    /* ---------- Shop System ---------- */
    function openShop(shop) {
        const { player } = gameState;
        
        playSound('doorSound');
        gameState.mode = MODE_SHOP;
        gameState.currentShop = shop;
        
        if (shop.type === 'recruit' && (!player.party || player.party.length < 2)) {
            gameState.shopOffer = shop.recruitType;
        } else {
            gameState.shopOffer = null;
        }
        displayGame();
    }

    function buyPartyMember(accept) {
        const { player, shopOffer } = gameState;
        
        if (accept && shopOffer) {
            if (player.gold >= shopOffer.price) {
                playSound('spendSound');
                setTimeout(() => playSound('cloth'), 300); // Party member joins
                player.gold -= shopOffer.price;
                if (!player.party) {
                    player.party = [];
                }
                // Calculate stats relative to BASE_PLAYER_STATS (not hero's boosted stats)
                const memberHp = Math.floor(BASE_PLAYER_STATS.hp * shopOffer.hpMult);
                const memberAttack = Math.floor(BASE_PLAYER_STATS.attack * shopOffer.attackMult);
                const memberDefense = Math.floor(BASE_PLAYER_STATS.defense * shopOffer.defenseMult);
                const memberMagic = Math.floor(BASE_PLAYER_STATS.magic * shopOffer.magicMult);
                
                player.party.push({
                    name: shopOffer.name,
                    symbol: shopOffer.symbol,
                    hp: memberHp,
                    maxHp: memberHp,
                    currentHp: memberHp,
                    attack: memberAttack,
                    defense: memberDefense,
                    magic: memberMagic,
                    maxMp: memberMagic,
                    currentMp: memberMagic,
                    level: 1,
                    exp: 0,
                    nextLevel: 10,
                    specialMeter: 0,
                    specialReady: false,
                    x: player.x, // Start at player position
                    y: player.y,
                    attackEmoji: shopOffer.attackEmoji || '⚔️',
                    magicEmoji: shopOffer.magicEmoji || '🔥',
                    superEmoji: shopOffer.superEmoji || '💥',
                    attackName: shopOffer.attackName || 'attacks',
                    magicName: shopOffer.magicName || 'Magic',
                    specialName: shopOffer.specialName || 'SPECIAL ATTACK'
                });
                gameState.battleLog = [`✅ ${shopOffer.name} joined your party!`];
                
                // Initialize position trail for new party member (fill with player's current position)
                gameState.positionTrail.push({ x: player.x, y: player.y });
                
                // Remove the recruit from the map
                const shopIndex = gameState.shopsOnMap.findIndex(s => s === gameState.currentShop);
                if (shopIndex !== -1) {
                    gameState.shopsOnMap.splice(shopIndex, 1);
                    gameState.map[gameState.currentShop.y][gameState.currentShop.x] = '🟩';
                }
            } else {
                gameState.battleLog = [`❌ Not enough gold! Need ${shopOffer.price} gold.`];
                gameState.mode = MODE_EXPLORE;
                gameState.shopOffer = null;
                gameState.currentShop = null;
                playMusic('mapMusic');
                displayGame();
                setTimeout(() => {
                    gameState.battleLog = [];
                    displayGame();
                }, 2000);
                return;
            }
        } else {
            gameState.battleLog = [`You left the recruit.`];
        }
        
        gameState.mode = MODE_EXPLORE;
        gameState.shopOffer = null;
        gameState.currentShop = null;
        playMusic('mapMusic');
        displayGame();
        setTimeout(() => {
            gameState.battleLog = [];
            displayGame();
        }, 2000);
    }

    /* ---------- Inn System ---------- */
    function openInn() {
        const { player } = gameState;
        
        playSound('doorSound');
        
        if (player.currentHp === player.maxHp && player.currentMp === player.maxMp) {
            gameState.battleLog = [`You're already at full health!`];
            displayGame();
            setTimeout(() => {
                gameState.battleLog = [];
                displayGame();
            }, 2000);
            return;
        }
        
        gameState.mode = MODE_INN;
        gameState.innOffer = true;
        displayGame();
    }

    function useInn(accept) {
        const { player } = gameState;
        
        if (accept) {
            if (player.gold >= INN_COST) {
                playSound('spendSound');
                setTimeout(() => playSound('innRestSound'), 200); // Inn rest sound
                setTimeout(() => playSound('bubble'), 800); // Restoration effect
                player.gold -= INN_COST;
                player.currentHp = player.maxHp;
                player.currentMp = player.maxMp;
                if (player.party) {
                    player.party.forEach(member => {
                        member.currentHp = member.maxHp;
                        member.currentMp = member.maxMp;
                    });
                }
                gameState.battleLog = [`✅ Rested at the inn! HP and MP fully restored for all party members! (-${INN_COST} gold)`];
            } else {
                gameState.battleLog = [`❌ Not enough gold! Need ${INN_COST} gold.`];
            }
        } else {
            gameState.battleLog = [`You left the inn.`];
        }
        
        gameState.mode = MODE_EXPLORE;
        gameState.innOffer = false;
        playMusic('mapMusic');
        displayGame();
        setTimeout(() => {
            gameState.battleLog = [];
            displayGame();
        }, 2000);
    }

    /* ---------- Movement ---------- */
    function movePlayer(dx, dy) {
        if (gameState.mode !== MODE_EXPLORE || gameState.gameOver || gameState.gameWon || gameState.isAnimating) return;
        
        const { player } = gameState;
        const newX = player.x + dx;
        const newY = player.y + dy;
        
        if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) return;
        
        const tile = gameState.map[newY][newX];
        if (tile === '⛰️') return;
        
        // Check for enemy collision
        const enemy = gameState.enemiesOnMap.find(e => e.x === newX && e.y === newY);
        if (enemy) {
            enemy.x = newX;
            enemy.y = newY;
            startBattle(enemy);
            return;
        }
        
        // Check for shop/recruit
        const shop = gameState.shopsOnMap.find(s => s.x === newX && s.y === newY);
        if (shop) {
            openShop(shop);
            return;
        }
        
        // Check for inn
        const inn = gameState.innsOnMap.find(i => i.x === newX && i.y === newY);
        if (inn || tile === '🏠' || tile === '🏨') {
            openInn();
            return;
        }
        
        // Save current position to trail before moving (for party members to follow)
        gameState.positionTrail.unshift({ x: player.x, y: player.y });
        
        // Keep trail length based on party size (each member needs a position)
        const maxTrailLength = player.party ? player.party.length : 0;
        if (gameState.positionTrail.length > maxTrailLength) {
            gameState.positionTrail.pop();
        }
        
        // Move player
        player.x = newX;
        player.y = newY;
        gameState.steps++;
        
        // Update party member positions from trail
        if (player.party && player.party.length > 0) {
            player.party.forEach((member, index) => {
                if (gameState.positionTrail[index]) {
                    member.x = gameState.positionTrail[index].x;
                    member.y = gameState.positionTrail[index].y;
                }
            });
        }
        
        displayGame();
    }

    /* ---------- Rendering ---------- */
    function displayGame() {
        if (gameState.isAnimating) return;
        
        console.clear();
        
        if (gameState.mode === MODE_EXPLORE) {
            displayExplore();
        } else if (gameState.mode === MODE_BATTLE) {
            displayBattle();
        } else if (gameState.mode === MODE_SHOP) {
            displayShop();
        } else if (gameState.mode === MODE_INN) {
            displayInnPrompt();
        } else if (gameState.mode === 'info') {
            displayInfoScreen();
        }
        
        updateStatsDisplay();
    }

    function displayExplore() {
        const { player } = gameState;
        
        const exploreBorder = createDialogBorder("⚔️  RPG ADVENTURE  ⚔️", 60, '#00ff00');
        exploreBorder.forEach((line, index) => {
            if (index % 2 === 0) {
                console.log(line, exploreBorder[index + 1]);
            }
        });
        
        // Draw map with enemies and party members
        for (let y = 0; y < MAP_HEIGHT; y++) {
            let line = '';
            for (let x = 0; x < MAP_WIDTH; x++) {
                if (x === player.x && y === player.y) {
                    line += player.symbol || '🧙';
                } else {
                    // Check for party member at this position
                    const partyMember = player.party ? player.party.find(m => m.x === x && m.y === y) : null;
                    if (partyMember) {
                        line += partyMember.symbol;
                    } else {
                        const enemy = gameState.enemiesOnMap.find(e => e.x === x && e.y === y);
                        if (enemy) {
                            line += enemy.symbol;
                        } else {
                            line += gameState.map[y][x];
                        }
                    }
                }
            }
            console.log(`%c${line}`, "font-size: 16px;");
        }
        
        console.log("%cArrows: move | Walk to enemies to fight | ⚔️🔮🏹🛡️ Recruits | 🏠 Inn (20g) | [I] Info", "color: #888");
        console.log("%c═════════════════════════════════════════════════════════", "color: #ffff00");
        
        // Hero stats with visual bars
        const heroStats = createStatDisplay(player);
        const heroName = player.heroData?.title || player.heroData?.nickname || 'Hero';
        console.log(`%c${player.symbol || '🧙'} Lv${player.level}: ${heroName}   HP ${heroStats.hpBar} ${heroStats.hpText} | MP: ${heroStats.mpText}`, "color: #00ffff; font-weight: bold");
        console.log(`%cSA ${heroStats.specialBar} ${heroStats.specialText} | XP ${heroStats.expBar} ${heroStats.expText}`, "color: #ffaa00; font-weight: bold");
        
        if (player.party && player.party.length > 0) {
            player.party.forEach((member) => {
                const memberStats = createStatDisplay(member);
                console.log(`%c${member.symbol} Lv${member.level}: ${member.name}   HP ${memberStats.hpBar} ${memberStats.hpText} | MP: ${memberStats.mpText}`, "color: #ff88ff; font-weight: bold");
                console.log(`%c  SA ${memberStats.specialBar} ${memberStats.specialText} | XP ${memberStats.expBar} ${memberStats.expText}`, "color: #ffaa00");
            });
        }
        
        console.log(`%c💰 Gold: ${player.gold} | 🗺️ Enemies on map: ${gameState.enemiesOnMap.length}`, "color: #ffff00");
        console.log("%c═════════════════════════════════════════════════════════", "color: #ffff00");
        
        if (gameState.battleLog.length > 0) {
            console.log("");
            gameState.battleLog.forEach(log => {
                const lines = breakTextIntoLines(log, 60);
                lines.forEach(line => console.log(`  ${line}`));
            });
        }
        
  }

    function displayBattle() {
        displayBattleArena();
        console.log("");
        
       
        if (!gameState.gameOver && gameState.enemies.length > 0) {
            // Show whose turn it is
            const currentPlayer = gameState.currentPlayerIndex === 0 ? 
                gameState.player : 
                gameState.player.party[gameState.currentPlayerIndex - 1];
            const playerName = gameState.currentPlayerIndex === 0 ? 'Hero' : currentPlayer.name;
            
            // Create battle action dialog with proper spacing
            const dialogWidth = 60;
            const borderStyle = "color: #00ffff; font-weight: bold";
            
            logStyled(createBorder(dialogWidth, 'top'), borderStyle);
            logStyled(createBorderedLine(`${playerName}'s Turn - Choose Action:`, dialogWidth), "color: #ffff00; font-weight: bold");
            logStyled(createBorderedLine('[1] Attack  [2] Magic (5 MP)  [3] Defend  [4] Run', dialogWidth), "color: #ffffff");
            
            // Special attack line
            const specialText = currentPlayer.specialReady ? 
                '[5] ✨ SPECIAL ATTACK ✨ ALL ENEMIES' : 
                `[5] Special: ${currentPlayer.specialMeter}/100 (not ready)`;
            const specialColor = currentPlayer.specialReady ? "color: #ffff00; font-weight: bold" : "color: #888";
            logStyled(createBorderedLine(specialText, dialogWidth), specialColor);
            
            logStyled(createBorderedLine('[Tab] Switch Target Enemy', dialogWidth), "color: #888");
            logStyled(createBorder(dialogWidth, 'bottom'), borderStyle);
        }
        
        logStyled(createSeparator(61, '═'), "color: #00ff00");
        console.log("%cBattle Log:", "color: #ffff00; font-weight: bold");
        gameState.battleLog.slice(-5).forEach(log => {
            const lines = breakTextIntoLines(log, 60);
            lines.forEach(line => console.log(`  ${line}`));
        });
        logStyled(createSeparator(61, '═'), "color: #00ff00");
        console.log("");

        if (gameState.gameOver) {
            console.log("");
            const gameOverStyle = "color: #ff0000; font-weight: bold; font-size: 16px";
            logStyled(createBorder(43, 'top'), gameOverStyle);
            logStyled(createBorderedLine('💀 GAME OVER 💀', 42), gameOverStyle);
            logStyled(createBorderedLine('Press [R] to restart!', 52), "color: #ffff00");
            logStyled(createBorder(43, 'bottom'), gameOverStyle);
        }
    }

    function displayShop() {
        const { player, shopOffer } = gameState;
        
        console.log(""); // Add space before shop header
        const shopStyle = "color: #ffff00; font-weight: bold";
        logStyled(createBorder(60, 'top'), shopStyle);
        logStyled(createBorderedLine('🏪  ADVENTURER\'S SHOP  🏪', 60), shopStyle);
        logStyled(createBorder(60, 'bottom'), shopStyle);
        console.log(""); // Add space after shop header
        
        console.log(`%c💰 Your Gold: ${player.gold}`, "color: #ffff00; font-weight: bold");
        console.log(`%c👥 Party Size: ${player.party ? player.party.length : 0}/2`, "color: #00ffff");
        console.log("");
        
        if (shopOffer && (!player.party || player.party.length < 2)) {
            const member = shopOffer;
            console.log(""); // Add space before recruit box
            
            // Display character symbol (BIG)
            console.log(`%c${member.symbol}`, "font-size: 48px; text-align: center;");
            console.log(""); // Space after symbol
            
            // Display recruit info box
            logStyled(createBorder(63, 'top'), "color: #00ff00");
            const nameLine = `${member.name}`;
            const costLine = `Cost: ${member.price} Gold`;
            const nameCostSpread = spreadAsSpace([nameLine, costLine], 55).padEnd(55);
            logStyled(`║  ${nameCostSpread}       ║`, "color: #ffffff; font-weight: bold");
            
            // Calculate stats based on BASE_PLAYER_STATS (same as heroes)
            const displayHp = Math.floor(BASE_PLAYER_STATS.hp * member.hpMult);
            const displayAttack = Math.floor(BASE_PLAYER_STATS.attack * member.attackMult);
            const displayDefense = Math.floor(BASE_PLAYER_STATS.defense * member.defenseMult);
            const displayMagic = Math.floor(BASE_PLAYER_STATS.magic * member.magicMult);
            
            const statsSpread = spreadAsSpace([
                `HP: ${displayHp}`,
                `Attack: ${displayAttack}`,
                `Defense: ${displayDefense}`,
                `Magic: ${displayMagic}`
            ], 55).padEnd(55);
            logStyled(`║  ${statsSpread}  ║`, "color: #888");
            logStyled(createBorder(63, 'bottom'), "color: #00ff00");
            
            // Display story box
            console.log(""); // Add space after recruit box
            const storyStyle = "color: #ffff00; font-weight: bold";
            logStyled(createBorder(59, 'top'), storyStyle);
            logStyled(createBorderedLine('BACKGROUND STORY', 59), storyStyle);
            logStyled(createBorder(59, 'bottom'), storyStyle);
            const storyLines = breakTextIntoLines(member.story, 60);
            storyLines.forEach(line => logStyled(line, "color: #cccccc; font-style: italic"));
            
            // Display confirmation box
            console.log(""); // Add space after story
            const confirmStyle = "color: #00ffff; font-weight: bold";
            logStyled(createBorder(59, 'top'), confirmStyle);
            logStyled(createBorderedLine('Would you like to recruit this hero?', 59), confirmStyle);
            logStyled(createBorderedLine('', 59), "color: #00ffff");
            logStyled(createBorderedLine('Press [Y] Yes    [N] No', 59), "color: #ffffff; font-weight: bold");
            logStyled(createBorder(59, 'bottom'), confirmStyle);
        } else {
            const noHeroStyle = "color: #ff0000";
            logStyled(createBorder(59, 'top'), noHeroStyle);
            logStyled(createBorderedLine('No heroes available or party is full!', 59, 'left'), noHeroStyle + "; font-weight: bold");
            logStyled(createBorderedLine('Press any key to leave...', 59, 'left'), "color: #888");
            logStyled(createBorder(59, 'bottom'), noHeroStyle);
        }
    }

    function displayInnPrompt() {
        const { player } = gameState;
        
        console.log(""); // Add space before inn header
        const innStyle = "color: #00ffff; font-weight: bold";
        logStyled(createBorder(60, 'top'), innStyle);
        logStyled(createBorderedLine('🏠  WELCOME TO THE INN  🏠', 60), innStyle);
        logStyled(createBorder(60, 'bottom'), innStyle);
        console.log(""); // Add space after inn header
        
        console.log(`%c💰 Your Gold: ${player.gold}`, "color: #ffff00; font-weight: bold");
        console.log(`%c💊 Rest Cost: ${INN_COST} Gold`, "color: #00ff00; font-weight: bold");
        console.log("");
        console.log(`%c${player.symbol || '🧙'} Your HP: ${player.currentHp}/${player.maxHp}`, "color: #ff6666");
        console.log(`%c✨ Your MP: ${player.currentMp}/${player.maxMp}`, "color: #6666ff");
        console.log("");
        
        logStyled(createBorder(59, 'top'), "color: #00ff00");
        logStyled(createBorderedLine('Rest here to fully restore HP and MP!', 59, 'left'), "color: #ffffff");
        logStyled(createBorder(59, 'bottom'), "color: #00ff00");
        
        console.log("");
        const confirmStyle = "color: #ffff00; font-weight: bold";
        logStyled(createBorder(59, 'top'), confirmStyle);
        logStyled(createBorderedLine('Would you like to rest? (20 Gold)', 59), confirmStyle);
        logStyled(createBorderedLine('', 59), "color: #ffff00");
        logStyled(createBorderedLine('Press [Y] Yes    [N] No', 59), "color: #ffffff; font-weight: bold");
        logStyled(createBorder(59, 'bottom'), confirmStyle);
    }

    function updateStatsDisplay() {
        const { player } = gameState;
        const partyStr = (player.party && player.party.length > 0) ? ` +${player.party.length}` : '';
        statsDisplay.value = `Lv.${player.level}${partyStr} | HP:${player.currentHp}/${player.maxHp} | Gold:${player.gold}`;
    }

    /* ---------- Game Control ---------- */
    function newGame() {
        stopAllAudio();
        gameState = {
            mode: MODE_EXPLORE,
            player: {
                x: 10,
                y: 5,
                level: 1,
                hp: BASE_PLAYER_STATS.hp,
                maxHp: BASE_PLAYER_STATS.hp,
                currentHp: BASE_PLAYER_STATS.hp,
                mp: BASE_PLAYER_STATS.magic,
                maxMp: BASE_PLAYER_STATS.magic,
                currentMp: BASE_PLAYER_STATS.magic,
                exp: 0,
                nextLevel: 10,
                attack: BASE_PLAYER_STATS.attack,
                defense: BASE_PLAYER_STATS.defense,
                magic: BASE_PLAYER_STATS.magic,
                gold: 50,
                party: [],
                specialMeter: 0,
                specialReady: false,
                symbol: '🧙' // Default symbol
            },
            enemies: [],
            battleLog: [],
            gameOver: false,
            steps: 0,
            map: generateMap(),
            enemiesOnMap: [],
            shopsOnMap: [],
            innsOnMap: [],
            positionTrail: [], // Track player positions for party following
            enemiesDefeated: 0,
            battlesCount: 0,
            nextEnemyLevel: 1, // Progressive enemy difficulty
            animationFrame: 0,
            isAnimating: false,
            shopOffer: null,
            innOffer: false,
            bossDefeated: false,
            bossSpawned: false,
            gameWon: false,
            currentEnemyIndex: 0,
            currentAttackingEnemy: null
        };
        
        // Spawn initial enemies and shops - MORE ENEMIES at start!
        spawnEnemies(10); // Start with 15 enemies!
        spawnRecruits();
        spawnInns(); // Spawn 3 inns
        
        console.clear();
        const welcomeStyle = "color: #ffff00; font-weight: bold; font-size: 16px";
        logStyled(createBorder(56, 'top'), welcomeStyle);
        logStyled(createBorderedLine('⚔️  WELCOME TO RPG ADVENTURE!  ⚔️', 56), welcomeStyle);
        logStyled(createBorder(56, 'bottom'), welcomeStyle);
        console.log("");
        console.log("%c🗺️  MAP TILES:", "color: #00ffff; font-weight: bold");
        console.log("   🧙 You | 🟩 Grass | 🌲 Forest | ⛰️ Mountain (blocked)");
        console.log("   ⚔️🔮🏹🛡️ Recruits (buy party members - 30-60g)");
        console.log("   🏠 Inn (rest & heal - 20g)");
        console.log("   👾 Enemies (visible on map!)");
        console.log("");
        console.log("%c⚔️  GAMEPLAY:", "color: #ff0000; font-weight: bold");
        console.log("   • Walk into enemies to fight them!");
        console.log("   • Every 2-4 battles, 2-3 new enemies spawn");
        console.log("   • Recruit party members from heroes on map (max 2)");
        console.log("   • Rest at inn for gold to heal");
        console.log("   • 🐛 AT LEVEL 10: FINAL BOSS APPEARS!");
        console.log("   • Defeat the BUG IN PRODUCTION to win!");
        console.log("   • Enemies appear in groups of 1-3!");
        console.log("   • Enemy levels increase progressively (1-10)!");
        console.log("   • Build special meter to use ultimate attack!");
        console.log("");
        console.log("%c🎮 CONTROLS:", "color: #00ff00; font-weight: bold");
        console.log("   Exploration: ↑↓←→ arrows");
        console.log("   Battle: 1-5 number keys, Tab to switch target");
        console.log("   Shop/Inn: Y/N keys");
        console.log("   Info/Credits: I key");
        console.log("   Restart: R key (only when game over)");
        console.log("");
        console.log("%cGame starting in 3 seconds...", "color: #00ff00; font-weight: bold");
        
        setTimeout(() => {
            displayGame();
        }, 3000);
    }

    /* ---------- Info & Credits Screen ---------- */
    function displayInfoScreen() {
        console.clear();
        
        const headerStyle = "color: #00ffff; font-weight: bold";
        const textStyle = "color: #ffffff";
        const highlightStyle = "color: #ffff00; font-weight: bold";
        
        // Header
        logStyled(createBorder(60, 'top'), headerStyle);
        logStyled(createBorderedLine('ℹ️  DEVELOPER INFO & CREDITS  ℹ️', 59), headerStyle);
        logStyled(createBorder(60, 'bottom'), headerStyle);
        console.log("");
        
        // Professional intro
        console.log("%c👨‍💻 Alexander Richkov", "color: #ffff00; font-weight: bold; font-size: 18px");
        console.log("%cFull-Stack Developer | 7+ Years Experience", highlightStyle);
        console.log("");
        console.log("%c📧 alexander@arich-software.co.il | ☎️ 054-569-0911", "color: #00ffff");
        console.log("%c📍 Rehovot, Israel | 🌐 arich-software.co.il", "color: #00ffff");
        console.log("");
        console.log("%c💼 Professional Summary:", highlightStyle);
        console.log("%c6+ years designing, developing, and maintaining complex web systems", textStyle);
        console.log("%cusing React, Vue, and Laravel. Proven record in optimizing SaaS and", textStyle);
        console.log("%cFintech platforms, leading API integrations, and deploying scalable", textStyle);
        console.log("%ccloud environments. Passionate about automation and AI-based tools.", textStyle);
        console.log("");
        console.log("%c🚀 Tech Stack:", highlightStyle);
        console.log("%c  • React | Vue | Angular | TypeScript | JavaScript (ES6+)", textStyle);
        console.log("%c  • PHP/Laravel | Node.js | Express | .NET", textStyle);
        console.log("%c  • Docker | AWS | NGINX | Jenkins | Git | Linux", textStyle);
        console.log("%c  • MySQL | MongoDB | Firebase", textStyle);
        console.log("");
        console.log("%c🤝 Available For:", "color: #ff00ff; font-weight: bold");
        console.log("%c  • Freelance Projects & Contract Work", textStyle);
        console.log("%c  • Full-Time Positions", textStyle);
        console.log("%c  • Technical Consulting & System Optimization", textStyle);
        console.log("");
        
        // QR Code section
        logStyled(createBorder(40, 'top'), "color: #00ff00; font-weight: bold");
        logStyled(createBorderedLine('📱 Scan to Connect', 40), "color: #00ff00; font-weight: bold");
        logStyled(createBorder(40, 'bottom'), "color: #00ff00; font-weight: bold");
        console.log("");
        console.log("%c^^Scroll up to see more^^^", "color: #00ff00; font-weight: bold");
        
        // Display QR code
        printEmojiQR();
        
        console.log("");
            console.log("%c 💼 LinkedIn  → https://www.linkedin.com/in/arich-software ←", "color: #0077B5; font-weight: bold; font-size: 14px");
        console.log("%c 📘 Facebook  → https://www.facebook.com/arichsoftware ←", "color: #1877F2; font-weight: bold; font-size: 14px");
        console.log("%c 💬 WhatsApp  → https://wa.me/+972545690911 ←", "color: #25D366; font-weight: bold; font-size: 14px");
       
        console.log("");
        
        // Footer
        console.log("");
        logStyled(createSeparator(60), "color: #888888");
        console.log("%c🚀 Let's build something amazing together!", "color: #ff00ff; font-weight: bold; font-size: 16px");
        console.log("%c   Ready to turn your ideas into reality!", "color: #00ffff; font-size: 14px");
        console.log("");
        console.log("%cPress [ESC] or [ENTER] to return to game", "color: #888888; font-style: italic");
    }
    
    /* ---------- Character Selection ---------- */
    function displayCharacterSelection() {
        console.clear();
        const hero = HERO_CHARACTERS[selectedHeroIndex];
        const skin = hero.skins[selectedSkinIndex];
        
        const headerStyle = "color: #00ffff; font-weight: bold; font-size: 18px";
        logStyled(createBorder(60, 'top'), headerStyle);
        logStyled(createBorderedLine('', 60), headerStyle);
        logStyled(createBorderedLine('🎮 SELECT YOUR HERO 🎮', 53), "color: #ffff00; font-weight: bold; font-size: 20px");
        logStyled(createBorderedLine('', 60), headerStyle);
        logStyled(createBorder(60, 'bottom'), headerStyle);
        console.log("");
        
        // Show all heroes with highlighting
        HERO_CHARACTERS.forEach((h, index) => {
            if (index === selectedHeroIndex) {
                console.log(`%c▶ ${h.emoji} ${h.title} (${h.nickname})`, "color: #00ff00; font-weight: bold; font-size: 16px; background: #004400; padding: 5px;");
            } else {
                console.log(`%c  ${h.emoji} ${h.title} (${h.nickname})`, "color: #888888; font-size: 14px;");
            }
        });
        
        console.log("");
        logStyled(createSeparator(60), "color: #00ffff");
        console.log(`%c${skin} ${hero.title}`, "color: #ffff00; font-weight: bold; font-size: 24px");
        console.log(`%c"${hero.nickname}"`, "color: #ff00ff; font-style: italic; font-size: 14px");
        console.log("");
        console.log(`%c${hero.story}`, "color: #ffffff; font-size: 13px");
        console.log("");
        logStyled(createSeparator(60), "color: #00ffff");
        
        // Calculate and display hero stats based on BASE_PLAYER_STATS
        const displayHp = Math.floor(BASE_PLAYER_STATS.hp * hero.hpMult);
        const displayAttack = Math.floor(BASE_PLAYER_STATS.attack * hero.attackMult);
        const displayDefense = Math.floor(BASE_PLAYER_STATS.defense * hero.defenseMult);
        const displayMagic = Math.floor(BASE_PLAYER_STATS.magic * hero.magicMult);
        
        console.log(`%c❤️  HP: ${displayHp}    ⚔️  Attack: ${displayAttack}    🛡️  Defense: ${displayDefense}    ✨ Magic: ${displayMagic}`, "color: #00ffff; font-weight: bold");
        console.log("");
        
        // Show skin colors
        console.log("%c🎨 Select Skin Color:", "color: #ffaa00; font-weight: bold");
        let skinDisplay = "";
        hero.skins.forEach((s, idx) => {
            if (idx === selectedSkinIndex) {
                skinDisplay += `  ▶ [${s}] ◀  `;
            } else {
                skinDisplay += `  ${s}  `;
            }
        });
        console.log(`%c${skinDisplay}`, "color: #00ff00; font-size: 20px; font-weight: bold;");
        
        console.log("");
        logStyled(createSeparator(60), "color: #00ffff");
        console.log("%c⬆️ ⬇️  Select Hero  |  ⬅️ ➡️  Select Skin  |  ENTER to Confirm", "color: #ffff00; font-weight: bold; font-size: 14px");
        logStyled(createSeparator(60), "color: #00ffff");
    }
    
    function confirmHeroSelection() {
        characterSelected = true;
        const hero = HERO_CHARACTERS[selectedHeroIndex];
        const skin = hero.skins[selectedSkinIndex];
        
        // Start the game first
        newGame();
        
        // Then update player with calculated hero stats based on BASE_PLAYER_STATS
        const { player } = gameState;
        const calculatedHp = Math.floor(BASE_PLAYER_STATS.hp * hero.hpMult);
        const calculatedAttack = Math.floor(BASE_PLAYER_STATS.attack * hero.attackMult);
        const calculatedDefense = Math.floor(BASE_PLAYER_STATS.defense * hero.defenseMult);
        const calculatedMagic = Math.floor(BASE_PLAYER_STATS.magic * hero.magicMult);
        
        player.symbol = skin;
        player.hp = calculatedHp;
        player.maxHp = calculatedHp;
        player.currentHp = calculatedHp;
        player.mp = calculatedMagic;
        player.maxMp = calculatedMagic;
        player.currentMp = calculatedMagic;
        player.attack = calculatedAttack;
        player.defense = calculatedDefense;
        player.magic = calculatedMagic;
        player.heroData = hero;
        
        // Start exploration music
        playMusic('mapMusic');
        
        // Display the game with the selected hero
        displayGame();
    }

    /* ---------- Event Handlers ---------- */
    startBtn.addEventListener("click", () => {
        if (!devtoolsOpen) {
            showStatus("🚨 Open DevTools first!", "error");
            return;
        }
        
        // Only allow restart if game is over or won
        if (gameStarted && !gameState.gameOver && !gameState.gameWon) {
            showStatus("⚠️ Game in progress! Use [R] only when game over.", "error");
            return;
        }
        
        gameStarted = true;
        startBtn.textContent = "Click here to focus back";
        startBtn.disabled = true; // Disable until game ends
        statsDisplay.style.display = "block";
        showStatus("🎮 Adventure started!", "success");
        
        // Show character selection instead of immediately starting
        characterSelected = false;
        selectedHeroIndex = 0;
        selectedSkinIndex = 0;
        gameState.mode = MODE_CHARACTER_SELECT;
        displayCharacterSelection();
    });

    container.addEventListener("mouseleave", () => {
        if (gameStarted) showStatus("⚠️ Keep mouse on card!", "error");
    });
    
    container.addEventListener("mouseenter", () => {
        if (gameStarted && devtoolsOpen) showStatus("✅ Ready!", "success");
    });

    /* ---------- Keyboard Controls ---------- */
    window.addEventListener('keydown', e => {
        if (!gameStarted) return;
        
        // Character selection controls
        if (gameState.mode === MODE_CHARACTER_SELECT && !characterSelected) {
            const validSelectKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
            if (validSelectKeys.includes(e.key)) {
                switch(e.key) {
                    case 'ArrowUp':
                        selectedHeroIndex = (selectedHeroIndex - 1 + HERO_CHARACTERS.length) % HERO_CHARACTERS.length;
                        selectedSkinIndex = 0; // Reset skin when changing hero
                        displayCharacterSelection();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        selectedHeroIndex = (selectedHeroIndex + 1) % HERO_CHARACTERS.length;
                        selectedSkinIndex = 0; // Reset skin when changing hero
                        displayCharacterSelection();
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                        selectedSkinIndex = (selectedSkinIndex - 1 + HERO_CHARACTERS[selectedHeroIndex].skins.length) % HERO_CHARACTERS[selectedHeroIndex].skins.length;
                        displayCharacterSelection();
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                        selectedSkinIndex = (selectedSkinIndex + 1) % HERO_CHARACTERS[selectedHeroIndex].skins.length;
                        displayCharacterSelection();
                        e.preventDefault();
                        break;
                    case 'Enter':
                        confirmHeroSelection();
                        e.preventDefault();
                        break;
                }
            } else if (e.key.length === 1 || e.key === 'Escape') {
                console.log("%c⚠️ Invalid key! Use Arrow keys to select character/skin, [Enter] to confirm.", "color: #ff0000; font-weight: bold");
            }
            return;
        }
        
        if (gameState.isAnimating) return;
        
        // Only allow restart when game is over or won
        if ((gameState.gameOver || gameState.gameWon) && e.key.toLowerCase() === 'r') {
            // Reset to character selection
            stopAllAudio();
            characterSelected = false;
            selectedHeroIndex = 0;
            selectedSkinIndex = 0;
            gameState.mode = MODE_CHARACTER_SELECT;
            displayCharacterSelection();
            return;
        }
        
        if (gameState.gameOver || gameState.gameWon) return;
        
        if (gameState.mode === MODE_EXPLORE) {
            if (e.key.toLowerCase() === 'i') {
                // Open info/credits screen
                e.preventDefault();
                gameState.previousMode = gameState.mode;
                gameState.mode = 'info';
                displayInfoScreen();
            } else {
                const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
                if (validKeys.includes(e.key)) {
                    switch(e.key) {
                        case 'ArrowUp':
                            movePlayer(0, -1);
                            e.preventDefault();
                            break;
                        case 'ArrowDown':
                            movePlayer(0, 1);
                            e.preventDefault();
                            break;
                        case 'ArrowLeft':
                            movePlayer(-1, 0);
                            e.preventDefault();
                            break;
                        case 'ArrowRight':
                            movePlayer(1, 0);
                            e.preventDefault();
                            break;
                    }
                } else if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Escape') {
                    console.log("%c⚠️ Invalid key! Use Arrow keys to move or [I] for info.", "color: #ff0000; font-weight: bold");
                }
            }
        } else if (gameState.mode === MODE_BATTLE) {
            const validBattleKeys = ['1', '2', '3', '4', '5', 'Tab'];
            if (validBattleKeys.includes(e.key)) {
                switch(e.key) {
                    case '1':
                        playerAttack();
                        break;
                    case '2':
                        playerMagic();
                        break;
                    case '3':
                        playerDefend();
                        break;
                    case '4':
                        playerRun();
                        break;
                    case '5':
                        playerSpecial();
                        break;
                    case 'Tab':
                        e.preventDefault();
                        if (gameState.enemies.length > 0) {
                            gameState.currentEnemyIndex = (gameState.currentEnemyIndex + 1) % gameState.enemies.length;
                            displayGame();
                        }
                        break;
                }
            } else if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Escape') {
                console.log("%c⚠️ Invalid key! Use keys 1-5 for battle actions, Tab to switch targets.", "color: #ff0000; font-weight: bold");
            }
        } else if (gameState.mode === MODE_SHOP) {
            const key = e.key.toLowerCase();
            if (key === 'y') {
                buyPartyMember(true);
            } else if (key === 'n') {
                buyPartyMember(false);
            } else if (e.key.length === 1) {
                console.log("%c⚠️ Invalid key! Press [Y] to buy or [N] to decline.", "color: #ff0000; font-weight: bold");
            }
        } else if (gameState.mode === MODE_INN) {
            const key = e.key.toLowerCase();
            if (key === 'y') {
                useInn(true);
            } else if (key === 'n') {
                useInn(false);
            } else if (e.key.length === 1) {
                console.log("%c⚠️ Invalid key! Press [Y] to rest or [N] to decline.", "color: #ff0000; font-weight: bold");
            }
        } else if (gameState.mode === 'info') {
            // Info screen - return to previous mode
            if (e.key === 'Escape' || e.key === 'Enter') {
                e.preventDefault();
                gameState.mode = gameState.previousMode || MODE_EXPLORE;
                displayGame();
            }
        }
    });

    showStatus("Waiting for DevTools...", "info");

})();
