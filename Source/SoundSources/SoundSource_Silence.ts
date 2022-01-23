
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSource_Silence extends SoundSourceChild
{
	constructor()
	{
		super(SoundSourceType.Instances().Silence.name);
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		return 0;
	}

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