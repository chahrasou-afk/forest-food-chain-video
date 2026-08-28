/* ============================================
   FOREST FOOD CHAIN VIDEO - SOUND EFFECTS
   ============================================ */

// Sound object to manage audio playback
const SoundManager = {
    // Web Audio API context
    audioContext: null,
    
    // Store for audio buffers
    sounds: {},
    
    // Volume control
    volume: 0.3,
    
    /**
     * Initialize audio context
     */
    init: function() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        this.createSynthSounds();
    },
    
    /**
     * Create synthesized forest sounds using Web Audio API
     * This allows sounds to work without external files
     */
    createSynthSounds: function() {
        // Forest ambient sound
        this.sounds['forest-ambient'] = {
            play: () => this.playForestAmbient()
        };
        
        // Bird chirping sound
        this.sounds['bird-chirp'] = {
            play: () => this.playBirdChirp()
        };
        
        // Soft eating sound
        this.sounds['soft-eating-sound'] = {
            play: () => this.playEatingSound()
        };
        
        // Hawk screech sound
        this.sounds['hawk-screech'] = {
            play: () => this.playHawkScreech()
        };
        
        // Leaf rustling sound
        this.sounds['leaf-rustle'] = {
            play: () => this.playLeafRustle()
        };
    },
    
    /**
     * Play forest ambient sound (nature, wind, subtle bird sounds)
     */
    playForestAmbient: function() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create multiple oscillators for natural ambient sound
        const oscillators = [];
        const frequencies = [49.5, 55, 61.74]; // Very low frequencies for ambient
        
        oscillators.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(this.volume * 0.1, now);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now);
            osc.stop(now + 3);
            
            oscillators.push(osc);
        });
        
        // Wind-like whooshing sound
        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 150;
        
        const windGain = ctx.createGain();
        windGain.gain.setValueAtTime(this.volume * 0.05, now);
        windGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
        
        const windNoise = ctx.createBufferSource();
        const noiseBuffer = this.createNoiseBuffer(ctx, ctx.sampleRate * 3);
        windNoise.buffer = noiseBuffer;
        
        windNoise.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(ctx.destination);
        
        windNoise.start(now);
        windNoise.stop(now + 3);
    },
    
    /**
     * Play bird chirping sound
     */
    playBirdChirp: function() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create bird chirp pattern
        const chirpPattern = [
            { freq: 2000, duration: 0.1, delay: 0 },
            { freq: 2500, duration: 0.08, delay: 0.12 },
            { freq: 2200, duration: 0.1, delay: 0.25 },
            { freq: 1800, duration: 0.12, delay: 0.4 }
        ];
        
        chirpPattern.forEach(chirp => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.value = chirp.freq;
            
            // Frequency sweep for natural bird sound
            osc.frequency.setValueAtTime(chirp.freq + 500, now + chirp.delay);
            osc.frequency.exponentialRampToValueAtTime(chirp.freq, now + chirp.delay + chirp.duration * 0.5);
            
            filter.type = 'highpass';
            filter.frequency.value = 1500;
            
            gain.gain.setValueAtTime(0, now + chirp.delay);
            gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + chirp.delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + chirp.delay + chirp.duration);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + chirp.delay);
            osc.stop(now + chirp.delay + chirp.duration);
        });
    },
    
    /**
     * Play eating/munching sound
     */
    playEatingSound: function() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create crunching pattern
        const crunchCount = 3;
        for (let i = 0; i < crunchCount; i++) {
            const delay = i * 0.15;
            
            // Create noise burst for crunch sound
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(this.volume * 0.3, now + delay);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
            
            const noiseBuf = this.createNoiseBuffer(ctx, ctx.sampleRate * 0.1);
            const noiseSrc = ctx.createBufferSource();
            noiseSrc.buffer = noiseBuf;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 4000 + (i * 500);
            
            noiseSrc.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            
            noiseSrc.start(now + delay);
            noiseSrc.stop(now + delay + 0.1);
        }
    },
    
    /**
     * Play hawk screech sound
     */
    playHawkScreech: function() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create harsh screech with frequency sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sawtooth'; // Harsh waveform
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.6);
        
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        filter.Q.value = 2;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.6);
    },
    
    /**
     * Play leaf rustling sound
     */
    playLeafRustle: function() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create rustling pattern with filtered noise
        const rustleGain = ctx.createGain();
        rustleGain.gain.setValueAtTime(this.volume * 0.25, now);
        rustleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 3;
        
        const noiseBuffer = this.createNoiseBuffer(ctx, ctx.sampleRate * 0.5);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        
        noiseSrc.connect(filter);
        filter.connect(rustleGain);
        rustleGain.connect(ctx.destination);
        
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.5);
    },
    
    /**
     * Create white noise buffer for synthesized sounds
     */
    createNoiseBuffer: function(ctx, length) {
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    },
    
    /**
     * Play a specific sound
     */
    play: function(soundName) {
        if (this.sounds[soundName] && this.sounds[soundName].play) {
            try {
                // Resume audio context if suspended
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                this.sounds[soundName].play();
            } catch (e) {
                console.log('Sound playback error:', e);
            }
        }
    }
};

/**
 * Initialize sound manager and expose playSound function globally
 */
function initializeSounds() {
    try {
        SoundManager.init();
        console.log('Sound Manager Initialized');
    } catch (e) {
        console.log('Audio API not available:', e);
    }
}

/**
 * Global function to play sounds
 */
function playSound(soundName) {
    if (SoundManager.audioContext) {
        SoundManager.play(soundName);
    }
}

/**
 * Set global volume
 */
function setVolume(level) {
    if (level >= 0 && level <= 1) {
        SoundManager.volume = level;
    }
}

/**
 * Get current volume
 */
function getVolume() {
    return SoundManager.volume;
}

console.log('Forest Food Chain Video - Sound Module Loaded');
