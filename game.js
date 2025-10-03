(() => {
    const PATTERN_SEMITONES = [0, 0, 0, 2, 4];
    const COOLDOWN_MS = 5000;
    const NOTE_MS = 350;
    const GAP_MS = 170;

    let gameActive = false;
    let isDemoPlaying = false;
    let targetLen = 5;

    const noteBuffer = [];
    let lastNoteTs = 0;
    let gameButtonCooldownUntil = 0;

    const userNoteListeners = new Set();

    function T() { return window.Tone ?? null; }

    function ensureDock() {
        const existing = document.getElementById('gameDock');
        if (existing) return existing;
        const piano = document.getElementById('piano');
        if (!piano) return null;
        const dock = document.createElement('div');
        dock.id = 'gameDock';
        dock.className = 'game-dock';
        piano.insertAdjacentElement('afterend', dock);
        return dock;
    }

    function ensureButton() {
        if (document.getElementById('gameBtn')) return;
        const dock = ensureDock();
        if (!dock) return;
        const btn = document.createElement('button');
        btn.id = 'gameBtn';
        btn.className = 'game-btn';
        btn.type = 'button';
        btn.textContent = '🎮 Jeu';
        btn.title = 'Mini-jeu mémoire';
        btn.addEventListener('click', () => openGame());
        dock.appendChild(btn);
    }

    function showGameButton() {
        ensureButton();
        const btn = document.getElementById('gameBtn');
        if (btn) btn.classList.add('visible');
    }

    function ensurePanel() {
        if (document.getElementById('gamePanel')) return;
        const dock = ensureDock();
        if (!dock) return;
        const wrap = document.createElement('div');
        wrap.id = 'gamePanel';
        wrap.className = 'game-inline';
        wrap.innerHTML = `
      <div class="game-card">
        <div class="game-card-header">
          <div class="sparkle">✨</div>
          <div class="game-title">Mini-jeu mémoire</div>
          <button class="game-close" type="button" aria-label="Fermer">✕</button>
        </div>
        <div class="game-card-body">
          <div class="game-level" id="gameLevel">Niveau : 5 notes</div>
          <div class="game-status" id="gameStatus">Clique “Démarrer” pour écouter la suite.</div>
          <div class="game-actions">
            <button id="gameStart" class="game-action">Démarrer</button>
            <button id="gameRetry" class="game-action" disabled>Rejouer la suite</button>
            <button id="gameQuit" class="game-action">Quitter</button>
          </div>
        </div>
      </div>
    `;
        dock.appendChild(wrap);

        wrap.querySelector('.game-close').addEventListener('click', stopGameUI);
        wrap.querySelector('#gameQuit').addEventListener('click', stopGameUI);
        wrap.querySelector('#gameStart').addEventListener('click', async () => { await startGameRound(); });
        wrap.querySelector('#gameRetry').addEventListener('click', async () => { await startGameRound(true); });
    }

    function openGame() {
        ensurePanel();
        const p = document.getElementById('gamePanel');
        if (p) p.classList.add('open');
    }

    function stopGameUI() {
        const p = document.getElementById('gamePanel');
        if (p) p.classList.remove('open');
        stopGame();
    }

    function setLevelText() {
        const el = document.getElementById('gameLevel');
        if (el) el.textContent = `Niveau : ${targetLen} notes`;
    }

    function setStatusText(msg) {
        const el = document.getElementById('gameStatus');
        if (el) el.textContent = msg;
    }

    function setPanelEnabled(enabled) {
        const start = document.getElementById('gameStart');
        const retry = document.getElementById('gameRetry');
        if (start) start.disabled = !enabled;
        if (retry) retry.disabled = !enabled;
    }

    function highlightKey(note, on) {
        const el = document.getElementById(note) || document.querySelector(`[data-note="${note}"]`);
        if (!el) return;
        el.classList.toggle('highlight', !!on);
    }

    function allowedNotes() {
        const els = document.querySelectorAll('#piano .touche_blanche, #piano .touche_noire');
        const notes = Array.from(els).map(el => el.id).filter(Boolean);
        return notes.length ? notes : ["C6","D6","E6","F6","G6","A6","B6","C7","D7","E7","F7","G7","A7","B7","C8"];
    }

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function makeRandomSequence(len) {
        const pool = allowedNotes();
        const seq = [];
        for (let i = 0; i < len; i++) seq.push(randomFrom(pool));
        return seq;
    }

    function synthFallback() {
        if (!window.__gameSynth && T()) {
            window.__gameSynth = new T().Synth().toDestination();
        }
        return window.__gameSynth ?? null;
    }

    async function playOne(note, ms = NOTE_MS) {
        const tone = T();
        highlightKey(note, true);
        if (typeof window.playNote === 'function') {
            await window.playNote(note);
        } else if (tone) {
            await tone.start();
            synthFallback()?.triggerAttackRelease(note, ms / 1000);
        }
        await wait(ms);
        highlightKey(note, false);
    }

    async function playDemo(seq) {
        isDemoPlaying = true;
        setStatusText('Écoute la suite…');
        setPanelEnabled(false);
        for (const n of seq) {
            await playOne(n, NOTE_MS);
            await wait(GAP_MS);
        }
        setPanelEnabled(true);
        setStatusText('À toi de rejouer la suite, note par note !');
        isDemoPlaying = false;
    }

    function captureUser(seq) {
        return new Promise((resolve) => {
            let i = 0;
            const onUser = (note) => {
                if (isDemoPlaying) return;
                highlightKey(note, true);
                setTimeout(() => highlightKey(note, false), 120);
                if (note !== seq[i]) {
                    setStatusText('Raté 😅 — clique “Rejouer la suite” pour réécouter.');
                    userNoteListeners.delete(onUser);
                    resolve(false);
                    return;
                }
                i++;
                if (i >= seq.length) {
                    setStatusText('Bravo ! ✅');
                    userNoteListeners.delete(onUser);
                    resolve(true);
                }
            };
            userNoteListeners.add(onUser);
        });
    }

    async function startGameRound() {
        if (gameActive) return;
        gameActive = true;
        setLevelText();
        const prev = pauseMainTransport();
        try {
            const seq = makeRandomSequence(targetLen);
            await playDemo(seq);
            const ok = await captureUser(seq);
            if (ok) {
                if (targetLen < 20) {
                    targetLen += 5;
                    setStatusText(`Super ! On passe à ${targetLen} notes.`);
                } else {
                    setStatusText('GG ✨ Tu as réussi 20/20 !');
                }
            } else {
                setStatusText(`On reste à ${targetLen} notes. Clique “Rejouer la suite”.`);
            }
        } finally {
            resumeMainTransport(prev);
            gameActive = false;
            const retry = document.getElementById('gameRetry');
            if (retry) retry.disabled = false;
        }
    }

    function pauseMainTransport() {
        const tone = T();
        if (!tone) return { wasStarted: false, position: 0 };
        const wasStarted = tone.Transport.state === 'started';
        const position = tone.Transport.position;
        tone.Transport.pause();
        return { wasStarted, position };
    }

    function resumeMainTransport(prev) {
        const tone = T();
        if (!tone || !prev) return;
        if (prev.wasStarted) {
            tone.Transport.start('+0.05', prev.position);
        }
    }

    function wait(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    function onUserNotePlayed(noteName) {
        const tone = T();
        if (!tone) return;
        const now = performance.now();
        if (now - lastNoteTs < 40) {
            lastNoteTs = now;
        } else {
            lastNoteTs = now;
        }
        const m = tone.Frequency(noteName).toMidi();
        if (!Number.isFinite(m)) return;
        noteBuffer.push(m);
        if (noteBuffer.length > 10) noteBuffer.shift();

        if (matchesAuClairDeLaLune(noteBuffer)) {
            if (now >= gameButtonCooldownUntil) {
                gameButtonCooldownUntil = now + COOLDOWN_MS;
                showGameButton();
            }
        }
    }

    function matchesAuClairDeLaLune(buf) {
        if (buf.length < 5) return false;
        const last5 = buf.slice(-5);
        const base = last5[0];
        const diffs = last5.map((x) => x - base);
        if (diffs.length !== PATTERN_SEMITONES.length) return false;
        for (let i = 0; i < diffs.length; i++) {
            if (diffs[i] !== PATTERN_SEMITONES[i]) return false;
        }
        return true;
    }

    window.gameRegisterUserNote = function (noteName) {
        if (isDemoPlaying) return;
        for (const fn of userNoteListeners) fn(noteName);
        onUserNotePlayed(noteName);
    };

    window.showGameButton = showGameButton;
    window.openGame = openGame;
    window.stopGame = stopGame;

    function stopGame() {
        userNoteListeners.clear();
        gameActive = false;
    }
})();
