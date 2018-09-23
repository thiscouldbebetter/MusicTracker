
function ModFile(name, title, instruments, sequenceIndicesToPlayInOrder, sequences)
{
	this.name = name;
	this.title = title;
	this.instruments = instruments;
	this.sequenceIndicesToPlayInOrder = sequenceIndicesToPlayInOrder;
	this.sequences = sequences;
}
{
	ModFile.fromBytes = function(name, bytes)
	{
		// Based on descriptions of the MOD file format found at the URLs:
		// "https://www.aes.id.au/modformat.html"
		// and
		// "https://www.ocf.berkeley.edu/~eek/index.html/tiny_examples/ptmod/ap12.html".

		var reader = new ByteStreamBigEndian(bytes);

		var title = reader.readString(20).replace(/\0/g, "").trim();

		var instruments = [];

		var numberOfInstruments = 31; // Or maybe 15?
		for (var i = 0; i < numberOfInstruments; i++)
		{
			var instrumentName = reader.readString(22).replace(/\0/g, "").trim();

			// In "words". 2 bytes/word
			var numberOfSamplesInInstrumentPlusOne = reader.readShort();

			var pitchShiftInSixteenthTones = reader.readByte(); // -8 to 7.
			if (pitchShiftInSixteenthTones >= 8)
			{
				// todo - Two's complement.
			}

			var volume = reader.readByte(); // 0 to 64.

			var repeatOffsetInWords = reader.readShort();
			var repeatLengthInWords = reader.readShort();

			var instrument = new ModFileInstrument
			(
				instrumentName,
				numberOfSamplesInInstrumentPlusOne,
				pitchShiftInSixteenthTones,
				volume,
				repeatOffsetInWords,
				repeatLengthInWords
			);
			instruments.push(instrument);
		}

		var numberOfSequencesToPlay = reader.readByte(); // 1 to 128.
		var reserved = reader.readByte(); // Should be 127.
		var sequenceIndicesToPlay = reader.readBytes(128); // Each 0 - 63.
		sequenceIndicesToPlay.length = numberOfSequencesToPlay;

		var sequenceIndexHighestSoFar = -1;
		for (var i = 0; i < sequenceIndicesToPlay.length; i++)
		{
			var sequenceIndex = sequenceIndicesToPlay[i];
			if (sequenceIndex > sequenceIndexHighestSoFar)
			{
				sequenceIndexHighestSoFar = sequenceIndex;
			}
		}
		var numberOfSequenceDefns = sequenceIndexHighestSoFar + 1;

		var signatureOrSequenceDefnsStart = reader.readString(4);
		var signatureFor32InstrumentMode = "M.K."; // "Mahoney and Kaktus"

		if (signatureOrSequenceDefnsStart == signatureFor32InstrumentMode)
		{
			// Someone hacked the format to support 32 instruments, not 16.
		}
		else
		{
			// It wasn't a signature, it was the start of sequence definitions.
			// Back up 4 bytes.
			reader.byteIndex -= 4;
		}

		var samplesPerSequence = 64; // Or "divisions".
		var numberOfChannels = 4; // 1 and 4 on left, 2 and 3 on right.
		var bytesPerSamplePerChannel = 4;

		var sequences = [];

		for (var s = 0; s < numberOfSequenceDefns; s++)
		{
			var divisionCellsForChannels = [];
			for (var c = 0; c < numberOfChannels; c++)
			{
				divisionCellsForChannels[c] = [];
			}

			for (var d = 0; d < samplesPerSequence; d++)
			{
				for (var c = 0; c < numberOfChannels; c++)
				{
					var bytesForSampleAndChannel =
						reader.readBytes(bytesPerSamplePerChannel);

					var instrumentIndex =
						(
							(bytesForSampleAndChannel[0] & 0xF0)
							| ( (bytesForSampleAndChannel[2] >> 4) & 0xF)
						);

					var pitchCodeOrEffectParameter =
						(
							( (bytesForSampleAndChannel[0] & 0xF) << 8)
							| bytesForSampleAndChannel[1]
						);

					// Effects
					// 0 - Arpeggio
					// 1 - Slide Up
					// 2 - Slide Down
					// 3 - Slide to Note
					// 4 - Vibrato
					// 5 - Continue Slide to Note with Volume Slide
					// 6 - Continue Vibrato with Volume Slide
					// 7 - Tremolo
					// 8 - Set Panning Position
					// 9 - Set Sample Offset
					// 10 - Volume Slide
					// 11 - Position Jump
					// 12 - Set Volume
					// 13 - Pattern Break
					// 14 - Extended
						// 1 - Fineslide Up
						// 2 - Fineslide Down
						// 3 - Toggle Glissando
						// 4 - Set Vibrato Waveform
						// 5 - Set Finetune Value
						// 6 - Loop Pattern
						// 7 - Set Tremolo Waveform
						// 8 - Reserved
						// 9 - Retrigger Sample
						// 10 - Fine Volume Slide Up
						// 11 - Fine Volume Slide Down
						// 12 - Cut Sample
						// 13 - Delay Sample
						// 14 - Delay Pattern
						// 15 - Invert Loop
					// 15 - Set Speed

					var effectDefnID =
						(
							( (bytesForSampleAndChannel[2] & 0xF) << 8)
							| bytesForSampleAndChannel[3]
						);

					var cell = new ModFileDivisionCell
					(
						instrumentIndex, pitchCodeOrEffectParameter, effectDefnID
					);

					divisionCellsForChannels[c].push(cell);

				} // end for c

			} // end for d

			var sequence = new ModFileSequence(divisionCellsForChannels);
			sequences.push(sequence);

		} // end for s

		for (var i = 0; i < instruments.length; i++)
		{
			var instrument = instruments[i];

			if (instrument.name == "")
			{
				// The rest of the instrument slots
				// are used to store other data, or blank.
				break;
			}

			var instrumentSamples = reader.readBytes(instrument.numberOfSamplesPlusOne * 2);
			instrument.samples = instrumentSamples;
		}

		var returnValue = new ModFile
		(
			name,
			title,
			instruments,
			sequenceIndicesToPlay,
			sequences
		);

		return returnValue;

	} // end function

	ModFile.pitchNameToPitchCodeLookup =
	{
		// Pitch codes:
		// From https://www.ocf.berkeley.edu/~eek/index.html/tiny_examples/ptmod/ap12.html:
		// "Periodtable for Tuning 0, Normal

		"C_1": 856,
		"C#1": 808,
		"D_1": 762,
		"D#1": 720,
		"E_1": 678,
		"F_1": 640,
		"F#1": 604,
		"G_1": 570,
		"G#1": 538,
		"A_1": 508,
		"A#1": 480,
		"B_1": 453,

		"C_2": 428,
		"C#2": 404,
		"D_2": 381,
		"D#2": 360,
		"E_2": 339,
		"F_2": 320,
		"F#2": 302,
		"G_2": 285,
		"G#2": 269,
		"A_2": 254,
		"A#2": 240,
		"B_2": 226,

		"C_3": 214,
		"C#3": 202,
		"D_3": 190,
		"D#3": 180,
		"E_3": 170,
		"F_3": 160,
		"F#3": 151,
		"G_3": 143,
		"G#3": 135,
		"A_3": 127,
		"A#3": 120,
		"B_3": 113,
	};

	ModFile.pitchNameForPitchCode = function(pitchCodeToFind)
	{
		var returnValue = null;

		var lookup = ModFile.pitchNameToPitchCodeLookup;
		for (var pitchName in lookup)
		{
			var pitchCode = lookup[pitchName];
			if (pitchCode < pitchCodeToFind)
			{
				returnValue = pitchName;
			}
		}

		return returnValue;
	}

} // end class ModFile

function ModFileDivisionCell(instrumentIndex, pitchCodeOrEffectParameter, effectDefnID)
{
	this.instrumentIndex = instrumentIndex;
	this.pitchCodeOrEffectParameter = pitchCodeOrEffectParameter;
	this.effectDefnID = effectDefnID;
}
{
	ModFileDivisionCell.prototype.toString = function()
	{
		return JSON.stringify(this);
	}
}

function ModFileInstrument
(
	name,
	numberOfSamplesPlusOne,
	pitchShiftInSixteenthTones,
	volume,
	repeatOffsetInWords,
	repeatLengthInWords
)
{
	this.name = name;
	this.numberOfSamplesPlusOne = numberOfSamplesPlusOne;
	this.pitchShiftInSixteenthTones = pitchShiftInSixteenthTones;
	this.volume = volume;
	this.repeatOffsetInWords = repeatOffsetInWords;
	this.repeatLengthInWords = repeatLengthInWords;

	this.samples = null;
}

function ModFileSequence(divisionCellsForChannels)
{
	this.divisionCellsForChannels = divisionCellsForChannels;
}
