"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Clip extends MusicTracker.SoundSourceChild {
            constructor(startInSeconds, endInSeconds, child) {
                super(MusicTracker.SoundSourceType.Instances().Clip.name);
                this.startInSeconds = startInSeconds;
                this.endInSeconds = endInSeconds;
                this.child = child;
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var returnValue;
                if (timeInSeconds < this.startInSeconds || timeInSeconds > this.endInSeconds) {
                    returnValue = 0;
                }
                else {
                    returnValue = this.child.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
                }
                return returnValue;
            }
            // ui
            uiClear() {
                delete this.divSoundSource;
                delete this.inputStartInSeconds;
                delete this.inputEndInSeconds;
            }
            uiUpdate() {
                var d = document;
                if (this.divSoundSource == null) {
                    this.divSoundSource = d.createElement("div");
                    var labelStartInSeconds = d.createElement("label");
                    labelStartInSeconds.innerText = "Start in Seconds:";
                    this.divSoundSource.appendChild(labelStartInSeconds);
                    var inputStartInSeconds = d.createElement("input");
                    inputStartInSeconds.type = "number";
                    inputStartInSeconds.style.width = "64px";
                    this.divSoundSource.appendChild(inputStartInSeconds);
                    this.inputStartInSeconds = inputStartInSeconds;
                    var labelEndInSeconds = d.createElement("label");
                    labelEndInSeconds.innerText = "End in Seconds:";
                    this.divSoundSource.appendChild(labelEndInSeconds);
                    var inputEndInSeconds = d.createElement("input");
                    inputEndInSeconds.type = "number";
                    inputEndInSeconds.style.width = "64px";
                    this.divSoundSource.appendChild(inputEndInSeconds);
                    this.inputEndInSeconds = inputEndInSeconds;
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
                    this.inputStartInSeconds.value = this.startInSeconds;
                    this.inputEndInSeconds.value = this.endInSeconds;
                    this.child.uiUpdate();
                }
                return this.divSoundSource;
            }
        }
        MusicTracker.SoundSource_Clip = SoundSource_Clip;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
