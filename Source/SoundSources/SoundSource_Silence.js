
function SoundSource_Silence()
{
	this.typeName = SoundSourceType.Instances().Silence.name;
}

{
	SoundSource_Silence.prototype.sampleForFrequencyAndTime = function(frequencyInHertz, timeInSeconds)
	{
		return 0;
	}

	SoundSource_Silence.prototype.uiClear = function()
	{
		delete this.divSoundSource;
	}

	SoundSource_Silence.prototype.uiUpdate = function()
	{
		if (this.divSoundSource == null)
		{
			this.divSoundSource = document.createElement("div");
		}

		return this.divSoundSource;
	}

}
