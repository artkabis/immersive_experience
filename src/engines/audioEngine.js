// ============================================
// COSMIC AUDIO ENGINE
// ============================================

class CosmicAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.ambientNodes = [];
        this.isPlaying = false;
        this.volume = 0.3;
        this.currentUniverse = 0;
        this.analyser = null;
        this.dataArray = null;
    }

    async init() {
        if (this.ctx) return;

        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Master gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);

        // Analyser pour visualisation
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.masterGain.connect(this.analyser);
    }

    setVolume(value) {
        this.volume = value;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);
        }
    }

    // Créer un oscillateur avec enveloppe
    createOscillator(type, freq, gain, detune = 0) {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        gainNode.gain.value = gain;

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        return { osc, gain: gainNode };
    }

    // Créer un bruit filtré
    createNoise(duration = 2) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        return noise;
    }

    // Filtre passe-bas
    createLowpass(freq, q = 1) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = freq;
        filter.Q.value = q;
        return filter;
    }

    // Filtre passe-haut
    createHighpass(freq) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = freq;
        return filter;
    }

    // Reverb simple
    createReverb(duration = 2, decay = 2) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.ctx.createBuffer(2, length, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }

        const convolver = this.ctx.createConvolver();
        convolver.buffer = impulse;
        return convolver;
    }

    // Arrêter l'ambiance actuelle
    stopAmbient() {
        this.ambientNodes.forEach(node => {
            try {
                if (node.gain) {
                    node.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
                }
                setTimeout(() => {
                    try { node.osc?.stop(); } catch (e) { }
                    try { node.noise?.stop(); } catch (e) { }
                }, 1000);
            } catch (e) { }
        });
        this.ambientNodes = [];
    }

    // ============================================
    // AMBIANCES PAR UNIVERS
    // ============================================

    playUniverseAmbient(universeIndex) {
        if (!this.ctx || !this.isPlaying) return;

        this.stopAmbient();
        this.currentUniverse = universeIndex;

        switch (universeIndex) {
            case 0: this.ambientGenesis(); break;
            case 1: this.ambientNebula(); break;
            case 2: this.ambientPlasma(); break;
            case 3: this.ambientStellar(); break;
            case 4: this.ambientFractal(); break;
            case 5: this.ambientAsteroid(); break;
            case 6: this.ambientOcean(); break;
            case 7: this.ambientAurora(); break;
            case 8: this.ambientVortex(); break;
            case 9: this.ambientGlitch(); break;
            case 10: this.ambientSingularity(); break;
        }
    }

    // 0. GENÈSE - Sons doux, émergents, mystérieux
    ambientGenesis() {
        // Drone fondamental grave
        const drone1 = this.createOscillator('sine', 55, 0.15);
        const drone2 = this.createOscillator('sine', 82.5, 0.1);
        const drone3 = this.createOscillator('triangle', 110, 0.05);

        // LFO pour modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(drone1.osc.frequency);

        // Reverb
        const reverb = this.createReverb(4, 3);
        drone1.gain.disconnect();
        drone1.gain.connect(reverb);
        reverb.connect(this.masterGain);

        drone1.osc.start();
        drone2.osc.start();
        drone3.osc.start();
        lfo.start();

        this.ambientNodes.push(drone1, drone2, drone3, { osc: lfo });
    }

    // 1. NÉBULEUSE - Sons éthérés, gazeux, profonds
    ambientNebula() {
        // Pads de synthé doux
        const pad1 = this.createOscillator('sine', 146.83, 0.08); // D3
        const pad2 = this.createOscillator('sine', 220, 0.06); // A3
        const pad3 = this.createOscillator('triangle', 293.66, 0.04); // D4

        // Bruit filtré pour texture gazeuse
        const noise = this.createNoise();
        const lpf = this.createLowpass(200, 2);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.03;

        noise.connect(lpf);
        lpf.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        // Modulation lente
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.05;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 20;
        lfo.connect(lfoGain);
        lfoGain.connect(pad1.osc.frequency);

        pad1.osc.start();
        pad2.osc.start();
        pad3.osc.start();
        noise.start();
        lfo.start();

        this.ambientNodes.push(pad1, pad2, pad3, { noise, gain: noiseGain }, { osc: lfo });
    }

    // 2. PLASMA - Sons énergétiques, électriques, pulsants
    ambientPlasma() {
        // Oscillateurs désaccordés pour effet plasma
        const osc1 = this.createOscillator('sawtooth', 65.41, 0.04); // C2
        const osc2 = this.createOscillator('sawtooth', 65.41, 0.04, 7);
        const osc3 = this.createOscillator('sawtooth', 65.41, 0.04, -7);

        // Filtre avec résonance
        const filter = this.createLowpass(400, 8);
        osc1.gain.disconnect();
        osc2.gain.disconnect();
        osc3.gain.disconnect();
        osc1.gain.connect(filter);
        osc2.gain.connect(filter);
        osc3.gain.connect(filter);
        filter.connect(this.masterGain);

        // LFO rapide pour pulsation
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 2;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        // Crépitements
        const noise = this.createNoise();
        const hpf = this.createHighpass(2000);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.02;
        noise.connect(hpf);
        hpf.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        osc1.osc.start();
        osc2.osc.start();
        osc3.osc.start();
        lfo.start();
        noise.start();

        this.ambientNodes.push(osc1, osc2, osc3, { osc: lfo }, { noise, gain: noiseGain });
    }

    // 3. FORGE STELLAIRE - Sons puissants, chauds, rayonnants
    ambientStellar() {
        // Drone majeur brillant
        const drone1 = this.createOscillator('sine', 196, 0.1); // G3
        const drone2 = this.createOscillator('sine', 246.94, 0.08); // B3
        const drone3 = this.createOscillator('sine', 293.66, 0.06); // D4
        const drone4 = this.createOscillator('triangle', 392, 0.03); // G4

        // Bruit de fusion
        const noise = this.createNoise();
        const bpf = this.ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 1000;
        bpf.Q.value = 0.5;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.015;
        noise.connect(bpf);
        bpf.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        // Pulsation stellaire
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.3;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.03;
        lfo.connect(lfoGain);
        lfoGain.connect(drone1.gain.gain);

        drone1.osc.start();
        drone2.osc.start();
        drone3.osc.start();
        drone4.osc.start();
        noise.start();
        lfo.start();

        this.ambientNodes.push(drone1, drone2, drone3, drone4, { noise, gain: noiseGain }, { osc: lfo });
    }

    // 4. FRACTALE - Sons géométriques, cristallins, mathématiques
    ambientFractal() {
        // Harmoniques parfaites (série de Fibonacci vibes)
        const freqs = [174.61, 261.63, 349.23, 523.25, 698.46]; // Pentatonique
        const oscs = freqs.map((f, i) => this.createOscillator('sine', f, 0.04 - i * 0.006));

        // Arpeggios subtils via modulation de volume
        oscs.forEach((o, i) => {
            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.2 + i * 0.1;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.02;
            lfo.connect(lfoGain);
            lfoGain.connect(o.gain.gain);
            lfo.start();
            this.ambientNodes.push({ osc: lfo });
        });

        // Résonance cristalline
        const crystal = this.createOscillator('sine', 2093, 0.01);
        const crystalLfo = this.ctx.createOscillator();
        crystalLfo.frequency.value = 4;
        const crystalLfoGain = this.ctx.createGain();
        crystalLfoGain.gain.value = 100;
        crystalLfo.connect(crystalLfoGain);
        crystalLfoGain.connect(crystal.osc.frequency);

        oscs.forEach(o => o.osc.start());
        crystal.osc.start();
        crystalLfo.start();

        this.ambientNodes.push(...oscs, crystal, { osc: crystalLfo });
    }

    // 5. ASTÉROÏDES - Sons rocheux, impacts lointains, vide spatial
    ambientAsteroid() {
        // Drone grave minimal
        const drone = this.createOscillator('sine', 41.2, 0.12); // E1

        // Bruit filtré très grave pour le vide
        const noise = this.createNoise();
        const lpf = this.createLowpass(100, 1);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.04;
        noise.connect(lpf);
        lpf.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        // Impacts occasionnels simulés par modulation
        const impactLfo = this.ctx.createOscillator();
        impactLfo.frequency.value = 0.08;
        const impactGain = this.ctx.createGain();
        impactGain.gain.value = 0.05;
        impactLfo.connect(impactGain);
        impactGain.connect(drone.gain.gain);

        drone.osc.start();
        noise.start();
        impactLfo.start();

        this.ambientNodes.push(drone, { noise, gain: noiseGain }, { osc: impactLfo });
    }

    // 6. OCÉAN COSMIQUE - Sons aquatiques, flottants, apaisants
    ambientOcean() {
        // Accord mineur flottant
        const pad1 = this.createOscillator('sine', 130.81, 0.08); // C3
        const pad2 = this.createOscillator('sine', 155.56, 0.06); // Eb3
        const pad3 = this.createOscillator('sine', 196, 0.05); // G3
        const pad4 = this.createOscillator('triangle', 261.63, 0.03); // C4

        // Bruit d'eau filtré
        const noise = this.createNoise();
        const lpf = this.createLowpass(600, 2);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.025;
        noise.connect(lpf);
        lpf.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        // Modulation d'ondulation
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 3;
        lfo.connect(lfoGain);
        lfoGain.connect(pad1.osc.frequency);
        lfoGain.connect(pad2.osc.frequency);

        // Reverb océanique
        const reverb = this.createReverb(5, 2);
        pad1.gain.disconnect();
        pad1.gain.connect(reverb);
        reverb.connect(this.masterGain);

        pad1.osc.start();
        pad2.osc.start();
        pad3.osc.start();
        pad4.osc.start();
        noise.start();
        lfo.start();

        this.ambientNodes.push(pad1, pad2, pad3, pad4, { noise, gain: noiseGain }, { osc: lfo });
    }

    // 7. AURORA - Sons éthérés, magnétiques, dansants
    ambientAurora() {
        // Arpège lent majeur
        const notes = [329.63, 392, 493.88, 587.33, 659.25]; // E4, G4, B4, D5, E5
        const oscs = notes.map((f, i) => this.createOscillator('sine', f, 0.035));

        // Modulation de pan (simulée avec volume)
        oscs.forEach((o, i) => {
            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.1 + i * 0.05;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.02;
            lfo.connect(lfoGain);
            lfoGain.connect(o.gain.gain);
            lfo.start();
            this.ambientNodes.push({ osc: lfo });
        });

        // Shimmer haute fréquence
        const shimmer = this.createOscillator('sine', 4186, 0.003);
        const shimmerLfo = this.ctx.createOscillator();
        shimmerLfo.frequency.value = 6;
        const shimmerLfoGain = this.ctx.createGain();
        shimmerLfoGain.gain.value = 200;
        shimmerLfo.connect(shimmerLfoGain);
        shimmerLfoGain.connect(shimmer.osc.frequency);

        oscs.forEach(o => o.osc.start());
        shimmer.osc.start();
        shimmerLfo.start();

        this.ambientNodes.push(...oscs, shimmer, { osc: shimmerLfo });
    }

    // 8. VORTEX - Sons tourbillonnants, vertigineux, hypnotiques
    ambientVortex() {
        // Spirale de fréquences
        const baseFreq = 110;
        const oscs = [];
        for (let i = 0; i < 5; i++) {
            const osc = this.createOscillator('sawtooth', baseFreq * (i + 1), 0.02);

            // LFO de modulation avec phase décalée
            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.5;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = baseFreq * 0.1 * (i + 1);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.osc.frequency);
            lfo.start(this.ctx.currentTime + i * 0.2);

            oscs.push(osc);
            this.ambientNodes.push({ osc: lfo });
        }

        // Filtre tournant
        const filter = this.createLowpass(800, 5);
        const filterLfo = this.ctx.createOscillator();
        filterLfo.frequency.value = 0.3;
        const filterLfoGain = this.ctx.createGain();
        filterLfoGain.gain.value = 500;
        filterLfo.connect(filterLfoGain);
        filterLfoGain.connect(filter.frequency);

        oscs.forEach(o => {
            o.gain.disconnect();
            o.gain.connect(filter);
            o.osc.start();
        });
        filter.connect(this.masterGain);
        filterLfo.start();

        this.ambientNodes.push(...oscs, { osc: filterLfo });
    }

    // 9. GLITCH - Sons cassés, numériques, chaotiques
    ambientGlitch() {
        // Oscillateurs désaccordés et instables
        const osc1 = this.createOscillator('square', 110, 0.03);
        const osc2 = this.createOscillator('square', 111.5, 0.03);

        // Bruit bitcrushed (simulé)
        const noise = this.createNoise();
        const hpf = this.createHighpass(1000);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.02;
        noise.connect(hpf);
        hpf.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        // Modulation chaotique
        const lfo1 = this.ctx.createOscillator();
        lfo1.frequency.value = 7;
        const lfo1Gain = this.ctx.createGain();
        lfo1Gain.gain.value = 50;
        lfo1.connect(lfo1Gain);
        lfo1Gain.connect(osc1.osc.frequency);

        const lfo2 = this.ctx.createOscillator();
        lfo2.frequency.value = 11;
        const lfo2Gain = this.ctx.createGain();
        lfo2Gain.gain.value = 30;
        lfo2.connect(lfo2Gain);
        lfo2Gain.connect(osc2.osc.frequency);

        osc1.osc.start();
        osc2.osc.start();
        noise.start();
        lfo1.start();
        lfo2.start();

        this.ambientNodes.push(osc1, osc2, { noise, gain: noiseGain }, { osc: lfo1 }, { osc: lfo2 });
    }

    // 10. SINGULARITÉ - Sons intenses, compressés, puis silence
    ambientSingularity() {
        // Drone massif
        const drone1 = this.createOscillator('sine', 36.71, 0.15); // D1
        const drone2 = this.createOscillator('sine', 73.42, 0.1); // D2
        const drone3 = this.createOscillator('sine', 146.83, 0.08); // D3

        // Sub-bass pulsant
        const sub = this.createOscillator('sine', 27.5, 0.12); // A0
        const subLfo = this.ctx.createOscillator();
        subLfo.frequency.value = 1;
        const subLfoGain = this.ctx.createGain();
        subLfoGain.gain.value = 0.08;
        subLfo.connect(subLfoGain);
        subLfoGain.connect(sub.gain.gain);

        // Bruit blanc intense
        const noise = this.createNoise();
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.03;
        noise.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        // Harmoniques hautes
        const high = this.createOscillator('sine', 4000, 0.01);
        const highLfo = this.ctx.createOscillator();
        highLfo.frequency.value = 8;
        const highLfoGain = this.ctx.createGain();
        highLfoGain.gain.value = 500;
        highLfo.connect(highLfoGain);
        highLfoGain.connect(high.osc.frequency);

        drone1.osc.start();
        drone2.osc.start();
        drone3.osc.start();
        sub.osc.start();
        subLfo.start();
        noise.start();
        high.osc.start();
        highLfo.start();

        this.ambientNodes.push(drone1, drone2, drone3, sub, { osc: subLfo }, { noise, gain: noiseGain }, high, { osc: highLfo });
    }

    stopAll() {
        this.ambientNodes.forEach(n => {
            try { n.noise.stop(); } catch { }
        });
        this.ambientNodes = [];
        this.isPlaying = false;
    }

    // ============================================
    // SONS DE SPAWN PAR UNIVERS
    // ============================================

    playSpawnSound(universeIndex) {
        if (!this.ctx || !this.isPlaying) return;

        const now = this.ctx.currentTime;

        switch (universeIndex) {
            case 0: this.spawnGenesis(now); break;
            case 1: this.spawnNebula(now); break;
            case 2: this.spawnPlasma(now); break;
            case 3: this.spawnStellar(now); break;
            case 4: this.spawnFractal(now); break;
            case 5: this.spawnAsteroid(now); break;
            case 6: this.spawnOcean(now); break;
            case 7: this.spawnAurora(now); break;
            case 8: this.spawnVortex(now); break;
            case 9: this.spawnGlitch(now); break;
            case 10: this.spawnSingularity(now); break;
        }
    }

    // Sons de spawn courts et caractéristiques
    spawnGenesis(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    spawnNebula(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.5);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.5);
    }

    spawnPlasma(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        const filter = this.createLowpass(2000, 3);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    spawnStellar(now) {
        // Son de "naissance d'étoile"
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(600, now);
        osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        osc1.frequency.exponentialRampToValueAtTime(400, now + 0.4);
        osc2.frequency.setValueAtTime(900, now);
        osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(600, now + 0.4);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
    }

    spawnFractal(now) {
        // Son cristallin
        const freqs = [523, 659, 784, 1047];
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.08, now + i * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.03);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.03);
            osc.stop(now + 0.3 + i * 0.03);
        });
    }

    spawnAsteroid(now) {
        // Impact sourd
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noise = this.createNoise(0.2);
        const noiseGain = this.ctx.createGain();
        const filter = this.createLowpass(200, 1);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        noiseGain.gain.setValueAtTime(0.1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        osc.start(now);
        noise.start(now);
        osc.stop(now + 0.2);
        noise.stop(now + 0.2);
    }

    spawnOcean(now) {
        // Splash doux
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.createLowpass(800, 2);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.setValueAtTime(0.12, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
    }

    spawnAurora(now) {
        // Tintement magique
        const freqs = [880, 1109, 1319, 1760];
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.02 + i * 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.02);
            osc.stop(now + 0.5);
        });
    }

    spawnVortex(now) {
        // Whoosh descendant
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        const filter = this.createLowpass(3000, 2);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    spawnGlitch(now) {
        // Son glitché
        for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 100 + Math.random() * 2000;
            gain.gain.setValueAtTime(0.05, now + i * 0.02);
            gain.gain.setValueAtTime(0, now + i * 0.02 + 0.015);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.02);
            osc.stop(now + i * 0.02 + 0.02);
        }
    }

    spawnSingularity(now) {
        // Implosion/explosion
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        // Monte puis descend
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.5);
    }

    // Big Bang sound
    playBigBang() {
        if (!this.ctx || !this.isPlaying) return;

        const now = this.ctx.currentTime;

        // Explosion massive
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noise = this.createNoise(2);
        const gain = this.ctx.createGain();
        const noiseGain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(30, now);
        osc1.frequency.exponentialRampToValueAtTime(10, now + 2);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(100, now);
        osc2.frequency.exponentialRampToValueAtTime(20, now + 1.5);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2);

        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        const filter = this.createLowpass(500, 1);

        osc1.connect(gain);
        osc2.connect(filter);
        filter.connect(gain);
        noise.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        noise.start(now);
        osc1.stop(now + 2);
        osc2.stop(now + 2);
        noise.stop(now + 2);
    }

    startAmbient() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        const noise = this.createNoise(4);
        const filter = this.createLowpass(300);
        const gain = this.ctx.createGain();
        gain.gain.value = 0.15;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();

        this.ambientNodes.push({ noise, gain });
    }

    async start() {
        await this.init();
        this.isPlaying = true;
        this.playUniverseAmbient(this.currentUniverse);
    }

    stop() {
        this.isPlaying = false;
        this.stopAmbient();
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
            return false;
        } else {
            this.start();
            return true;
        }
        console.log('Audio toggled. Playing:', this.isPlaying);
        return this.isPlaying;
    }
}

export default CosmicAudioEngine;
