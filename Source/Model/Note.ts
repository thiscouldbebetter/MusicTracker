
class Note
{
	timeStartInTicks: number;
	octaveIndex: number;
	pitchCode: string;
	volumeAsPercentage: number;
	durationInTicks: number;

	sound: Sound;

	constructor
	(
		timeStartInTicks: number,
		octaveIndex: number,
		pitchCode: string,
		volumeAsPercentage: number,
		durationInTicks: number
	)
	{
		this.timeStartInTicks = timeStartInTicks;
		this.octaveIndex = octaveIndex;
		this.pitchCode = pitchCode;
		this.volumeAsPercentage = volumeAsPercentage;
		this.durationInTicks = durationInTicks;
	}

	static Blank = "-----------"; // "pitch-volume-duration";
	static VolumeAsPercentageMax = 99; // Not technically a percentage.

	static default(): Note
	{
		return Note.fromString("C_4-25-0001", null);
	}

	clone(): Note
	{
		return new Note
		(
			this.timeStartInTicks,
			this.octaveIndex,
			this.pitchCode,
			this.volumeAsPercentage,
			this.durationInTicks
		);
	}

	durationInTicksAdd(ticksToAdd: number): Note
	{
		this.durationInTicks += ticksToAdd;
		if (this.durationInTicks < 1)
		{
			this.durationInTicks = 1;
		}
		return this;
	}

	durationInSamples(song: Song, sequence: Sequence): number
	{
		var returnValue =
			this.durationInTicks
			* song.samplesPerSecond
			/ sequence.ticksPerSecond;

		return returnValue;
	}

	frequencyInHertz(): number
	{
		var octave = this.octave();
		var frequencyBase = octave.frequencyInHertzOfC;
		var frequencyMultiplier = this.pitch().frequencyMultiplier;
		var frequency = frequencyBase * frequencyMultiplier;
		return frequency;
	}

	octave(): Octave
	{
		return Octave.Instances()._All[this.octaveIndex];
	}

	octaveIndexAdd(octaveOffset: number): Note
	{
		return this.octaveIndexSet(this.octaveIndex + octaveOffset);
	}

	octaveIndexSet(value: number): Note
	{
		this.octaveIndex = value;
		if (this.octaveIndex < 0)
		{
			this.octaveIndex = 0;
		}
		else if (this.octaveIndex >= Octave.Instances()._All.length)
		{
			this.octaveIndex = Octave.Instances()._All.length - 1;
		}
		return this;
	}

	overwriteWith(other: Note): Note
	{
		this.timeStartInTicks = other.timeStartInTicks;
		this.octaveIndex = other.octaveIndex;
		this.pitchCode = other.pitchCode;
		this.volumeAsPercentage = other.volumeAsPercentage;
		this.durationInTicks = other.durationInTicks;
		return this;
	}

	pitch(): Pitch
	{
		return Pitch.Instances().byCode(this.pitchCode);
	}

	pitchAdd(pitchOffset: number): Note
	{
		var pitches = Pitch.Instances()._All;
		var pitchIndex = pitches.indexOf(this.pitch());
		pitchIndex += pitchOffset;
		if (pitchIndex < 0)
		{
			if (this.octaveIndex <= 0)
			{
				pitchIndex -= pitchOffset;
			}
			else
			{
				this.octaveIndexAdd(-1);
				pitchIndex = pitches.length - 1;
			}
		}
		else if (pitchIndex >= pitches.length)
		{
			if (this.octaveIndex >= Octave.Instances()._All.length - 1)
			{
				pitchIndex -= pitchOffset;
			}
			else
			{
				this.octaveIndexAdd(1);
				pitchIndex = 0;
			}
		}
		this.pitchCode = pitches[pitchIndex].code;
		return this;
	}

	pitchCodeSet(value: string): Note
	{
		var pitch = Pitch.Instances().byCode(value);
		if (pitch != null)
		{
			this.pitchCode = pitch.code;
		}
		return this;
	}

	play(song: Song, sequence: Sequence, track: Track): void
	{
		var samples = this.toSamples(song, sequence, track, null);
		var wavFile = Tracker.samplesToWavFile
		(
			"", song.samplesPerSecond, song.bitsPerSample, samples
		);
		this.sound = new Sound("", wavFile, null);
		var note = this;
		this.sound.play( () => { note.sound = null; } );
	}

	stop(): void
	{
		if (this.sound != null)
		{
			this.sound.stop();
			this.sound = null;
		}
	}

	timeStartInSamples(song: Song, sequence: Sequence): number
	{
		var timeStartInSeconds = this.timeStartInSeconds(sequence);
		var returnValue = Math.round
		(
			timeStartInSeconds * song.samplesPerSecond
		);
		return returnValue;
	}

	timeStartInSeconds(sequence: Sequence): number
	{
		return this.timeStartInTicks / sequence.ticksPerSecond;
	}

	timeSubdivideByFactor(factor: RationalNumber): Note
	{
		this.timeStartInTicks =
			factor.clone().multiplyInteger(this.timeStartInTicks).toNumber();
		this.durationInTicks =
			factor.clone().multiplyInteger(this.durationInTicks).toNumber();
		return this;
	}

	timeSubdivideByFactorIsPossible(factor: RationalNumber): boolean
	{
		var returnValue =
		(
			factor.clone().multiplyInteger(this.timeStartInTicks).isInteger()
			&& factor.clone().multiplyInteger(this.durationInTicks).isInteger()
		);
		return returnValue;
	}

	volumeAsFraction(): number
	{
		return this.volumeAsPercentage / Note.VolumeAsPercentageMax;
	}

	volumeAsPercentageAdd(volumeOffset: number): Note
	{
		this.volumeAsPercentage += volumeOffset;
		if (this.volumeAsPercentage < 0)
		{
			this.volumeAsPercentage = 0;
		}
		else if (this.volumeAsPercentage > Note.VolumeAsPercentageMax)
		{
			this.volumeAsPercentage = Note.VolumeAsPercentageMax;
		}
		return this;
	}

	// samples

	toSamples
	(
		song: Song, sequence: Sequence, track: Track, instrument: Instrument
	): number[]
	{
		var samplesPerSecond = song.samplesPerSecond;
		var durationInSamples = this.durationInSamples(song, sequence);
		var frequencyInHertz = this.frequencyInHertz();
		var volumeAsFraction = this.volumeAsFraction();
		volumeAsFraction *= song.volumeAsFraction;
		var instrument = track.instrument(song);
		var noteAsSamples = instrument.samplesForNote
		(
			samplesPerSecond, durationInSamples, frequencyInHertz, volumeAsFraction
		);
		//Tracker.samplesValidate(noteAsSamples);
		return noteAsSamples;
	}

	// strings

	static fromString(stringToParse: string, timeStartInTicks: number): Note
	{
		stringToParse = stringToParse.toUpperCase();

		var returnValue: Note = null;

		var parts = stringToParse.split("-");
		if (parts.length != 3)
		{
			returnValue = null;
		}
		else
		{
			var pitchCodeAndOctaveIndex = parts[0];
			var pitchCode = pitchCodeAndOctaveIndex.substr(0, 2);
			var pitch = Pitch.Instances().byCode(pitchCode);

			if (pitch == null)
			{
				returnValue = null;
			}
			else
			{
				var octaveIndexAsString = pitchCodeAndOctaveIndex.substr(2);
				var octaveIndex = parseInt(octaveIndexAsString);

				var volumeAsPercentageAsString = parts[1];
				var volumeAsPercentage = parseInt(volumeAsPercentageAsString);

				var durationInTicksAsString = parts[2];
				var durationInTicks = parseInt(durationInTicksAsString);

				if
				(
					isNaN(octaveIndex)
					|| isNaN(volumeAsPercentage)
					|| isNaN(durationInTicks)
				)
				{
					returnValue = null;
				}
				else
				{
					returnValue = new Note
					(
						timeStartInTicks,
						octaveIndex,
						pitchCode,
						volumeAsPercentage,
						durationInTicks
					);
				}
			}
		}

		return returnValue;
	}

	toString(): string
	{
		var returnValue =
			this.pitchCode + this.octaveIndex + "-"
			+ StringHelper.padLeft("" + this.volumeAsPercentage, 2, "0") + "-"
			+ StringHelper.padLeft("" + this.durationInTicks, 4, "0");
		return returnValue
	}
}
