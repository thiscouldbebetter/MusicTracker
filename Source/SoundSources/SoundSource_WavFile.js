
function SoundSource_WavFile(pitchBase, wavFile)
{
	this.typeName = SoundSourceType.Instances().WavFile.name;
	this.pitchBase = pitchBase;
	this.wavFile = wavFile;

	this._frequencyBase = null;
}
{
	SoundSource_WavFile.prototype.frequencyBase = function()
	{
		if (this._frequencyBase == null)
		{
			var note = Note.fromString(this.pitchBase + "-00-0000")
			this._frequencyBase = note.frequencyInHertz();
		}

		return this._frequencyBase;
	}

	SoundSource_WavFile.prototype.sampleForFrequencyAndTime = function
	(
		frequencyInHertz, timeInSeconds
	)
	{
		var samplesPerSecond = this.samplesPerSecond();
		var sampleIndex = Math.floor
		(
			timeInSeconds
			* frequencyInHertz
			/ this.frequencyBase()
			* samplesPerSecond
		);
		var returnValue = this.samplesNormalized()[sampleIndex];

		return returnValue;
	}

	SoundSource_WavFile.prototype.samplesNormalized = function()
	{
		if (this._samplesNormalized == null)
		{
			if (this.wavFile != null)
			{
				var samplingInfo = this.wavFile.samplingInfo;
				this._samplesNormalized =
					samplingInfo.samplesNormalize
					(
						this.wavFile.samplesForChannels[0]
					);
			}
		}
		return this._samplesNormalized;
	}

	SoundSource_WavFile.prototype.samplesPerSecond = function()
	{
		if (this._samplesPerSecond == null)
		{
			if (this.wavFile != null)
			{
				this._samplesPerSecond =
					this.wavFile.samplingInfo.samplesPerSecond;
			}
		}
		return this._samplesPerSecond;
	}

	// ui

	SoundSource_WavFile.prototype.uiClear = function()
	{
		delete this.divSoundSource;
	}

	SoundSource_WavFile.prototype.uiUpdate = function()
	{
		var d = document;
		var soundSource = this;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");

			var inputWavFile = d.createElement("input");
			inputWavFile.type = "file";
			inputWavFile.onchange = function(event)
			{
				var inputWavFile = event.target;
				var file = inputWavFile.files[0];
				if (file != null)
				{
					FileHelper.loadFileAsBytes
					(
						file,
						function callback(file, fileAsBytes)
						{
							soundSource.wavFile =
								WavFile.fromBytes(file.name, fileAsBytes);
						}
					);
				}
			}
			this.divSoundSource.appendChild(inputWavFile);

			var labelPitchBase = d.createElement("label");
			labelPitchBase.innerHTML = "Pitch:";
			this.divSoundSource.appendChild(labelPitchBase);

			var inputPitchBase = d.createElement("input");
			inputPitchBase.onchange = function(event)
			{
				soundSource.pitchBase = event.target.value;
				soundSource._frequencyBase = null;
			}
			inputPitchBase.value = this.pitchBase;
			this.divSoundSource.appendChild(inputPitchBase);

			var buttonPlay = d.createElement("button");
			buttonPlay.innerText = "Play";
			buttonPlay.onclick = function()
			{
				new Sound("", soundSource.wavFile).play();
			}
			this.divSoundSource.appendChild(buttonPlay);
		}

		return this.divSoundSource;
	}
}
