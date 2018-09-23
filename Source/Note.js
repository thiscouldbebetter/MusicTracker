
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

	Note.prototype.overwriteWith = function(other)
	{
		this.timeStartInTicks = other.timeStartInTicks;
		this.octaveIndex = other.octaveIndex;
		this.pitchCode = other.pitchCode;
		this.volumeAsPercentage = other.volumeAsPercentage;
		this.durationInTicks = other.durationInTicks;
		return this;
	}

	Note.prototype.play = function(song, sequence, track)
	{
		var samples = this.toSamples(song, sequence, track);
		var wavFile = Tracker.samplesToWavFile
		(
			"", song.samplesPerSecond, song.bitsPerSample, samples
		);
		var sound = new Sound("", wavFile);
		sound.play();
	}

	Note.prototype.pitch = function()
	{
		return Pitch.Instances._All[this.pitchCode];
	}

	Note.prototype.timeStartInSeconds = function(song)
	{
		return this.timeStartInTicks / song.ticksPerSecond;
	}

	Note.prototype.volumeAsFraction = function()
	{
		return this.volumeAsPercentage / 100;
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
