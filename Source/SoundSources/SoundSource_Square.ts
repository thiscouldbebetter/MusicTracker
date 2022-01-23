
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSource_Square extends SoundSourceChild
{
	constructor()
	{
		super(SoundSourceType.Instances().Square.name);
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
		var sample = (fractionOfCycleComplete <= .5 ? 1 : -1);
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