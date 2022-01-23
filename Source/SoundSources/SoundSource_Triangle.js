"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Triangle extends MusicTracker.SoundSourceChild {
            constructor() {
                super(MusicTracker.SoundSourceType.Instances().Triangle.name);
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var secondsPerCycle = 1 / frequencyInHertz;
                var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
                var fractionOfCycleComplete = secondsSinceCycleStarted / secondsPerCycle;
                var sample;
                if (fractionOfCycleComplete <= .5) {
                    sample = fractionOfCycleComplete;
                }
                else {
                    sample = 1 - fractionOfCycleComplete;
                }
                sample = sample * 4 - 1;
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
        MusicTracker.SoundSource_Triangle = SoundSource_Triangle;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
