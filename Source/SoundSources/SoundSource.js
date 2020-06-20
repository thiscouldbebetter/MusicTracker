
class SoundSource
{
	constructor(child)
	{
		this.child = child;
	}

	// constants

	static RadiansPerCycle = Math.PI * 2;

	// methods

	sampleForFrequencyAndTime
	(
		frequencyInHertz, timeInSeconds
	)
	{
		var returnValue = this.child.sampleForFrequencyAndTime
		(
			frequencyInHertz, timeInSeconds
		);
		return returnValue;
	}

	// serialization

	static objectPrototypesSet(object)
	{
		object.__proto__ = SoundSource.prototype;
		var child = object.child;
		var childTypeName = child.typeName;
		var type = SoundSourceType.Instances()[childTypeName];
		type.objectPrototypesSet(child);
	}

	// ui

	uiClear()
	{
		delete this.divSoundSource;
		this.child.uiClear();
	}

	uiUpdate()
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			var soundSource = this;

			var divSoundSource = d.createElement("div");
			divSoundSource.style.border = "1px solid";

			var labelType = d.createElement("label");
			labelType.innerText = "Type:";
			divSoundSource.appendChild(labelType);

			var selectType = d.createElement("select");
			var soundSourceTypes = SoundSourceType.Instances()._All;
			for (var i = 0; i < soundSourceTypes.length; i++)
			{
				var soundSourceType = soundSourceTypes[i];
				var soundSourceTypeName = soundSourceType.name;
				var soundSourceTypeAsOption = d.createElement("option");
				soundSourceTypeAsOption.innerText = soundSourceTypeName;
				selectType.appendChild(soundSourceTypeAsOption);
			}
			selectType.onchange = (event) =>
			{
				var selectType = event.target;
				var typeNameSelected = selectType.value;
				var typeSelected = SoundSourceType.Instances()[typeNameSelected];
				divSoundSource.removeChild(soundSource.child.divSoundSource);
				var child = typeSelected.soundSourceCreate();
				soundSource.child = child;
				divSoundSource.appendChild(child.uiUpdate());
				child.uiUpdate(); // hack
			}
			selectType.value = this.child.typeName;
			divSoundSource.appendChild(selectType);
			divSoundSource.appendChild(d.createElement("br"));

			var childAsUIElement = this.child.uiUpdate();
			divSoundSource.appendChild(childAsUIElement);

			this.divSoundSource = divSoundSource;
		}
		else
		{
			this.child.uiUpdate();
		}

		return this.divSoundSource;
	}
}
