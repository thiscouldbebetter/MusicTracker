
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSource_WavFile extends SoundSourceChild
{
	pitchBaseCode: string;
	wavFile: WavFile;

	_frequencyBase: number;
	_samplesNormalized: number[];
	_samplesPerSecond: number;

	constructor(pitchBaseCode: string, wavFile: WavFile)
	{
		super(SoundSourceType.Instances().WavFile.name);

		this.pitchBaseCode = pitchBaseCode;
		this.wavFile = wavFile;

		this._frequencyBase = null;
	}

	frequencyBase(): number
	{
		if (this._frequencyBase == null)
		{
			var note = Note.fromString(this.pitchBaseCode + "-00-0000", null)
			this._frequencyBase = note.frequencyInHertz();
		}

		return this._frequencyBase;
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
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
		var samples = this.samplesNormalized();
		var returnValue = (sampleIndex >= samples.length ? 0 : samples[sampleIndex]);

		return returnValue;
	}

	samplesNormalized(): number[]
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

	samplesPerSecond(): number
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

	// Serialization.

	compressForSerialization(): void
	{
		this._samplesNormalized = null;

		// todo - Convert samples to Base64.
	}

	decompressAfterDeserialization(): void
	{
		// todo - Convert samples back from Base64.
	}

	// UI.

	uiClear(): void
	{
		delete this.divSoundSource;
	}

	uiUpdate(): void
	{
		var d = document;
		var soundSource = this;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");

			var inputWavFile = d.createElement("input");
			inputWavFile.type = "file";
			inputWavFile.onchange = (event: any) =>
			{
				var inputWavFile = event.target;
				var file = inputWavFile.files[0];
				if (file != null)
				{
					FileHelper.loadFileAsBytes
					(
						file,
						(file: any, fileAsBytes: number[]) =>
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
			inputPitchBase.onchange = (event: any) =>
			{
				soundSource.pitchBaseCode = event.target.value;
				soundSource._frequencyBase = null;
			}
			inputPitchBase.value = this.pitchBaseCode;
			this.divSoundSource.appendChild(inputPitchBase);

			var buttonPlay = d.createElement("button");
			buttonPlay.innerText = "Play";
			buttonPlay.onclick = () =>
			{
				new Sound("", soundSource.wavFile, null).play(null);
			}
			this.divSoundSource.appendChild(buttonPlay);
		}

		return this.divSoundSource;
	}
}

}