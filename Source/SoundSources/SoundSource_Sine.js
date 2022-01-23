"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Sine extends MusicTracker.SoundSourceChild {
            constructor() {
                super(MusicTracker.SoundSourceType.Instances().Sine.name);
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var secondsPerCycle = 1 / frequencyInHertz;
                var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
                var fractionOfCycleComplete = secondsSinceCycleStarted / secondsPerCycle;
                var radiansSinceCycleStarted = MusicTracker.SoundSource.RadiansPerCycle * fractionOfCycleComplete;
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
        MusicTracker.SoundSource_Sine = SoundSource_Sine;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
