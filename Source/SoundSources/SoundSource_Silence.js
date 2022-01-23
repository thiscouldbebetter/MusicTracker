"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Silence extends MusicTracker.SoundSourceChild {
            constructor() {
                super(MusicTracker.SoundSourceType.Instances().Silence.name);
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
        MusicTracker.SoundSource_Silence = SoundSource_Silence;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
