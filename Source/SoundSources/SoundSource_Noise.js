"use strict";
class SoundSource_Noise extends SoundSourceChild {
    constructor() {
        super(SoundSourceType.Instances().Noise.name);
    }
    static default() {
        return new SoundSource_Noise();
    }
    sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
        return Math.random() * 2 - 1;
    }
    // ui
    uiClear() {
        delete this.divSoundSource;
    }
    uiUpdate() {
        var d = document;
        if (this.divSoundSource == null) {
            this.divSoundSource = d.createElement("div");
        }
        return this.divSoundSource;
    }
}
