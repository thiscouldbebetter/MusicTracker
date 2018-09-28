
function SoundSource_Vibrato(pitchChangesPerSecond, pitchMultipliers, areTransitionsSmooth, child)
{
	this.typeName = SoundSourceType.Instances().Vibrato.name;
	this.pitchChangesPerSecond = pitchChangesPerSecond;
	this.pitchMultipliers = pitchMultipliers;
	this.areTransitionsSmooth = areTransitionsSmooth;
	this.child = child;
}
{
	SoundSource_Vibrato.prototype.sampleForFrequencyAndTime = function
	(
		frequencyInHertz, timeInSeconds
	)
	{
		var timeInCycles = timeInSeconds * this.pitchChangesPerSecond;
		var cycleIndexCurrent = Math.floor(timeInCycles);
		var pitchMultiplierIndexCurrent = cycleIndexCurrent % this.pitchMultipliers.length;
		var pitchMultiplierCurrent = this.pitchMultipliers[pitchMultiplierIndexCurrent];

		if (this.areTransitionsSmooth == true)
		{
			var cycleIndexNext = cycleIndexCurrent + 1;
			var fractionThroughCycleCurrent = timeInCycles - cycleIndexCurrent;
			var pitchMultiplierIndexNext = cycleIndexNext % this.pitchMultipliers.length;
			var pitchMultiplierNext = this.pitchMultipliers[pitchMultiplierIndexNext];
			var pitchMultiplierInterpolated =
				pitchMultiplierCurrent * (1 - fractionThroughCycleCurrent)
				+ pitchMultiplierNext * fractionThroughCycleCurrent;
			frequencyInHertz *= pitchMultiplierInterpolated;
		}
		else
		{
			frequencyInHertz *= pitchMultiplierCurrent;
		}

		var returnValue = this.child.sampleForFrequencyAndTime
		(
			frequencyInHertz, timeInSeconds
		);
		return returnValue;
	}

	// ui

	SoundSource_Vibrato.prototype.uiClear = function()
	{
		delete this.divSoundSource;
		delete this.inputPitchChangesPerSecond;
		delete this.inputFrequencyMultipliers;
	}

	SoundSource_Vibrato.prototype.uiUpdate = function()
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			var soundSource = this;

			this.divSoundSource = d.createElement("div");

			var labelChild = d.createElement("label");
			labelChild.innerText = "Child:";
			this.divSoundSource.appendChild(labelChild);

			var divChild = d.createElement("div");
			this.divSoundSource.appendChild(divChild);
			this.divChild = divChild;

			var childAsDiv = this.child.uiUpdate();
			this.divChild.appendChild(childAsDiv);

			var labelPitchChangesPerSecond = d.createElement("label");
			labelPitchChangesPerSecond.innerText = "Pitch Changes per Second:";
			this.divSoundSource.appendChild(labelPitchChangesPerSecond);
			var inputPitchChangesPerSecond = d.createElement("input");
			inputPitchChangesPerSecond.type = "number";
			inputPitchChangesPerSecond.style.width = "64px";
			inputPitchChangesPerSecond.onchange = function(event)
			{
				var inputPitchChangesPerSecond = event.target;
				var pitchChangesPerSecond = parseInt(inputPitchChangesPerSecond.value);
				soundSource.pitchChangesPerSecond = pitchChangesPerSecond;
			}
			this.divSoundSource.appendChild(inputPitchChangesPerSecond);

			var labelPitchMultipliers = d.createElement("label");
			labelPitchMultipliers.innerText = "Pitch Multiplier:";
			this.divSoundSource.appendChild(labelPitchMultipliers);
			var inputPitchMultipliers = d.createElement("input");
			inputPitchMultipliers.style.width = "64px";
			inputPitchMultipliers.onchange = function(event)
			{
				var inputPitchMultipliers = event.target;
				var pitchMultipliersAsString = inputPitchMultipliers.value;
				var pitchMultipliersAsStrings = pitchMultipliersAsString.split(",");
				var pitchMultipliers = [];
				for (var m = 0; m < pitchMultipliersAsStrings.length; m++)
				{
					var pitchMultiplierAsString = pitchMultipliersAsStrings[m];
					var pitchMultiplier = parseFloat(pitchMultiplierAsString);
					pitchMultipliers.push(pitchMultiplier);
				}
				soundSource.pitchMultipliers = pitchMultipliers;
			}
			this.divSoundSource.appendChild(inputPitchMultipliers);

			this.inputPitchChangesPerSecond = inputPitchChangesPerSecond;
			this.inputPitchMultipliers = inputPitchMultipliers;
		}
		else
		{
			this.inputPitchChangesPerSecond.value = this.pitchChangesPerSecond;
			this.inputPitchMultipliers.value = this.pitchMultipliers.join(",");

			this.child.uiUpdate();
		}

		return this.divSoundSource;
	}
}
