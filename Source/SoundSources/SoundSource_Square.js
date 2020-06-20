
class SoundSource_Square
{
	constructor()
	{
		this.typeName = SoundSourceType.Instances().Square.name;
	}

	sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds)
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample = (fractionOfCycleComplete <= .5 ? 1 : -1);
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
