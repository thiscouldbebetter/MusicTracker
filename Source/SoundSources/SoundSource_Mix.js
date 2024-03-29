"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_Mix extends MusicTracker.SoundSourceChild {
            constructor(children) {
                super(MusicTracker.SoundSourceType.Instances().Mix.name);
                this.children = children;
                this.childIndexSelected = 0;
            }
            childSelected() {
                return this.children[this.childIndexSelected];
            }
            // samples
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var returnValue = 0;
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    var sampleFromChild = child.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
                    returnValue += sampleFromChild;
                }
                if (returnValue < -1) {
                    returnValue = -1;
                }
                else if (returnValue > 1) {
                    returnValue = 1;
                }
                return returnValue;
            }
            // ui
            uiClear() {
                delete this.divSoundSource;
                delete this.selectChild;
                for (var i = 0; i < this.children.length; i++) {
                    var children = this.children[i];
                    children.uiClear();
                }
            }
            uiUpdate() {
                var d = document;
                if (this.divSoundSource == null) {
                    var soundSource = this;
                    this.divSoundSource = d.createElement("div");
                    var labelChild = d.createElement("label");
                    labelChild.innerText = "Child:";
                    this.divSoundSource.appendChild(labelChild);
                    var selectChild = d.createElement("select");
                    for (var i = 0; i < this.children.length; i++) {
                        // var child = this.children[i];
                        var childAsOption = d.createElement("option");
                        childAsOption.value = "" + i;
                        selectChild.appendChild(childAsOption);
                    }
                    selectChild.onchange = (selectChildChangedEvent) => {
                        var child = this.childSelected();
                        var divChild = d.createElement("div");
                        this.divSoundSource.appendChild(divChild);
                        this.divChild = divChild;
                        var childAsDiv = child.uiUpdate();
                        this.divChild.appendChild(childAsDiv);
                    };
                    this.divSoundSource.appendChild(selectChild);
                    this.selectChild = selectChild;
                    var buttonChildAdd = d.createElement("button");
                    buttonChildAdd.innerText = "New";
                    buttonChildAdd.onclick = () => {
                        var child = new MusicTracker.SoundSource(new MusicTracker.SoundSource_Scale(1, // volumeAsFraction
                        new MusicTracker.SoundSource(new MusicTracker.SoundSource_Silence())));
                        var childIndex = soundSource.children.length;
                        soundSource.childIndexSelected = childIndex;
                        soundSource.children.push(child);
                        var childAsOption = d.createElement("option");
                        childAsOption.innerText = "" + childIndex;
                        selectChild.appendChild(childAsOption);
                        soundSource.uiUpdate();
                    };
                    this.divSoundSource.appendChild(buttonChildAdd);
                    var divChild = d.createElement("div");
                    this.divSoundSource.appendChild(divChild);
                    this.divChild = divChild;
                }
                else {
                    var childSelected = this.childSelected();
                    if (childSelected != null) {
                        this.selectChild.value = childSelected.child.typeName;
                        childSelected.uiUpdate();
                    }
                }
                return this.divSoundSource;
            }
        }
        MusicTracker.SoundSource_Mix = SoundSource_Mix;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
