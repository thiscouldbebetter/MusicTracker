
class SoundSource_Triangle extends SoundSourceChild
{
	constructor()
	{
		super(SoundSourceType.Instances().Triangle.name);
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample;
		if (fractionOfCycleComplete <= .5)
		{
			sample = fractionOfCycleComplete;
		}
		else
		{
			sample = 1 - fractionOfCycleComplete;
		}
		sample = sample * 4 - 1;

		return sample;
	}

	// ui

	uiClear(): void
	{
		delete this.divSoundSource;
	}

	uiUpdate(): void
	{
		if (this.divSoundSource == null)
		{
			this.divSoundSource = document.createElement("div");
		}

		return this.divSoundSource;
	}
}
