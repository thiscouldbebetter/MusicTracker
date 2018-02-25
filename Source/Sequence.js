
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
	Sequence.demo = function(instrumentName, sequencesSoFar)
	{
		var ticksPerSecond = 8;
		var sequenceDurationInSeconds = 8;
		var noteVolume = 25;
		var noteOctaveIndex = 3;
		var noteDuration = Math.floor(ticksPerSecond / 2);
		var noteOctaveIndexLow = noteOctaveIndex - 1;
		var noteDurationLong = noteDuration * 2;

		var sequenceName = String.fromCharCode
		(
			"A".charCodeAt(0) + sequencesSoFar
		);

		var returnValue = new Sequence
		(
			sequenceName,
			ticksPerSecond, // ticksPerSecond
			sequenceDurationInSeconds * ticksPerSecond, // durationInTicks
			[
				new Track
				(
					instrumentName,
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
				),
				new Track
				(
					instrumentName,
					[
						// notes
						// timeStartInTicks, octaveIndex, pitchCode, volume, durationInTicks
						new Note(0 * noteDurationLong, noteOctaveIndexLow, "C_", noteVolume, noteDurationLong),
						new Note(1 * noteDurationLong, noteOctaveIndexLow, "D_", noteVolume, noteDurationLong),
						new Note(2 * noteDurationLong, noteOctaveIndexLow, "E_", noteVolume, noteDurationLong),
						new Note(3 * noteDurationLong, noteOctaveIndexLow, "F_", noteVolume, noteDurationLong),
						new Note(4 * noteDurationLong, noteOctaveIndexLow, "G_", noteVolume, noteDurationLong),
						new Note(5 * noteDurationLong, noteOctaveIndexLow, "A_", noteVolume, noteDurationLong),
						new Note(6 * noteDurationLong, noteOctaveIndexLow, "B_", noteVolume, noteDurationLong),
						new Note(7 * noteDurationLong, noteOctaveIndexLow + 1, "C_", noteVolume, noteDurationLong),
					]
				)
			]
		);

		return returnValue;
	}

	Sequence.new = function(instrumentName, sequencesSoFar)
	{
		var ticksPerSecond = 8;
		var sequenceDurationInSeconds = 8;

		var sequenceName = String.fromCharCode
		(
			"A".charCodeAt(0) + sequencesSoFar
		);

		var returnValue = new Sequence
		(
			sequenceName,
			ticksPerSecond, // ticksPerSecond
			sequenceDurationInSeconds * ticksPerSecond, // durationInTicks
			[
				new Track
				(
					instrumentName,
					[] // notes
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

	Sequence.prototype.trackSelected = function(value)
	{
		if (value != null)
		{
			this.trackIndexSelected = this.tracks.indexOf(value);
		}
		return this.tracks[this.trackIndexSelected];
	}

	// cloneable

	Sequence.prototype.clone = function()
	{
		return new Sequence
		(
			this.name + "_Cloned",
			this.ticksPerSecond,
			this.durationInTicks,
			this.tracks.clone()
		);
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

	Sequence.prototype.uiClear = function()
	{
		delete this.divSequence;
		delete this.inputSequenceName;
		delete this.inputTicksPerSecond;
		delete this.inputDurationInTicks;
		delete this.divTracks;
		delete this.selectTrack;
		delete this.selectInstrument;
		delete this.inputTickSelected;
		delete this.selectTicks;
	}

	Sequence.prototype.uiUpdate = function(song)
	{
		var d = document;

		if (this.divSequence == null)
		{
			var sequence = this;

			divSequence = d.createElement("div");
			divSequence.style.border = "1px solid";
			this.divSequence = divSequence;

			var labelSequenceName = d.createElement("label");
			labelSequenceName.innerText = "Sequence Name:";
			divSequence.appendChild(labelSequenceName);

			var inputSequenceName = d.createElement("input");
			inputSequenceName.onchange = function(event)
			{
				var sequenceNameNew = event.target.value;
				song.sequenceRename(sequence.name, sequenceNameNew);
				Tracker.Instance.uiUpdate();
			}
			divSequence.appendChild(inputSequenceName);
			this.inputSequenceName = inputSequenceName;

			var buttonSequenceSelectedPlay = d.createElement("button");
			buttonSequenceSelectedPlay.innerText = "Play";
			buttonSequenceSelectedPlay.onclick = function()
			{
				var sequenceAsSamples = sequence.toSamples(song, sequence);
				var sequenceAsWavFile = Tracker.samplesToWavFile
				(
					"", song.samplesPerSecond, song.bitsPerSample, sequenceAsSamples
				);
				var sequenceAsSound = new Sound("", sequenceAsWavFile);
				sequenceAsSound.play();
			}
			divSequence.appendChild(buttonSequenceSelectedPlay);

			divSequence.appendChild(d.createElement("br"));

			var labelTicksPerSecond = d.createElement("label");
			labelTicksPerSecond.innerText = "Ticks per Second:";
			divSequence.appendChild(labelTicksPerSecond);

			var inputTicksPerSecond = d.createElement("input");
			inputTicksPerSecond.type = "number";
			inputTicksPerSecond.onchange = function(event)
			{
				var inputTicksPerSecond = event.target;
				var ticksPerSecondAsString = inputTicksPerSecond.value;
				var ticksPerSecond = parseInt(ticksPerSecondAsString);
				sequence.ticksPerSecond = ticksPerSecond;
				sequence.uiUpdate(song);
			}
			divSequence.appendChild(inputTicksPerSecond);
			this.inputTicksPerSecond = inputTicksPerSecond;

			divSequence.appendChild(d.createElement("br"));

			var labelDurationInTicks = d.createElement("label");
			labelDurationInTicks.innerText = "Duration in Ticks:";
			divSequence.appendChild(labelDurationInTicks);

			var inputDurationInTicks = d.createElement("input");
			inputDurationInTicks.type = "number";
			inputDurationInTicks.onchange = function(event)
			{
				var inputDurationInTicks = event.target;
				var durationInTicksAsString = inputDurationInTicks.value;
				var durationInTicks = parseInt(durationInTicksAsString);
				sequence.durationInTicks = durationInTicks;
				sequence.uiUpdate(song);
			}
			divSequence.appendChild(inputDurationInTicks);
			this.inputDurationInTicks = inputDurationInTicks;

			divSequence.appendChild(d.createElement("br"));

			var labelTracks = d.createElement("label");
			labelTracks.innerText = "Tracks:";
			divSequence.appendChild(labelTracks);

			divSequence.appendChild(d.createElement("br"));

			var divTracks = this.uiUpdate_Tracks(song);

			divSequence.appendChild(divTracks);
		}

		var selectTrack = this.selectTrack;
		selectTrack.innerHTML = "";
		for (var i = 0; i < this.tracks.length; i++)
		{
			var track = this.tracks[i];
			var trackAsSelectOption = d.createElement("option");
			trackAsSelectOption.innerText = "" + i;
			selectTrack.appendChild(trackAsSelectOption);
		}
		selectTrack.selectedIndex = this.trackIndexSelected;

		this.inputSequenceName.value = this.name;
		this.inputTicksPerSecond.value = this.ticksPerSecond;
		this.inputDurationInTicks.value = this.durationInTicks;

		this.uiUpdate_Tracks(song);

		return divSequence;
	}

	Sequence.prototype.uiUpdate_Tracks = function(song)
	{
		var d = document;

		if (this.divTracks == null)
		{
			var sequence = this;

			var divTracks = d.createElement("div");
			divTracks.style.border = "1px solid";
			this.divTracks = divTracks;

			var labelTrack = d.createElement("label");
			labelTrack.innerText = "Track:";
			divTracks.appendChild(labelTrack);

			var buttonTrackNew = d.createElement("button");
			buttonTrackNew.innerText = "New";
			buttonTrackNew.onclick = function()
			{
				var instrument = song.instruments[0];
				var track = new Track(instrument.name, []);
				sequence.tracks.push(track);
				sequence.trackSelected(track);
				sequence.uiUpdate(song);
			}
			divTracks.appendChild(buttonTrackNew);

			var labelSelected = d.createElement("label");
			labelSelected.innerText = "Selected:";
			divTracks.appendChild(labelSelected);

			var selectTrack = d.createElement("select");
			selectTrack.onchange = function(event)
			{
				sequence.trackIndexSelected = parseInt(selectTrack.value);
				sequence.uiUpdate(song);
			}
			divTracks.appendChild(selectTrack);
			this.selectTrack = selectTrack;

			var buttonTrackSelectedPlay = d.createElement("button");
			buttonTrackSelectedPlay.innerText = "Play";
			buttonTrackSelectedPlay.onclick = function()
			{
				var trackSelected = sequence.trackSelected();
				var trackAsSamples = trackSelected.toSamples(song, sequence);
				var trackAsWavFile = Tracker.samplesToWavFile
				(
					"", song.samplesPerSecond, song.bitsPerSample, trackAsSamples
				);
				var trackAsSound = new Sound("", trackAsWavFile);
				trackAsSound.play();
			}
			divTracks.appendChild(buttonTrackSelectedPlay);

			var buttonTrackClone = d.createElement("button");
			buttonTrackClone.innerText = "Clone";
			buttonTrackClone.onclick = function()
			{
				var trackToClone = sequence.trackSelected();
				var trackCloned = trackToClone.clone();
				sequence.tracks.splice(sequence.trackIndexSelected, 0, trackCloned);
				sequence.trackSelected(trackCloned);
				sequence.uiUpdate(song);
			}
			divTracks.appendChild(buttonTrackClone);

			var buttonTrackSelectedDelete = d.createElement("button");
			buttonTrackSelectedDelete.innerText = "Delete";
			buttonTrackSelectedDelete.onclick = function()
			{
				var tracks = sequence.tracks;
				if (tracks.length > 1)
				{
					var trackSelected = sequence.trackSelected();
					tracks.remove(trackSelected);
					sequence.trackIndexSelected = 0;
					sequence.uiUpdate(song);
				}
			}
			divTracks.appendChild(buttonTrackSelectedDelete);

			var divTrack = d.createElement("div");

			var labelInstrument = d.createElement("label");
			labelInstrument.innerText = "Instrument:";
			divTrack.appendChild(labelInstrument);

			var selectInstrument = d.createElement("select");
			divTrack.appendChild(selectInstrument);
			selectInstrument.onchange = function(event)
			{
				var trackSelected = sequence.trackSelected();
				trackSelected.instrumentName = selectInstrument.value;
			}
			this.selectInstrument = selectInstrument;

			var divTickSelected = d.createElement("div");

			var labelTickSelected = d.createElement("label");
			labelTickSelected.innerText = "Tick Selected:";
			divTickSelected.appendChild(labelTickSelected);

			var inputTickSelected = d.createElement("input");
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
			this.inputTickSelected = inputTickSelected;

			var buttonTickSelectedApply = d.createElement("button");
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

			var labelNoteFormat = d.createElement("label");
			labelNoteFormat.innerText = "[pitch+octave]-[volume]-[duration], e.g. 'C_3-99-0128'";
			divTickSelected.appendChild(labelNoteFormat);

			divTrack.appendChild(divTickSelected);

			divTracks.appendChild(divTrack);

			divTracks.appendChild(d.createElement("br"));

			var selectTicks = d.createElement("select");
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
			this.selectTicks = selectTicks;
		}

		this.selectInstrument.innerHTML = "";
		var instruments = song.instruments;
		for (var i = 0; i < instruments.length; i++)
		{
			var instrument = instruments[i];
			var instrumentAsSelectOption = d.createElement("option");
			instrumentAsSelectOption.innerText = instrument.name;
			this.selectInstrument.appendChild(instrumentAsSelectOption);
		}
		var trackSelected = this.trackSelected();
		if (trackSelected.instrumentName == null)
		{
			trackSelected.instrumentName = song.instruments[0].name;
		}
		this.selectInstrument.value = trackSelected.instrumentName;

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

		var selectTicks = this.selectTicks;
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
			var tickAsSelectOption = d.createElement("option");
			tickAsSelectOption.innerText = tickAsString;
			selectTicks.appendChild(tickAsSelectOption);
		}

		selectTicks.selectedIndex = this.tickIndexSelected;

		var inputTickSelected = this.inputTickSelected;
		if (inputTickSelected != null)
		{
			var tickAsString = this.tickSelectedAsString();
			inputTickSelected.value = tickAsString;
		}

		return divTracks;
	}
}
