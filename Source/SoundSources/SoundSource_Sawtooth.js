
function SoundSource_Sawtooth()
{
	this.typeName = SoundSourceType.Instances().Sawtooth.name;
}

{
	SoundSource_Sawtooth.prototype.sampleForFrequencyAndTime = function(frequencyInHertz, timeInSeconds)
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

	SoundSource_Sawtooth.prototype.uiClear = function()
	{
		delete this.divSoundSource;
	}

	SoundSource_Sawtooth.prototype.uiUpdate = function()
	{
		if (this.divSoundSource == null)
		{
			this.divSoundSource = document.createElement("div");
		}

		return this.divSoundSource;
	}
}
