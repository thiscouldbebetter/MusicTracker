"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class ModFile {
            constructor(name, title, instruments, sequenceIndicesToPlayInOrder, sequences) {
                this.name = name;
                this.title = title;
                this.instruments = instruments;
                this.sequenceIndicesToPlayInOrder = sequenceIndicesToPlayInOrder;
                this.sequences = sequences;
            }
            static fromBytes(name, bytes) {
                // Based on descriptions of the MOD file format found at the URLs:
                // "https://www.aes.id.au/modformat.html"
                // and
                // "https://www.ocf.berkeley.edu/~eek/index.html/tiny_examples/ptmod/ap12.html".
                var reader = ByteStream.fromBytes(bytes);
                var converter = new ByteConverter();
                var titleRaw = converter.bytesToString(reader.readBytes(20));
                var title = MusicTracker.StringHelper.replaceAll(titleRaw, "\0", "").trim();
                var instruments = [];
                var numberOfInstruments = 31; // Or maybe 15?
                for (var i = 0; i < numberOfInstruments; i++) {
                    var instrumentNameRaw = MusicTracker.StringHelper.replaceAll(converter.bytesToString(reader.readBytes(22)), "\0", "");
                    var instrumentName = instrumentNameRaw.trim().split(".").join("_");
                    // In "words". 2 bytes/word
                    var numberOfSamplesInInstrumentPlusOne = converter.bytesToIntegerSignedBE(reader.readBytes(2));
                    var pitchShiftInSixteenthTones = reader.readByte(); // -8 to 7.
                    if (pitchShiftInSixteenthTones >= 8) {
                        // todo - Two's complement.
                    }
                    var volume = reader.readByte(); // 0 to 64.
                    var repeatOffsetInWords = converter.bytesToIntegerSignedBE(reader.readBytes(2));
                    var repeatLengthInWords = converter.bytesToIntegerSignedBE(reader.readBytes(2));
                    var instrument = new ModFileInstrument(instrumentName, numberOfSamplesInInstrumentPlusOne, pitchShiftInSixteenthTones, volume, repeatOffsetInWords, repeatLengthInWords);
                    instruments.push(instrument);
                }
                var numberOfSequencesToPlay = reader.readByte(); // 1 to 128.
                reader.readByte(); // reserved - Should be 127.
                var sequenceIndicesToPlay = reader.readBytes(128); // Each 0 - 63.
                sequenceIndicesToPlay.length = numberOfSequencesToPlay;
                var sequenceIndexHighestSoFar = -1;
                for (var i = 0; i < sequenceIndicesToPlay.length; i++) {
                    var sequenceIndex = sequenceIndicesToPlay[i];
                    if (sequenceIndex > sequenceIndexHighestSoFar) {
                        sequenceIndexHighestSoFar = sequenceIndex;
                    }
                }
                var numberOfSequenceDefns = sequenceIndexHighestSoFar + 1;
                var signatureOrSequenceDefnsStart = converter.bytesToString(reader.readBytes(4));
                var signatureFor32InstrumentMode = "M.K."; // "Mahoney and Kaktus"
                if (signatureOrSequenceDefnsStart == signatureFor32InstrumentMode) {
                    // Someone hacked the format to support 32 instruments, not 16.
                }
                else {
                    // It wasn't a signature, it was the start of sequence definitions.
                    // Back up 4 bytes.
                    reader.byteIndexCurrent -= 4;
                }
                var samplesPerSequence = 64; // Or "divisions".
                var numberOfChannels = 4; // 1 and 4 on left, 2 and 3 on right.
                var bytesPerSamplePerChannel = 4;
                var sequences = [];
                for (var s = 0; s < numberOfSequenceDefns; s++) {
                    var divisionCellsForChannels = [];
                    for (var c = 0; c < numberOfChannels; c++) {
                        divisionCellsForChannels[c] = [];
                    }
                    for (var d = 0; d < samplesPerSequence; d++) {
                        for (var c = 0; c < numberOfChannels; c++) {
                            var bytesForSampleAndChannel = reader.readBytes(bytesPerSamplePerChannel);
                            var instrumentIndex = ((bytesForSampleAndChannel[0] & 0xF0)
                                | ((bytesForSampleAndChannel[2] >> 4) & 0xF));
                            var pitchCode = // Or sometimes effect parameter?
                             (((bytesForSampleAndChannel[0] & 0xF) << 8)
                                | bytesForSampleAndChannel[1]);
                            var effectDefnID = bytesForSampleAndChannel[2] & 0xF;
                            var effectArgsAsByte = bytesForSampleAndChannel[3];
                            var effectAsNumber = (effectDefnID << 8) | effectArgsAsByte;
                            var effect = null;
                            if (effectAsNumber != 0) {
                                var effectArg0 = effectArgsAsByte >> 4;
                                var effectArg1 = effectArgsAsByte & 0xF;
                                effect = new ModFileEffect(effectDefnID, effectArg0, effectArg1);
                            }
                            var cell = new ModFileDivisionCell(instrumentIndex, pitchCode, effect);
                            divisionCellsForChannels[c].push(cell);
                        } // end for c
                    } // end for d
                    var sequence = new ModFileSequence(divisionCellsForChannels);
                    sequences.push(sequence);
                } // end for s
                for (var i = 0; i < instruments.length; i++) {
                    var instrument = instruments[i];
                    if (instrument.name == "_") {
                        instrument.name = "_" + i;
                    }
                    var numberOfSamplesPlusOne = instrument.numberOfSamplesPlusOne;
                    instrument.samples = reader.readBytes(numberOfSamplesPlusOne * 2);
                }
                var returnValue = new ModFile(name, title, instruments, sequenceIndicesToPlay, sequences);
                return returnValue;
            } // end function
            static pitchNameForPitchCode(pitchCodeToFind) {
                var returnValue = null;
                var lookup = ModFile.pitchCodesByName;
                for (var keyValuePair of lookup) {
                    var pitchCode = keyValuePair[1];
                    if (pitchCode <= pitchCodeToFind) {
                        returnValue = keyValuePair[0];
                        break;
                    }
                }
                if (returnValue == null) {
                    throw "Unrecognized pitch code.";
                }
                return returnValue;
            }
        } // end class ModFile
        ModFile.SamplesPerSecond = 8287;
        ModFile.BitsPerSample = 16;
        ModFile.pitchCodesByName = new Map([
            // Pitch codes:
            // From https://www.ocf.berkeley.edu/~eek/index.html/tiny_examples/ptmod/ap12.html:
            // "Periodtable for Tuning 0, Normal
            // This is counterintuitive: The "octave" number goes up as the frequency decresases?
            ["C_1", 856],
            ["C#1", 808],
            ["D_1", 762],
            ["D#1", 720],
            ["E_1", 678],
            ["F_1", 640],
            ["F#1", 604],
            ["G_1", 570],
            ["G#1", 538],
            ["A_1", 508],
            ["A#1", 480],
            ["B_1", 453],
            ["C_2", 428],
            ["C#2", 404],
            ["D_2", 381],
            ["D#2", 360],
            ["E_2", 339],
            ["F_2", 320],
            ["F#2", 302],
            ["G_2", 285],
            ["G#2", 269],
            ["A_2", 254],
            ["A#2", 240],
            ["B_2", 226],
            ["C_3", 214],
            ["C#3", 202],
            ["D_3", 190],
            ["D#3", 180],
            ["E_3", 170],
            ["F_3", 160],
            ["F#3", 151],
            ["G_3", 143],
            ["G#3", 135],
            ["A_3", 127],
            ["A#3", 120],
            ["B_3", 113],
            // Not given in the document mentioned in the above comment.
            // Extrapolated, and rounded up.
            ["C_4", 107],
            ["C#4", 101],
            ["D_4", 95],
            ["D#4", 90],
            ["E_4", 85],
            ["F_4", 80],
            ["F#4", 75.5],
            ["G_4", 71.5],
            ["G#4", 67.5],
            ["A_4", 63.5],
            ["A#4", 60],
            ["B_4", 56.5],
            ["C_5", 54],
            ["C#5", 51],
            ["D_5", 48],
            ["D#5", 45],
            ["E_5", 43],
            ["F_5", 40],
            ["F#5", 38],
            ["G_5", 36],
            ["G#5", 34],
            ["A_5", 32],
            ["A#5", 30],
            ["B_5", 29],
            ["C_6", 0], // hack - todo - Perhaps this pitch code is used for effects?
        ]);
        MusicTracker.ModFile = ModFile;
        class ModFileDivisionCell {
            constructor(instrumentIndex, pitchCode, effect) {
                this.instrumentIndex = instrumentIndex;
                this.pitchCode = pitchCode;
                this.effect = effect;
            }
            toString() {
                var returnValue = (this.instrumentIndex
                    + "-" + this.pitchCode
                    + "-" + this.effect.toString());
                return returnValue;
            }
        }
        MusicTracker.ModFileDivisionCell = ModFileDivisionCell;
        class ModFileEffect {
            constructor(defnID, arg0, arg1) {
                this.defnID = defnID;
                this.arg0 = arg0;
                this.arg1 = arg1;
            }
            // Effect Defn IDs
            // 0 - Arpeggio
            // 1 - Slide Up
            // 2 - Slide Down
            // 3 - Slide to Note
            // 4 - Vibrato
            // 5 - Continue Slide to Note with Volume Slide
            // 6 - Continue Vibrato with Volume Slide
            // 7 - Tremolo
            // 8 - Set Panning Position
            // 9 - Set Sample Offset
            // A - Volume Slide
            // B - Position Jump
            // C - Set Volume
            // D - Pattern Break
            // E - Extended
            // 1 - Fineslide Up
            // 2 - Fineslide Down
            // 3 - Toggle Glissando
            // 4 - Set Vibrato Waveform
            // 5 - Set Finetune Value
            // 6 - Loop Pattern
            // 7 - Set Tremolo Waveform
            // 8 - Reserved
            // 9 - Retrigger Sample
            // A - Fine Volume Slide Up
            // B - Fine Volume Slide Down
            // C - Cut Sample
            // D - Delay Sample
            // E - Delay Pattern
            // F - Invert Loop
            // F - Set Speed
            toString() {
                var returnValue = (this.defnID
                    + "-" + this.arg0
                    + "-" + this.arg1);
                return returnValue;
            }
        }
        MusicTracker.ModFileEffect = ModFileEffect;
        class ModFileInstrument {
            constructor(name, numberOfSamplesPlusOne, pitchShiftInSixteenthTones, volume, repeatOffsetInWords, repeatLengthInWords) {
                this.name = name;
                this.numberOfSamplesPlusOne = numberOfSamplesPlusOne;
                this.pitchShiftInSixteenthTones = pitchShiftInSixteenthTones;
                this.volume = volume;
                this.repeatOffsetInWords = repeatOffsetInWords;
                this.repeatLengthInWords = repeatLengthInWords;
                this.samples = null;
            }
        }
        MusicTracker.ModFileInstrument = ModFileInstrument;
        class ModFileSequence {
            constructor(divisionCellsForChannels) {
                this.divisionCellsForChannels = divisionCellsForChannels;
            }
        }
        MusicTracker.ModFileSequence = ModFileSequence;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
