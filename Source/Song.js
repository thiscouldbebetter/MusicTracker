
function Song(name, samplesPerSecond, instruments, sequences, sequenceNamesToPlayInOrder)
{
	this.name = name;
	this.samplesPerSecond = samplesPerSecond;
	this.instruments = instruments.addLookups("name");
	this.sequences = sequences.addLookups("name");
	
	this.sequenceNamesToPlayInOrder = sequenceNamesToPlayInOrder;
	this.sequenceNameCurrent = this.sequences[0].name;
	this.instrumentNameCurrent = this.instruments[0].name;
}

{
	Song.fromJSON = function(songAsJSON)
	{
		var song = JSON.parse(songAsJSON);
		
		song.__proto__ = Song.prototype;
		
		var instruments = song.instruments;
		for (var i = 0; i < instruments.length; i++)
		{
			var instrument = instruments[i];
			instrument.__proto__ = Instrument.prototype;
		}
		
		var sequences = song.sequences;
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

	Song.new = function()
	{
		var sequence0 = Sequence.new(0);
		
		var returnValue = new Song
		(
			"Scale",
			1200, // samplesPerSecond
			[
				Instrument.Instances.Sine
			],
			// sequences
			[
				sequence0
			],
			// sequenceNamesToPlayInOrder
			[
				sequence0.name,
				sequence0.name
			]
		);
		
		return returnValue;
	}

	Song.prototype.instrumentCurrent = function()
	{
		return this.instruments[this.instrumentNameCurrent];
	}
	
	Song.prototype.sequenceCurrent = function()
	{
		return (this.sequenceNameCurrent == null ? null : this.sequences[this.sequenceNameCurrent]);
	}
	
	Song.prototype.sequenceNew = function()
	{
		var sequenceNew = Sequence.new(this.sequences.length);
		this.sequences.push(sequenceNew);
		this.sequences[sequenceNew.name] = sequenceNew;
		this.uiUpdate();
	}
	
	Song.prototype.sequenceRename = function(sequenceNameOld, sequenceNameNew)
	{
		var sequence = this.sequences[sequenceNameOld];
		delete this.sequences[sequenceNameOld];
		sequence.name = sequenceNameNew;
		this.sequences[sequenceNameNew] = sequence;
		
		for (var i = 0; i < this.sequenceNamesToPlayInOrder.length; i++)
		{
			var sequenceNameOrdered = this.sequenceNamesToPlayInOrder[i];
			if (sequenceNameOrdered == sequenceNameOld)
			{
				this.sequenceNamesToPlayInOrder.splice(i, 1, sequenceNameNew);
			}
		}
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

	Song.prototype.uiUpdate = function()
	{
		var divSong = document.getElementById("divSong");
		if (divSong == null)
		{
			var song = this;
		
			var divSong = document.createElement("div");
			divSong.id = "divSong";

			var labelName = document.createElement("label");
			labelName.innerText = "Song Name:";
			divSong.appendChild(labelName);
			
			var inputName = document.createElement("input");
			inputName.id = "inputName";
			divSong.appendChild(inputName);

			var buttonSave = document.createElement("button");
			buttonSave.innerText = "Save";
			buttonSave.onclick = function() 
			{ 
				var songAsJSON = JSON.stringify(song, null, 4);
				
				var songAsBlob = new Blob([songAsJSON], {type:"text/plain"});
				var songAsObjectURL = window.URL.createObjectURL(songAsBlob);
				
				var aDownload = document.createElement("a");
				aDownload.href = songAsObjectURL;
				aDownload.download = song.name + ".json";
				aDownload.click();
			}
			divSong.appendChild(buttonSave);
									
			var labelLoad = document.createElement("label");
			labelLoad.innerText = "Load:";
			divSong.appendChild(labelLoad);
			
			var inputFileToLoad = document.createElement("input");
			inputFileToLoad.type = "file";
			inputFileToLoad.onchange = function(event)
			{
				var file = event.target.files[0];
				if (file != null)
				{
					var fileReader = new FileReader();
					fileReader.onload = function(event2)
					{
						var songAsJSON = event2.target.result;
						var song = Song.fromJSON(songAsJSON);
						Tracker.Instance.songCurrent = song;
						Tracker.Instance.uiUpdate();
					}
					fileReader.readAsText(file);
				}
			}
			divSong.appendChild(inputFileToLoad);
						
			var buttonExport = document.createElement("button");
			buttonExport.innerText = "Export to WAV";
			buttonExport.onclick = function() 
			{ 
				var songAsSamples = song.toSamples();
				var songAsWavFileSamples = [];
				for (var s = 0; s < songAsSamples.length; s++)
				{
					var sample = songAsSamples[s];
					var sampleScaled = sample;//Math.round((sample + 1) / 2 * 255) - 128;
					songAsWavFileSamples.push(sampleScaled);
				}
				var songFilePath = song.name + ".wav";
				var songAsWavFile = new WavFile
				(
					songFilePath,
					WavFileSamplingInfo.buildDefault(), // todo
					[ songAsWavFileSamples ] // samplesForChannels
				);
				var songAsWavFileBytes = songAsWavFile.toBytes();
				FileHelper.saveBytesToFile(songAsWavFileBytes, songFilePath);
			}
			divSong.appendChild(buttonExport);
			
			divSong.appendChild(document.createElement("br"));	
			
			var labelSamplesPerSecond = document.createElement("label");
			labelSamplesPerSecond.innerText = "Samples per Second:";
			divSong.appendChild(labelSamplesPerSecond);
						
			var inputSamplesPerSecond = document.createElement("input");
			inputSamplesPerSecond.id = "inputSamplesPerSecond";
			inputSamplesPerSecond.type = "number";
			divSong.appendChild(inputSamplesPerSecond);

			divSong.appendChild(document.createElement("br"));			
			
			var labelInstruments = document.createElement("label");
			labelInstruments.innerText = "Instruments:";
			divSong.appendChild(labelInstruments);
			
			selectInstruments = document.createElement("select");
			selectInstruments.id = "selectInstruments";
			divSong.appendChild(selectInstruments);
			divSong.appendChild(document.createElement("br"));
			
			var labelSequencesToPlay = document.createElement("label");
			labelSequencesToPlay.innerText = "Sequences to Play:"
			divSong.appendChild(labelSequencesToPlay);
			divSong.appendChild(document.createElement("br"));
			
			var inputSequenceNamesToPlayInOrder = document.createElement("input");
			inputSequenceNamesToPlayInOrder.id = "inputSequenceNamesToPlayInOrder";
			divSong.appendChild(inputSequenceNamesToPlayInOrder);
			divSong.appendChild(document.createElement("br"));
						
			var labelSequence = document.createElement("label");
			labelSequence.innerText = "Sequence Selected:";
			divSong.appendChild(labelSequence);
			
			var selectSequence = document.createElement("select");			
			selectSequence.id = "selectSequence";
			divSong.appendChild(selectSequence);
						
			var buttonSequenceNew = document.createElement("button");
			buttonSequenceNew.innerText = "New";
			buttonSequenceNew.onclick = this.sequenceNew.bind(this);
			divSong.appendChild(buttonSequenceNew);
			divSong.appendChild(document.createElement("br"));
			
			var divSequenceCurrent = document.createElement("div");
			divSequenceCurrent.id = "divSequenceCurrent";
			divSong.appendChild(divSequenceCurrent);
		}
		else
		{
			
			var inputName = document.getElementById("inputName");
			inputName.value = this.name;
			
			var inputSamplesPerSecond = document.getElementById("inputSamplesPerSecond");
			inputSamplesPerSecond.value = this.samplesPerSecond;
			
			var selectInstruments = document.getElementById("selectInstruments");
			selectInstruments.innerHTML = "";
			for (var i = 0; i < this.instruments.length; i++)
			{
				var instrument = this.instruments[i];
				var instrumentAsSelectOption = document.createElement("option");
				instrumentAsSelectOption.innerText = instrument.name;
				selectInstruments.appendChild(instrumentAsSelectOption);
			}
			
			var selectSequence = document.getElementById("selectSequence");
			selectSequence.innerHTML = "";
			for (var i = 0; i < this.sequences.length; i++)
			{
				var sequence = this.sequences[i];
				var sequenceAsSelectOption = document.createElement("option");
				sequenceAsSelectOption.innerText = sequence.name;
				selectSequence.appendChild(sequenceAsSelectOption);
			}
											
			var sequenceNamesAsLines = this.sequenceNamesToPlayInOrder.join(";");
			var inputSequenceNamesToPlayInOrder = document.getElementById("inputSequenceNamesToPlayInOrder");
			inputSequenceNamesToPlayInOrder.value = sequenceNamesAsLines;
			
			var sequenceCurrent = this.sequenceCurrent();
			if (sequenceCurrent != null)
			{
				var sequenceAsDOMElement = sequenceCurrent.uiUpdate(this);
				var divSequenceCurrent = document.getElementById("divSequenceCurrent");
				divSequenceCurrent.appendChild(sequenceAsDOMElement);
			}
		}
		
		return divSong;
	}
}
