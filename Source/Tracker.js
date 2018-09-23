
function Tracker(songCurrent)
{
	this.songCurrent = songCurrent;
	this.useKeyboardCommands = false;
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
			sequence.uiUpdate(song);
		}
		else if (key == "Delete")
		{
			track.noteAtTick_Set(sequence.tickIndexSelected, null);
			sequence.uiUpdate_Tracks(song);
		}
		else if (key == "Enter")
		{
			var notePrev = sequence.notePrecedingTickCurrent();
			var noteToClone = (notePrev == null ? new Note("C3-25-0001") : notePrev);
			var noteNew = noteToClone.clone();
			track.noteAtTick_Set(sequence.tickIndexSelected, noteNew);
			sequence.uiUpdate_Tracks(song);
		}
		else if (key.length == 1 && key >= "a" && key <= "g")
		{
			var tickAsNote = sequence.noteAtTickCurrent();
			if (tickAsNote != null)
			{
				tickAsNote.pitchCode = key.toUpperCase() + "_";
				track.noteAtTick_Set(sequence.tickIndexSelected, tickAsNote);
				sequence.uiUpdate_Tracks(song);
			}
		}
		else if (key.length == 1 && key >= "A" && key <= "G")
		{
			var tickAsNote = sequence.noteAtTickCurrent();
			if (tickAsNote != null)
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
				tickAsNote.pitchCode = pitchCode;
				track.noteAtTick_Set(sequence.tickIndexSelected, tickAsNote);
				sequence.uiUpdate_Tracks(song);
			}
		}
		else if ( (key >= "0" && key <= "9") || key == "`" )
		{
			var keyAsInt = parseInt(key);
			if (key == "`")
			{
				keyAsInt = 0;
			}
			else if (key == 0)
			{
				keyAsInt = 9.9;
			}
			var volumePercentageToSet = keyAsInt * 10;
			var tickAsNote = sequence.noteAtTickCurrent();
			tickAsNote.volumePercentage = volumePercentageToSet;
			track.noteAtTick_Set(sequence.tickIndexSelected, tickAsNote);
			sequence.uiUpdate_Tracks(song);
		}
		else if (key == "-" || key == "+")
		{
			var tickAsNote = sequence.noteAtTickCurrent();
			var durationInTicks = tickAsNote.durationInTicks;
			var direction = (key == "-" ? -1 : 1);
			durationInTicks += direction;
			if (durationInTicks < 1)
			{
				durationInTicks = 1;
			}
			tickAsNote.durationInTicks = durationInTicks;
			track.noteAtTick_Set(sequence.tickIndexSelected, tickAsNote);
			sequence.uiUpdate_Tracks(song);
		}
		else if (key == ".")
		{
			sequence.noteAtTickCurrent().play();
		}
		else if (key == "/")
		{
			sequence.trackCurrent().play();
		}
		else if (key == " ")
		{
			sequence.play();
		}
	}
}
