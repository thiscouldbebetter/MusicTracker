"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Noise extends MusicTracker.SoundSourceChild {
            constructor() {
                super(MusicTracker.SoundSourceType.Instances().Noise.name);
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
        MusicTracker.SoundSource_Noise = SoundSource_Noise;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
