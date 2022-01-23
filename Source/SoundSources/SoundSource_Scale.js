"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Scale extends MusicTracker.SoundSourceChild {
            constructor(amplitudeMultiplier, child) {
                super(MusicTracker.SoundSourceType.Instances().Scale.name);
                this.amplitudeMultiplier = amplitudeMultiplier;
                this.child = child;
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var sampleFromChild = this.child.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
                var returnValue = this.amplitudeMultiplier * sampleFromChild;
                return returnValue;
            }
            // ui
            uiClear() {
                delete this.divSoundSource;
                delete this.inputAmplitudeMultiplier;
                this.child.uiClear();
            }
            uiUpdate() {
                var d = document;
                if (this.divSoundSource == null) {
                    this.divSoundSource = d.createElement("div");
                    var labelAmplitudeMultiplier = d.createElement("label");
                    labelAmplitudeMultiplier.innerText = "Amplitude Multiplier:";
                    this.divSoundSource.appendChild(labelAmplitudeMultiplier);
                    var inputAmplitudeMultiplier = d.createElement("input");
                    inputAmplitudeMultiplier.type = "number";
                    inputAmplitudeMultiplier.style.width = "64px";
                    this.divSoundSource.appendChild(inputAmplitudeMultiplier);
                    this.inputAmplitudeMultiplier = inputAmplitudeMultiplier;
                    this.divSoundSource.appendChild(d.createElement("br"));
                    var labelChild = d.createElement("label");
                    labelChild.innerText = "Child:";
                    this.divSoundSource.appendChild(labelChild);
                    var divChild = d.createElement("div");
                    this.divSoundSource.appendChild(divChild);
                    this.divChild = divChild;
                    var childAsDiv = this.child.uiUpdate();
                    this.divChild.appendChild(childAsDiv);
                }
                else {
                    this.inputAmplitudeMultiplier.value = this.amplitudeMultiplier;
                    this.child.uiUpdate();
                }
                return this.divSoundSource;
            }
        }
        MusicTracker.SoundSource_Scale = SoundSource_Scale;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
