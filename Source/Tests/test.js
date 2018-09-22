function test()
{
	var tests = new Tests();
	//tests.wavFilePlay();
	tests.instrumentWavFile();
}

function Tests()
{
	this.wavFilePath = "../../Media/Pluck.wav";
	this.song = Song.new();
	this.sequence = this.song.sequences[0];
	this.track = this.sequence.tracks[0];
}
{
	// helpers

	Tests.prototype.wavFileAtPathLoad = function(wavFilePath, callback)
	{
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", wavFilePath, true);
		xmlHttpRequest.responseType = "blob";
		xmlHttpRequest.onreadystatechange =
			this.wavFileAtPathLoad_FileReadyStateChanged.bind(this, callback);
		xmlHttpRequest.send();
	}

	Tests.prototype.wavFileAtPathLoad_FileReadyStateChanged = function(callback, event)
	{
		var request = event.target;
		if (request.readyState == 4)
		{
			var responseAsBlob = request.response;
			FileHelper.loadFileAsBytes
			(
				responseAsBlob, this.wavFileAtPathLoad_FileLoaded.bind(this, callback)
			);
		}
	}

	Tests.prototype.wavFileAtPathLoad_FileLoaded = function(callback, file, fileAsBytes)
	{
		var wavFile = WavFile.fromBytes("", fileAsBytes);
		callback.call(this, wavFile);
	}

	// tests

	Tests.prototype.instrumentWavFile = function()
	{
		this.wavFileAtPathLoad
		(
			this.wavFilePath,
			function(wavFile)
			{
				var soundSourceWavFile = new SoundSource_WavFile
				(
					60, // frequencyBase,
					wavFile
				);
				var soundSourceWrapper = new SoundSource(soundSourceWavFile);
				var instrument = new Instrument("WavFile", soundSourceWrapper);
				this.song.instrumentAdd(instrument);
				this.track.instrumentName = instrument.name;
				var noteAsString = "C_3-99-0008";
				var note = Note.fromString(noteAsString);
				note.play(this.song, this.sequence, this.track);
				alert("You should hear a sound when you dismiss this dialog.");
			}
		);

	}

	Tests.prototype.wavFilePlay = function()
	{
		this.wavFileAtPathLoad
		(
			this.wavFilePath,
			function(wavFile)
			{
				var sound = new Sound("", wavFile);
				sound.play();
				alert("You should hear a sound when you dismiss this dialog.");
			}
		);
	}
}
