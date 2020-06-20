
class SoundSource_Sawtooth
{
	constructor()
	{
		this.typeName = SoundSourceType.Instances().Sawtooth.name;
	}

	sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds)
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample = fractionOfCycleComplete;
		sample = sample * 2 - 1;

		return sample;
	}

	// ui

	uiClear()
	{
		delete this.divSoundSource;
	}

	uiUpdate()
	{
		if (this.divSoundSource == null)
		{
			this.divSoundSource = document.createElement("div");
		}

		return this.divSoundSource;
	}
}
