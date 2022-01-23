"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Square extends MusicTracker.SoundSourceChild {
            constructor() {
                super(MusicTracker.SoundSourceType.Instances().Square.name);
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var secondsPerCycle = 1 / frequencyInHertz;
                var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
                var fractionOfCycleComplete = secondsSinceCycleStarted / secondsPerCycle;
                var sample = (fractionOfCycleComplete <= .5 ? 1 : -1);
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
        MusicTracker.SoundSource_Square = SoundSource_Square;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
