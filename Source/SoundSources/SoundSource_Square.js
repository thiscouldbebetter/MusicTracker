
function SoundSource_Square()
{
	this.typeName = SoundSourceType.Instances().Square.name;
}

{
	SoundSource_Square.prototype.sampleForFrequencyAndTime = function(frequencyInHertz, timeInSeconds)
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample = (fractionOfCycleComplete <= .5 ? 1 : -1);
		return sample;
	}

	// ui

	SoundSource_Square.prototype.uiClear = function()
	{
		delete this.divSoundSource;
	}

	SoundSource_Square.prototype.uiUpdate = function()
	{
		if (this.divSoundSource == null)
		{
			this.divSoundSource = document.createElement("div");
		}

		return this.divSoundSource;
	}
}
