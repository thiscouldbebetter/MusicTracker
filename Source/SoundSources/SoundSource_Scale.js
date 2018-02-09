
function SoundSource_Scale(amplitudeMultiplier, child)
{
	this.typeName = SoundSourceType.Instances().Scale.name;

	this.amplitudeMultiplier = amplitudeMultiplier;
	this.child = child;
}

{
	SoundSource_Scale.prototype.sampleForFrequencyAndTime = function
	(
		frequencyInHertz, timeInSeconds
	)
	{
		var sampleFromChild =
			this.child.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
		var returnValue = this.amplitudeMultiplier * childSample;
		return returnValue;
	}

	// ui

	SoundSource_Scale.prototype.uiClear = function()
	{
		delete this.divSoundSource;
		delete this.inputAmplitudeMultiplier;
		this.child.uiClear();
	}

	SoundSource_Scale.prototype.uiUpdate = function()
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

			var labelAmplitudeMultiplier = d.createElement("label");
			labelAmplitudeMultiplier.innerText = "Amplitude Multiplier:";
			this.divSoundSource.appendChild(labelAmplitudeMultiplier);
			var inputAmplitudeMultiplier = d.createElement("input");
			inputAmplitudeMultiplier.type = "number";
			inputAmplitudeMultiplier.style.width = "64px";
			this.divSoundSource.appendChild(inputAmplitudeMultiplier);
			this.inputAmplitudeMultiplier = inputAmplitudeMultiplier;
		}
		else
		{
			this.inputAmplitudeMultiplier.value = this.amplitudeMultiplier;

			this.child.uiUpdate();
		}

		return this.divSoundSource;
	}
}
