
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSource //
{
	child: SoundSourceChild;

	divSoundSource: any;

	constructor(child: SoundSourceChild)
	{
		this.child = child;
	}

	// constants

	static RadiansPerCycle = Math.PI * 2;

	// methods

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	)
	{
		var returnValue = this.child.sampleForFrequencyAndTime
		(
			frequencyInHertz, timeInSeconds
		);
		return returnValue;
	}

	// serialization

	static objectPrototypesSet(objectToSet: any): void
	{
		Object.setPrototypeOf(objectToSet, SoundSource.prototype);
		var child = objectToSet.child;
		var childTypeName = child.typeName;
		var type = SoundSourceType.Instances().byName(childTypeName);
		type.objectPrototypesSet(child);
	}

	compressForSerialization(): void
	{
		this.child.compressForSerialization();
	}

	// ui

	uiClear(): void
	{
		delete this.divSoundSource;
		this.child.uiClear();
	}

	uiUpdate(): any
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
			selectType.onchange = (event: any) =>
			{
				var selectType = event.target;
				var typeNameSelected = selectType.value;
				var typeSelected = SoundSourceType.Instances().byName(typeNameSelected);
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

}