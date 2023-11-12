"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSourceChild {
            constructor(typeName) {
                this.typeName = typeName;
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                throw new Error("Must be implemented in subclass!");
            }
            // Serialization.
            compressForSerialization() {
                // By default, do nothing.
            }
            decompressAfterDeserialization() {
                // By default, do nothing.
            }
            // UI.
            uiClear() { }
            uiUpdate() {
                throw new Error("Must be implemented in subclass!");
            }
        }
        MusicTracker.SoundSourceChild = SoundSourceChild;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
