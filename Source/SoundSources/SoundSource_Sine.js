
function SoundSource_Sine()
{
	this.typeName = SoundSourceType.Instances().Sine.name;
}

{
	SoundSource_Sine.prototype.sampleForFrequencyAndTime = function(frequencyInHertz, timeInSeconds)
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

	SoundSource_Sine.prototype.uiClear = function()
	{
		delete this.divSoundSource;
	}

	SoundSource_Sine.prototype.uiUpdate = function()
	{
		if (this.divSoundSource == null)
		{
			this.divSoundSource = document.createElement("div");
		}

		return this.divSoundSource;
	}
}
