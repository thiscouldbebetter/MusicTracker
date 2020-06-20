
class Song
{
	constructor(name, samplesPerSecond, bitsPerSample, volumeAsFraction, instruments, sequences, sequenceNamesToPlayInOrder)
	{
		this.name = name;
		this.samplesPerSecond = samplesPerSecond;
		this.bitsPerSample = bitsPerSample;
		this.volumeAsFraction = volumeAsFraction || 0.25;
		this.instruments = instruments.addLookups("name");
		this.sequences = sequences.addLookups("name");

		this.sequenceNamesToPlayInOrder = sequenceNamesToPlayInOrder;
		this.sequenceNameSelected = this.sequences[0].name;
		this.instrumentNameSelected = this.instruments[0].name;
	}

	static demo(samplesPerSecond, bitsPerSample)
	{
		samplesPerSecond = (samplesPerSecond == null ? 8000 : samplesPerSecond);
		bitsPerSample = (bitsPerSample == null ? 8 : bitsPerSample);

		var instrument0 = Instrument.default("Instrument0");

		var sequenceA = Sequence.demo(instrument0.name, "A");
		var sequenceB = Sequence.demo2(instrument0.name, "B");

		var returnValue = new Song
		(
			"Scale",
			samplesPerSecond,
			bitsPerSample,
			null, // volumeAsFraction
			[ instrument0 ],
			[ sequenceA, sequenceB ],
			// sequenceNamesToPlayInOrder
			[
				sequenceA.name,
				sequenceB.name,
				sequenceA.name
			]
		);

		return returnValue;
	}

	static blank(samplesPerSecond, bitsPerSample)
	{
		samplesPerSecond = (samplesPerSecond == null ? 8000 : samplesPerSecond);
		bitsPerSample = (bitsPerSample == null ? 8 : bitsPerSample);

		var instrument0 = Instrument.default("Instrument0");

		var sequence0 = Sequence.blank(instrument0.name, 0);

		var returnValue = new Song
		(
			"[untitled]",
			samplesPerSecond,
			bitsPerSample,
			null, // volumeAsFraction
			[ instrument0 ],
			[ sequence0 ],
			// sequenceNamesToPlayInOrder
			[
				sequence0.name,
				sequence0.name
			]
		);

		return returnValue;
	}

	durationInSamples()
	{
		var durationInSamplesSoFar = 0;

		var sequences = this.sequencesToPlayInOrder();
		for (var i = 0; i < sequences.length; i++)
		{
			var sequence = sequences[i];
			var sequenceDurationInSamples = sequence.durationInSamples(this);
			durationInSamplesSoFar += sequenceDurationInSamples;
		}

		return durationInSamplesSoFar;
	}

	instrumentAdd(instrument)
	{
		this.instruments.push(instrument);
		this.instruments[instrument.name] = instrument;
	}

	instrumentSelected(value)
	{
		if (value != null)
		{
			this.instrumentNameSelected = value.name;
		}
		return this.instruments[this.instrumentNameSelected];
	}

	play()
	{
		var samples = this.toSamples();
		var wavFile = Tracker.samplesToWavFile
		(
			"", this.samplesPerSecond, this.bitsPerSample, samples
		);
		this.sound = new Sound("", wavFile);
		var song = this;
		this.sound.play( () => { song.stop(); } );

		song.uiCursorFollow();
	}

	playOrStop()
	{
		if (this.sound == null)
		{
			this.play();
		}
		else
		{
			this.stop();
		}
	}

	sequenceRename(sequenceNameOld, sequenceNameNew)
	{
		var sequence = this.sequences[sequenceNameOld];
		delete this.sequences[sequenceNameOld];
		sequence.name = sequenceNameNew;
		this.sequences[sequenceNameNew] = sequence;
		this.sequenceNameSelected = sequence.name;

		for (var i = 0; i < this.sequenceNamesToPlayInOrder.length; i++)
		{
			var sequenceNameOrdered = this.sequenceNamesToPlayInOrder[i];
			if (sequenceNameOrdered == sequenceNameOld)
			{
				this.sequenceNamesToPlayInOrder.splice(i, 1, sequenceNameNew);
			}
		}
	}

	sequenceSelectByName(sequenceNameToSelect)
	{
		this.sequenceNameSelected = sequenceNameToSelect;
		this.sequenceSelected().uiClear();
		this.uiUpdate();
	}

	sequenceSelectNext()
	{
		var sequenceNext = this.sequences[this.sequence];
		this.sequenceSelectByName(sequenceNextName);
	}

	sequenceSelected()
	{
		return (this.sequenceNameSelected == null ? null : this.sequences[this.sequenceNameSelected]);
	}

	sequencesToPlayInOrder()
	{
		var returnValues = [];

		for (var i = 0; i < this.sequenceNamesToPlayInOrder.length; i++)
		{
			var sequenceName = this.sequenceNamesToPlayInOrder[i];
			var sequence = this.sequences[sequenceName];
			returnValues.push(sequence);
		}

		return returnValues;
	}

	stop()
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

	toSamples()
	{
		var sequencesInOrder = this.sequencesToPlayInOrder();
		var sequencesAsSampleArrays = [];

		for (var i = 0; i < sequencesInOrder.length; i++)
		{
			var sequence = sequencesInOrder[i];
			var sequenceAsSamples = sequence.toSamples(this);
			sequencesAsSampleArrays.push(sequenceAsSamples);
		}

		var songAsSamples = [];
		var durationInSamples = this.durationInSamples();

		for (var i = 0; i < durationInSamples; i++)
		{
			songAsSamples[i] = 0;
		}

		var sequenceCurrentStartInSamples = 0;
		for (var i = 0; i < sequencesAsSampleArrays.length; i++)
		{
			var sequence = sequencesInOrder[i];
			var sequenceAsSamples = sequencesAsSampleArrays[i];

			for (var s = 0; s < sequenceAsSamples.length; s++)
			{
				var sampleFromSequence = sequenceAsSamples[s];
				var sampleIndex = s + sequenceCurrentStartInSamples;
				songAsSamples[sampleIndex] += sampleFromSequence;
			}

			// Use sequence.durationInSamples() rather than sequenceAsSamples.length,
			// as that may include "carryover" notes.
			sequenceCurrentStartInSamples += sequence.durationInSamples(this);
		}

		this.trimSamples(songAsSamples);

		return songAsSamples;
	}

	trimSamples(samplesToTrim)
	{
		for (var s = 0; s < samplesToTrim.length; s++)
		{
			var sample = samplesToTrim[s];
			if (sample > 1)
			{
				sample = 1;
			}
			else if (sample < -1)
			{
				sample = -1;
			}
			samplesToTrim[s] = sample;
		}
	}

	// mod

	static fromModFile(modFile)
	{
		var instruments = Song.fromModFile_Instruments(modFile);

		var sequences = Song.fromModFile_Sequences(modFile, instruments);

		var sequenceNamesToPlayInOrder = [];
		var sequenceIndicesFromModFile = modFile.sequenceIndicesToPlayInOrder;
		for (var i = 0; i < sequenceIndicesFromModFile.length; i++)
		{
			var sequenceIndex = sequenceIndicesFromModFile[i];
			var sequence = sequences[sequenceIndex];
			var sequenceName = sequence.name;
			sequenceNamesToPlayInOrder.push(sequenceName);
		}

		var song = new Song
		(
			this.name,
			ModFile.SamplesPerSecond, // samplesPerSecond,
			ModFile.BitsPerSample, // bitsPerSample,
			null, // volumeAsFraction
			instruments,
			sequences,
			sequenceNamesToPlayInOrder
		);

		return song;
	}

	static fromModFile_Instruments(modFile)
	{
		var instruments = [];
		var instrumentsFromModFile = modFile.instruments;
		for (var i = 0; i < instrumentsFromModFile.length; i++)
		{
			var instrumentFromModFile = instrumentsFromModFile[i];
			var instrument = Instrument.fromModFileInstrument(instrumentFromModFile);
			if (instrument != null)
			{
				instruments.push(instrument);
			}
		}

		return instruments;
	}

	static fromModFile_Sequences(modFile, instruments)
	{
		var ticksPerSecond = 8;
		var volumeCurrentByChannel = [99, 99, 99, 99];

		var sequences = [];
		var sequencesFromModFile = modFile.sequences;
		for (var s = 0; s < sequencesFromModFile.length; s++)
		{
			var sequenceFromModFile = sequencesFromModFile[s];
			var divisionCellsForChannels = sequenceFromModFile.divisionCellsForChannels;

			var tracksConverted = [];

			for (var t = 0; t < divisionCellsForChannels.length; t++)
			{
				var divisionCellsForChannel = divisionCellsForChannels[t];

				var volumeCurrentForChannel = volumeCurrentByChannel[t];

				for (var c = 0; c < divisionCellsForChannel.length; c++)
				{
					var divisionCellToConvert = divisionCellsForChannel[c];
					var instrumentIndex = divisionCellToConvert.instrumentIndex;
					if (instrumentIndex != 0)
					{
						var effect = divisionCellToConvert.effect;
						if (effect != null)
						{
							var effectDefnID = effect.defnID;
							if (effectDefnID == 0xF) // speed
							{
								var effectArg = 16 * effect.arg0 + effect.arg1;
								ticksPerSecond = (effectArg == 3 ? 16 : 8); // hack
							}
						}
						var pitchCode = divisionCellToConvert.pitchCode;
						var pitchName = ModFile.pitchNameForPitchCode(pitchCode);
						var octaveIndex = parseInt(pitchName.substr(2));
						var note = new Note
						(
							c, // timeStartInTicks
							octaveIndex,
							pitchName.substr(0, 2),
							volumeCurrentForChannel,
							8 // durationInTicks - Will be set later.
							// hack - Setting durationInTicks to 0 causes trouble.
						);
						var instrumentPlusChannel = instrumentIndex + "_" + t;
						var track = tracksConverted[instrumentPlusChannel];
						if (track == null)
						{
							var instrument = instruments[instrumentIndex - 1];
							track = new Track(instrument.name, []);
							tracksConverted.push(track);
							tracksConverted[instrumentPlusChannel] = track;
						}
						track.notes.push(note);
					}
				}
			}

			var sequence = new Sequence
			(
				"_" + s,
				ticksPerSecond,
				64, // durationInTicks
				tracksConverted
			);

			sequence.notesSustainAll();

			sequences.push(sequence);
		}
		sequences.addLookups("name");

		return sequences;

	}

	// ui

	uiClear()
	{
		if (this.divSong != null)
		{
			this.divSong.parentElement.removeChild(this.divSong);
			delete this.divSong;
			delete this.divInstrument;
			delete this.inputName;
			delete this.inputSamplesPerSecond;
			delete this.selectBitsPerSample;
			delete this.selectInstrument;
			delete this.inputSequenceNamesToPlayInOrder;
			delete this.selectSequence;
			delete this.divSequenceSelected;
			for (var i = 0; i < this.instruments.length; i++)
			{
				this.instruments[i].uiClear();
			}
			for (var i = 0; i < this.sequences.length; i++)
			{
				this.sequences[i].uiClear();
			}
		}
	}

	uiCursorFollow()
	{
		var song = this;

		var sequences = song.sequences;
		var sequenceNameIndex = 0;
		var sequenceNames = song.sequenceNamesToPlayInOrder;
		var sequenceName = sequenceNames[sequenceNameIndex];
		var sequence = sequences[sequenceName];
		sequence.tickSelectAtIndex(0);
		var ticksPerSecond = sequence.ticksPerSecond; // hack - Assuming this doesn't change.
		var millisecondsPerTick = 1000 / ticksPerSecond;

		this.cursorMover = setInterval
		(
			function()
			{
				var sequence = song.sequenceSelected();
				sequence.tickIndexSelected++;
				if (sequence.tickIndexSelected > sequence.durationInTicks)
				{
					sequenceNameIndex++;
					if (sequenceNameIndex >= sequenceNames.length)
					{
						clearInterval(song.cursorMover);
					}
					else
					{
						sequenceName = sequenceNames[sequenceNameIndex];
						sequence = sequences[sequenceName];
						sequence.tickIndexSelected = 0;
						song.sequenceSelectByName(sequenceName);
						sequence.uiUpdate(song);
					}
				}
				sequence.uiUpdate_TickCursorPositionFromSelected(true);
			},
			millisecondsPerTick
		);
	}

	uiUpdate()
	{
		if (this.divSong == null)
		{
			this.uiUpdate_Create();
		}

		this.inputName.value = this.name;
		this.inputSamplesPerSecond.value = this.samplesPerSecond;
		this.selectBitsPerSample.value = this.bitsPerSample;
		this.inputVolumeAsPercentage.value = this.volumeAsFraction * 100;
		this.selectInstrument.value = this.instrumentNameSelected;
		this.selectSequence.value = this.sequenceNameSelected;

		var sequenceNamesAsLines = this.sequenceNamesToPlayInOrder.join(";");
		this.inputSequenceNamesToPlayInOrder.value = sequenceNamesAsLines;

		this.divSequenceSelected.innerHTML = "";
		var sequenceSelected = this.sequenceSelected();
		if (sequenceSelected != null)
		{
			this.selectSequence.value = sequenceSelected.name;
			var sequenceAsDOMElement = sequenceSelected.uiUpdate(this);
			this.divSequenceSelected.appendChild(sequenceAsDOMElement);
		}

		this.instrumentSelected().uiUpdate();

		return this.divSong;
	}

	uiUpdate_Create()
	{
		var song = this;

		var d = document;

		var divSong = d.createElement("div");
		this.divSong = divSong;

		var labelSong = d.createElement("label");
		labelSong.innerText = "Song:";
		divSong.appendChild(labelSong);

		var buttonNew = d.createElement("button");
		buttonNew.innerText = "New";
		buttonNew.onclick = () =>
		{
			var song = Song.blank();
			var tracker = Tracker.Instance;
			tracker.songCurrent = song;
			tracker.uiClear();
			tracker.uiUpdate();
		}
		divSong.appendChild(buttonNew);

		var labelName = d.createElement("label");
		labelName.innerText = "Name:";
		divSong.appendChild(labelName);

		var inputName = d.createElement("input");
		divSong.appendChild(inputName);
		inputName.onchange = (event) =>
		{
			song.name = inputName.value;
		}
		this.inputName = inputName;

		var buttonSave = d.createElement("button");
		buttonSave.innerText = "Save";
		buttonSave.onclick = () =>
		{
			var parentElement = song.divSong.parentElement;
			song.uiClear();
			var songAsJSON = JSON.stringify(song, null, 4);

			var songAsBlob = new Blob([songAsJSON], {type:"text/plain"});
			var songAsObjectURL = window.URL.createObjectURL(songAsBlob);

			var aDownload = d.createElement("a");
			aDownload.href = songAsObjectURL;
			aDownload.download = song.name + ".json";
			aDownload.click();

			parentElement.appendChild(song.uiUpdate());
		}
		divSong.appendChild(buttonSave);

		var labelLoad = d.createElement("label");
		labelLoad.innerText = "Load:";
		divSong.appendChild(labelLoad);

		var inputFileToLoad = d.createElement("input");
		inputFileToLoad.type = "file";
		inputFileToLoad.onchange = (event) =>
		{
			var file = event.target.files[0];
			if (file != null)
			{
				var fileName = file.name;
				if (fileName.endsWith(".mod"))
				{
					FileHelper.loadFileAsBytes
					(
						file,
						(file, fileAsBytes) => // callback
						{
							var modFile = ModFile.fromBytes
							(
								file.name, fileAsBytes
							);
							alert("todo");
						}
					);
				}
				else // Assume JSON.
				{
					var fileReader = new FileReader();
					fileReader.onload(event2)
					{
						var songAsJSON = event2.target.result;
						var song = Song.fromJSON(songAsJSON);
						var tracker = Tracker.Instance;
						tracker.songCurrent = song;
						tracker.uiClear();
						tracker.uiUpdate();
					}
					fileReader.readAsText(file);
				}
			}
		}
		divSong.appendChild(inputFileToLoad);

		divSong.appendChild(d.createElement("br"));

		// Samples per Second.

		var labelSamplesPerSecond = d.createElement("label");
		labelSamplesPerSecond.innerText = "Samples per Second:";
		divSong.appendChild(labelSamplesPerSecond);

		var inputSamplesPerSecond = d.createElement("input");
		inputSamplesPerSecond.type = "number";
		inputSamplesPerSecond.style.width = "64px";
		inputSamplesPerSecond.onchange = (event) =>
		{
			var inputSamplesPerSecond = event.target;
			var samplesPerSecondAsString = inputSamplesPerSecond.value;
			var samplesPerSecond = parseInt(samplesPerSecondAsString);
			song.samplesPerSecond = samplesPerSecond;
		}
		divSong.appendChild(inputSamplesPerSecond);
		this.inputSamplesPerSecond = inputSamplesPerSecond;

		// Bits per sample.

		var labelBitsPerSample = d.createElement("label");
		labelBitsPerSample.innerText = "Bits per Sample:";
		divSong.appendChild(labelBitsPerSample);

		var selectBitsPerSample = d.createElement("select");
		selectBitsPerSample.style.width = "48px";
		var bitsPerSampleAllowed = [ 8, 16, 32 ];
		for (var i = 0; i < bitsPerSampleAllowed.length; i++)
		{
			var bitsPerSample = bitsPerSampleAllowed[i];
			var bitsPerSampleAsOption = d.createElement("option");
			bitsPerSampleAsOption.text = bitsPerSample;
			selectBitsPerSample.appendChild(bitsPerSampleAsOption);
		}
		selectBitsPerSample.onchange = (event) =>
		{
			var selectBitsPerSample = event.target;
			var bitsPerSampleAsString = selectBitsPerSample.value;
			var bitsPerSample = parseInt(bitsPerSampleAsString);
			song.bitsPerSample = bitsPerSample;
		}
		divSong.appendChild(selectBitsPerSample);
		this.selectBitsPerSample = selectBitsPerSample;

		// Volume.

		var labelVolumeAsPercentage = d.createElement("label");
		labelVolumeAsPercentage.innerText = "Volume As Percentage:";
		divSong.appendChild(labelVolumeAsPercentage);

		var inputVolumeAsPercentage = d.createElement("input");
		inputVolumeAsPercentage.type = "number";
		inputVolumeAsPercentage.style.width = "48px";
		inputVolumeAsPercentage.onchange = (event) =>
		{
			var inputVolumeAsPercentage = event.target;
			var volumeAsPercentageAsString = inputVolumeAsPercentage.value;
			var volumeAsPercentage = parseFloat(volumeAsPercentageAsString);
			song.volumeAsFraction = volumeAsPercentage / 100;
		}
		divSong.appendChild(inputVolumeAsPercentage);
		this.inputVolumeAsPercentage = inputVolumeAsPercentage;

		divSong.appendChild(d.createElement("br"));

		// Play.

		var buttonPlay = d.createElement("button");
		buttonPlay.innerText = "Play/Stop (p)";
		buttonPlay.onclick = () =>
		{
			song.playOrStop();
		}
		divSong.appendChild(buttonPlay);

		var buttonExport = d.createElement("button");
		buttonExport.innerText = "Export to WAV";
		buttonExport.onclick = () =>
		{
			var songFilePath = song.name + ".wav";
			var songAsSamples = song.toSamples();
			var songAsWavFile = Tracker.samplesToWavFile
			(
				songFilePath, song.samplesPerSecond, song.bitsPerSample, songAsSamples
			);
			var songAsWavFileBytes = songAsWavFile.toBytes();
			FileHelper.saveBytesToFile(songAsWavFileBytes, songFilePath);
		}
		divSong.appendChild(buttonExport);

		divSong.appendChild(d.createElement("br"));

		var checkboxKeyboardCommands = d.createElement("input");
		checkboxKeyboardCommands.type = "checkbox";
		checkboxKeyboardCommands.value = "Keyboard Commands";
		checkboxKeyboardCommands.checked = Tracker.Instance.useKeyboardCommands;
		checkboxKeyboardCommands.onchange = (event) =>
		{
			Tracker.Instance.useKeyboardCommands = event.target.checked;
		}
		divSong.appendChild(checkboxKeyboardCommands);

		var labelKeyboardCommands = d.createElement("label");
		labelKeyboardCommands.innerText = "Enable Keyboard Commands";
		divSong.appendChild(labelKeyboardCommands);

		divSong.appendChild(d.createElement("br"));

		var labelInstruments = d.createElement("label");
		labelInstruments.innerText = "Instruments:";
		divSong.appendChild(labelInstruments);

		var selectInstrument = d.createElement("select");
		divSong.appendChild(selectInstrument);
		for (var i = 0; i < this.instruments.length; i++)
		{
			var instrument = this.instruments[i];
			var instrumentAsSelectOption = d.createElement("option");
			instrumentAsSelectOption.innerText = instrument.name;
			selectInstrument.appendChild(instrumentAsSelectOption);
		}
		selectInstrument.onchange = (event) =>
		{
			var instrumentName = selectInstrument.value;
			var instrument = song.instruments[instrumentName];
			song.instrumentSelected(instrument);
			song.divInstrument.innerHTML = "";
			song.divInstrument.appendChild(instrument.uiUpdate());
		}
		this.selectInstrument = selectInstrument;

		var buttonInstrumentNew = d.createElement("button");
		buttonInstrumentNew.innerText = "New";
		buttonInstrumentNew.onclick = () =>
		{
			var now = new Date();
			var nowAsString =
				("" + now.getHours()).padLeft(2, "0")
				+ ("" + now.getMinutes()).padLeft(2, "0")
				+ ("" + now.getSeconds()).padLeft(2, "0");
			var instrumentName = "Instrument" + nowAsString;
			var instrument = Instrument.default(instrumentName);
			instrumentAsOption = d.createElement("option");
			instrumentAsOption.innerText = instrument.name;
			selectInstrument.appendChild(instrumentAsOption);
			selectInstrument.value = instrument.name;
			song.instrumentAdd(instrument);
			song.instrumentSelected(instrument);
			song.divInstrument.innerHTML = "";
			song.divInstrument.appendChild(instrument.uiUpdate());
			song.uiUpdate();
		}
		divSong.appendChild(buttonInstrumentNew);

		var labelLoad = d.createElement("label");
		labelLoad.innerText = "Load:";
		divSong.appendChild(labelLoad);

		var inputFileToLoad = d.createElement("input");
		inputFileToLoad.type = "file";
		inputFileToLoad.onchange = (event) =>
		{
			var file = event.target.files[0];
			if (file != null)
			{
				FileHelper.loadFileAsText
				(
					file,
					(file, instrumentAsJSON) => // callback
					{
						var instrument = Instrument.fromStringJSON(instrumentAsJSON);
						session.instrumentAdd(instrument);
						session.instrumentSelected(instrument);
						session.uiClear();
						session.uiUpdate();
					}
				);
			}
		}
		divSong.appendChild(inputFileToLoad);

		var divInstrument = d.createElement("div");
		divInstrument.style.border = "1px solid";
		var instrumentSelected = this.instrumentSelected();
		divInstrument.appendChild(instrumentSelected.uiUpdate());
		divSong.appendChild(divInstrument);
		this.divInstrument = divInstrument;

		divSong.appendChild(d.createElement("br"));

		var labelSequencesToPlay = d.createElement("label");
		labelSequencesToPlay.innerText = "Sequences to Play:"
		divSong.appendChild(labelSequencesToPlay);
		divSong.appendChild(d.createElement("br"));

		var inputSequenceNamesToPlayInOrder = d.createElement("input");
		inputSequenceNamesToPlayInOrder.onchange = (event) =>
		{
			song.sequenceNamesToPlayInOrder =
				inputSequenceNamesToPlayInOrder.value.split(";");
		}
		divSong.appendChild(inputSequenceNamesToPlayInOrder);
		this.inputSequenceNamesToPlayInOrder = inputSequenceNamesToPlayInOrder;

		divSong.appendChild(d.createElement("br"));

		var labelSequence = d.createElement("label");
		labelSequence.innerText = "Sequence Selected:";
		divSong.appendChild(labelSequence);

		var selectSequence = d.createElement("select");
		for (var i = 0; i < this.sequences.length; i++)
		{
			var sequence = this.sequences[i];
			var sequenceAsSelectOption = d.createElement("option");
			sequenceAsSelectOption.innerText = sequence.name;
			selectSequence.appendChild(sequenceAsSelectOption);
		}
		selectSequence.onchange = (event) =>
		{
			var selectSequence = event.target;
			var sequenceNameToSelect = selectSequence.value;
			var sequenceToSelect = song.sequences[sequenceNameToSelect];
			song.sequenceSelectByName(sequenceToSelect.name);
		}
		divSong.appendChild(selectSequence);
		this.selectSequence = selectSequence;

		var buttonSequenceNew = d.createElement("button");
		buttonSequenceNew.innerText = "New";
		buttonSequenceNew.onclick = () =>
		{
			var sequences = song.sequences;
			var sequenceNew = Sequence.blank(song.instruments[0].name, sequences.length);
			sequences.push(sequenceNew);
			sequences[sequenceNew.name] = sequenceNew;
			var sequenceNewAsOption = d.createElement("option");
			sequenceNewAsOption.innerText = sequenceNew.name;
			selectSequence.appendChild(sequenceNewAsOption);
			song.sequenceSelectByName(sequenceNew.name);
		}
		divSong.appendChild(buttonSequenceNew);

		var buttonSequenceClone = d.createElement("button");
		buttonSequenceClone.innerText = "Clone";
		buttonSequenceClone.onclick = () =>
		{
			var sequences = song.sequences;
			var sequenceNameNext = String.fromCharCode("A".charCodeAt(0) + sequences.length);
			var sequenceSelected = song.sequenceSelected();
			var sequenceCloned = sequenceSelected.clone();
			sequenceCloned.name = sequenceNameNext;
			sequences.push(sequenceCloned);
			sequences[sequenceCloned.name] = sequenceCloned;
			var sequenceClonedAsOption = d.createElement("option");
			sequenceClonedAsOption.innerText = sequenceCloned.name;
			selectSequence.appendChild(sequenceClonedAsOption);
			song.sequenceSelectByName(sequenceCloned.name);
		}
		divSong.appendChild(buttonSequenceClone);

		var buttonSequenceDelete = d.createElement("button");
		buttonSequenceDelete.innerText = "Delete";
		buttonSequenceDelete.onclick = () =>
		{
			var sequenceSelected = song.sequenceSelected();
			var sequences = song.sequences;
			var sequenceIndexSelected = sequences.indexOf(sequenceSelected);
			sequences.splice(sequenceIndexSelected, 1);
			sequences[sequenceSelected.name] = null;
			song.sequenceSelectByName(sequences[0].name);
			song.uiUpdate();
		}
		divSong.appendChild(buttonSequenceDelete);

		divSong.appendChild(d.createElement("br"));

		var divSequenceSelected = d.createElement("div");
		divSong.appendChild(divSequenceSelected);
		this.divSequenceSelected = divSequenceSelected;
	}

	// json

	static fromJSON(songAsJSON)
	{
		var song = JSON.parse(songAsJSON);

		song.__proto__ = Song.prototype;

		var instruments = song.instruments;
		instruments.addLookups("name");
		for (var i = 0; i < instruments.length; i++)
		{
			var instrument = instruments[i];
			Instrument.objectPrototypesSet(instrument);
		}

		var sequences = song.sequences;
		sequences.addLookups("name");
		for (var i = 0; i < sequences.length; i++)
		{
			var sequence = sequences[i];
			sequence.__proto__ = Sequence.prototype;

			var tracks = sequence.tracks;
			for (var t = 0; t < tracks.length; t++)
			{
				var track = tracks[t];
				track.__proto__ = Track.prototype;

				var notes = track.notes;
				for (var n = 0; n < notes.length; n++)
				{
					var note = notes[n];
					note.__proto__ = Note.prototype;
				}
			}
		}

		return song;
	}
}