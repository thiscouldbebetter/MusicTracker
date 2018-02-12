function FrequencyAnalysis(sineAmplitudes, cosineAmplitudes)
{
	this.sineAmplitudes = sineAmplitudes;
	this.cosineAmplitudes = cosineAmplitudes;
}
{
	FrequencyAnalysis.fromSamples = function
	(
		numberOfOscillators, frequencyLowestInCyclesPerSecond, samplesPerSecond, samples
	)
	{
		var sineAmplitudes = [];
		var cosineAmplitudes = [];

		var radiansPerCycle = 2 * Math.PI;
		var numberOfSamples = samples.length;
		var epsilon = 0.0000000001;

		for (var i = 0; i < numberOfOscillators; i++)
		{
			var oscillatorFrequencyInCyclesPerSecond =
				frequencyLowestInCyclesPerSecond * i;

			var sumOfSamplesTimesSines = 0;
			var sumOfSamplesTimesCosines = 0;

			for (var s = 0; s < numberOfSamples; s++)
			{
				var sample = samples[s];

				var timeInSeconds = s / samplesPerSecond;
				var timeInCycles =
					timeInSeconds * oscillatorFrequencyInCyclesPerSecond;
				var timeInRadians = timeInCycles * radiansPerCycle;

				var sine = Math.sin(timeInRadians);
				var cosine = Math.cos(timeInRadians);

				var sampleTimesSine = sample * sine;
				var sampleTimesCosine = sample * cosine;

				sumOfSamplesTimesSines += sampleTimesSine;
				sumOfSamplesTimesCosines += sampleTimesCosine;
			}

			var sineAmplitude = sumOfSamplesTimesSines / numberOfSamples;
			if (Math.abs(sineAmplitude) < epsilon)
			{
				sineAmplitude = 0;
			}
			sineAmplitudes.push(sineAmplitude);

			var cosineAmplitude = sumOfSamplesTimesCosines / numberOfSamples;
			if (Math.abs(cosineAmplitude) < epsilon)
			{
				cosineAmplitude = 0;
			}
			cosineAmplitudes.push(cosineAmplitude);
		}

		var returnValue = new FrequencyAnalysis(sineAmplitudes, cosineAmplitudes);
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

		for (var i = 0; i < this.sineAmplitudes.length; i++)
		{
			var sineAmplitude = this.sineAmplitudes[i];
			var cosineAmplitude = this.cosineAmplitudes[i];

			if (sineAmplitude != 0 || cosineAmplitude != 0)
			{
				var oscillatorFrequencyInCyclesPerSecond =
					frequencyFundamentalInCyclesPerSecond * i;

				for (var s = 0; s < durationInSamples; s++)
				{
					var timeInSeconds = s / samplesPerSecond;
					var timeInCycles =
						timeInSeconds * oscillatorFrequencyInCyclesPerSecond;
					var timeInRadians = timeInCycles * radiansPerCycle;

					var sine = Math.sin(timeInRadians);
					var cosine = Math.cos(timeInRadians);

					var sineTimesSineAmplitude =
						sine * sineAmplitude;
					var cosineTimesCosineAmplitude =
						cosine * cosineAmplitude;

					samples[s] += sineTimesSineAmplitude;
					samples[s] += cosineTimesCosineAmplitude;
				}
			}
		}

		return samples;
	}
}
