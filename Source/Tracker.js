
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
