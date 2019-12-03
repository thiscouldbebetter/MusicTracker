
function Tracker(songCurrent)
{
	this.songCurrent = songCurrent;
	this.useKeyboardCommands = true;
}
{
	Tracker.new = function()
	{
		var song = Song.demo();
		var returnValue = new Tracker(song);
		return returnValue;
	}

	Tracker.Instance = Tracker.new();

	Tracker.samplesToWavFile = function(fileName, samplesPerSecond, bitsPerSample, samplesToConvert)
	{
		var samplingInfo = new WavFileSamplingInfo
		(
			1, // formatCode
			1, // numberOfChannels
			samplesPerSecond,
			bitsPerSample
		);

		var samplesForWavFile =
			samplingInfo.samplesDenormalize(samplesToConvert);

		var samplesAsWavFile = new WavFile
		(
			fileName,
			samplingInfo,
			[ samplesForWavFile ] // samplesForChannels
		);

		return samplesAsWavFile;
	}

	Tracker.samplesValidate = function(samples)
	{
		for (var i = 0; i < samples.length; i++)
		{
			if (isNaN(samples[i]))
			{
				throw "Invalid sample.";
			}
		}
	}

	// ui

	Tracker.prototype.uiClear = function()
	{
		this.divTracker.parentElement.removeChild(this.divTracker);
		this.songCurrent.uiClear();
		delete this.divTracker;
	}

	Tracker.prototype.uiUpdate = function()
	{
		if (this.divTracker == null)
		{
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

	Tracker.prototype.handleEventKeyDown = function(event)
	{
		if (this.useKeyboardCommands == false)
		{
			return;
		}

		event.preventDefault();

		var song = this.songCurrent;
		var sequence = song.sequenceSelected();
		var track = sequence.trackSelected();

		var key = event.key;
		if (key.startsWith("Arrow") == true)
		{
			if (key.endsWith("Left") == true)
			{
				sequence.trackSelectNextInDirection(-1);
			}
			else if (key.endsWith("Right") == true)
			{
				sequence.trackSelectNextInDirection(1);
			}
			else if (key.endsWith("Down") == true)
			{
				sequence.tickSelectNextInDirection(1);
			}
			else if (key.endsWith("Up") == true)
			{
				sequence.tickSelectNextInDirection(-1);
			}
		}
		else if (key == "Backspace")
		{
			sequence.noteAtTickCurrentSet(null);
		}
		else if (key == "Insert")
		{
			sequence.tickInsertAtCursor();
		}
		else if (key == "Delete")
		{
			sequence.tickRemoveAtCursor();
		}
		else if (key == "Enter")
		{
			var notePrev = sequence.notePrecedingTickCurrent();
			var noteToClone = (notePrev == null ? Note.default() : notePrev);
			var noteNew = noteToClone.clone();
			sequence.noteAtTickCurrentSet(noteNew);
		}
		else if (key.length == 1 && key >= "a" && key <= "g")
		{
			var pitchCode = key.toUpperCase() + "_";
			var note = sequence.noteAtTickCurrent();
			if (note == null)
			{
				note = Note.default();
			}
			sequence.noteAtTickCurrentSet(note.pitchCodeSet(pitchCode));
		}
		else if (key.length == 1 && key >= "A" && key <= "G")
		{
			var pitchCode = key.toUpperCase() + "#";
			if (pitchCode == "B#")
			{
				pitchCode = "C";
			}
			else if (pitchCode == "E#")
			{
				pitchCode = "F";
			} 
			var note = sequence.noteAtTickCurrent();
			if (note == null)
			{
				note = Note.default();
			}
			sequence.noteAtTickCurrentSet(note.pitchCodeSet(pitchCode));
		}
		else if ( key == "-" || key == "_" || key == "=" || key == "+" )
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				if (key == "-" || key == "=")
				{
					var pitchOffset = (key == "-" ? -1 : 1);
					sequence.noteAtTickCurrentSet(note.pitchAdd(pitchOffset));
				}
				else
				{
					var octaveOffset = (key == "_" ? -1 : 1);
					sequence.noteAtTickCurrentSet(note.octaveAdd(octaveOffset));
				}
			}
		}
		else if ( key == "[" || key == "{" || key == "]" || key == "}" ) // volume
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				var volumeOffset = ( (key == "[" || key == "{") ? -1 : 1);
				volumeOffset *= ( key == "[" || key == "]" ? 1 : 10);
				sequence.noteAtTickCurrentSet(note.volumeAsPercentageAdd(volumeOffset));
			}
		}
		else if (key == "," || key == ".") // duration
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				var ticksOffset = ( key == "," ? -1 : 1);
				sequence.noteAtTickCurrentSet(note.durationInTicksAdd(ticksOffset));
			}
		}
		else if (key == "<" || key == ">") // shift start time
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				var ticksOffset = ( key == "<" ? -1 : 1);
				sequence.noteAtTickCurrentTimeStartInTicksAdd(ticksOffset);
			}
		}
		else if (key.toLowerCase() == "n")
		{
			sequence.noteAtTickCurrent().play(song, sequence, track);
		}
		else if (key.toLowerCase() == "t")
		{
			track.playOrStop(song, sequence);
		}
		else if (key.toLowerCase() == "s")
		{
			sequence.playOrStop(song);
		}
		else if (key.toLowerCase() == "p")
		{
			song.playOrStop();
		}

		sequence.uiUpdate_Tracks(song);
	}
}
