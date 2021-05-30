
class Sound //
{
	name: string;
	sourceWavFile: WavFile;
	offsetInSeconds: number;

	domElementAudio: any;

	constructor
	(
		name: string, sourceWavFile: WavFile, offsetInSeconds: number
	)
	{
		this.name = name;
		this.offsetInSeconds = (offsetInSeconds || 0);
		this.sourceWavFile = sourceWavFile;
	}

	// instance methods

	durationInSeconds(): number
	{
		return this.sourceWavFile.durationInSeconds();
	}

	play(callback: ()=>void): void
	{
		var soundAsWavFile = this.sourceWavFile;

		var soundAsBytes = soundAsWavFile.toBytes();

		var soundAsStringBase64 = Base64Encoder.bytesToStringBase64(soundAsBytes);

		var soundAsDataURI = "data:audio/wav;base64," + soundAsStringBase64;

		var domElementSoundSource = document.createElement("source");
		domElementSoundSource.src = soundAsDataURI;

		var domElementAudio = document.createElement("audio");
		domElementAudio.autoplay = true;
		var sound = this;
		domElementAudio.onended = () =>
		{
			sound.stop();
			if (callback != null)
			{
				callback();
			}
		}

		this.domElementAudio = domElementAudio;
		domElementAudio.appendChild(domElementSoundSource);

		document.body.appendChild(domElementAudio);
	}

	stop(): void
	{
		if (this.domElementAudio != null)
		{
			this.domElementAudio.parentElement.removeChild
			(
				this.domElementAudio
			);
			this.domElementAudio = null;
		}
	}
}
