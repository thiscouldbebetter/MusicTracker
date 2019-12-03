
function Note(timeStartInTicks, octaveIndex, pitchCode, volumeAsPercentage, durationInTicks)
{
	this.timeStartInTicks = timeStartInTicks;
	this.octaveIndex = octaveIndex;
	this.pitchCode = pitchCode;
	this.volumeAsPercentage = volumeAsPercentage;
	this.durationInTicks = durationInTicks;
}

{
	Note.Blank = "-----------"; // "pitch-volume-duration";
	Note.VolumeAsPercentageMax = 99; // Not technically a percentage.

	Note.default = function()
	{
		return Note.fromString("C_4-25-0001");
	}

	Note.prototype.clone = function()
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

	Note.prototype.durationInTicksAdd = function(ticksToAdd)
	{
		this.durationInTicks += ticksToAdd;
		if (this.durationInTicks < 1)
		{
			this.durationInTicks = 1;
		}
		return this;
	}

	Note.prototype.durationInSamples = function(song, sequence)
	{
		var returnValue =
			this.durationInTicks
			* song.samplesPerSecond
			/ sequence.ticksPerSecond;

		return returnValue;
	}

	Note.prototype.frequencyInHertz = function()
	{
		var octave = this.octave();
		var frequencyBase = octave.frequencyInHertzOfC;
		var frequencyMultiplier = this.pitch().frequencyMultiplier;
		var frequency = frequencyBase * frequencyMultiplier;
		return frequency;
	}

	Note.prototype.octave = function()
	{
		return Octave.Instances._All[this.octaveIndex];
	}

	Note.prototype.octaveAdd = function(octaveOffset)
	{
		this.octaveIndex += octaveOffset;
		if (this.octaveIndex < 0)
		{
			this.octaveIndex = 0;
		}
		else if (this.octaveIndex >= Octave.Instances._All.length)
		{
			this.octaveIndex = Octave.Instances._All.length - 1;
		}
		return this;
	}

	Note.prototype.overwriteWith = function(other)
	{
		this.timeStartInTicks = other.timeStartInTicks;
		this.octaveIndex = other.octaveIndex;
		this.pitchCode = other.pitchCode;
		this.volumeAsPercentage = other.volumeAsPercentage;
		this.durationInTicks = other.durationInTicks;
		return this;
	}

	Note.prototype.pitch = function()
	{
		return Pitch.Instances._All[this.pitchCode];
	}

	Note.prototype.pitchAdd = function(pitchOffset)
	{
		var pitches = Pitch.Instances._All;
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
				this.octaveAdd(-1);
				pitchIndex = pitches.length - 1;
			}
		}
		else if (pitchIndex >= pitches.length)
		{
			if (this.octaveIndex >= Octave.Instances._All.length - 1)
			{
				pitchIndex -= pitchOffset;
			}
			else
			{
				this.octaveAdd(1);
				pitchIndex = 0;
			}
		}
		this.pitchCode = pitches[pitchIndex].code;
		return this;
	}

	Note.prototype.pitchCodeSet = function(value)
	{
		var pitches = Pitch.Instances._All;
		var pitch = pitches[value];
		if (pitch != null)
		{
			this.pitchCode = pitch.code;
		}
		return this;
	}

	Note.prototype.play = function(song, sequence, track)
	{
		var samples = this.toSamples(song, sequence, track);
		var wavFile = Tracker.samplesToWavFile
		(
			"", song.samplesPerSecond, song.bitsPerSample, samples
		);
		this.sound = new Sound("", wavFile);
		var note = this;
		this.sound.play( () => { note.sound = null; } );
	}

	Note.prototype.stop = function()
	{
		if (this.sound != null)
		{
			this.sound.stop();
			this.sound = null;
		}
	}

	Note.prototype.timeStartInSamples = function(song, sequence)
	{
		var timeStartInSeconds = this.timeStartInSeconds(sequence);
		var returnValue = Math.round
		(
			timeStartInSeconds * song.samplesPerSecond
		);
		return returnValue;
	}

	Note.prototype.timeStartInSeconds = function(sequence)
	{
		return this.timeStartInTicks / sequence.ticksPerSecond;
	}

	Note.prototype.volumeAsFraction = function()
	{
		return this.volumeAsPercentage / Note.VolumeAsPercentageMax;
	}

	Note.prototype.volumeAsPercentageAdd = function(volumeOffset)
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

	Note.prototype.toSamples = function(song, sequence, track, instrument)
	{
		var samplesPerSecond = song.samplesPerSecond;
		var durationInSamples = this.durationInSamples(song, sequence);
		var frequencyInHertz = this.frequencyInHertz();
		var volumeAsFraction = this.volumeAsFraction();
		var instrument = track.instrument(song);
		var noteAsSamples = instrument.samplesForNote
		(
			samplesPerSecond, durationInSamples, frequencyInHertz, volumeAsFraction
		);
		//Tracker.samplesValidate(noteAsSamples);
		return noteAsSamples;
	}

	// strings

	Note.fromString = function(stringToParse, timeStartInTicks)
	{
		stringToParse = stringToParse.toUpperCase();

		var returnValue;

		var parts = stringToParse.split("-");
		if (parts.length != 3)
		{
			returnValue = null;
		}
		else
		{
			var pitchCodeAndOctaveIndex = parts[0];
			var pitchCode = pitchCodeAndOctaveIndex.substr(0, 2);
			var pitch = Pitch.Instances._All[pitchCode];

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
					var returnValue = new Note
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

	Note.prototype.toString = function()
	{
		var returnValue =
			this.pitchCode + this.octaveIndex + "-"
			+ ("" + this.volumeAsPercentage).padLeft(2, "0") + "-"
			+ ("" + this.durationInTicks).padLeft(4, "0");
		return returnValue
	}
}
