
class SoundSource_PitchChange
{
	constructor(frequencyMultiplier, child)
	{
		this.typeName = SoundSourceType.Instances().PitchChange.name;

		this.frequencyMultiplier = frequencyMultiplier;
		this.child = child;
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz, timeInSeconds
	)
	{
		var returnValue = this.child.sampleForFrequencyAndTime
		(
			frequencyInHertz * this.frequencyMultiplier,
			timeInSeconds
		);
		return returnValue;
	}

	// ui

	uiClear()
	{
		delete this.divSoundSource;
		delete this.inputFrequencyMultiplier;
	}

	uiUpdate()
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");

			var labelChild = d.createElement("label");
			labelChild.innerText = "Child:";
			this.divSoundSource.appendChild(labelChild);

			var divChild = d.createElement("div");
			this.divSoundSource.appendChild(divChild);
			this.divChild = divChild;

			var childAsDiv = this.child.uiUpdate();
			this.divChild.appendChild(childAsDiv);

			var labelFrequencyMultiplier = d.createElement("label");
			labelFrequencyMultiplier.innerText = "Frequency Multiplier:";
			this.divSoundSource.appendChild(labelFrequencyMultiplier);
			var inputFrequencyMultiplier = d.createElement("input");
			inputFrequencyMultiplier.type = "number";
			inputFrequencyMultiplier.style.width = "64px";
			var soundSource = this;
			inputFrequencyMultiplier.onchange = (event) =>
			{
				var inputFrequencyMultiplier = event.target;
				soundSource.frequencyMultiplier = parseFloat(inputFrequencyMultiplier.value);
			}
			this.divSoundSource.appendChild(inputFrequencyMultiplier);
			this.inputFrequencyMultiplier = inputFrequencyMultiplier;
		}
		else
		{
			this.inputFrequencyMultiplier.value = this.frequencyMultiplier;

			this.child.uiUpdate();
		}

		return this.divSoundSource;
	}
}
