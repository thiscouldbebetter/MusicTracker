
function SoundSource_Noise()
{
	this.typeName = SoundSourceType.Instances().Noise.name;
}

{

	SoundSource_Noise.default = function()
	{
		return new SoundSource_Noise();
	}

	SoundSource_Noise.prototype.sampleForFrequencyAndTime = function
	(
		frequencyInHertz, timeInSeconds
	)
	{
		return Math.random() * 2 - 1;
	}

	// ui

	SoundSource_Noise.prototype.uiClear = function()
	{
		delete this.divSoundSource;
	}

	SoundSource_Noise.prototype.uiUpdate = function()
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");
		}

		return this.divSoundSource;
	}
}
