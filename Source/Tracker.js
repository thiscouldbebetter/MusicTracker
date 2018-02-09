
function Tracker(songCurrent)
{
	this.songCurrent = songCurrent;
}
{
	Tracker.new = function()
	{
		var song = Song.new();
		var returnValue = new Tracker(song);
		return returnValue;
	}

	Tracker.Instance = Tracker.new();

	Tracker.samplesToWavFile = function(fileName, samplesPerSecond, bitsPerSample, samplesToConvert)
	{
		var samplesForWavFile = [];
		for (var s = 0; s < samplesToConvert.length; s++)
		{
			var sample = samplesToConvert[s];
			var sampleRectified = (sample + 1) / 2;
			var sampleMultiplier = Math.pow(2, bitsPerSample) - 1;
			var sampleScaled =
				Math.round(sampleRectified * sampleMultiplier);
			// todo - Little-Endian?
			samplesForWavFile.push(sampleScaled);

		}
		var samplesAsWavFile = new WavFile
		(
			fileName, 
			new WavFileSamplingInfo
			(
				1, // formatCode
				1, // numberOfChannels
				samplesPerSecond,
				bitsPerSample
			),
			[ samplesForWavFile ] // samplesForChannels
		);

		return samplesAsWavFile;
	}

	// ui

	Tracker.prototype.uiClear = function()
	{
		this.divTracker.parentElement.removeChild(this.divTracker);
		this.songCurrent.uiClear();
		delete this.divTracker;
	}

	Tracker.prototype.uiUpdate = function()
	{
		if (this.divTracker == null)
		{
			this.divTracker = document.createElement("div");

			var divSong = this.songCurrent.uiUpdate();
			this.divTracker.appendChild(divSong);

			var divMain = document.getElementById("divMain");
			divMain.appendChild(this.divTracker);

			this.songCurrent.uiUpdate(); // hack
		}

		this.songCurrent.uiUpdate();
	}
}
