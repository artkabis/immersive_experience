
        import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

        const universeData = [
            { name: 'GENÈSE', color: '#00ffc8' },
            { name: 'NÉBULEUSE', color: '#8a2be2' },
            { name: 'PLASMA', color: '#ff0080' },
            { name: 'FORGE STELLAIRE', color: '#ffd700' },
            { name: 'FRACTALE', color: '#ffc800' },
            { name: 'ASTÉROÏDES', color: '#8b7765' },
            { name: 'OCÉAN COSMIQUE', color: '#00c8ff' },
            { name: 'AURORA', color: '#00ff7f' },
            { name: 'VORTEX', color: '#ff00ff' },
            { name: 'GLITCH', color: '#ff0000' },
            { name: 'SINGULARITÉ', color: '#ffffff' }
        ];

        let currentSection = 0;
        let scrollProgress = 0;
        let mouseX = 0, mouseY = 0;
        let isMouseDown = false;
        let spawnInterval = null;

        // MODES
        let gravityInverted = false;
        let attractMode = false;
        let timeWarp = false;
        let radarVisible = false;
        let audioPlaying = false;

        // ============================================
        // SYSTÈME AUDIO COMPLET
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

                // Créer le visualiseur
                this.createVisualizer();
            }

            createVisualizer() {
                const visualizer = document.getElementById('audioVisualizer');
                visualizer.innerHTML = '';
                for (let i = 0; i < 24; i++) {
                    const bar = document.createElement('div');
                    bar.className = 'audio-bar';
                    visualizer.appendChild(bar);
                }
            }

            updateVisualizer() {
                if (!this.isPlaying || !this.analyser) return;

                this.analyser.getByteFrequencyData(this.dataArray);
                const bars = document.querySelectorAll('.audio-bar');

                bars.forEach((bar, i) => {
                    const value = this.dataArray[i] || 0;
                    const height = Math.max(3, (value / 255) * 25);
                    bar.style.height = height + 'px';
                });
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
                document.getElementById('audioVisualizer').classList.remove('playing');
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

        // Instance audio globale
        const audioEngine = new CosmicAudioEngine();

        // ============================================
        // RADAR FONCTIONNEL
        // ============================================
        class CosmicRadar {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.width = 150;
                this.height = 150;
                this.centerX = this.width / 2;
                this.centerY = this.height / 2;
                this.radius = 70;
                this.sweepAngle = 0;
                this.detectedObjects = [];
                this.trails = []; // Traînées des objets
                this.color = '#00ffc8';
            }

            setColor(color) {
                this.color = color;
            }

            update(bodies, currentTime) {
                // Mise à jour de l'angle de balayage
                this.sweepAngle += 0.03;
                if (this.sweepAngle > Math.PI * 2) {
                    this.sweepAngle -= Math.PI * 2;
                }

                // Convertir les positions 3D en positions radar
                this.detectedObjects = bodies.map(b => {
                    const pos = b.body.translation();
                    // Normaliser les positions (supposons que la scène va de -20 à 20)
                    const rx = (pos.x / 25) * this.radius;
                    const rz = (pos.z / 25) * this.radius;
                    const distance = Math.sqrt(rx * rx + rz * rz);
                    const angle = Math.atan2(rz, rx);

                    return {
                        x: this.centerX + rx,
                        y: this.centerY + rz,
                        distance: distance,
                        angle: angle,
                        altitude: pos.y,
                        isNew: (currentTime - b.birthTime) < 500 // Nouveau si créé il y a moins de 500ms
                    };
                });

                // Ajouter des traînées pour les objets détectés par le balayage
                this.detectedObjects.forEach(obj => {
                    // Vérifier si l'objet est dans le secteur du balayage
                    let objAngle = obj.angle;
                    if (objAngle < 0) objAngle += Math.PI * 2;

                    const sweepNormalized = this.sweepAngle % (Math.PI * 2);
                    const angleDiff = Math.abs(objAngle - sweepNormalized);

                    if (angleDiff < 0.1 || angleDiff > Math.PI * 2 - 0.1) {
                        // L'objet vient d'être "scanné"
                        this.trails.push({
                            x: obj.x,
                            y: obj.y,
                            opacity: 1,
                            isNew: obj.isNew
                        });
                    }
                });

                // Faire décroître les traînées
                this.trails = this.trails.filter(trail => {
                    trail.opacity -= 0.015;
                    return trail.opacity > 0;
                });

                // Mettre à jour les stats
                const avgDist = this.detectedObjects.length > 0
                    ? Math.round(this.detectedObjects.reduce((sum, o) => sum + o.distance, 0) / this.detectedObjects.length)
                    : '--';
                document.getElementById('radarStats').textContent =
                    `OBJETS: ${this.detectedObjects.length} | DIST: ${avgDist}`;
            }



            draw() {
                this.ctx.clearRect(0, 0, this.width, this.height);

                // Cercles concentriques
                this.ctx.strokeStyle = this.color;
                this.ctx.globalAlpha = 0.2;
                for (let r = 20; r <= this.radius; r += 20) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.centerX, this.centerY, r, 0, Math.PI * 2);
                    this.ctx.stroke();
                }

                // Lignes de quadrant
                this.ctx.beginPath();
                this.ctx.moveTo(this.centerX, this.centerY - this.radius);
                this.ctx.lineTo(this.centerX, this.centerY + this.radius);
                this.ctx.moveTo(this.centerX - this.radius, this.centerY);
                this.ctx.lineTo(this.centerX + this.radius, this.centerY);
                this.ctx.stroke();

                // Balayage (effet de radar)
                const gradient = this.ctx.createConicalGradient
                    ? this.ctx.createConicalGradient(this.sweepAngle, this.centerX, this.centerY)
                    : null;

                // Dessiner le secteur de balayage
                this.ctx.globalAlpha = 0.3;
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                this.ctx.moveTo(this.centerX, this.centerY);
                this.ctx.arc(this.centerX, this.centerY, this.radius, this.sweepAngle - 0.5, this.sweepAngle);
                this.ctx.closePath();
                this.ctx.fill();

                // Ligne de balayage
                this.ctx.globalAlpha = 0.8;
                this.ctx.strokeStyle = this.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.centerX, this.centerY);
                this.ctx.lineTo(
                    this.centerX + Math.cos(this.sweepAngle) * this.radius,
                    this.centerY + Math.sin(this.sweepAngle) * this.radius
                );
                this.ctx.stroke();
                this.ctx.lineWidth = 1;

                // Dessiner les traînées (effet persistance)
                this.trails.forEach(trail => {
                    this.ctx.globalAlpha = trail.opacity * 0.6;
                    this.ctx.fillStyle = trail.isNew ? '#ffff00' : this.color;
                    this.ctx.beginPath();
                    this.ctx.arc(trail.x, trail.y, trail.isNew ? 4 : 3, 0, Math.PI * 2);
                    this.ctx.fill();
                });

                // Dessiner les objets actuels (points brillants)
                this.detectedObjects.forEach(obj => {
                    // Point principal
                    this.ctx.globalAlpha = 0.9;
                    this.ctx.fillStyle = obj.isNew ? '#ffff00' : this.color;
                    this.ctx.beginPath();
                    this.ctx.arc(obj.x, obj.y, obj.isNew ? 5 : 3, 0, Math.PI * 2);
                    this.ctx.fill();

                    // Halo pour les nouveaux objets
                    if (obj.isNew) {
                        this.ctx.globalAlpha = 0.3;
                        this.ctx.beginPath();
                        this.ctx.arc(obj.x, obj.y, 8, 0, Math.PI * 2);
                        this.ctx.fill();
                    }

                    // Indicateur d'altitude (ligne verticale)
                    if (obj.altitude > 5) {
                        this.ctx.globalAlpha = 0.4;
                        this.ctx.strokeStyle = '#ffff00';
                        this.ctx.beginPath();
                        this.ctx.moveTo(obj.x, obj.y);
                        this.ctx.lineTo(obj.x, obj.y - Math.min(obj.altitude / 2, 15));
                        this.ctx.stroke();
                    }
                });

                // Centre du radar
                this.ctx.globalAlpha = 1;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, this.centerY, 3, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.globalAlpha = 1;
            }
        }

        const radar = new CosmicRadar('radarCanvas');

        // ============================================
        // INITIALISATION PRINCIPALE
        // ============================================
        async function init() {
            try {
                await RAPIER.init();
                const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
                const bodies = [];

                // THREE.JS SETUP
                const scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2(0x000000, 0.012);

                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(0, 5, 18);

                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 1.5;
                renderer.domElement.id = 'webgl';
                document.body.appendChild(renderer.domElement);

                // LUMIÈRES
                const mainLight = new THREE.PointLight(0x00ffc8, 300);
                mainLight.position.set(5, 15, 5);
                scene.add(mainLight);

                const secondaryLight = new THREE.PointLight(0x8a2be2, 150);
                secondaryLight.position.set(-8, 8, -8);
                scene.add(secondaryLight);

                const tertiaryLight = new THREE.PointLight(0xff0080, 100);
                tertiaryLight.position.set(0, -5, 10);
                scene.add(tertiaryLight);

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
                scene.add(ambientLight);

                // SOL PHYSIQUE
                const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -2, 0));
                world.createCollider(RAPIER.ColliderDesc.cuboid(25, 0.5, 25), groundBody);

                // GRILLE LUMINEUSE
                const gridGroup = new THREE.Group();
                const gridSize = 60;
                const gridDivisions = 30;

                const groundPlaneGeo = new THREE.PlaneGeometry(gridSize, gridSize);
                const groundPlaneMat = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    metalness: 0.9,
                    roughness: 0.1,
                    transparent: true,
                    opacity: 0.8
                });
                const groundPlane = new THREE.Mesh(groundPlaneGeo, groundPlaneMat);
                groundPlane.rotation.x = -Math.PI / 2;
                groundPlane.position.y = -1.49;
                gridGroup.add(groundPlane);

                const gridMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ffc8,
                    transparent: true,
                    opacity: 0.6
                });

                const gridLines = new THREE.Group();
                const step = gridSize / gridDivisions;

                for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
                    const geoX = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(i, 0, -gridSize / 2),
                        new THREE.Vector3(i, 0, gridSize / 2)
                    ]);
                    gridLines.add(new THREE.Line(geoX, gridMaterial.clone()));

                    const geoZ = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(-gridSize / 2, 0, i),
                        new THREE.Vector3(gridSize / 2, 0, i)
                    ]);
                    gridLines.add(new THREE.Line(geoZ, gridMaterial.clone()));
                }
                gridLines.position.y = -1.48;
                gridGroup.add(gridLines);

                const centerLineMat = new THREE.LineBasicMaterial({
                    color: 0x00ffc8,
                    transparent: true,
                    opacity: 1
                });

                const centerX = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, -gridSize / 2),
                    new THREE.Vector3(0, 0, gridSize / 2)
                ]);
                const centerLineX = new THREE.Line(centerX, centerLineMat);
                centerLineX.position.y = -1.47;
                gridGroup.add(centerLineX);

                const centerZ = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-gridSize / 2, 0, 0),
                    new THREE.Vector3(gridSize / 2, 0, 0)
                ]);
                const centerLineZ = new THREE.Line(centerZ, centerLineMat.clone());
                centerLineZ.position.y = -1.47;
                gridGroup.add(centerLineZ);

                const intersectionGeo = new THREE.BufferGeometry();
                const intersectionPositions = [];
                for (let x = -gridSize / 2; x <= gridSize / 2; x += step * 2) {
                    for (let z = -gridSize / 2; z <= gridSize / 2; z += step * 2) {
                        intersectionPositions.push(x, -1.45, z);
                    }
                }
                intersectionGeo.setAttribute('position', new THREE.Float32BufferAttribute(intersectionPositions, 3));
                const intersectionMat = new THREE.PointsMaterial({
                    color: 0x00ffc8,
                    size: 0.15,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending
                });
                const intersectionPoints = new THREE.Points(intersectionGeo, intersectionMat);
                gridGroup.add(intersectionPoints);

                const glowGeo = new THREE.PlaneGeometry(gridSize * 0.8, gridSize * 0.8);
                const glowMat = new THREE.MeshBasicMaterial({
                    color: 0x00ffc8,
                    transparent: true,
                    opacity: 0.05,
                    blending: THREE.AdditiveBlending
                });
                const glowPlane = new THREE.Mesh(glowGeo, glowMat);
                glowPlane.rotation.x = -Math.PI / 2;
                glowPlane.position.y = -1.4;
                gridGroup.add(glowPlane);

                scene.add(gridGroup);

                // ÉTOILES
                const starCount = 5000;
                const starGeometry = new THREE.BufferGeometry();
                const starPositions = new Float32Array(starCount * 3);
                const starColors = new Float32Array(starCount * 3);

                for (let i = 0; i < starCount; i++) {
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(Math.random() * 2 - 1);
                    const radius = 50 + Math.random() * 150;

                    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    starPositions[i * 3 + 2] = radius * Math.cos(phi);

                    const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8);
                    starColors[i * 3] = color.r;
                    starColors[i * 3 + 1] = color.g;
                    starColors[i * 3 + 2] = color.b;
                }

                starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
                starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

                const starMaterial = new THREE.PointsMaterial({
                    size: 0.3,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending
                });

                const starField = new THREE.Points(starGeometry, starMaterial);
                scene.add(starField);

                // NÉBULEUSE
                const nebulaGeometry = new THREE.BufferGeometry();
                const nebulaCount = 800;
                const nebulaPositions = new Float32Array(nebulaCount * 3);
                const nebulaColors = new Float32Array(nebulaCount * 3);

                for (let i = 0; i < nebulaCount; i++) {
                    nebulaPositions[i * 3] = (Math.random() - 0.5) * 100;
                    nebulaPositions[i * 3 + 1] = (Math.random() - 0.5) * 50 + 15;
                    nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;

                    const hue = Math.random() * 0.3 + 0.6;
                    const color = new THREE.Color().setHSL(hue, 1, 0.5);
                    nebulaColors[i * 3] = color.r;
                    nebulaColors[i * 3 + 1] = color.g;
                    nebulaColors[i * 3 + 2] = color.b;
                }

                nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
                nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

                const nebulaMaterial = new THREE.PointsMaterial({
                    size: 4,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.12,
                    blending: THREE.AdditiveBlending
                });

                const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
                scene.add(nebula);

                // ANNEAUX
                const rings = [];
                for (let i = 0; i < 5; i++) {
                    const ringGeometry = new THREE.TorusGeometry(12 + i * 5, 0.04, 16, 200);
                    const ringMaterial = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(i * 0.15, 0.8, 0.5),
                        transparent: true,
                        opacity: 0.25,
                        blending: THREE.AdditiveBlending
                    });
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
                    ring.position.y = 8;
                    scene.add(ring);
                    rings.push(ring);
                }

                // CRÉATION D'OBJETS COSMIQUES (simplifié pour la lisibilité)
                const objectCreators = [
                    // 0. Genèse - Poussière cosmique
                    () => {
                        const group = new THREE.Group();
                        for (let i = 0; i < 12; i++) {
                            const geo = new THREE.SphereGeometry(0.05 + Math.random() * 0.12, 8, 8);
                            const mat = new THREE.MeshStandardMaterial({
                                color: 0x00ffc8, emissive: 0x00ffc8, emissiveIntensity: 0.8,
                                transparent: true, opacity: 0.9
                            });
                            const p = new THREE.Mesh(geo, mat);
                            p.position.set((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8);
                            group.add(p);
                        }
                        return group;
                    },
                    // 1. Nébuleuse
                    () => {
                        const group = new THREE.Group();
                        const core = new THREE.Mesh(
                            new THREE.SphereGeometry(0.4, 16, 16),
                            new THREE.MeshStandardMaterial({ color: 0x8a2be2, emissive: 0x4b0082, emissiveIntensity: 1, transparent: true, opacity: 0.7 })
                        );
                        group.add(core);
                        for (let i = 0; i < 15; i++) {
                            const cloud = new THREE.Mesh(
                                new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 8),
                                new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.8, 0.5), emissive: 0x4b0082, emissiveIntensity: 0.5, transparent: true, opacity: 0.5 })
                            );
                            const angle = Math.random() * Math.PI * 2;
                            cloud.position.set(Math.cos(angle) * (0.3 + Math.random() * 0.5), (Math.random() - 0.5) * 0.6, Math.sin(angle) * (0.3 + Math.random() * 0.5));
                            group.add(cloud);
                        }
                        return group;
                    },
                    // 2. Plasma
                    () => {
                        const group = new THREE.Group();
                        group.add(new THREE.Mesh(
                            new THREE.SphereGeometry(0.5, 32, 32),
                            new THREE.MeshStandardMaterial({ color: 0xff0080, emissive: 0xff4400, emissiveIntensity: 1.2, metalness: 0.3, roughness: 0.7 })
                        ));
                        for (let i = 0; i < 5; i++) {
                            const filament = new THREE.Mesh(
                                new THREE.TorusGeometry(0.55 + i * 0.08, 0.015, 8, 32),
                                new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.7 - i * 0.1 })
                            );
                            filament.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
                            group.add(filament);
                        }
                        return group;
                    },
                    // 3. Étoile
                    () => {
                        const group = new THREE.Group();
                        group.add(new THREE.Mesh(
                            new THREE.IcosahedronGeometry(0.4, 2),
                            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd700, emissiveIntensity: 2 })
                        ));
                        for (let i = 0; i < 8; i++) {
                            const ray = new THREE.Mesh(
                                new THREE.ConeGeometry(0.06, 0.7, 4),
                                new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.85 })
                            );
                            const theta = (i / 8) * Math.PI * 2;
                            ray.position.set(Math.cos(theta) * 0.45, 0, Math.sin(theta) * 0.45);
                            ray.rotation.z = -Math.PI / 2;
                            ray.rotation.y = -theta;
                            group.add(ray);
                        }
                        group.add(new THREE.Mesh(
                            new THREE.SphereGeometry(0.65, 16, 16),
                            new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.25, side: THREE.BackSide })
                        ));
                        return group;
                    },
                    // 4. Cristal
                    () => {
                        const group = new THREE.Group();
                        group.add(new THREE.Mesh(
                            new THREE.OctahedronGeometry(0.5, 0),
                            new THREE.MeshStandardMaterial({ color: 0xffc800, emissive: 0xffa000, emissiveIntensity: 0.6, metalness: 1, roughness: 0, transparent: true, opacity: 0.9 })
                        ));
                        const inner = new THREE.Mesh(
                            new THREE.OctahedronGeometry(0.3, 0),
                            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, wireframe: true })
                        );
                        inner.rotation.y = Math.PI / 4;
                        group.add(inner);
                        return group;
                    },
                    // 5. Astéroïde
                    () => {
                        const group = new THREE.Group();
                        const geo = new THREE.DodecahedronGeometry(0.5, 1);
                        const pos = geo.attributes.position;
                        for (let i = 0; i < pos.count; i++) {
                            const noise = 0.75 + Math.random() * 0.5;
                            pos.setXYZ(i, pos.getX(i) * noise, pos.getY(i) * noise, pos.getZ(i) * noise);
                        }
                        geo.computeVertexNormals();
                        group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x8b7765, roughness: 1, metalness: 0.2, flatShading: true })));
                        return group;
                    },
                    // 6. Méduse
                    () => {
                        const group = new THREE.Group();
                        const dome = new THREE.Mesh(
                            new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
                            new THREE.MeshStandardMaterial({ color: 0x00c8ff, emissive: 0x0066ff, emissiveIntensity: 0.6, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
                        );
                        dome.rotation.x = Math.PI;
                        group.add(dome);
                        for (let i = 0; i < 8; i++) {
                            const curve = new THREE.CatmullRomCurve3([
                                new THREE.Vector3(0, 0, 0),
                                new THREE.Vector3((Math.random() - 0.5) * 0.3, -0.3, (Math.random() - 0.5) * 0.3),
                                new THREE.Vector3((Math.random() - 0.5) * 0.5, -0.7, (Math.random() - 0.5) * 0.5),
                                new THREE.Vector3((Math.random() - 0.5) * 0.4, -1.1, (Math.random() - 0.5) * 0.4)
                            ]);
                            const tentacle = new THREE.Mesh(
                                new THREE.TubeGeometry(curve, 20, 0.02, 8, false),
                                new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.65 })
                            );
                            const angle = (i / 8) * Math.PI * 2;
                            tentacle.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
                            group.add(tentacle);
                        }
                        return group;
                    },
                    // 7. Aurora
                    () => {
                        const group = new THREE.Group();
                        const points = [];
                        for (let i = 0; i < 20; i++) {
                            points.push(new THREE.Vector3(Math.sin(i * 0.5) * 0.3, i * 0.1 - 1, Math.cos(i * 0.5) * 0.3));
                        }
                        const curve = new THREE.CatmullRomCurve3(points);
                        group.add(new THREE.Mesh(
                            new THREE.TubeGeometry(curve, 50, 0.07, 8, false),
                            new THREE.MeshBasicMaterial({ color: 0x00ff7f, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
                        ));
                        for (let i = 0; i < 12; i++) {
                            const p = new THREE.Mesh(
                                new THREE.SphereGeometry(0.035, 8, 8),
                                new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.3 + Math.random() * 0.4, 1, 0.6), transparent: true, opacity: 0.85 })
                            );
                            p.position.copy(curve.getPoint(Math.random()));
                            group.add(p);
                        }
                        return group;
                    },
                    // 8. Vortex
                    () => {
                        const group = new THREE.Group();
                        group.add(new THREE.Mesh(
                            new THREE.TorusKnotGeometry(0.28, 0.08, 64, 8, 2, 3),
                            new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 0.9, metalness: 0.5, roughness: 0.3 })
                        ));
                        for (let i = 0; i < 3; i++) {
                            const ring = new THREE.Mesh(
                                new THREE.TorusGeometry(0.45 + i * 0.12, 0.012, 8, 32),
                                new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(i * 0.3, 1, 0.5), transparent: true, opacity: 0.55 - i * 0.1 })
                            );
                            ring.rotation.x = Math.PI / 2;
                            group.add(ring);
                        }
                        return group;
                    },
                    // 9. Glitch
                    () => {
                        const group = new THREE.Group();
                        group.add(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), new THREE.MeshNormalMaterial({ flatShading: true })));
                        for (let i = 0; i < 6; i++) {
                            const frag = new THREE.Mesh(
                                new THREE.BoxGeometry(0.18, 0.18, 0.18),
                                new THREE.MeshBasicMaterial({ color: [0xff0000, 0x00ff00, 0x0000ff][i % 3], transparent: true, opacity: 0.6, wireframe: Math.random() > 0.5 })
                            );
                            frag.position.set((Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7);
                            group.add(frag);
                        }
                        return group;
                    },
                    // 10. Singularité
                    () => {
                        const group = new THREE.Group();
                        group.add(new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 })));
                        const disk = new THREE.Mesh(
                            new THREE.TorusGeometry(0.55, 0.12, 16, 100),
                            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
                        );
                        disk.rotation.x = Math.PI / 2;
                        group.add(disk);
                        group.add(new THREE.Mesh(
                            new THREE.SphereGeometry(0.75, 32, 32),
                            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.BackSide, blending: THREE.AdditiveBlending })
                        ));
                        return group;
                    }
                ];

                // GSAP TIMELINE
                gsap.registerPlugin(ScrollTrigger);
                const totalSections = 11;
                const sectionDuration = 1 / totalSections;

                const mainTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 2,
                        onUpdate: (self) => {
                            scrollProgress = self.progress;
                            document.getElementById('progressBar').style.width = (scrollProgress * 100) + '%';

                            const newSection = Math.min(Math.floor(scrollProgress * totalSections), totalSections - 1);
                            if (newSection !== currentSection) {
                                currentSection = newSection;
                                updateUI();
                                updateGridColor();
                                if (audioPlaying) {
                                    audioEngine.playUniverseAmbient(currentSection);
                                }
                            }
                        }
                    }
                });

                const cameraPositions = [
                    { x: 0, y: 5, z: 18 }, { x: -10, y: 8, z: 14 }, { x: 5, y: 4, z: 12 },
                    { x: 0, y: 12, z: 10 }, { x: -8, y: 15, z: 8 }, { x: 8, y: 6, z: 16 },
                    { x: 0, y: 2, z: 20 }, { x: -6, y: 8, z: 15 }, { x: 0, y: 5, z: 12 },
                    { x: 5, y: 10, z: 14 }, { x: 0, y: 20, z: 25 }
                ];

                for (let i = 0; i < totalSections - 1; i++) {
                    mainTimeline.to(camera.position, { ...cameraPositions[i + 1], duration: sectionDuration }, i * sectionDuration);
                }

                mainTimeline.to({}, {
                    duration: 0.01,
                    onStart: () => { if (!gravityInverted) world.gravity = { x: 0, y: -2, z: 0 }; },
                    onReverseComplete: () => { if (!gravityInverted) world.gravity = { x: 0, y: -9.81, z: 0 }; }
                }, sectionDuration * 6);

                mainTimeline.to({}, {
                    duration: 0.01,
                    onStart: () => { if (!gravityInverted) world.gravity = { x: 0, y: -9.81, z: 0 }; }
                }, sectionDuration * 7);

                mainTimeline.to({}, {
                    duration: 0.01,
                    onStart: () => triggerBigBang(),
                    onReverseComplete: () => resetGravity()
                }, sectionDuration * 10 + 0.05);

                // FONCTIONS UI
                function updateUI() {
                    document.querySelectorAll('.indicator-dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentSection);
                    });

                    document.getElementById('universeName').textContent = universeData[currentSection].name;
                    document.getElementById('universeName').style.color = universeData[currentSection].color;
                    document.getElementById('chapterNumber').textContent = String(currentSection + 1).padStart(2, '0');
                    document.documentElement.style.setProperty('--universe-color', universeData[currentSection].color);

                    radar.setColor(universeData[currentSection].color);
                }

                function updateGridColor() {
                    const color = new THREE.Color(universeData[currentSection].color);
                    gridLines.children.forEach(line => { line.material.color = color; });
                    centerLineX.material.color = color;
                    centerLineZ.material.color = color;
                    intersectionPoints.material.color = color;
                    glowPlane.material.color = color;
                }

                function updateObjectCounter() {
                    document.getElementById('objectCount').textContent = bodies.length;
                }

                function showModeIndicator(text) {
                    const indicator = document.getElementById('modeIndicator');
                    indicator.textContent = text;
                    indicator.classList.add('visible');
                    setTimeout(() => indicator.classList.remove('visible'), 1500);
                }

                function triggerBigBang() {
                    world.gravity = { x: 0, y: 20, z: 0 };
                    audioEngine.playBigBang();
                    bodies.forEach((b) => {
                        const pos = b.body.translation();
                        b.body.applyImpulse({
                            x: pos.x * 30 + (Math.random() - 0.5) * 50,
                            y: 200 + Math.random() * 100,
                            z: pos.z * 30 + (Math.random() - 0.5) * 50
                        }, true);
                        gsap.to(b.mesh.scale, { x: 3, y: 3, z: 3, duration: 0.3, yoyo: true, repeat: 5 });
                    });
                }

                function resetGravity() {
                    world.gravity = { x: 0, y: gravityInverted ? 9.81 : -9.81, z: 0 };
                }

                function spawnObject(x, y) {
                    const cosmicObject = objectCreators[currentSection]();
                    scene.add(cosmicObject);

                    const mouseXNorm = (x / window.innerWidth) * 2 - 1;
                    const mouseYNorm = -(y / window.innerHeight) * 2 + 1;
                    const spawnX = mouseXNorm * 12;
                    const spawnZ = mouseYNorm * 8;

                    const body = world.createRigidBody(
                        RAPIER.RigidBodyDesc.dynamic()
                            .setTranslation(spawnX, 25, spawnZ)
                            .setAngvel({ x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3, z: (Math.random() - 0.5) * 3 })
                    );

                    world.createCollider(RAPIER.ColliderDesc.ball(0.5), body);

                    bodies.push({ mesh: cosmicObject, body, type: currentSection, birthTime: Date.now() });

                    gsap.from(cosmicObject.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });

                    updateObjectCounter();
                    createClickRipple(x, y);

                    // Jouer le son de spawn
                    audioEngine.playSpawnSound(currentSection);
                }

                function createClickRipple(x, y) {
                    const ripple = document.createElement('div');
                    ripple.className = 'click-ripple';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    document.body.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 800);
                }

                // CURSEUR
                const cursor = document.getElementById('cursor');
                const trailsContainer = document.getElementById('cursorTrails');
                const trails = [];

                for (let i = 0; i < 8; i++) {
                    const trail = document.createElement('div');
                    trail.className = 'cursor-trail';
                    trail.style.opacity = (1 - i / 8) * 0.5;
                    trailsContainer.appendChild(trail);
                    trails.push({ el: trail, x: 0, y: 0 });
                }

                document.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    cursor.style.left = mouseX + 'px';
                    cursor.style.top = mouseY + 'px';
                });

                function updateTrails() {
                    let prevX = mouseX, prevY = mouseY;
                    trails.forEach((trail, i) => {
                        const speed = 0.15 - i * 0.01;
                        trail.x += (prevX - trail.x) * speed;
                        trail.y += (prevY - trail.y) * speed;
                        trail.el.style.left = trail.x + 'px';
                        trail.el.style.top = trail.y + 'px';
                        prevX = trail.x;
                        prevY = trail.y;
                    });
                    requestAnimationFrame(updateTrails);
                }
                updateTrails();

                // INTERACTIONS
                document.addEventListener('mousedown', (e) => {
                    if (e.target.closest('.control-btn') || e.target.closest('.indicator-dot') || e.target.closest('.volume-control')) return;

                    cursor.classList.add('clicking');
                    isMouseDown = true;
                    spawnObject(e.clientX, e.clientY);

                    spawnInterval = setInterval(() => {
                        if (isMouseDown) spawnObject(mouseX, mouseY);
                    }, 150);
                });

                document.addEventListener('mouseup', () => {
                    cursor.classList.remove('clicking');
                    isMouseDown = false;
                    clearInterval(spawnInterval);
                });

                // CLAVIER
                document.addEventListener('keydown', (e) => {
                    switch (e.code) {
                        case 'Space':
                            e.preventDefault();
                            triggerBigBang();
                            showModeIndicator('BIG BANG !');
                            setTimeout(resetGravity, 2000);
                            break;
                        case 'KeyG':
                            gravityInverted = !gravityInverted;
                            world.gravity = { x: 0, y: gravityInverted ? 9.81 : -9.81, z: 0 };
                            document.getElementById('btnGravity').classList.toggle('active', gravityInverted);
                            showModeIndicator(gravityInverted ? 'GRAVITÉ INVERSÉE' : 'GRAVITÉ NORMALE');
                            break;
                        case 'KeyA':
                            attractMode = !attractMode;
                            document.getElementById('btnAttract').classList.toggle('active', attractMode);
                            showModeIndicator(attractMode ? 'MODE ATTRACTION' : 'MODE NORMAL');
                            break;
                        case 'KeyT':
                            timeWarp = !timeWarp;
                            document.getElementById('btnTimeWarp').classList.toggle('active', timeWarp);
                            showModeIndicator(timeWarp ? 'RALENTI TEMPOREL' : 'TEMPS NORMAL');
                            break;
                        case 'KeyR':
                            radarVisible = !radarVisible;
                            document.getElementById('radarContainer').classList.toggle('visible', radarVisible);
                            document.getElementById('btnRadar').classList.toggle('active', radarVisible);
                            break;
                        case 'KeyM':
                            toggleAudio();
                            break;
                        case 'KeyC':
                            clearAllObjects();
                            break;
                    }
                });

                // BOUTONS
                document.getElementById('btnGravity').addEventListener('click', () => {
                    gravityInverted = !gravityInverted;
                    world.gravity = { x: 0, y: gravityInverted ? 9.81 : -9.81, z: 0 };
                    document.getElementById('btnGravity').classList.toggle('active', gravityInverted);
                    showModeIndicator(gravityInverted ? 'GRAVITÉ INVERSÉE' : 'GRAVITÉ NORMALE');
                });

                document.getElementById('btnAttract').addEventListener('click', () => {
                    attractMode = !attractMode;
                    document.getElementById('btnAttract').classList.toggle('active', attractMode);
                    showModeIndicator(attractMode ? 'MODE ATTRACTION' : 'MODE NORMAL');
                });

                document.getElementById('btnTimeWarp').addEventListener('click', () => {
                    timeWarp = !timeWarp;
                    document.getElementById('btnTimeWarp').classList.toggle('active', timeWarp);
                    showModeIndicator(timeWarp ? 'RALENTI TEMPOREL' : 'TEMPS NORMAL');
                });

                document.getElementById('btnRadar').addEventListener('click', () => {
                    radarVisible = !radarVisible;
                    document.getElementById('radarContainer').classList.toggle('visible', radarVisible);
                    document.getElementById('btnRadar').classList.toggle('active', radarVisible);
                });

                document.getElementById('btnAudio').addEventListener('click', toggleAudio);
                document.getElementById('btnClear').addEventListener('click', clearAllObjects);

                // Volume slider
                document.getElementById('volumeSlider').addEventListener('input', (e) => {
                    const value = e.target.value / 100;
                    audioEngine.setVolume(value);
                    document.getElementById('volumeValue').textContent = e.target.value + '%';
                });

                function toggleAudio() {
                    audioPlaying = audioEngine.toggle();
                    document.getElementById('btnAudio').classList.toggle('active', audioPlaying);
                    document.getElementById('volumeControl').classList.toggle('visible', audioPlaying);
                    document.getElementById('audioVisualizer').classList.toggle('playing', audioPlaying);

                    showModeIndicator(audioPlaying ? 'AUDIO ACTIVÉ' : 'AUDIO DÉSACTIVÉ');
                    console.log('Audio playing:', audioPlaying);

                }

                function clearAllObjects() {
                    bodies.forEach(b => {
                        scene.remove(b.mesh);
                        world.removeRigidBody(b.body);
                    });
                    bodies.length = 0;
                    updateObjectCounter();
                    showModeIndicator('TOUT EFFACÉ');
                }

                // Navigation
                document.querySelectorAll('.indicator-dot').forEach(dot => {
                    dot.addEventListener('click', () => {
                        const section = parseInt(dot.dataset.section);
                        const targetScroll = section * (document.body.scrollHeight - window.innerHeight) / (totalSections - 1);
                        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    });
                });

                // ANIMATION LOOP
                let time = 0;
                function animate() {
                    const dt = timeWarp ? 0.004 : 0.016;
                    time += dt;

                    world.step();

                    if (attractMode) {
                        const attractPoint = new THREE.Vector3(
                            (mouseX / window.innerWidth) * 2 - 1,
                            0,
                            -(mouseY / window.innerHeight) * 2 + 1
                        ).multiplyScalar(10);

                        bodies.forEach(b => {
                            const pos = b.body.translation();
                            b.body.applyImpulse({
                                x: (attractPoint.x - pos.x) * 0.5,
                                y: 0,
                                z: (attractPoint.z - pos.z) * 0.5
                            }, true);
                        });
                    }

                    bodies.forEach((b, index) => {
                        const p = b.body.translation();
                        const r = b.body.rotation();
                        b.mesh.position.set(p.x, p.y, p.z);
                        b.mesh.quaternion.set(r.x, r.y, r.z, r.w);

                        // Animations par type
                        if (b.type === 0) b.mesh.children.forEach((c, i) => { if (c.material) c.material.opacity = 0.6 + Math.sin(time * 5 + i) * 0.3; });
                        if (b.type === 1) b.mesh.scale.setScalar(1 + Math.sin(time * 2) * 0.15);
                        if (b.type === 2) b.mesh.children.forEach((c, i) => { if (i > 0) c.rotation.z = time * (2 + i * 0.5); });
                        if (b.type === 3) b.mesh.rotation.y = time * 0.5;
                        if (b.type === 4 && b.mesh.children[1]) { b.mesh.children[1].rotation.y = time * 2; }
                        if (b.type === 6) { b.mesh.children.forEach((c, i) => { if (i > 0 && i < 9) c.rotation.x = Math.sin(time * 3 + i) * 0.2; }); b.mesh.position.y += Math.sin(time * 2 + index) * 0.008; }
                        if (b.type === 7) b.mesh.rotation.y = time * 0.5;
                        if (b.type === 8) { b.mesh.rotation.y = time * 3; b.mesh.rotation.x = Math.sin(time) * 0.5; }
                        if (b.type === 9 && Math.random() < 0.03) b.mesh.children.forEach(c => { c.position.x += (Math.random() - 0.5) * 0.15; });
                        if (b.type === 10) { if (b.mesh.children[1]) b.mesh.children[1].rotation.z = time * 2; if (b.mesh.children[2]) b.mesh.children[2].scale.setScalar(1 + Math.sin(time * 3) * 0.2); }

                        if (p.y < -30 || p.y > 50) {
                            scene.remove(b.mesh);
                            world.removeRigidBody(b.body);
                            bodies.splice(index, 1);
                            updateObjectCounter();
                        }
                    });

                    starField.rotation.y = time * 0.015;
                    nebula.rotation.y = time * 0.008;
                    rings.forEach((ring, i) => { ring.rotation.z = time * (0.08 + i * 0.03); });

                    if (currentSection === 9) {
                        gridGroup.position.x = Math.sin(time * 20) * 0.2;
                        gridGroup.position.z = Math.cos(time * 15) * 0.2;
                    } else {
                        gridGroup.position.x *= 0.9;
                        gridGroup.position.z *= 0.9;
                    }

                    // Mise à jour radar
                    if (radarVisible) {
                        radar.update(bodies, Date.now());
                        radar.draw();
                    }

                    // Mise à jour visualiseur audio
                    if (audioPlaying) {
                        audioEngine.updateVisualizer();
                    }

                    camera.lookAt(0, 3, 0);
                    renderer.render(scene, camera);
                    requestAnimationFrame(animate);
                }
                animate();

                window.addEventListener('resize', () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                });

                updateUI();
                updateGridColor();

            } catch (error) {
                console.error("Erreur:", error);
            }
        }

        init();
