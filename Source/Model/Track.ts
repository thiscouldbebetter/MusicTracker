
namespace ThisCouldBeBetter.MusicTracker
{

export class Track
{
	instrumentName: string;
	notes: Note[];

	cursorMover: any;
	sound: Sound;

	constructor(instrumentName: string, notes: Note[])
	{
		this.instrumentName = instrumentName;
		this.notes = notes;
	}

	clone(): Track
	{
		return new Track(this.instrumentName, ArrayHelper.clone(this.notes));
	}

	instrument(song: Song): Instrument
	{
		return song.instrumentsByName.get(this.instrumentName);
	}

	noteAtTick(tickIndexToSearch: number): Note
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

	noteAtTickSet(tickIndexToSearch: number, valueToSet: Note): void
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
				ArrayHelper.insertElementAt(this.notes, valueToSet, n);
			}
		}
		else
		{
			if (valueToSet == null)
			{
				ArrayHelper.remove(this.notes, noteExisting);
			}
			else
			{
				valueToSet.timeStartInTicks = tickIndexToSearch;
				note.overwriteWith(valueToSet);
			}
		}

		return returnValue;
	}

	notePrecedingTick(tickIndexToSearch: number): Note
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

	notesSustainAll(sequence: Sequence): void
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

	notesReorder(): void
	{
		this.notes.sort( (x, y) => { return x.timeStartInTicks - y.timeStartInTicks } );
	}

	play(song: Song, sequence: Sequence): void
	{
		var samples = this.toSamples(song, sequence);
		var wavFile = Tracker.samplesToWavFile
		(
			"", song.samplesPerSecond, song.bitsPerSample, samples
		);
		this.sound = new Sound("", wavFile, null);
		var track = this;
		this.sound.play( () => { track.stop(); } );

		this.uiCursorFollow(song, sequence);
	}

	playOrStop(song: Song, sequence: Sequence)
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

	stop(): void
	{
		if (this.sound != null)
		{
			this.sound.stop();
			this.sound = null;
		}
		if (this.cursorMover != null)
		{
			clearInterval(this.cursorMover);
			this.cursorMover = null;
		}
	}

	tickAtIndexAsString(sequence: Sequence, tickIndex: number): string
	{
		var noteAtTick = this.noteAtTick(tickIndex);
		var returnValue = ( noteAtTick == null ? Note.Blank : noteAtTick.toString() );
		return returnValue;
	}

	ticksAsStrings(sequence: Sequence): string[] 
	{
		var returnValues = [];

		for (var i = 0; i < sequence.durationInTicks; i++)
		{
			returnValues.push(Note.Blank);
		}

		var notes = this.notes;
		for (var i = 0; i < notes.length; i++)
		{
			var note = notes[i];
			var noteAsString = note.toString();
			returnValues[note.timeStartInTicks] = noteAsString;
		}

		return returnValues;
	}

	timeSubdivideByFactor(factor: RationalNumber): Track
	{
		this.notes.forEach(x => x.timeSubdivideByFactor(factor));
		return this;
	}

	timeSubdivideByFactorIsPossible(factor: RationalNumber): boolean
	{
		var returnValue =
		(
			this.notes.some
			(
				x => x.timeSubdivideByFactorIsPossible(factor) == false
			) == false
		);

		return returnValue;
	}

	// samples

	toSamples(song: Song, sequence: Sequence): number[]
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

	// ui

	uiCursorFollow(song: Song, sequence: Sequence): void
	{
		sequence.tickSelectAtIndex(0);

		var ticksPerSecond = sequence.ticksPerSecond;
		var millisecondsPerTick = 1000 / ticksPerSecond;

		this.cursorMover = setInterval
		(
			function()
			{
				sequence.tickIndexSelected++;
				if (sequence.tickIndexSelected > sequence.durationInTicks)
				{
					clearInterval(sequence.cursorMover);
				}
				sequence.uiUpdate_TickCursorPositionFromSelected(false);
			},
			millisecondsPerTick
		);
	}
}

}