
function Track(instrumentName, notes)
{
	this.instrumentName = instrumentName;
	this.notes = notes;
}

{
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
				note.overwriteWith(valueToSet);
			}
		}

		return returnValue;
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

		return trackAsSamples;
	}
}
