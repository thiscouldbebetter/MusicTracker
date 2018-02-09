
function SoundSource_Mix(children)
{
	this.typeName = SoundSourceType.Instances().Mix.name;

	this.children = children;

	this.childIndexSelected = 0;
}

{
	SoundSource_Mix.prototype.childSelected = function()
	{
		return this.children[this.childIndexSelected];
	}

	// samples

	SoundSource_Mix.prototype.sampleForFrequencyAndTime = function
	(
		frequencyInHertz, timeInSeconds
	)
	{
		var returnValue = 0;

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			var sampleFromChild =
				child.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
			returnValue += sampleFromChild;
		}

		if (returnValue < -1)
		{
			returnValue = -1;
		}
		else if (returnValue > 1)
		{
			returnValue = 1;
		}

		return returnValue;
	}

	// ui

	SoundSource_Mix.prototype.uiClear = function()
	{
		delete this.divSoundSource;
		delete this.selectChild;
		for (var i = 0; i < this.children.length; i++)
		{
			var children = this.children[i];
			children.uiClear();
		}
	}

	SoundSource_Mix.prototype.uiUpdate = function()
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			var soundSource = this;

			this.divSoundSource = d.createElement("div");

			var labelChild = d.createElement("label");
			labelChild.innerText = "Child:";
			this.divSoundSource.appendChild(labelChild);

			var selectChild = d.createElement("select");
			for (var i = 0; i < this.children.length; i++)
			{
				var child = this.children[i];
				childAsOption = d.createElement("option");
				childAsOption = "" + i;
				selectChild.appendChild(childAsOption);
			}
			this.divSoundSource.appendChild(selectChild);
			this.selectChild = selectChild;

			var buttonChildAdd = d.createElement("button");
			buttonChildAdd.innerText = "New";
			buttonChildAdd.onclick = function()
			{
				var child = new SoundSource(new SoundSource_Sine());
				var childIndex = soundSource.children.length;
				soundSource.childIndexSelected = childIndex;
				soundSource.children.push(child);
				var childAsOption = d.createElement("option");
				childAsOption.innerText = childIndex;
				selectChild.appendChild(childAsOption);
				soundSource.uiUpdate();
			}
			this.divSoundSource.appendChild(buttonChildAdd);

			var divChild = d.createElement("div");
			this.divSoundSource.appendChild(divChild);
			this.divChild = divChild;
		}
		else
		{
			var childSelected = this.childSelected();

			if (childSelected != null)
			{
				this.selectChild.value = childSelected.name;
				childSelected.uiUpdate();
			}
		}

		return this.divSoundSource;
	}
}
