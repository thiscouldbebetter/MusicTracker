
class SoundSource_Scale extends SoundSourceChild
{
	amplitudeMultiplier: number;
	child: SoundSource;

	inputAmplitudeMultiplier: any;

	constructor(amplitudeMultiplier: number, child: SoundSource)
	{
		super(SoundSourceType.Instances().Scale.name);

		this.amplitudeMultiplier = amplitudeMultiplier;
		this.child = child;
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		var sampleFromChild =
			this.child.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
		var returnValue = this.amplitudeMultiplier * sampleFromChild;
		return returnValue;
	}

	// ui

	uiClear(): void
	{
		delete this.divSoundSource;
		delete this.inputAmplitudeMultiplier;
		this.child.uiClear();
	}

	uiUpdate(): void
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");

			var labelAmplitudeMultiplier = d.createElement("label");
			labelAmplitudeMultiplier.innerText = "Amplitude Multiplier:";
			this.divSoundSource.appendChild(labelAmplitudeMultiplier);
			var inputAmplitudeMultiplier = d.createElement("input");
			inputAmplitudeMultiplier.type = "number";
			inputAmplitudeMultiplier.style.width = "64px";
			this.divSoundSource.appendChild(inputAmplitudeMultiplier);
			this.inputAmplitudeMultiplier = inputAmplitudeMultiplier;

			this.divSoundSource.appendChild(d.createElement("br"));

			var labelChild = d.createElement("label");
			labelChild.innerText = "Child:";
			this.divSoundSource.appendChild(labelChild);

			var divChild = d.createElement("div");
			this.divSoundSource.appendChild(divChild);
			this.divChild = divChild;

			var childAsDiv = this.child.uiUpdate();
			this.divChild.appendChild(childAsDiv);
		}
		else
		{
			this.inputAmplitudeMultiplier.value = this.amplitudeMultiplier;

			this.child.uiUpdate();
		}

		return this.divSoundSource;
	}
}
