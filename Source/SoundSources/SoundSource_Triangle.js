
function SoundSource_Triangle()
{
	this.typeName = SoundSourceType.Instances().Triangle.name;
}

{
	SoundSource_Triangle.prototype.sampleForFrequencyAndTime = function(frequencyInHertz, timeInSeconds)
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample;
		if (fractionOfCycleComplete <= .5)
		{
			sample = fractionOfCycleComplete;
		}
		else
		{
			sample = 1 - fractionOfCycleComplete;
		}
		sample = sample * 4 - 1;

		return sample;
	}

	// ui

	SoundSource_Triangle.prototype.uiClear = function()
	{
		delete this.divSoundSource;
	}

	SoundSource_Triangle.prototype.uiUpdate = function()
	{
		if (this.divSoundSource == null)
		{
			this.divSoundSource = document.createElement("div");
		}

		return this.divSoundSource;
	}
}
