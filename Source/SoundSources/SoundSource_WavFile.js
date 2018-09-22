
function SoundSource_WavFile(frequencyBase, wavFile)
{
	this.typeName = SoundSourceType.Instances().WavFile.name;
	this.frequencyBase = frequencyBase;
	this.wavFile = wavFile;
}
{
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
			/ this.frequencyBase
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

			var labelFrequencyBase = d.createElement("label");
			labelFrequencyBase.innerHTML = "Frequency:";
			this.divSoundSource.appendChild(labelFrequencyBase);

			var inputFrequencyBase = d.createElement("input");
			inputFrequencyBase.type = "number";
			inputFrequencyBase.onchange = function(event)
			{
				soundSource.frequencyBase = parseInt(event.target.value);
			}
			inputFrequencyBase.value = 261.63; // C4
			this.divSoundSource.appendChild(inputFrequencyBase);

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
				var samplingInfoIn = wavFileSource.samplingInfo;
				var samplesNormalized =
					samplingInfoIn.samplesNormalize(samplesDenormalized);
				var frequencyFundamental = 1;
				var samplesAnalyzed = FrequencyAnalysis.fromSamples
				(
					1024, // numberOfOscillators,
					frequencyFundamental,
					samplingInfoIn.samplesPerSecond,
					samplesNormalized
				);
				var samplingInfoOut = new WavFileSamplingInfo(1, 1, 8000, 8); // todo
				var samplesSynthesized = samplesAnalyzed.toSamples
				(
					samplingInfoOut.samplesPerSecond,
					frequencyFundamental,
					1 // durationInSeconds
				);
				var samplesSynthesizedAndDenormalized =
					samplingInfoOut.samplesDenormalize(samplesSynthesized);
				var wavFileTransformed = new WavFile
				(
					"analysis.wav",
					samplingInfoOut,
					[ samplesSynthesizedAndDenormalized ]
				);
				var wavFileTransformedAsBytes =
					wavFileTransformed.toBytes();
				FileHelper.saveBytesToFile
				(
					wavFileTransformedAsBytes,
					wavFileTransformed.filePath
				)
				new Sound("", wavFileTransformed).play();
			}
			this.divSoundSource.appendChild(buttonPlay2);
			*/

		}

		return this.divSoundSource;
	}
}
