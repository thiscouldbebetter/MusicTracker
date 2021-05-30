
class SoundSource_Noise extends SoundSourceChild
{
	constructor()
	{
		super(SoundSourceType.Instances().Noise.name);
	}

	static default(): SoundSource_Noise
	{
		return new SoundSource_Noise();
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		return Math.random() * 2 - 1;
	}

	// ui

	uiClear(): void
	{
		delete this.divSoundSource;
	}

	uiUpdate(): void
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");
		}

		return this.divSoundSource;
	}
}
