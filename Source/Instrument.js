
function Instrument(name, sampleForFrequencyAndTime)
{
	this.name = name;
	this.sampleForFrequencyAndTime = sampleForFrequencyAndTime;
}

{
	Instrument.RadiansPerCycle = Math.PI * 2;

	Instrument.Instances = new Instrument_Instances();

	function Instrument_Instances()
	{
		this.Sine = new Instrument
		(
			"Sine",
			function sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds)
			{
				var secondsPerCycle = 1 / frequencyInHertz;
				var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
				var fractionOfCycleComplete =
					secondsSinceCycleStarted / secondsPerCycle;
				var radiansSinceCycleStarted =
					Instrument.RadiansPerCycle * fractionOfCycleComplete;
				var sample = Math.sin(radiansSinceCycleStarted);
				return sample;
			}
		);
	}

	Instrument.prototype.samplesForNote = function
	(
		samplesPerSecond, durationInSamples, frequencyInHertz, volumeAsFraction
	)
	{
		var noteAsSamples = [];

		for (var s = 0; s < durationInSamples; s++)
		{
			var timeInSeconds = s / samplesPerSecond;
			var sample = this.sampleForFrequencyAndTime
			(
				frequencyInHertz, timeInSeconds
			);
			sample *= volumeAsFraction;
			noteAsSamples.push(sample);
		}

		return noteAsSamples;
	}
}
