// Web Audio procedural sound engine for zero-dependency ambient audio and chimes

class SoundEngine {
  private ctx: AudioContext | null = null;
  private nodes: Partial<
    Record<
      string,
      {
        source: AudioNode;
        gain: GainNode;
        stop?: () => void;
      }
    >
  > = {};

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a pleasant, soothing crystal chime when focus timer finishes
  public playCelebrationChime(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // 3 harmonic bells (E5, G#5, B5 - peaceful major triad)
      const freqs = [659.25, 830.61, 987.77, 1318.51];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.6);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Play gentle tick or click
  public playClick(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore click audio error
    }
  }

  // Procedural Noise Generator (Rain, White Noise, Forest)
  public startAmbientSound(id: string, volume: number = 0.5): void {
    try {
      const ctx = this.getContext();
      this.stopAmbientSound(id);

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

      if (id === 'rain') {
        // Pink-noise based rain with low-pass filter
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        whiteNoise.start(0);

        this.nodes[id] = {
          source: whiteNoise,
          gain: masterGain,
          stop: () => {
            try {
              whiteNoise.stop();
              whiteNoise.disconnect();
            } catch {}
          },
        };
      } else if (id === 'whitenoise') {
        // Smooth brown/grey noise for high-concentration masking
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 1.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        noise.start(0);

        this.nodes[id] = {
          source: noise,
          gain: masterGain,
          stop: () => {
            try {
              noise.stop();
              noise.disconnect();
            } catch {}
          },
        };
      } else if (id === 'lofi') {
        // Binaural 432 Hz theta harmonic drone for deep flow state
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime); // sub-octave of 432Hz

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(220, ctx.currentTime); // 4Hz delta/theta beat

        const subOsc = ctx.createOscillator();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(108, ctx.currentTime);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc1.connect(masterGain);
        osc2.connect(masterGain);
        subOsc.connect(subGain);
        subGain.connect(masterGain);

        masterGain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        subOsc.start();

        this.nodes[id] = {
          source: osc1,
          gain: masterGain,
          stop: () => {
            try {
              osc1.stop();
              osc2.stop();
              subOsc.stop();
              osc1.disconnect();
              osc2.disconnect();
              subOsc.disconnect();
            } catch {}
          },
        };
      } else if (id === 'forest') {
        // Gentle rustling wind with warm resonance
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.03 * white) / 1.03;
          lastOut = output[i];
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);

        source.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        source.start(0);

        this.nodes[id] = {
          source,
          gain: masterGain,
          stop: () => {
            try {
              source.stop();
              source.disconnect();
            } catch {}
          },
        };
      } else if (id === 'cafe') {
        // Cozy low-frequency warmth
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);

        source.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        source.start(0);

        this.nodes[id] = {
          source,
          gain: masterGain,
          stop: () => {
            try {
              source.stop();
              source.disconnect();
            } catch {}
          },
        };
      }
    } catch (e) {
      console.warn('Audio start error:', e);
    }
  }

  public setSoundVolume(id: string, volume: number): void {
    if (this.nodes[id] && this.ctx) {
      this.nodes[id]!.gain.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume * 0.4)),
        this.ctx.currentTime
      );
    }
  }

  public stopAmbientSound(id: string): void {
    if (this.nodes[id]) {
      this.nodes[id]!.stop?.();
      delete this.nodes[id];
    }
  }

  public stopAll(): void {
    Object.keys(this.nodes).forEach((id) => this.stopAmbientSound(id));
  }
}

export const soundEngine =
  typeof window !== 'undefined' ? new SoundEngine() : ({} as SoundEngine);
