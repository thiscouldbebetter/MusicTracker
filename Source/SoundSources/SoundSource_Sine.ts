
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSource_Sine extends SoundSourceChild
{
	constructor()
	{
		super(SoundSourceType.Instances().Sine.name);
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
		var radiansSinceCycleStarted =
			SoundSource.RadiansPerCycle * fractionOfCycleComplete;
		var sample = Math.sin(radiansSinceCycleStarted);
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