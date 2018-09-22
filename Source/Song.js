
function Song(name, samplesPerSecond, bitsPerSample, instruments, sequences, sequenceNamesToPlayInOrder)
{
	this.name = name;
	this.samplesPerSecond = samplesPerSecond;
	this.bitsPerSample = bitsPerSample;
	this.instruments = instruments.addLookups("name");
	this.sequences = sequences.addLookups("name");

	this.sequenceNamesToPlayInOrder = sequenceNamesToPlayInOrder;
	this.sequenceNameSelected = this.sequences[0].name;
	this.instrumentNameSelected = this.instruments[0].name;
}

{
	Song.demo = function(samplesPerSecond, bitsPerSample)
	{
		samplesPerSecond = (samplesPerSecond == null ? 8000 : samplesPerSecond);
		bitsPerSample = (bitsPerSample == null ? 8 : bitsPerSample);

		var instrument0 = Instrument.new("Instrument0");

		var sequence0 = Sequence.demo(instrument0.name, 0);

		var returnValue = new Song
		(
			"Scale",
			samplesPerSecond,
			bitsPerSample,
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

	Song.new = function(samplesPerSecond, bitsPerSample)
	{
		samplesPerSecond = (samplesPerSecond == null ? 8000 : samplesPerSecond);
		bitsPerSample = (bitsPerSample == null ? 8 : bitsPerSample);

		var instrument0 = Instrument.new("Instrument0");

		var sequence0 = Sequence.new(instrument0.name, 0);

		var returnValue = new Song
		(
			"[untitled]",
			samplesPerSecond,
			bitsPerSample,
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

	Song.prototype.instrumentAdd = function(instrument)
	{
		this.instruments.push(instrument);
		this.instruments[instrument.name] = instrument;
	}

	Song.prototype.instrumentSelected = function(value)
	{
		if (value != null)
		{
			this.instrumentNameSelected = value.name;
		}
		return this.instruments[this.instrumentNameSelected];
	}

	Song.prototype.play = function()
	{
		var samples = this.toSamples();
		var wavFile = Tracker.samplesToWavFile
		(
			"", this.samplesPerSecond, this.bitsPerSample, samples
		);
		var sound = new Sound("", wavFile);
		sound.play();
	}

	Song.prototype.sequenceSelected = function()
	{
		return (this.sequenceNameSelected == null ? null : this.sequences[this.sequenceNameSelected]);
	}

	Song.prototype.sequenceRename = function(sequenceNameOld, sequenceNameNew)
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

	Song.prototype.sequenceSelectByName = function(sequenceNameToSelect)
	{
		this.sequenceNameSelected = sequenceNameToSelect;
		this.uiUpdate();
	}

	Song.prototype.toSamples = function()
	{
		var songAsSamples = [];

		for (var i = 0; i < this.sequenceNamesToPlayInOrder.length; i++)
		{
			var sequenceName = this.sequenceNamesToPlayInOrder[i];
			var sequence = this.sequences[sequenceName];
			var sequenceAsSamples = sequence.toSamples(this);
			songAsSamples = songAsSamples.concat(sequenceAsSamples);
		}

		return songAsSamples;
	}

	// ui

	Song.prototype.uiClear = function()
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

	Song.prototype.uiUpdate = function()
	{
		var d = document;

		if (this.divSong == null)
		{
			var song = this;

			var divSong = d.createElement("div");
			this.divSong = divSong;

			var labelSong = d.createElement("label");
			labelSong.innerText = "Song:";
			divSong.appendChild(labelSong);

			var buttonNew = d.createElement("button");
			buttonNew.innerText = "New";
			buttonNew.onclick = function()
			{
				var song = Song.new();
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
			inputName.onchange = function(event)
			{
				song.name = inputName.value;
			}
			this.inputName = inputName;

			var buttonSave = d.createElement("button");
			buttonSave.innerText = "Save";
			buttonSave.onclick = function()
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
			inputFileToLoad.onchange = function(event)
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
							function callback(file, fileAsBytes)
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
						fileReader.onload = function(event2)
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

			var labelSamplesPerSecond = d.createElement("label");
			labelSamplesPerSecond.innerText = "Samples per Second:";
			divSong.appendChild(labelSamplesPerSecond);

			var inputSamplesPerSecond = d.createElement("input");
			inputSamplesPerSecond.type = "number";
			inputSamplesPerSecond.style.width = "64px";
			inputSamplesPerSecond.onchange = function(event)
			{
				var inputSamplesPerSecond = event.target;
				var samplesPerSecondAsString = inputSamplesPerSecond.value;
				var samplesPerSecond = parseInt(samplesPerSecondAsString);
				song.samplesPerSecond = samplesPerSecond;
			}
			divSong.appendChild(inputSamplesPerSecond);
			this.inputSamplesPerSecond = inputSamplesPerSecond;

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
			selectBitsPerSample.onchange = function(event)
			{
				var selectBitsPerSample = event.target;
				var bitsPerSampleAsString = selectBitsPerSample.value;
				var bitsPerSample = parseInt(bitsPerSampleAsString);
				song.bitsPerSample = bitsPerSample;
			}
			divSong.appendChild(selectBitsPerSample);
			this.selectBitsPerSample = selectBitsPerSample;

			var buttonPlay = d.createElement("button");
			buttonPlay.innerText = "Play";
			buttonPlay.onclick = function()
			{
				song.play();
			}
			divSong.appendChild(buttonPlay);

			var buttonExport = d.createElement("button");
			buttonExport.innerText = "Export to WAV";
			buttonExport.onclick = function()
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
			selectInstrument.onchange = function(event)
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
			buttonInstrumentNew.onclick = function()
			{
				var now = new Date();
				var nowAsString =
					("" + now.getHours()).padLeft(2, "0")
					+ ("" + now.getMinutes()).padLeft(2, "0")
					+ ("" + now.getSeconds()).padLeft(2, "0");
				var instrumentName = "Instrument" + nowAsString;
				var instrument = Instrument.new(instrumentName);
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
			inputFileToLoad.onchange = function(event)
			{
				var file = event.target.files[0];
				if (file != null)
				{
					FileHelper.loadFileAsText
					(
						file,
						function callback(file, instrumentAsJSON)
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
			inputSequenceNamesToPlayInOrder.onchange = function(event)
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
			selectSequence.onchange = function(event)
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
			buttonSequenceNew.onclick = function()
			{
				var sequences = song.sequences;
				var sequenceNew = Sequence.new(song.instruments[0].name, sequences.length);
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
			buttonSequenceClone.onclick = function()
			{
				var sequences = song.sequences;
				var sequenceNameNext = String.fromCharCode("A".charCodeAt(0) + sequences.length);
				var sequenceCloned = sequence.clone();
				sequenceCloned.name = sequenceNameNext;
				var sequenceSelected = song.sequenceSelected();
				var sequenceIndexSelected = sequences.indexOf(sequenceSelected);
				sequences.splice(sequenceIndexSelected, 0, sequenceCloned);
				sequences[sequenceCloned.name] = sequenceCloned;
				var sequenceClonedAsOption = d.createElement("option");
				sequenceClonedAsOption.innerText = sequenceCloned.name;
				selectSequence.appendChild(sequenceClonedAsOption);
				song.sequenceSelectByName(sequenceCloned.name);
			}
			divSong.appendChild(buttonSequenceClone);

			var buttonSequenceDelete = d.createElement("button");
			buttonSequenceDelete.innerText = "Delete";
			buttonSequenceDelete.onclick = function()
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

		this.inputName.value = this.name;
		this.inputSamplesPerSecond.value = this.samplesPerSecond;
		this.selectBitsPerSample.value = this.bitsPerSample;
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

	// json

	Song.fromJSON = function(songAsJSON)
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
