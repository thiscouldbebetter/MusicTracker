
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSource_Sawtooth extends SoundSourceChild
{
	constructor()
	{
		super(SoundSourceType.Instances().Sawtooth.name);
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
		var sample = fractionOfCycleComplete;
		sample = sample * 2 - 1;

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

}