"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class Tracker {
            constructor(songCurrent) {
                this.songCurrent = songCurrent;
            }
            static default() {
                var song = MusicTracker.Song.demoScale(null, null);
                var returnValue = new Tracker(song);
                return returnValue;
            }
            static Instance() {
                if (Tracker._instance == null) {
                    Tracker._instance = Tracker.default();
                }
                return Tracker._instance;
            }
            static samplesToWavFile(fileName, samplesPerSecond, bitsPerSample, samplesToConvert) {
                var samplingInfo = new MusicTracker.WavFileSamplingInfo(1, // formatCode
                1, // numberOfChannels
                samplesPerSecond, bitsPerSample, null // ?
                );
                var samplesForWavFile = samplingInfo.samplesDenormalize(samplesToConvert);
                var samplesAsWavFile = new MusicTracker.WavFile(fileName, samplingInfo, [samplesForWavFile] // samplesForChannels
                );
                return samplesAsWavFile;
            }
            static samplesValidate(samples) {
                for (var i = 0; i < samples.length; i++) {
                    if (isNaN(samples[i])) {
                        throw "Invalid sample.";
                    }
                }
            }
            // ui
            uiClear() {
                this.divTracker.parentElement.removeChild(this.divTracker);
                this.songCurrent.uiClear();
                delete this.divTracker;
            }
            uiUpdate() {
                if (this.divTracker == null) {
                    document.body.onkeydown = this.handleEventKeyDown.bind(this);
                    this.divTracker = document.createElement("div");
                    var divSong = this.songCurrent.uiUpdate();
                    this.divTracker.appendChild(divSong);
                    var divMain = document.getElementById("divMain");
                    divMain.appendChild(this.divTracker);
                    this.songCurrent.uiUpdate(); // hack
                }
                this.songCurrent.uiUpdate();
            }
            // events
            handleEventKeyDown(event) {
                var key = event.key;
                if (key == "F5"
                    || (event.ctrlKey && key == "F4")) {
                    var message = "Keyboard command partially disabled to prevent accidental"
                        + " loss of work.  Press key again to confirm.";
                    alert(message);
                    event.preventDefault();
                    return;
                }
                if (event.altKey == false) {
                    return;
                }
                event.preventDefault();
                var song = this.songCurrent;
                var sequence = song.sequenceSelected();
                var track = sequence.trackSelected();
                if (key.startsWith("Arrow")) {
                    if (key.endsWith("Left")) {
                        sequence.trackSelectNextInDirection(-1);
                    }
                    else if (key.endsWith("Right")) {
                        sequence.trackSelectNextInDirection(1);
                    }
                    else if (key.endsWith("Down")) {
                        sequence.tickSelectNextInDirection(1);
                    }
                    else if (key.endsWith("Up")) {
                        sequence.tickSelectNextInDirection(-1);
                    }
                }
                else if (key == "Backspace") {
                    sequence.noteAtTickCurrentSet(null);
                }
                else if (key == "Insert") {
                    sequence.tickInsertAtCursor();
                }
                else if (key == "Delete") {
                    sequence.tickRemoveAtCursor();
                }
                else if (key == "Enter") {
                    var notePrev = sequence.notePrecedingTickCurrent();
                    var noteToClone = (notePrev == null ? MusicTracker.Note.default() : notePrev);
                    var noteNew = noteToClone.clone();
                    sequence.noteAtTickCurrentSet(noteNew);
                }
                else if (key.length == 1 && key >= "a" && key <= "g") {
                    var pitchCode = key.toUpperCase() + "_";
                    var note = sequence.noteAtTickCurrent();
                    if (note == null) {
                        note = MusicTracker.Note.default();
                    }
                    sequence.noteAtTickCurrentSet(note.pitchCodeSet(pitchCode));
                }
                else if (key.length == 1 && key >= "A" && key <= "G") {
                    var pitchCode = key.toUpperCase() + "#";
                    if (pitchCode == "B#") {
                        pitchCode = "C";
                    }
                    else if (pitchCode == "E#") {
                        pitchCode = "F";
                    }
                    var note = sequence.noteAtTickCurrent();
                    if (note == null) {
                        note = MusicTracker.Note.default();
                    }
                    sequence.noteAtTickCurrentSet(note.pitchCodeSet(pitchCode));
                }
                else if (key.length == 1 && key >= "0" && key <= "9") {
                    var octaveIndex = parseInt(key);
                    var note = sequence.noteAtTickCurrent();
                    if (note == null) {
                        note = MusicTracker.Note.default();
                    }
                    sequence.noteAtTickCurrentSet(note.octaveIndexSet(octaveIndex));
                }
                else if (key == "-" || key == "_" || key == "=" || key == "+") {
                    var note = sequence.noteAtTickCurrent();
                    if (note != null) {
                        if (key == "-" || key == "=") {
                            var pitchOffset = (key == "-" ? -1 : 1);
                            sequence.noteAtTickCurrentSet(note.pitchAdd(pitchOffset));
                        }
                        else {
                            var octaveOffset = (key == "_" ? -1 : 1);
                            sequence.noteAtTickCurrentSet(note.octaveIndexAdd(octaveOffset));
                        }
                    }
                }
                else if (key == "[" || key == "{" || key == "]" || key == "}") // volume
                 {
                    var note = sequence.noteAtTickCurrent();
                    if (note != null) {
                        var volumeOffset = ((key == "[" || key == "{") ? -1 : 1);
                        volumeOffset *= (key == "[" || key == "]" ? 1 : 10);
                        sequence.noteAtTickCurrentSet(note.volumeAsPercentageAdd(volumeOffset));
                    }
                }
                else if (key == "," || key == ".") // duration
                 {
                    var note = sequence.noteAtTickCurrent();
                    if (note != null) {
                        var ticksOffset = (key == "," ? -1 : 1);
                        sequence.noteAtTickCurrentSet(note.durationInTicksAdd(ticksOffset));
                    }
                }
                else if (key == "<" || key == ">") // shift start time
                 {
                    var note = sequence.noteAtTickCurrent();
                    if (note != null) {
                        var ticksOffset = (key == "<" ? -1 : 1);
                        sequence.noteAtTickCurrentTimeStartInTicksAdd(ticksOffset);
                    }
                }
                else if (key.toLowerCase() == "n") {
                    sequence.noteAtTickCurrent().play(song, sequence, track);
                }
                else if (key.toLowerCase() == "t") {
                    track.playOrStop(song, sequence);
                }
                else if (key.toLowerCase() == "s") {
                    sequence.playOrStop(song);
                }
                else if (key.toLowerCase() == "p") {
                    song.playOrStop();
                }
                sequence.uiUpdate_TickCursorPositionFromSelected(null);
                sequence.uiUpdate_Tracks(song);
            }
        }
        MusicTracker.Tracker = Tracker;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
