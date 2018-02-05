
function Sequence(name, ticksPerSecond, durationInTicks, tracks)
{
	this.name = name;
	this.ticksPerSecond = ticksPerSecond;
	this.durationInTicks = durationInTicks;
	this.tracks = tracks;

	this.trackIndexSelected = 0;
	this.tickIndexSelected = 0;
}

{
	Sequence.new = function(sequencesSoFar)
	{
		var ticksPerSecond = 8;
		var sequenceDurationInSeconds = 8;
		var noteVolume = 25;
		var noteOctaveIndex = 3;
		var noteDuration = Math.floor(ticksPerSecond / 2);

		var sequenceName = "Sequence" + sequencesSoFar;

		var returnValue = new Sequence
		(
			sequenceName,
			ticksPerSecond, // ticksPerSecond
			sequenceDurationInSeconds * ticksPerSecond, // durationInTicks
			[
				new Track
				(
					"Sine", // instrumentName
					[
						// notes
						// timeStartInTicks, octaveIndex, pitchCode, volume, durationInTicks
						new Note(0 * noteDuration, noteOctaveIndex, "C_", noteVolume, noteDuration),
						new Note(1 * noteDuration, noteOctaveIndex, "D_", noteVolume, noteDuration),
						new Note(2 * noteDuration, noteOctaveIndex, "E_", noteVolume, noteDuration),
						new Note(3 * noteDuration, noteOctaveIndex, "F_", noteVolume, noteDuration),
						new Note(4 * noteDuration, noteOctaveIndex, "G_", noteVolume, noteDuration),
						new Note(5 * noteDuration, noteOctaveIndex, "A_", noteVolume, noteDuration),
						new Note(6 * noteDuration, noteOctaveIndex, "B_", noteVolume, noteDuration),
						new Note(7 * noteDuration, noteOctaveIndex + 1, "C_", noteVolume, noteDuration),
						new Note(8 * noteDuration, noteOctaveIndex, "B_", noteVolume, noteDuration),
						new Note(9 * noteDuration, noteOctaveIndex, "A_", noteVolume, noteDuration),
						new Note(10 * noteDuration, noteOctaveIndex, "G_", noteVolume, noteDuration),
						new Note(11 * noteDuration, noteOctaveIndex, "F_", noteVolume, noteDuration),
						new Note(12 * noteDuration, noteOctaveIndex, "E_", noteVolume, noteDuration),
						new Note(13 * noteDuration, noteOctaveIndex, "D_", noteVolume, noteDuration),
						new Note(14 * noteDuration, noteOctaveIndex, "C_", noteVolume, noteDuration),
					]
				)
			]
		);

		return returnValue;
	}

	Sequence.prototype.durationInSamples = function(song)
	{
		return this.durationInSeconds() * song.samplesPerSecond;
	}

	Sequence.prototype.durationInSeconds = function()
	{
		return this.durationInTicks / this.ticksPerSecond;
	}

	Sequence.prototype.tickSelectedAsString = function()
	{
		var trackSelected = this.trackSelected();
		var noteAtTick = trackSelected.noteAtTick(this.tickIndexSelected);
		var tickAsString = (noteAtTick == null ? Note.Blank : noteAtTick.toString());
		return tickAsString;
	}

	Sequence.prototype.trackSelected = function()
	{
		return this.tracks[this.trackIndexSelected];
	}

	// samples

	Sequence.prototype.toSamples = function(song)
	{
		var sequenceAsSamples = [];

		var durationInSamples =
			song.samplesPerSecond * this.durationInSeconds();

		for (var s = 0; s < durationInSamples; s++)
		{
			sequenceAsSamples.push(0);
		}

		for (var t = 0; t < this.tracks.length; t++)
		{
			var track = this.tracks[t];
			var trackAsSamples = track.toSamples(song, this);

			for (var s = 0; s < trackAsSamples.length; s++)
			{
				var sampleMixed = sequenceAsSamples[s];
				var sampleFromTrack = trackAsSamples[s];
				sampleMixed += sampleFromTrack;
				if (sampleMixed < -1)
				{
					sampleMixed = -1;
				}
				else if (sampleMixed > 1)
				{
					sampleMixed = 1;
				}
				sequenceAsSamples[s] = sampleMixed;
			}
		}

		return sequenceAsSamples;
	}

	// ui

	Sequence.prototype.uiUpdate = function(song)
	{
		var divSequence = document.getElementById("divSequence");
		if (divSequence == null)
		{
			var sequence = this;

			divSequence = document.createElement("div");
			divSequence.id = "divSequence";
			divSequence.style.border = "1px solid";

			var labelSequenceName = document.createElement("label");
			labelSequenceName.innerText = "Sequence Name:";
			divSequence.appendChild(labelSequenceName);

			var inputSequenceName = document.createElement("input");
			inputSequenceName.id = "inputSequenceName";
			inputSequenceName.onchange = function(event)
			{
				var sequenceNameNew = event.target.value;
				song.sequenceRename(sequence.name, sequenceNameNew);
				Tracker.Instance.uiUpdate();
			}
			divSequence.appendChild(inputSequenceName);
			divSequence.appendChild(document.createElement("br"));

			var labelTicksPerSecond = document.createElement("label");
			labelTicksPerSecond.innerText = "Ticks per Second:";
			divSequence.appendChild(labelTicksPerSecond);

			var inputTicksPerSecond = document.createElement("input");
			inputTicksPerSecond.id = "inputTicksPerSecond";
			inputTicksPerSecond.type = "number";
			inputTicksPerSecond.onchange = function(event)
			{
				var inputTicksPerSecond = event.target;
				var ticksPerSecondAsString = inputTicksPerSecond.value;
				var ticksPerSecond = parseInt(ticksPerSecondAsString);
				sequence.ticksPerSecond = ticksPerSecond;
			}
			divSequence.appendChild(inputTicksPerSecond);
			divSequence.appendChild(document.createElement("br"));

			var labelDurationInTicks = document.createElement("label");
			labelDurationInTicks.innerText = "Duration in Ticks:";
			divSequence.appendChild(labelDurationInTicks);

			var inputDurationInTicks = document.createElement("input");
			inputDurationInTicks.id = "inputDurationInTicks";
			inputDurationInTicks.type = "number";
			inputDurationInTicks.onchange = function(event)
			{
				var inputDurationInTicks = event.target;
				var durationInTicksAsString = inputDurationInTicks.value;
				var durationInTicks = parseInt(durationInTicks);
				sequence.durationInTicks = durationInTicks;
			}
			divSequence.appendChild(inputDurationInTicks);
			divSequence.appendChild(document.createElement("br"));

			var labelTracks = document.createElement("label");
			labelTracks.innerText = "Tracks:";
			divSequence.appendChild(labelTracks);

			var buttonTrackNew = document.createElement("button");
			buttonTrackNew.innerText = "New";
			buttonTrackNew.onclick = function()
			{
				var instrument = song.instruments[0];
				var track = new Track(instrument.name, []);
				sequence.tracks.push(track);
				sequence.uiUpdate(song);
			}
			divSequence.appendChild(buttonTrackNew);

			divSequence.appendChild(document.createElement("br"));

			var divTracks = this.uiUpdate_Tracks(song);

			divSequence.appendChild(divTracks);
		}
		else
		{
			var selectTrack = document.getElementById("selectTrack");
			if (this.tracks.length != selectTrack.children.length)
			{
				selectTrack.innerHTML = "";
				for (var i = 0; i < this.tracks.length; i++)
				{
					var track = this.tracks[i];
					var trackAsSelectOption = document.createElement("option");
					trackAsSelectOption.innerText = "" + i;
					selectTrack.appendChild(trackAsSelectOption);
				}
				selectTrack.selectedIndex = this.trackIndexSelected;
			}

			var inputSequenceName = document.getElementById("inputSequenceName");
			inputSequenceName.value = this.name;

			var inputTicksPerSecond = document.getElementById("inputTicksPerSecond");
			inputTicksPerSecond.value = this.ticksPerSecond;

			var inputDurationInTicks = document.getElementById("inputDurationInTicks");
			inputDurationInTicks.value = this.durationInTicks;

			this.uiUpdate_Tracks(song);
		}

		return divSequence;
	}

	Sequence.prototype.uiUpdate_Tracks = function(song)
	{
		var divTracks = document.getElementById("divTracks");
		if (divTracks == null)
		{
			var sequence = this;

			var divTracks = document.createElement("div");
			divTracks.id = "divTracks";
			divTracks.style.border = "1px solid";

			var labelTrackSelected = document.createElement("label");
			labelTrackSelected.innerText = "Track Selected:";
			divTracks.appendChild(labelTrackSelected);

			var selectTrack = document.createElement("select");
			selectTrack.id = "selectTrack";
			selectTrack.onchange = function(event)
			{
				var selectTrack = event.target;
				sequence.trackIndexSelected = selectTrack.value;
				sequence.uiUpdate(song);
			}
			divTracks.appendChild(selectTrack);

			var buttonTrackSelectedDelete = document.createElement("button");
			buttonTrackSelectedDelete.innerText = "Delete";
			buttonTrackSelectedDelete.onclick = function()
			{
				var trackSelected = sequence.trackSelected();
				sequence.tracks.remove(trackSelected);
				sequence.uiUpdate(song);
			}
			divTracks.appendChild(buttonTrackSelectedDelete);

			var divTrack = document.createElement("div");

			var labelInstrument = document.createElement("label");
			labelInstrument.innerText = "Instrument:";
			divTrack.appendChild(labelInstrument);

			var selectInstruments = document.createElement("select");
			var instruments = song.instruments;
			for (var i = 0; i < instruments.length; i++)
			{
				var instrument = instruments[i];
				var instrumentAsSelectOption = document.createElement("option");
				instrumentAsSelectOption.innerText = instrument.name;
				selectInstruments.appendChild(instrumentAsSelectOption);
			}
			divTrack.appendChild(selectInstruments);

			var divTickSelected = document.createElement("div");

			var labelTickSelected = document.createElement("label");
			labelTickSelected.innerText = "Tick Selected:";
			divTickSelected.appendChild(labelTickSelected);

			var inputTickSelected = document.createElement("input");
			inputTickSelected.id = "inputTickSelected";
			inputTickSelected.style.fontFamily = "monospace";
			inputTickSelected.size = 12;
			inputTickSelected.onkeypress = function(event)
			{
				if (event.key == "Enter")
				{
					var tickIndex = sequence.tickIndexSelected;
					var inputTickSelected = event.target;
					var tickAsString = inputTickSelected.value;
					var tickAsNote = Note.fromString(tickAsString, tickIndex);
					var trackSelected = sequence.trackSelected();
					trackSelected.noteAtTick_Set(tickIndex, tickAsNote);
					sequence.uiUpdate_Tracks(song);
				}
			}
			divTickSelected.appendChild(inputTickSelected);

			var buttonTickSelectedApply = document.createElement("button");
			buttonTickSelectedApply.innerText = "Apply";
			buttonTickSelectedApply.onclick = function()
			{
				var tickIndex = sequence.tickIndexSelected;
				var tickAsString = inputTickSelected.value;
				var tickAsNote = Note.fromString(tickAsString, tickIndex);
				var trackSelected = sequence.trackSelected();
				trackSelected.noteAtTick_Set(tickIndex, tickAsNote);
				sequence.uiUpdate_Tracks(song);
			}
			divTickSelected.appendChild(buttonTickSelectedApply);

			var labelNoteFormat = document.createElement("label");
			labelNoteFormat.innerText = "[pitch+octave]-[volume]-[duration], e.g. 'C_3-99-0128'";
			divTickSelected.appendChild(labelNoteFormat);

			divTrack.appendChild(divTickSelected);

			divTracks.appendChild(divTrack);

			divTracks.appendChild(document.createElement("br"));

			var selectTicks = document.createElement("select");
			selectTicks.id = "selectTicks";
			selectTicks.size = 16;
			selectTicks.style.fontFamily = "monospace";
			selectTicks.onchange = function(event)
			{
				var selectTicks = event.target;
				var tickIndex = selectTicks.selectedIndex;
				sequence.tickIndexSelected = tickIndex;
				var tickAsString = sequence.tickSelectedAsString();
				inputTickSelected.value = tickAsString;
			}
			divTracks.appendChild(selectTicks);
		}
		else
		{
			var sequenceTicksAsStrings = [];
			var ticksForTracks = [];
			var noteBlank = Note.Blank;

			for (var t = 0; t < this.tracks.length; t++)
			{
				var track = this.tracks[t];
				var ticksForTrack = [];

				for (var i = 0; i < this.durationInTicks; i++)
				{
					ticksForTrack.push(noteBlank);
				}

				var notes = track.notes;
				for (var i = 0; i < notes.length; i++)
				{
					var note = notes[i];
					var noteAsString = note.toString();
					ticksForTrack[note.timeStartInTicks] = noteAsString;
				}

				ticksForTracks.push(ticksForTrack);
			}

			var selectTicks = document.getElementById("selectTicks");
			selectTicks.innerHTML = "";

			for (var i = 0; i < this.durationInTicks; i++)
			{
				var ticksForTracksToJoin = [];

				for (var t = 0; t < this.tracks.length; t++)
				{
					var tickForTrack = ticksForTracks[t][i];
					ticksForTracksToJoin.push(tickForTrack);
				}

				var tickIndex = ("" + i).padLeft(5, "0");
				ticksForTracksToJoin.insertElementAt(tickIndex, 0);

				var tickAsString = ticksForTracksToJoin.join(" | ");
				var tickAsSelectOption = document.createElement("option");
				tickAsSelectOption.innerText = tickAsString;
				selectTicks.appendChild(tickAsSelectOption);
			}

			selectTicks.selectedIndex = this.tickIndexSelected;

			var inputTickSelected = document.getElementById("inputTickSelected");
			if (inputTickSelected != null)
			{
				var tickAsString = this.tickSelectedAsString();
				inputTickSelected.value = tickAsString;
			}
		}

		return divTracks;
	}
}
