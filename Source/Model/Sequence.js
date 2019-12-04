
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
	Sequence.TickIndexDigitsMax = 4;
	Sequence.TrackDelimiter = " | ";

	Sequence.demo = function(instrumentName, sequenceName)
	{
		var ticksPerSecond = 8;
		var sequenceDurationInSeconds = 8;
		var noteVolume = 25;
		var noteOctaveIndex = 4;
		var noteDuration = Math.floor(ticksPerSecond / 2);
		var noteOctaveIndexLow = noteOctaveIndex - 1;
		var noteDurationLong = noteDuration * 2;

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

	Sequence.demo2 = function(instrumentName, sequenceName)
	{
		var ticksPerSecond = 8;
		var sequenceDurationInSeconds = 8;
		var noteVolume = 25;
		var noteOctaveIndex = 4;
		var noteDuration = Math.floor(ticksPerSecond / 2);
		var noteOctaveIndexLow = noteOctaveIndex - 1;
		var noteDurationLong = noteDuration * 2;

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
						new Note(0 * noteDuration, noteOctaveIndex + 1, "C_", noteVolume, noteDuration),
						new Note(1 * noteDuration, noteOctaveIndex, "B_", noteVolume, noteDuration),
						new Note(2 * noteDuration, noteOctaveIndex, "A_", noteVolume, noteDuration),
						new Note(3 * noteDuration, noteOctaveIndex, "G_", noteVolume, noteDuration),
						new Note(4 * noteDuration, noteOctaveIndex, "F_", noteVolume, noteDuration),
						new Note(5 * noteDuration, noteOctaveIndex, "E_", noteVolume, noteDuration),
						new Note(6 * noteDuration, noteOctaveIndex, "D_", noteVolume, noteDuration),
						new Note(7 * noteDuration, noteOctaveIndex, "C_", noteVolume, noteDuration),
						new Note(8 * noteDuration, noteOctaveIndex, "D_", noteVolume, noteDuration),
						new Note(9 * noteDuration, noteOctaveIndex, "E_", noteVolume, noteDuration),
						new Note(10 * noteDuration, noteOctaveIndex, "F_", noteVolume, noteDuration),
						new Note(11 * noteDuration, noteOctaveIndex, "G_", noteVolume, noteDuration),
						new Note(12 * noteDuration, noteOctaveIndex, "A_", noteVolume, noteDuration),
						new Note(13 * noteDuration, noteOctaveIndex, "B_", noteVolume, noteDuration),
						new Note(14 * noteDuration, noteOctaveIndex + 1, "C_", noteVolume, noteDuration),
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

	Sequence.prototype.noteAtTickCurrent = function()
	{
		var trackSelected = this.trackSelected();
		var noteAtTick = trackSelected.noteAtTick(this.tickIndexSelected);
		return noteAtTick;
	}

	Sequence.prototype.noteAtTickCurrentSet = function(value)
	{
		var trackSelected = this.trackSelected();
		var noteAtTick = trackSelected.noteAtTickSet(this.tickIndexSelected, value);
	}

	Sequence.prototype.noteAtTickCurrentTimeStartInTicksAdd = function(ticksToMove)
	{
		var track = this.trackSelected();

		var directionToMove = ticksToMove / Math.abs(ticksToMove);
		var tickIndexNext = this.tickIndexSelected + directionToMove;
		var noteAtTickNext = track.noteAtTick(tickIndexNext);

		while (noteAtTickNext != null)
		{
			tickIndexNext += directionToMove;
			noteAtTickNext = track.noteAtTick(tickIndexNext);
		}

		if (tickIndexNext >= 0 && tickIndexNext < this.durationInTicks)
		{
			var noteToMove = this.noteAtTickCurrent();
			noteToMove.timeStartInTicks = tickIndexNext;
			track.notesReorder();
			this.tickSelectAtIndex(tickIndexNext);
		}

		return this;
	}

	Sequence.prototype.notePrecedingTickCurrent = function()
	{
		var trackSelected = this.trackSelected();
		var noteAtTick = trackSelected.notePrecedingTick(this.tickIndexSelected);
		return noteAtTick;
	}

	Sequence.prototype.notesSustainAll = function()
	{
		for (var t = 0; t < this.tracks.length; t++)
		{
			var track = this.tracks[t];
			track.notesSustainAll(this);
		}
	}

	Sequence.prototype.play = function(song)
	{
		var samples = this.toSamples(song);
		var wavFile = Tracker.samplesToWavFile
		(
			"", song.samplesPerSecond, song.bitsPerSample, samples
		);
		this.sound = new Sound("", wavFile);
		var sequence = this;
		this.sound.play( () => { sequence.stop(); } );

		this.uiCursorFollow(song);
	}

	Sequence.prototype.playOrStop = function(song)
	{
		if (this.sound == null)
		{
			this.play(song);
		}
		else
		{
			this.stop();
		}
	}

	Sequence.prototype.stop = function()
	{
		if (this.sound != null)
		{
			this.sound.stop();
			this.sound = null;
		}
		if (this.cursorMover != null)
		{
			clearInterval(this.cursorMover);
			this.cursorMover = null;
		}
	}

	Sequence.prototype.tickInsertAtCursor = function()
	{
		var track = this.trackSelected();
		var notes = track.notes;
		for (var i = 0; i < notes.length; i++)
		{
			var note = notes[i];
			if (note.timeStartInTicks >= this.tickIndexSelected)
			{
				note.timeStartInTicks++;
			}
		}
	}

	Sequence.prototype.tickRemoveAtCursor = function()
	{
		this.noteAtTickCurrentSet(null);
		var track = this.trackSelected();
		var notes = track.notes;
		for (var i = 0; i < notes.length; i++)
		{
			var note = notes[i];
			if (note.timeStartInTicks >= this.tickIndexSelected)
			{
				note.timeStartInTicks--;
			}
		}
	}

	Sequence.prototype.tickSelectAtIndex = function(tickIndexToSelect)
	{
		if (tickIndexToSelect < 0)
		{
			tickIndexToSelect = 0;
		}
		else if (tickIndexToSelect >= this.durationInTicks)
		{
			tickIndexToSelect = this.durationInTicks - 1;
		}
		this.tickIndexSelected = tickIndexToSelect;
	}

	Sequence.prototype.tickSelectNextInDirection = function(direction)
	{
		this.tickSelectAtIndex(this.tickIndexSelected + direction);
	}

	Sequence.prototype.tickSelectedAsString = function()
	{
		var noteAtTick = this.noteAtTickCurrent();
		var tickAsString = (noteAtTick == null ? Note.Blank : noteAtTick.toString());
		return tickAsString;
	}

	Sequence.prototype.trackSelectAtIndex = function(trackIndexToSelect)
	{
		if (trackIndexToSelect >= this.tracks.length)
		{
			trackIndexToSelect = 0;
		}
		else if (trackIndexToSelect < 0)
		{
			trackIndexToSelect = this.tracks.length - 1;
		}
		this.trackIndexSelected = trackIndexToSelect;
	}

	Sequence.prototype.trackSelectNextInDirection = function(direction)
	{
		this.trackSelectAtIndex(this.trackIndexSelected + direction);
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

		var tracksAsSampleArrays = [];
		var trackLengthInSamplesMaxSoFar = 0;

		for (var t = 0; t < this.tracks.length; t++)
		{
			var track = this.tracks[t];
			var trackAsSamples = track.toSamples(song, this);
			tracksAsSampleArrays.push(trackAsSamples);

			var trackLengthInSamples = trackAsSamples.length;
			if (trackLengthInSamples > trackLengthInSamplesMaxSoFar)
			{
				trackLengthInSamplesMaxSoFar = trackLengthInSamples;
			}
		}

		var durationInSamples = trackLengthInSamplesMaxSoFar;
		for (var s = 0; s < durationInSamples; s++)
		{
			sequenceAsSamples.push(0);
		}

		for (var t = 0; t < tracksAsSampleArrays.length; t++)
		{
			var trackAsSamples = tracksAsSampleArrays[t];
			for (var s = 0; s < trackAsSamples.length; s++)
			{
				sequenceAsSamples[s] += trackAsSamples[s];
			}
		}

		song.trimSamples(sequenceAsSamples);

		return sequenceAsSamples;
	}

	// ui

	Sequence.prototype.ticksAsStrings = function()
	{
		var returnValues = [];
		for (var i = 0; i < this.durationInTicks; i++)
		{
			var tickAsString = this.tickAtIndexAsString(i);
			returnValues.push(tickAsString);
		}

		return returnValues;
	}

	Sequence.prototype.tickAtIndexAsString = function(tickIndex)
	{
		var ticksForTracksToJoin = [];

		for (var t = 0; t < this.tracks.length; t++)
		{
			var track = this.tracks[t];
			var tickFromTrackAsString = track.tickAtIndexAsString(this, tickIndex);
			ticksForTracksToJoin.push(tickFromTrackAsString);
		}

		var tickIndex = ("" + tickIndex).padLeft(Sequence.TickIndexDigitsMax, "0");
		ticksForTracksToJoin.insertElementAt(tickIndex, 0);

		var tickAsString = ticksForTracksToJoin.join(Sequence.TrackDelimiter);

		return tickAsString;
	}

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

	Sequence.prototype.uiCursorFollow = function(song)
	{
		var sequence = this;

		sequence.tickSelectAtIndex(0);

		var ticksPerSecond = sequence.ticksPerSecond;
		var millisecondsPerTick = 1000 / ticksPerSecond;

		this.cursorMover = setInterval
		(
			function()
			{
				sequence.tickIndexSelected++;
				if (sequence.tickIndexSelected > sequence.durationInTicks)
				{
					clearInterval(sequence.cursorMover);
				}
				sequence.uiUpdate_TickCursorPositionFromSelected(true);
			},
			millisecondsPerTick
		);
	}

	Sequence.prototype.uiUpdate = function(song)
	{
		if (this.divSequence == null)
		{
			this.divSequence = this.uiUpdate_Create(song);
		}

		this.uiUpdate_SelectTrack();

		this.inputSequenceName.value = this.name;
		this.inputTicksPerSecond.value = this.ticksPerSecond;
		this.inputDurationInTicks.value = this.durationInTicks;

		this.uiUpdate_Tracks(song);

		return this.divSequence;
	}

	Sequence.prototype.uiUpdate_Create = function(song)
	{
		var sequence = this;

		var d = document;

		var divSequence = d.createElement("div");
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
		buttonSequenceSelectedPlay.innerText = "Play/Stop (s)";
		buttonSequenceSelectedPlay.onclick = function()
		{
			sequence.playOrStop(song);
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

		return divSequence;
	}

	Sequence.prototype.uiUpdate_SelectTrack = function()
	{
		var selectTrack = this.selectTrack;
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

	Sequence.prototype.uiUpdate_Tracks = function(song)
	{
		if (this.divTracks == null)
		{
			this.divTracks = this.uiUpdate_Tracks_Create(song);
		}

		this.uiUpdate_Tracks_Instruments(song);

		this.uiUpdate_Tracks_Ticks(song);

		return this.divTracks;
	}

	Sequence.prototype.uiUpdate_Tracks_Create = function(song)
	{
		var d = document;

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
		buttonTrackSelectedPlay.innerText = "Play/Stop (t)";
		buttonTrackSelectedPlay.onclick = function()
		{
			var trackSelected = sequence.trackSelected();
			trackSelected.playOrStop(song, sequence);
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

		var label = d.createElement("label");
		label.innerText = "Tick:";
		divTickSelected.appendChild(label);

		var button = d.createElement("button");
		button.innerText = "Insert (Ins)";
		button.onclick = function()
		{
			sequence.tickInsertAtCursor();
			sequence.uiUpdate(song);
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "Remove (Del)";
		button.onclick = function()
		{
			sequence.tickRemoveAtCursor();
			sequence.uiUpdate(song);
		}
		divTickSelected.appendChild(button);

		var label = d.createElement("label");
		label.innerText = "Selected:";
		divTickSelected.appendChild(label);

		var inputTickSelected = d.createElement("input");
		inputTickSelected.style.fontFamily = "monospace";
		inputTickSelected.size = 12;
		inputTickSelected.disabled = true;
		inputTickSelected.onkeypress = function(event)
		{
			var keyPressed = event.key;
			if (keyPressed == "Enter")
			{
				var tickIndex = sequence.tickIndexSelected;
				var inputTickSelected = event.target;
				var tickAsString = inputTickSelected.value;
				var tickAsNote = Note.fromString(tickAsString, tickIndex);
				sequence.noteAtTickCurrentSet(tickAsNote);
				sequence.uiUpdate_Tracks(song);
			}
		}
		divTickSelected.appendChild(inputTickSelected);
		this.inputTickSelected = inputTickSelected;

		var button = d.createElement("button");
		button.innerText = "Clear (Backsp)";
		button.onclick = function()
		{
			sequence.noteAtTickCurrentSet(null);
			sequence.uiUpdate_Tracks(song);
		}
		divTickSelected.appendChild(button);

		var buttonTickSelectedPlay = d.createElement("button");
		buttonTickSelectedPlay.innerText = "Play (n)";
		buttonTickSelectedPlay.onclick = function()
		{
			var tickIndex = sequence.tickIndexSelected;
			var tickAsString = inputTickSelected.value;
			var tickAsNote = Note.fromString(tickAsString, tickIndex);
			var track = sequence.trackSelected();
			tickAsNote.play(song, sequence, track);
		}
		divTickSelected.appendChild(buttonTickSelectedPlay);

		divTickSelected.appendChild(d.createElement("br"));

		var label = d.createElement("label");
		label.innerText = "Shift:";
		divTickSelected.appendChild(label);

		var button = d.createElement("button");
		button.innerText = "^ (<)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentTimeStartInTicksAdd(-1);
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "v (>)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentTimeStartInTicksAdd(1);
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		divTickSelected.appendChild(d.createElement("br"));

		var label = d.createElement("label");
		label.innerHTML = "Pitch:";
		divTickSelected.appendChild(label);

		var button = d.createElement("button");
		button.innerText = "-1 (-)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.pitchAdd(-1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "+1 (=)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.pitchAdd(1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var label = d.createElement("label");
		label.innerHTML = "Octave:";
		divTickSelected.appendChild(label);

		var button = d.createElement("button");
		button.innerText = "-1 (_)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.octaveAdd(-1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "+1 (+)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.octaveAdd(1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var label = d.createElement("label");
		label.innerHTML = "Volume:";
		divTickSelected.appendChild(label);

		var button = d.createElement("button");
		button.innerText = "-10 ({)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.volumeAsPercentageAdd(-10));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "-1 ([)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.volumeAsPercentageAdd(-1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "+1 (])";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.volumeAsPercentageAdd(1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "+10 (})";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.volumeAsPercentageAdd(10));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var label = d.createElement("label");
		label.innerHTML = "Duration:";
		divTickSelected.appendChild(label);

		var button = d.createElement("button");
		button.innerText = "-1 (,)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.durationInTicksAdd(-1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		var button = d.createElement("button");
		button.innerText = "+1 (.)";
		button.onclick = function()
		{
			var note = sequence.noteAtTickCurrent();
			if (note != null)
			{
				sequence.noteAtTickCurrentSet(note.durationInTicksAdd(1));
				sequence.uiUpdate(song);
			}
		}
		divTickSelected.appendChild(button);

		divTickSelected.appendChild(d.createElement("br"));

		divTrack.appendChild(divTickSelected);

		divTracks.appendChild(divTrack);

		divTracks.appendChild(d.createElement("br"));

		var selectTicks = d.createElement("textarea");
		selectTicks.cols = 40;
		selectTicks.rows = 16;
		selectTicks.style.fontFamily = "monospace";
		selectTicks.onclick = this.selectTicks_Clicked.bind(this, song);

		divTracks.appendChild(selectTicks);
		this.selectTicks = selectTicks;

		return divTracks;
	}

	Sequence.prototype.uiUpdate_Tracks_Instruments = function(song)
	{
		this.selectInstrument.innerHTML = "";
		var instruments = song.instruments;
		for (var i = 0; i < instruments.length; i++)
		{
			var instrument = instruments[i];
			var instrumentAsSelectOption = document.createElement("option");
			instrumentAsSelectOption.innerText = instrument.name;
			this.selectInstrument.appendChild(instrumentAsSelectOption);
		}

		var trackSelected = this.trackSelected();
		if (trackSelected.instrumentName == null)
		{
			trackSelected.instrumentName = song.instruments[0].name;
		}
		this.selectInstrument.value = trackSelected.instrumentName;
	}

	Sequence.prototype.uiUpdate_Tracks_Ticks = function()
	{
		var selectTicks = this.selectTicks;

		var selectTicksSelectionStartToRestore = selectTicks.selectionStart;
		var selectTicksSelectionEndToRestore = selectTicks.selectionEnd;

		var ticksAsStrings = this.ticksAsStrings();
		var newline = "\n";
		var ticksAsStringJoined = ticksAsStrings.join(newline);
		selectTicks.value = ticksAsStringJoined;

		selectTicks.selectionStart = selectTicksSelectionStartToRestore;
		selectTicks.selectionEnd = selectTicksSelectionEndToRestore;

		var inputTickSelected = this.inputTickSelected;
		if (inputTickSelected != null)
		{
			var tickAsString = this.tickSelectedAsString();
			inputTickSelected.value = tickAsString;
		}
	}

	Sequence.prototype.uiUpdate_TickCursorPositionFromSelected = function(shouldHighlightWholeTick)
	{
		var trackSelected = this.trackSelected();

		var trackDelimiter = Sequence.TrackDelimiter;
		var charsPerTrack = trackDelimiter.length + Note.Blank.length;

		var newline = "\n";
		var charsPerTick = 
			Sequence.TickIndexDigitsMax
			+ this.tracks.length * charsPerTrack
			+ newline.length;
		var tickSelectedOffsetInChars =
			this.tickIndexSelected * charsPerTick;

		var trackSelectedOffsetFromStartOfTickString = null;
		var selectionSize = null;
		if (shouldHighlightWholeTick)
		{
			trackSelectedOffsetFromStartOfTickString = 0;
			selectionSize = charsPerTick;
		}
		else
		{
			trackSelectedOffsetFromStartOfTickString =
				Sequence.TickIndexDigitsMax
				+ trackDelimiter.length
				+ this.trackIndexSelected * charsPerTrack;
			selectionSize = Note.Blank.length;
		}

		var selectTicks = this.selectTicks;
		selectTicks.selectionStart =
			tickSelectedOffsetInChars + trackSelectedOffsetFromStartOfTickString;
		selectTicks.selectionEnd =
			selectTicks.selectionStart + selectionSize;

		var selectTicksHeightInPixels = selectTicks.clientHeight;
		var lineHeightInPixels = selectTicksHeightInPixels / selectTicks.rows;
		var positionToScrollToInPixels =
			this.tickIndexSelected * lineHeightInPixels
			- selectTicksHeightInPixels / 2;
		selectTicks.scrollTop = positionToScrollToInPixels;

		var tickAsString = this.tickSelectedAsString();
		this.inputTickSelected.value = tickAsString;

		this.uiUpdate_SelectTrack();

		selectTicks.focus();
	}

	// ui event handlers

	Sequence.prototype.selectTicks_Clicked = function(song, event)
	{
		var selectTicks = event.target;
		var cursorOffset = selectTicks.selectionStart;

		var newline = "\n";
		var ticksAsStringJoined = this.selectTicks.value;
		var ticksAsStringJoinedBeforeSelectionStart =
			ticksAsStringJoined.substr(0, cursorOffset);
		var ticksBeforeCursorAsStrings =
			ticksAsStringJoinedBeforeSelectionStart.split(newline);
		ticksBeforeCursorAsStrings.length--;
		var tickIndex = ticksBeforeCursorAsStrings.length;

		var tickSelectedOffset = ticksBeforeCursorAsStrings.join(newline).length;
		var tickForAllTracksAsString = this.tickAtIndexAsString(tickIndex);

		var cursorOffsetFromStartOfTick = cursorOffset - tickSelectedOffset;
		var tickAsStringBeforeCursor =
			tickForAllTracksAsString.substr(0, cursorOffsetFromStartOfTick);
		var trackDelimiter = Sequence.TrackDelimiter;
		var pipesBeforeCursor = tickAsStringBeforeCursor.split(trackDelimiter).length - 1;
		var trackIndex = (pipesBeforeCursor == 0 ? 0 : pipesBeforeCursor - 1);
		this.trackSelectAtIndex(trackIndex);
		this.tickSelectAtIndex(tickIndex);

		this.uiUpdate_TickCursorPositionFromSelected();
	}
}
