function Instrument(name, soundSource)
{
	this.name = name;
	this.soundSource = soundSource;
}

{
	Instrument.new = function(name)
	{
		var returnValue = new Instrument
		(
			name,
			new SoundSource
			(
				new SoundSource_Sine()
			)
		);
		return returnValue;
	}

	Instrument.prototype.sampleForFrequencyAndTime = function(frequencyInHertz, timeInSeconds)
	{
		var returnValue = this.soundSource.sampleForFrequencyAndTime
		(
			frequencyInHertz, timeInSeconds
		);
		return returnValue;
	}

	Instrument.prototype.samplesForNote = function
	(
		samplesPerSecond, durationInSamples, frequencyInHertz, volumeAsFraction
	)
	{
		var noteAsSamples = [];

		for (var s = 0; s < durationInSamples; s++)
		{
			var timeInSeconds = s / samplesPerSecond;
			var sample = this.sampleForFrequencyAndTime
			(
				frequencyInHertz, timeInSeconds
			);
			sample *= volumeAsFraction;
			noteAsSamples.push(sample);
		}

		return noteAsSamples;
	}

	// string

	Instrument.objectPrototypesSet = function(object)
	{
		object.__proto__ = Instrument.prototype;
		SoundSource.objectPrototypesSet(object.soundSource);
	}

	Instrument.fromStringJSON = function(instrumentAsJSON)
	{
		var returnValue = JSON.parse(instrumentAsJSON);
		Instrument.objectPrototypesSet(returnValue);
		return returnValue;
	}

	Instrument.prototype.toStringJSON = function()
	{
		var returnValue = JSON.stringify(this);
		return returnValue;
	}

	// ui

	Instrument.prototype.uiClear = function()
	{
		if (this.divInstrument != null)
		{
			var parentElement = this.divInstrument.parentElement;
			if (parentElement != null)
			{
				parentElement.removeChild(this.divInstrument);
			}
			delete this.divInstrument;
			delete this.inputName;
		}
		this.soundSource.uiClear();
	}

	Instrument.prototype.uiUpdate = function()
	{
		var instrument = this;
		var d = document;

		if (this.divInstrument == null)
		{
			divInstrument = d.createElement("div");

			var labelName = d.createElement("label");
			labelName.innerText = "Name:";
			divInstrument.appendChild(labelName);

			inputName = d.createElement("input");
			inputName.value = this.name;
			inputName.onchange = function(event)
			{
				instrument.name = inputName.value;
				instrument.uiClear();
				instrument.uiUpdate();
			}
			divInstrument.appendChild(inputName);
			this.inputName = inputName;

			var buttonSave = d.createElement("button");
			buttonSave.innerText = "Save";
			buttonSave.onclick = function()
			{
				instrument.uiClear();
				var instrumentAsJSON = instrument.toStringJSON();
				instrument.uiUpdate();
				FileHelper.saveTextAsFile(instrumentAsJSON, "Instrument.json");
			}
			divInstrument.appendChild(buttonSave);

			divInstrument.appendChild(d.createElement("br"));

			var labelSoundSource = d.createElement("label");
			labelSoundSource.innerText = "Sound Source:";
			divInstrument.appendChild(labelSoundSource);

			var divForSoundSource = this.soundSource.uiUpdate();
			divInstrument.appendChild(divForSoundSource);

			this.divInstrument = divInstrument;
		}

		this.inputName.value = this.name;
		this.soundSource.uiUpdate();

		return this.divInstrument;
	}
}
