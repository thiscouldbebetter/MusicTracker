
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

	Track.prototype.notesSustainAll = function(sequence)
	{
		// For MOD file conversion.
		// All notes last until the next note starts.

		for (var i = 1; i < this.notes.length - 1; i++)
		{
			var note = this.notes[i];
			var noteNext = this.notes[i + 1];
			note.durationInTicks =
				noteNext.timeStartInTicks - note.timeStartInTicks;
		}

		if (this.notes.length > 0)
		{
			var noteFinal = this.notes[this.notes.length - 1];
			noteFinal.durationInTicks =
				sequence.durationInTicks - noteFinal.timeStartInTicks;
		}
	}

	Track.prototype.play = function(song, sequence)
	{
		var samples = this.toSamples(song, sequence);
		var wavFile = Tracker.samplesToWavFile
		(
			"", song.samplesPerSecond, song.bitsPerSample, samples
		);
		this.sound = new Sound("", wavFile);
		this.sound.play();
	}

	Track.prototype.playOrStop = function(song, sequence)
	{
		if (this.sound == null)
		{
			this.play(song, sequence);
		}
		else
		{
			this.stop();
		}
	}

	Track.prototype.stop = function()
	{
		if (this.sound != null)
		{
			this.sound.stop();
			this.sound = null;
		}
	}

	// samples

	Track.prototype.toSamples = function(song, sequence)
	{
		var trackAsSamples = [];

		var instrument = this.instrument(song);

		var notesAsSampleArrays = [];
		var sampleIndexMaxSoFar = 0;

		for (var n = 0; n < this.notes.length; n++)
		{
			var note = this.notes[n];

			var noteAsSamples =
				note.toSamples(song, sequence, this, instrument);
			notesAsSampleArrays.push(noteAsSamples);

			var noteTimeStartInSamples = note.timeStartInSamples(song, sequence);

			var noteTimeEndInSamples = noteTimeStartInSamples + noteAsSamples.length;
			if (noteTimeEndInSamples > sampleIndexMaxSoFar)
			{
				sampleIndexMaxSoFar = noteTimeEndInSamples;
			}
		}

		for (var s = 0; s < sampleIndexMaxSoFar; s++)
		{
			trackAsSamples[s] = 0;
		}

		for (var n = 0; n < this.notes.length; n++)
		{
			var note = this.notes[n];
			var noteAsSamples = notesAsSampleArrays[n];
			var noteTimeStartInSamples = note.timeStartInSamples(song, sequence);

			for (var s = 0; s < noteAsSamples.length; s++)
			{
				var sampleFromNote = noteAsSamples[s];
				var trackSampleIndex = noteTimeStartInSamples + s;
				trackAsSamples[trackSampleIndex] += sampleFromNote;
			}
		}

		return trackAsSamples;
	}
}
