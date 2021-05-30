"use strict";
class SoundSource_Sine extends SoundSourceChild {
    constructor() {
        super(SoundSourceType.Instances().Sine.name);
    }
    sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
        var secondsPerCycle = 1 / frequencyInHertz;
        var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
        var fractionOfCycleComplete = secondsSinceCycleStarted / secondsPerCycle;
        var radiansSinceCycleStarted = SoundSource.RadiansPerCycle * fractionOfCycleComplete;
        var sample = Math.sin(radiansSinceCycleStarted);
        return sample;
    }
    // ui
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
