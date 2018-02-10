
function SoundSource_WavFile(wavFile)
{
	this.typeName = SoundSourceType.Instances().WavFile.name;
	this.wavFile = wavFile;
}
{
	SoundSource_WavFile.prototype.sampleForFrequencyAndTime = function
	(
		frequencyInHertz, timeInSeconds
	)
	{
		var sampleIndex = Math.floor
		(
			timeInSeconds * this.samplesPerSecond()
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

			var buttonPlay = d.createElement("button");
			buttonPlay.innerText = "Play";
			buttonPlay.onclick = function()
			{
				new Sound("", soundSource.wavFile).play();
			}
			this.divSoundSource.appendChild(buttonPlay);

			/*
			var buttonPlay2 = d.createElement("button");
			buttonPlay2.innerText = "Play2";
			buttonPlay2.onclick = function()
			{
				var wavFileSource = soundSource.wavFile;
				var samplesDenormalized = wavFileSource.samplesForChannels[0];
				var samplingInfo = wavFileSource.samplingInfo;
				var samplesNormalized =
					samplingInfo.samplesNormalize(samplesDenormalized);
				var samplesAnalyzed = FrequencyAnalysis.fromSamples
				(
					256, // numberOfOscillators,
					20, // frequencyLowestInCyclesPerSecond,
					samplingInfo.samplesPerSecond,
					samplesNormalized
				);
				var samplesSynthesized = samplesAnalyzed.toSamples
				(
					samplingInfo.samplesPerSecond,
					20, // freqencyFundamentalInCyclesPerSecond,
					2 // durationInSeconds
				);
				var samplesSynthesizedAndDenormalized =
					samplingInfo.samplesDenormalize(samplesSynthesized);
				var wavFileTransformed = new WavFile
				(
					"", samplingInfo, samplesSynthesizedAndDenormalized
				);
				new Sound("", wavFileTransformed).play();
			}
			this.divSoundSource.appendChild(buttonPlay2);
			*/

		}

		return this.divSoundSource;
	}
}
