"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSource_WavFile extends MusicTracker.SoundSourceChild {
            constructor(pitchBaseCode, wavFile) {
                super(MusicTracker.SoundSourceType.Instances().WavFile.name);
                this.pitchBaseCode = pitchBaseCode;
                this.wavFile = wavFile;
                this._frequencyBase = null;
            }
            frequencyBase() {
                if (this._frequencyBase == null) {
                    var note = MusicTracker.Note.fromString(this.pitchBaseCode + "-00-0000", null);
                    this._frequencyBase = note.frequencyInHertz();
                }
                return this._frequencyBase;
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                var samplesPerSecond = this.samplesPerSecond();
                var sampleIndex = Math.floor(timeInSeconds
                    * frequencyInHertz
                    / this.frequencyBase()
                    * samplesPerSecond);
                var samples = this.samplesNormalized();
                var returnValue = (sampleIndex >= samples.length ? 0 : samples[sampleIndex]);
                return returnValue;
            }
            samplesNormalized() {
                if (this._samplesNormalized == null) {
                    if (this.wavFile != null) {
                        var samplingInfo = this.wavFile.samplingInfo;
                        this._samplesNormalized =
                            samplingInfo.samplesNormalize(this.wavFile.samplesForChannels[0]);
                    }
                }
                return this._samplesNormalized;
            }
            samplesPerSecond() {
                if (this._samplesPerSecond == null) {
                    if (this.wavFile != null) {
                        this._samplesPerSecond =
                            this.wavFile.samplingInfo.samplesPerSecond;
                    }
                }
                return this._samplesPerSecond;
            }
            // Serialization.
            compressForSerialization() {
                //var wavFile = this.wavFile;
                this._samplesNormalized = null;
                /*
                var samples = wavFile.samplesForChannels;
                var bitsPerSample = wavFile.samplingInfo.bitsPerSample;
        
                var samplesAsBytes = [];
        
                if (bitsPerSample == 8)
                {
                    samplesAsBytes = samples;
                }
                else if (bitsPerSample == 16)
                {
                    samples.forEach
                    (
                        sample =>
                        {
                            samplesAsBytes.push( (sample >> 8) && 0xFF );
                            samplesAsBytes.push(sample && 0xFF);
                        }
                    )
                }
                else
                {
                    throw new Error("WAV sampling rates greater than 16 not yet supported!");
                }
        
                var samplesAsBinaryString = samplesAsBytes.map(x => String.fromCharCode(x) ).join("");
        
                var samplesAsBase64 = btoa(samplesAsBinaryString);
                */
            }
            decompressAfterDeserialization() {
                // todo
            }
            // UI.
            uiClear() {
                delete this.divSoundSource;
            }
            uiUpdate() {
                var d = document;
                var soundSource = this;
                if (this.divSoundSource == null) {
                    this.divSoundSource = d.createElement("div");
                    var inputWavFile = d.createElement("input");
                    inputWavFile.type = "file";
                    inputWavFile.onchange = (event) => {
                        var inputWavFile = event.target;
                        var file = inputWavFile.files[0];
                        if (file != null) {
                            MusicTracker.FileHelper.loadFileAsBytes(file, (file, fileAsBytes) => {
                                soundSource.wavFile =
                                    MusicTracker.WavFile.fromBytes(file.name, fileAsBytes);
                            });
                        }
                    };
                    this.divSoundSource.appendChild(inputWavFile);
                    var labelPitchBase = d.createElement("label");
                    labelPitchBase.innerHTML = "Pitch:";
                    this.divSoundSource.appendChild(labelPitchBase);
                    var inputPitchBase = d.createElement("input");
                    inputPitchBase.onchange = (event) => {
                        soundSource.pitchBaseCode = event.target.value;
                        soundSource._frequencyBase = null;
                    };
                    inputPitchBase.value = this.pitchBaseCode;
                    this.divSoundSource.appendChild(inputPitchBase);
                    var buttonPlay = d.createElement("button");
                    buttonPlay.innerText = "Play";
                    buttonPlay.onclick = () => {
                        new MusicTracker.Sound("", soundSource.wavFile, null).play(null);
                    };
                    this.divSoundSource.appendChild(buttonPlay);
                }
                return this.divSoundSource;
            }
        }
        MusicTracker.SoundSource_WavFile = SoundSource_WavFile;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
