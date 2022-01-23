
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSource_Clip extends SoundSourceChild
{
	startInSeconds: number;
	endInSeconds: number;
	child: SoundSource;

	inputStartInSeconds: any;
	inputEndInSeconds: any;

	constructor
	(
		startInSeconds: number,
		endInSeconds: number,
		child: SoundSource
	)
	{
		super(SoundSourceType.Instances().Clip.name);

		this.startInSeconds = startInSeconds;
		this.endInSeconds = endInSeconds;
		this.child = child;
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		var returnValue;

		if (timeInSeconds < this.startInSeconds || timeInSeconds > this.endInSeconds)
		{
			returnValue = 0;
		}
		else
		{
			returnValue = this.child.sampleForFrequencyAndTime
			(
				frequencyInHertz, timeInSeconds
			);
		}

		return returnValue;
	}

	// ui

	uiClear(): void
	{
		delete this.divSoundSource;
		delete this.inputStartInSeconds;
		delete this.inputEndInSeconds;
	}

	uiUpdate(): void
	{
		var d = document;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");

			var labelStartInSeconds = d.createElement("label");
			labelStartInSeconds.innerText = "Start in Seconds:";
			this.divSoundSource.appendChild(labelStartInSeconds);
			var inputStartInSeconds = d.createElement("input");
			inputStartInSeconds.type = "number";
			inputStartInSeconds.style.width = "64px";
			this.divSoundSource.appendChild(inputStartInSeconds);
			this.inputStartInSeconds = inputStartInSeconds;

			var labelEndInSeconds = d.createElement("label");
			labelEndInSeconds.innerText = "End in Seconds:";
			this.divSoundSource.appendChild(labelEndInSeconds);
			var inputEndInSeconds = d.createElement("input");
			inputEndInSeconds.type = "number";
			inputEndInSeconds.style.width = "64px";
			this.divSoundSource.appendChild(inputEndInSeconds);
			this.inputEndInSeconds = inputEndInSeconds;

			this.divSoundSource.appendChild(d.createElement("br"));

			var labelChild = d.createElement("label");
			labelChild.innerText = "Child:";
			this.divSoundSource.appendChild(labelChild);

			var divChild = d.createElement("div");
			this.divSoundSource.appendChild(divChild);
			this.divChild = divChild;

			var childAsDiv = this.child.uiUpdate();
			this.divChild.appendChild(childAsDiv);
		}
		else
		{
			this.inputStartInSeconds.value = this.startInSeconds;
			this.inputEndInSeconds.value = this.endInSeconds;

			this.child.uiUpdate();
		}

		return this.divSoundSource;
	}
}

}