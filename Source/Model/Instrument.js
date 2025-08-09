"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class Instrument {
            constructor(name, soundSource) {
                this.name = name;
                this.soundSource = soundSource;
            }
            static default(name) {
                var returnValue = new Instrument(name, new MusicTracker.SoundSource(new MusicTracker.SoundSource_Sine()));
                return returnValue;
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var returnValue = this.soundSource.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
                return returnValue;
            }
            samplesForNote(samplesPerSecond, durationInSamples, frequencyInHertz, volumeAsFraction) {
                var noteAsSamples = [];
                for (var s = 0; s < durationInSamples; s++) {
                    var timeInSeconds = s / samplesPerSecond;
                    var sample = this.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
                    sample *= volumeAsFraction;
                    noteAsSamples.push(sample);
                }
                return noteAsSamples;
            }
            // File.
            saveToFile() {
                var instrument = this;
                var instrumentAsJSON = instrument.toStringJSON();
                instrument.uiUpdate();
                MusicTracker.FileHelper.saveTextAsFile(instrumentAsJSON, instrument.name + ".json");
            }
            // string
            static objectPrototypesSet(objectToSet) {
                Object.setPrototypeOf(objectToSet, Instrument.prototype);
                MusicTracker.SoundSource.objectPrototypesSet(objectToSet.soundSource);
            }
            static fromStringJSON(instrumentAsJSON) {
                var returnValue = JSON.parse(instrumentAsJSON);
                Instrument.objectPrototypesSet(returnValue);
                return returnValue;
            }
            toStringJSON() {
                var returnValue = JSON.stringify(this);
                return returnValue;
            }
            // ui
            uiClear() {
                if (this.divInstrument != null) {
                    var parentElement = this.divInstrument.parentElement;
                    if (parentElement != null) {
                        parentElement.removeChild(this.divInstrument);
                    }
                    delete this.divInstrument;
                    delete this.inputName;
                }
                this.soundSource.uiClear();
            }
            uiUpdate() {
                var instrument = this;
                var d = document;
                if (this.divInstrument == null) {
                    var divInstrument = d.createElement("div");
                    var labelName = d.createElement("label");
                    labelName.innerText = "Name:";
                    divInstrument.appendChild(labelName);
                    var inputName = d.createElement("input");
                    inputName.value = this.name;
                    inputName.onchange = (event) => {
                        var instrumentNameNew = event.target.value;
                        var tracker = MusicTracker.Tracker.Instance();
                        var song = tracker.songCurrent;
                        song.instrumentRename(instrument.name, instrumentNameNew);
                        tracker.uiClear();
                        tracker.uiUpdate();
                    };
                    divInstrument.appendChild(inputName);
                    this.inputName = inputName;
                    var buttonSave = d.createElement("button");
                    buttonSave.innerText = "Save";
                    buttonSave.onclick = this.saveToFile;
                    divInstrument.appendChild(buttonSave);
                    divInstrument.appendChild(d.createElement("br"));
                    var labelSoundSource = d.createElement("label");
                    labelSoundSource.innerText = "Sound Source:";
                    divInstrument.appendChild(labelSoundSource);
                    var divForSoundSource = this.soundSource.uiUpdate();
                    divInstrument.appendChild(divForSoundSource);
                    this.divInstrument = divInstrument;
                }
                this.inputName.value = this.name;
                this.soundSource.uiUpdate();
                return this.divInstrument;
            }
            // ModFile
            static fromModFileInstrument(instrumentFromModFile) {
                var returnValue = null;
                var samplesFromModFile = instrumentFromModFile.samples;
                if (samplesFromModFile != null) {
                    var bytesPerSample = 2;
                    var samplesForChannel = [];
                    for (var s = 0; s < samplesFromModFile.length; s += bytesPerSample) {
                        var sampleFromModFile = (samplesFromModFile[s] << 8)
                            | samplesFromModFile[s + 1];
                        var sampleConverted = sampleFromModFile; // todo
                        samplesForChannel.push(sampleConverted);
                    }
                    var samplesForChannels = [samplesForChannel];
                    var instrumentAsWavFile = new WavFile("", // filePath,
                    new WavFileSamplingInfo(1, // formatCode
                    1, // numberOfChannels
                    MusicTracker.ModFile.SamplesPerSecond, MusicTracker.ModFile.BitsPerSample, null // ?
                    ), samplesForChannels);
                    var soundSourceWavFile = new MusicTracker.SoundSource_WavFile("C_3", instrumentAsWavFile);
                    var soundSourceWrapper = new MusicTracker.SoundSource(soundSourceWavFile);
                    returnValue = new Instrument(instrumentFromModFile.name, soundSourceWrapper);
                }
                return returnValue;
            }
            // Serialization.
            compressForSerialization() {
                this.soundSource.compressForSerialization();
            }
        }
        MusicTracker.Instrument = Instrument;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
