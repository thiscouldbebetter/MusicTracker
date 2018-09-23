
function Track(instrumentName, notes)
{
	this.instrumentName = instrumentName;
	this.notes = notes;
}

{
	Track.prototype.clone = function()
	{
		return new Track(this.instrumentName, this.notes.clone());
	}

	Track.prototype.instrument = function(song)
	{
		return song.instruments[this.instrumentName];
	}

	Track.prototype.noteAtTick = function(tickIndexToSearch)
	{
		var returnValue = null;

		for (var i = 0; i < this.notes.length; i++)
		{
			var note = this.notes[i];
			var noteTickIndex = note.timeStartInTicks;
			if (noteTickIndex >= tickIndexToSearch)
			{
				if (noteTickIndex == tickIndexToSearch)
				{
					returnValue = note;
				}
				break;
			}
		}

		return returnValue;
	}

	Track.prototype.noteAtTick_Set = function(tickIndexToSearch, valueToSet)
	{
		var returnValue = null;

		var noteExisting = null;
		var n;
		for (n = 0; n < this.notes.length; n++)
		{
			var note = this.notes[n];
			var noteTickIndex = note.timeStartInTicks;
			if (noteTickIndex >= tickIndexToSearch)
			{
				if (noteTickIndex == tickIndexToSearch)
				{
					noteExisting = note;
				}
				break;
			}
		}

		if (noteExisting == null)
		{
			if (valueToSet != null)
			{
				valueToSet.timeStartInTicks = tickIndexToSearch;
				this.notes.insertElementAt(valueToSet, n);
			}
		}
		else
		{
			if (valueToSet == null)
			{
				this.notes.remove(noteExisting);
			}
			else
			{
				valueToSet.timeStartInTicks = tickIndexToSearch;
				note.overwriteWith(valueToSet);
			}
		}

		return returnValue;
	}

	Track.prototype.notePrecedingTick = function(tickIndexToSearch)
	{
		var returnValue = null;

		for (var i = 0; i < this.notes.length; i++)
		{
			var note = this.notes[i];
			var noteTickIndex = note.timeStartInTicks;
			if (noteTickIndex >= tickIndexToSearch)
			{
				break;
			}
			returnValue = note;
		}

		return returnValue;
	}

	Track.prototype.play = function(song, sequence)
	{
		var samples = this.toSamples(song, sequence);
		var wavFile = Tracker.samplesToWavFile
		(
			"", song.samplesPerSecond, song.bitsPerSample, samples
		);
		var sound = new Sound("", wavFile);
		sound.play();
	}

	// samples

	Track.prototype.toSamples = function(song, sequence)
	{
		var trackAsSamples = [];

		var durationInSamples = sequence.durationInSamples(song);
		for (var s = 0; s < durationInSamples; s++)
		{
			trackAsSamples[s] = 0;
		}

		var instrument = this.instrument(song);

		for (var n = 0; n < this.notes.length; n++)
		{
			var note = this.notes[n];
			var noteAsSamples =
				note.toSamples(song, sequence, this, instrument);

			var noteTimeStartInSeconds =
				note.timeStartInSeconds(sequence);
			var noteTimeStartInSamples = Math.round
			(
				noteTimeStartInSeconds
				* song.samplesPerSecond
			);

			for (var s = 0; s < noteAsSamples.length; s++)
			{
				var sampleFromNote = noteAsSamples[s];
				var trackSampleIndex = noteTimeStartInSamples + s;
				trackAsSamples[trackSampleIndex] = sampleFromNote;
			}
		}

		trackAsSamples.length = durationInSamples; // hack

		//Tracker.samplesValidate(trackAsSamples);

		return trackAsSamples;
	}
}
