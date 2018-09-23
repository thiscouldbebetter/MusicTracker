function test()
{
	var tests = new Tests();
	//tests.wavFilePlay();
	tests.modFilePlay();
	//tests.instrumentWavFile();
}

function Tests()
{
	this.wavFilePath = "../../Media/Pluck.wav";
	this.song = Song.new(44100, 16);
	this.sequence = this.song.sequences[0];
	this.track = this.sequence.tracks[0];
}
{
	// helpers

	Tests.prototype.fileAtPathLoad = function(filePath, callback)
	{
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", filePath, true);
		xmlHttpRequest.responseType = "blob";
		xmlHttpRequest.onreadystatechange =
			this.fileAtPathLoad_FileReadyStateChanged.bind(this, callback);
		xmlHttpRequest.send();
	}

	Tests.prototype.fileAtPathLoad_FileReadyStateChanged = function(callback, event)
	{
		var request = event.target;
		if (request.readyState == 4)
		{
			var responseAsBlob = request.response;
			FileHelper.loadFileAsBytes
			(
				responseAsBlob,
				//this.fileAtPathLoad_FileLoaded.bind(this, callback)
				callback.bind(this)
			);
		}
	}

	// tests

	Tests.prototype.instrumentWavFile = function()
	{
		this.fileAtPathLoad
		(
			this.wavFilePath,
			function(file, fileAsBytes)
			{
				var wavFile = WavFile.fromBytes(file.name, fileAsBytes);

				var noteBasePitch = "C_3";
				var noteBaseAsString = noteBasePitch + "-99-0008";
				var noteBase = Note.fromString(noteBaseAsString, 0);
				var soundSourceWavFile = new SoundSource_WavFile
				(
					noteBasePitch, wavFile
				);
				var soundSourceWrapper = new SoundSource(soundSourceWavFile);
				var instrument = new Instrument("WavFile", soundSourceWrapper);
				this.song.instrumentAdd(instrument);
				this.track.instrumentName = instrument.name;
				var noteHigher = noteBase;
				noteHigher.octaveIndex += 1;
				noteHigher.play(this.song, this.sequence, this.track);
				alert("You should hear a sound when you dismiss this dialog.");
			}
		);
	}

	Tests.prototype.modFilePlay = function()
	{
		var modFilePath = "../../Media/Test.mod";

		this.fileAtPathLoad
		(
			modFilePath,
			function(file, fileAsBytes)
			{
				var modFile = ModFile.fromBytes(file.name, fileAsBytes);
				var modFileAsSong = Song.fromModFile(modFile);
				modFileAsSong.play();
				alert("You should hear a song when you dismiss this dialog.");
			}
		);
	}

	Tests.prototype.wavFilePlay = function()
	{
		this.fileAtPathLoad
		(
			this.wavFilePath,
			function(file, fileAsBytes)
			{
				var wavFile = WavFile.fromBytes(file.name, fileAsBytes);
				var sound = new Sound("", wavFile);
				sound.play();
				alert("You should hear a sound when you dismiss this dialog.");
			}
		);
	}
}
