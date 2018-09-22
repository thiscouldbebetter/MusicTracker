
function Sound(name, sourceWavFile, offsetInSeconds)
{
	this.name = name;
	this.offsetInSeconds = (offsetInSeconds || 0);
	this.sourceWavFile = sourceWavFile;
}

{
	// instance methods

	Sound.prototype.durationInSeconds = function()
	{
		return this.sourceWavFile.durationInSeconds();
	}

	Sound.prototype.play = function(callback)
	{
		var soundAsWavFile = this.sourceWavFile;

		var soundAsBytes = soundAsWavFile.toBytes();

		var soundAsStringBase64 = Base64Encoder.bytesToStringBase64(soundAsBytes);

		var soundAsDataURI = "data:audio/wav;base64," + soundAsStringBase64;

		var domElementSoundSource = document.createElement("source");
		domElementSoundSource.src = soundAsDataURI;

		var domElementAudio = document.createElement("audio");
		domElementAudio.autoplay = "autoplay";
		var sound = this;
		domElementAudio.onended = function()
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

	Sound.prototype.stop = function()
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
