"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class Note {
            constructor(timeStartInTicks, octaveIndex, pitchCode, volumeAsPercentage, durationInTicks) {
                this.timeStartInTicks = timeStartInTicks;
                this.octaveIndex = octaveIndex;
                this.pitchCode = pitchCode;
                this.volumeAsPercentage = volumeAsPercentage;
                this.durationInTicks = durationInTicks;
            }
            static default() {
                return Note.fromString("C_4-25-0001", null);
            }
            clone() {
                return new Note(this.timeStartInTicks, this.octaveIndex, this.pitchCode, this.volumeAsPercentage, this.durationInTicks);
            }
            durationInTicksAdd(ticksToAdd) {
                this.durationInTicks += ticksToAdd;
                if (this.durationInTicks < 1) {
                    this.durationInTicks = 1;
                }
                return this;
            }
            durationInSamples(song, sequence) {
                var returnValue = this.durationInTicks
                    * song.samplesPerSecond
                    / sequence.ticksPerSecond;
                return returnValue;
            }
            frequencyInHertz() {
                var octave = this.octave();
                var frequencyBase = octave.frequencyInHertzOfC;
                var frequencyMultiplier = this.pitch().frequencyMultiplier;
                var frequency = frequencyBase * frequencyMultiplier;
                return frequency;
            }
            octave() {
                return MusicTracker.Octave.Instances()._All[this.octaveIndex];
            }
            octaveIndexAdd(octaveOffset) {
                return this.octaveIndexSet(this.octaveIndex + octaveOffset);
            }
            octaveIndexSet(value) {
                this.octaveIndex = value;
                if (this.octaveIndex < 0) {
                    this.octaveIndex = 0;
                }
                else if (this.octaveIndex >= MusicTracker.Octave.Instances()._All.length) {
                    this.octaveIndex = MusicTracker.Octave.Instances()._All.length - 1;
                }
                return this;
            }
            overwriteWith(other) {
                this.timeStartInTicks = other.timeStartInTicks;
                this.octaveIndex = other.octaveIndex;
                this.pitchCode = other.pitchCode;
                this.volumeAsPercentage = other.volumeAsPercentage;
                this.durationInTicks = other.durationInTicks;
                return this;
            }
            pitch() {
                return MusicTracker.Pitch.Instances().byCode(this.pitchCode);
            }
            pitchAdd(pitchOffset) {
                var pitches = MusicTracker.Pitch.Instances()._All;
                var pitchIndex = pitches.indexOf(this.pitch());
                pitchIndex += pitchOffset;
                if (pitchIndex < 0) {
                    if (this.octaveIndex <= 0) {
                        pitchIndex -= pitchOffset;
                    }
                    else {
                        this.octaveIndexAdd(-1);
                        pitchIndex = pitches.length - 1;
                    }
                }
                else if (pitchIndex >= pitches.length) {
                    if (this.octaveIndex >= MusicTracker.Octave.Instances()._All.length - 1) {
                        pitchIndex -= pitchOffset;
                    }
                    else {
                        this.octaveIndexAdd(1);
                        pitchIndex = 0;
                    }
                }
                this.pitchCode = pitches[pitchIndex].code;
                return this;
            }
            pitchCodeSet(value) {
                var pitch = MusicTracker.Pitch.Instances().byCode(value);
                if (pitch != null) {
                    this.pitchCode = pitch.code;
                }
                return this;
            }
            play(song, sequence, track) {
                var samples = this.toSamples(song, sequence, track, null);
                var wavFile = MusicTracker.Tracker.samplesToWavFile("", song.samplesPerSecond, song.bitsPerSample, samples);
                this.sound = SoundFromWavFile.fromWavFile(wavFile);
                var note = this;
                this.sound.playThenCallCallback(() => { note.sound = null; });
            }
            stop() {
                if (this.sound != null) {
                    this.sound.stop();
                    this.sound = null;
                }
            }
            timeStartInSamples(song, sequence) {
                var timeStartInSeconds = this.timeStartInSeconds(sequence);
                var returnValue = Math.round(timeStartInSeconds * song.samplesPerSecond);
                return returnValue;
            }
            timeStartInSeconds(sequence) {
                return this.timeStartInTicks / sequence.ticksPerSecond;
            }
            timeSubdivideByFactor(factor) {
                this.timeStartInTicks =
                    factor.clone().multiplyInteger(this.timeStartInTicks).toNumber();
                this.durationInTicks =
                    factor.clone().multiplyInteger(this.durationInTicks).toNumber();
                return this;
            }
            timeSubdivideByFactorIsPossible(factor) {
                var returnValue = (factor.clone().multiplyInteger(this.timeStartInTicks).isInteger()
                    && factor.clone().multiplyInteger(this.durationInTicks).isInteger());
                return returnValue;
            }
            volumeAsFraction() {
                return this.volumeAsPercentage / Note.VolumeAsPercentageMax;
            }
            volumeAsPercentageAdd(volumeOffset) {
                this.volumeAsPercentage += volumeOffset;
                if (this.volumeAsPercentage < 0) {
                    this.volumeAsPercentage = 0;
                }
                else if (this.volumeAsPercentage > Note.VolumeAsPercentageMax) {
                    this.volumeAsPercentage = Note.VolumeAsPercentageMax;
                }
                return this;
            }
            // samples
            toSamples(song, sequence, track, instrument) {
                var samplesPerSecond = song.samplesPerSecond;
                var durationInSamples = this.durationInSamples(song, sequence);
                var frequencyInHertz = this.frequencyInHertz();
                var volumeAsFraction = this.volumeAsFraction();
                volumeAsFraction *= song.volumeAsFraction;
                var instrument = track.instrument(song);
                var noteAsSamples = instrument.samplesForNote(samplesPerSecond, durationInSamples, frequencyInHertz, volumeAsFraction);
                //Tracker.samplesValidate(noteAsSamples);
                return noteAsSamples;
            }
            // strings
            static fromString(stringToParse, timeStartInTicks) {
                stringToParse = stringToParse.toUpperCase();
                var returnValue = null;
                var parts = stringToParse.split("-");
                if (parts.length != 3) {
                    returnValue = null;
                }
                else {
                    var pitchCodeAndOctaveIndex = parts[0];
                    var pitchCode = pitchCodeAndOctaveIndex.substr(0, 2);
                    var pitch = MusicTracker.Pitch.Instances().byCode(pitchCode);
                    if (pitch == null) {
                        returnValue = null;
                    }
                    else {
                        var octaveIndexAsString = pitchCodeAndOctaveIndex.substr(2);
                        var octaveIndex = parseInt(octaveIndexAsString);
                        var volumeAsPercentageAsString = parts[1];
                        var volumeAsPercentage = parseInt(volumeAsPercentageAsString);
                        var durationInTicksAsString = parts[2];
                        var durationInTicks = parseInt(durationInTicksAsString);
                        if (isNaN(octaveIndex)
                            || isNaN(volumeAsPercentage)
                            || isNaN(durationInTicks)) {
                            returnValue = null;
                        }
                        else {
                            returnValue = new Note(timeStartInTicks, octaveIndex, pitchCode, volumeAsPercentage, durationInTicks);
                        }
                    }
                }
                return returnValue;
            }
            toString() {
                var returnValue = this.pitchCode + this.octaveIndex + "-"
                    + MusicTracker.StringHelper.padStart("" + this.volumeAsPercentage, 2, "0") + "-"
                    + MusicTracker.StringHelper.padStart("" + this.durationInTicks, 4, "0");
                return returnValue;
            }
        }
        Note.Blank = "-----------"; // "pitch-volume-duration";
        Note.VolumeAsPercentageMax = 99; // Not technically a percentage.
        MusicTracker.Note = Note;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
