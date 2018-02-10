function FrequencyAnalysis(oscillatorAmplitudes)
{
	this.oscillatorAmplitudes = oscillatorAmplitudes;
}
{
	FrequencyAnalysis.fromSamples = function
	(
		numberOfOscillators, frequencyLowestInCyclesPerSecond, samplesPerSecond, samples
	)
	{
		var oscillatorAmplitudes = [];

		var radiansPerCycle = 2 * Math.PI;
		var numberOfSamples = samples.length;
		var epsilon = 0.0000000001;

		for (var i = 0; i < numberOfOscillators; i++)
		{
			var oscillatorFrequencyInCyclesPerSecond = 
				frequencyLowestInCyclesPerSecond + i;

			var sumOfSamplesTimesSines = 0;

			for (var s = 0; s < numberOfSamples; s++)
			{
				var sample = samples[s];

				var timeInSeconds = s / samplesPerSecond;
				var timeInCycles = 
					timeInSeconds * oscillatorFrequencyInCyclesPerSecond;
				var timeInRadians = timeInCycles * radiansPerCycle;

				var sine = Math.sin(timeInRadians); 

				var sampleTimesSine = sample * sine;

				sumOfSamplesTimesSines += sampleTimesSine;
			}

			var oscillatorAmplitude = sumOfSamplesTimesSines / numberOfSamples;
			if (oscillatorAmplitude < epsilon)
			{
				oscillatorAmplitude = 0;
			}
			oscillatorAmplitudes.push(oscillatorAmplitude);
		}

		var returnValue = new FrequencyAnalysis(oscillatorAmplitudes);
		return returnValue;
	}

	FrequencyAnalysis.prototype.toSamples = function
	(
		samplesPerSecond, frequencyFundamentalInCyclesPerSecond, durationInSeconds
	)
	{
		var samples = [];

		var durationInSamples = samplesPerSecond * durationInSeconds;

		for (var s = 0; s < durationInSamples; s++)
		{
			samples[s] = 0;
		}

		var radiansPerCycle = 2 * Math.PI;

		for (var i = 0; i < this.oscillatorAmplitudes.length; i++)
		{
			var oscillatorAmplitude = this.oscillatorAmplitudes[i];
			var oscillatorFrequencyInCyclesPerSecond = 
				frequencyFundamentalInCyclesPerSecond + i;

			if (oscillatorAmplitude > 0)
			{
				for (var s = 0; s < durationInSamples; s++)
				{
					var timeInSeconds = s / samplesPerSecond;
					var timeInCycles = 
						timeInSeconds * oscillatorFrequencyInCyclesPerSecond;
					var timeInRadians = timeInCycles * radiansPerCycle;
					var sine = Math.sin(timeInRadians);
					var sineTimesOscillatorAmplitude = 
						sine * oscillatorAmplitude;
					samples[s] += sineTimesOscillatorAmplitude;
				}
			}
		}

		return samples;
	}
}
