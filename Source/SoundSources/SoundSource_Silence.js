"use strict";
class SoundSource_Silence extends SoundSourceChild {
    constructor() {
        super(SoundSourceType.Instances().Silence.name);
    }
    sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
        return 0;
    }
    uiClear() {
        delete this.divSoundSource;
    }
    uiUpdate() {
        if (this.divSoundSource == null) {
            this.divSoundSource = document.createElement("div");
        }
        return this.divSoundSource;
    }
}
