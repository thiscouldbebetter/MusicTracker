
function ModFile()
{}
{
	ModFile.fromBytes = function(bytes)
	{
		// Based on a description of the MOD file format
		// found at the URL "https://www.aes.id.au/modformat.html".

		var reader = new ByteStreamBigEndian(bytes);

		var title = reader.readString(20).trim();

		var numberOfInstruments = 32; // Or maybe 16?
		for (var i = 0; i < numberOfInstruments; i++)
		{
			var instrumentName = reader.readString(22);

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
		}

		var numberOfSequences = reader.readByte(); // 1 to 128.
		var reserved = reader.readByte(); // Should be 127.
		var sequenceIndicesToPlay = reader.readBytes(128); // Each 0 - 63.

		var signatureOrSequenceDataStart = reader.readString(4);
		var signatureFor32InstrumentMode = "M.K.";

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

		for (var s = 0; s < numberOfSequences; s++)
		{
			for (var d = 0; d < samplesPerSequence; d++)
			{
				for (var c = 0; c < numberOfChannels; c++)
				{
					var bytesForSampleAndChannel =
						reader.readBytes(bytesPerSamplePerChannel);

					var instrumentIndex =
						(
							(bytesForSampleAndChannel[0] & 0xF0)
							| ( (bytesForSampleAndChannel[2] >> 4) & 0xF )
						);

					var pitchCodeOrEffectParameter =
						(
							( (bytesForSampleAndChannel[0] & 0xF) << 8)
							| bytes[1]
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

					var effect =
						(
							( (bytesForSampleAndChannel[2] & 0xF) << 8)
							| bytes[3]
						);

				}
			}
		}

	}
}
