
function WavFile
(
	filePath,
	samplingInfo,
	samplesForChannels
)
{
	this.filePath = filePath;
	this.samplingInfo = samplingInfo;
	this.samplesForChannels = samplesForChannels;

	 // hack
	if (this.samplingInfo == null)
	{
		this.samplingInfo = WavFileSamplingInfo.default();
	}

	if (this.samplesForChannels == null)
	{
		var numberOfChannels = this.samplingInfo.numberOfChannels;

		this.samplesForChannels = [];
		for (var c = 0; c < numberOfChannels; c++)
		{
			this.samplesForChannels[c] = [];
		}
	}
}

{
	// constants

	WavFile.NumberOfBytesInRiffWaveAndFormatChunks = 36;

	// static methods

	WavFile.prototype.appendClipFromWavFileBetweenTimesStartAndEnd = function
	(
		wavFileToClipFrom,
		timeStartInSeconds,
		timeEndInSeconds
	)
	{
		var samplesPerSecond = wavFileToClipFrom.samplingInfo.samplesPerSecond;

		var timeStartInSamples = Math.floor
		(
			samplesPerSecond * timeStartInSeconds
		);

		var timeEndInSamples = Math.ceil
		(
			samplesPerSecond * timeEndInSeconds
		);

		var samplesForChannelsInClip = [];

		for (var c = 0; c < wavFileToClipFrom.samplesForChannels.length; c++)
		{
			var samplesForChannelSource = wavFileToClipFrom.samplesForChannels[c];
			var samplesForChannelTarget = this.samplesForChannels[c];

			for (var s = timeStartInSamples; s <= timeEndInSamples; s++)
			{
				var sample = samplesForChannelSource[s];
				samplesForChannelTarget.push(sample);
			}
		}

		return this;
	}

	WavFile.prototype.clipBetweenTimes = function(timeStartInSeconds, timeEndInSeconds)
	{
		var numberOfChannels = this.samplesForChannels.length;
		var samplesForChannels = [];
		for (var i = 0; i < numberOfChannels; i++)
		{
			samplesForChannels.push([]);
		}

		var clip = new WavFile
		(
			this.filePath + "-Clip",
			this.samplingInfo,
			samplesForChannels
		);

		clip.appendClipFromWavFileBetweenTimesStartAndEnd
		(
			this,
			timeStartInSeconds,
			timeEndInSeconds
		);

		return clip;
	}

	WavFile.prototype.durationInSamples = function()
	{
		var returnValue = 0;
		if (this.samplesForChannels != null)
		{
			if (this.samplesForChannels.length > 0)
			{
				returnValue = this.samplesForChannels[0].length;
			}
		}

		return returnValue;
	}

	WavFile.prototype.durationInSeconds = function()
	{
		var durationInSamples = this.durationInSamples();
		var returnValue =
			durationInSamples
			/ this.samplingInfo.samplesPerSecond;
		return returnValue;
	}

	WavFile.prototype.extendOrTrimSamples = function(numberOfSamplesToExtendOrTrimTo)
	{
		var numberOfChannels = this.samplingInfo.numberOfChannels;
		var samplesForChannelsNew = [];

		for (var c = 0; c < numberOfChannels; c++)
		{
			var samplesForChannelOld = this.samplesForChannels[c];
			var samplesForChannelNew = [];

			for (var s = 0; s < samplesForChannelOld.length && s < numberOfSamplesToExtendOrTrimTo; s++)
			{
				samplesForChannelNew[s] = samplesForChannelOld[s];
			}

			for (var s = samplesForChannelOld.length; s < numberOfSamplesToExtendOrTrimTo; s++)
			{
				samplesForChannelNew[s] = 0;
			}

			samplesForChannelsNew[c] = samplesForChannelNew;
		}

		this.samplesForChannels = samplesForChannelsNew;
	}

	// bytes

	// read

	WavFile.fromBytes = function(name, bytes)
	{
		var returnValue = new WavFile(name);
		var reader = new ByteStreamLittleEndian(bytes);
		returnValue.fromBytes_Chunks(reader);
		return returnValue;
	}

	WavFile.prototype.fromBytes_Chunks = function(reader)
	{
		var riffStringAsBytes = reader.readBytes(4);

		var numberOfBytesInFile = reader.readInt();

		var waveStringAsBytes = reader.readBytes(4);

		while (reader.hasMoreBytes() == true)
		{
			var chunkTypeAsString = reader.readString(4);

			if (chunkTypeAsString == "data")
			{
				this.fromBytes_Chunks_Data(reader);
			}
			else if (chunkTypeAsString == "fmt ")
			{
				this.fromBytes_Chunks_Format(reader);
			}
			else
			{
				this.fromBytes_Chunks_Unrecognized(reader);
			}
		}
	}

	WavFile.prototype.fromBytes_Chunks_Data = function(reader)
	{
		var subchunk2SizeInBytes = reader.readInt();

		var samplesForChannelsMixedAsBytes = reader.readBytes(subchunk2SizeInBytes);

		var samplesForChannels = this.fromBytes_Chunks_Data_SamplesForChannels
		(
			this.samplingInfo,
			samplesForChannelsMixedAsBytes
		);

		this.samplesForChannels = samplesForChannels;
	}

	WavFile.prototype.fromBytes_Chunks_Data_SamplesForChannels = function
	(
		samplingInfo,
		bytesToConvert
	)
	{
		var numberOfBytes = bytesToConvert.length;

		var numberOfChannels = samplingInfo.numberOfChannels;

		var returnSamples = [];

		var bytesPerSample = samplingInfo.bitsPerSample / Constants.BitsPerByte;

		var samplesPerChannel =
			numberOfBytes
			/ bytesPerSample
			/ numberOfChannels;

		for (var c = 0; c < numberOfChannels; c++)
		{
			returnSamples[c] = [];
		}

		var b = 0;

		var byteConverter = new ByteConverter(samplingInfo.bitsPerSample);
		var sampleValueAsBytes = [];

		for (var s = 0; s < samplesPerChannel; s++)
		{
			for (var c = 0; c < numberOfChannels; c++)
			{
				sampleValueAsBytes.length = 0;

				for (var i = 0; i < bytesPerSample; i++)
				{
					sampleValueAsBytes.push(bytesToConvert[b]);
					b++;
				}

				var sampleValueAsInteger = byteConverter.bytesToInteger
				(
					sampleValueAsBytes
				);

				returnSamples[c][s] = sampleValueAsInteger;
			}
		}

		return returnSamples;
	}

	WavFile.prototype.fromBytes_Chunks_Format = function(reader)
	{
		var chunkSizeInBytes = reader.readInt();
		var formatCode = reader.readShort();

		var numberOfChannels = reader.readShort();
		var samplesPerSecond = reader.readInt();

		var bytesPerSecond = reader.readInt(); // samplesPerSecond * numberOfChannels * bitsPerSample / 8
		var bytesPerSampleForAllChannels = reader.readShort(); // numberOfChannels * bitsPerSample / 8
		var bitsPerSample = reader.readShort();

		var numberOfBytesInChunkSoFar = WavFileSamplingInfo.ChunkSizeInBytesMin;
		var numberOfExtraBytesInChunk =
			chunkSizeInBytes
			- numberOfBytesInChunkSoFar;

		var extraBytes = reader.readBytes(numberOfExtraBytesInChunk);

		var samplingInfo = new WavFileSamplingInfo
		(
			formatCode,
			numberOfChannels,
			samplesPerSecond,
			bitsPerSample,
			extraBytes
		);

		this.samplingInfo = samplingInfo;
	}

	WavFile.prototype.fromBytes_Chunks_Unrecognized = function(reader)
	{
		var chunkDataSizeInBytes = reader.readInt();
		var chunkData = reader.readBytes(chunkDataSizeInBytes);
	}

	// write

	WavFile.prototype.toBytes = function()
	{
		var writer = new ByteStreamLittleEndian([]);
		this.toBytes_Chunks(writer);
		return writer.bytes;
	}

	WavFile.prototype.toBytes_Chunks = function(writer)
	{
		writer.writeString("RIFF");

		// hack
		var numberOfBytesOfOverhead =
			"RIFF".length
			+ "WAVE".length
			+ "fmt ".length
			+ 20 // additional bytes In format header
			+ "data".length;

			//+ 4; // additional bytes in data header?

		var numberOfBytesInFile =
			this.samplingInfo.numberOfChannels
			* this.samplesForChannels[0].length
			* this.samplingInfo.bitsPerSample
			/ Constants.BitsPerByte
			+ numberOfBytesOfOverhead;

		writer.writeInt(numberOfBytesInFile);

		writer.writeString("WAVE");

		this.toBytes_Chunks_Format(writer);
		this.toBytes_Chunks_Data(writer);
	}

	WavFile.prototype.toBytes_Chunks_Data = function(writer)
	{
		writer.writeString("data");

		var samplesForChannelsMixedAsBytes =
			this.toBytes_Chunks_Data_SamplesForChannels
			(
				this.samplesForChannels,
				this.samplingInfo
			);

		writer.writeInt(samplesForChannelsMixedAsBytes.length);

		writer.writeBytes(samplesForChannelsMixedAsBytes);
	}

	WavFile.prototype.toBytes_Chunks_Data_SamplesForChannels = function
	(
		samplesForChannelsToConvert,
		samplingInfo
	)
	{
		var returnBytes = null;

		var numberOfChannels = samplingInfo.numberOfChannels;

		var samplesPerChannel = samplesForChannelsToConvert[0].length;

		var bitsPerSample = samplingInfo.bitsPerSample;

		var bytesPerSample = bitsPerSample / Constants.BitsPerByte;

		var numberOfBytes =
			numberOfChannels
			* samplesPerChannel
			* bytesPerSample;

		returnBytes = [];

		var b = 0;

		var byteConverter = new ByteConverter(bitsPerSample);

		for (var s = 0; s < samplesPerChannel; s++)
		{
			for (var c = 0; c < numberOfChannels; c++)
			{
				var sampleAsInteger = samplesForChannelsToConvert[c][s];

				var sampleAsBytes = byteConverter.integerToBytes
				(
					sampleAsInteger
				);

				for (var i = 0; i < bytesPerSample; i++)
				{
					returnBytes[b] = sampleAsBytes[i];
					b++;
				}
			}
		}

		return returnBytes;
	}

	WavFile.prototype.toBytes_Chunks_Format = function(writer)
	{
		writer.writeString("fmt ");

		writer.writeInt(this.samplingInfo.chunkSizeInBytes());
		writer.writeShort(this.samplingInfo.formatCode);

		writer.writeShort(this.samplingInfo.numberOfChannels);
		writer.writeInt(this.samplingInfo.samplesPerSecond);

		writer.writeInt(this.samplingInfo.bytesPerSecond());
		writer.writeShort(this.samplingInfo.bytesPerSampleForAllChannels());
		writer.writeShort(this.samplingInfo.bitsPerSample);

		if (this.samplingInfo.extraBytes != null)
		{
			writer.writeBytes(this.samplingInfo.extraBytes);
		}
	}

	// json

	WavFile.fromStringJSON = function(wavFileAsJSON)
	{
		var wavFile = JSON.parse(wavFileAsJSON);
		wavFile = WavFile.objectPrototypesSet(wavFile);
		return wavFile;
	}

	WavFile.objectPrototypesSet = function(wavFile)
	{
		wavFile.__proto__ = WavFile.prototype;

		wavFile.samplingInfo.__proto__ = WavFileSamplingInfo.prototype;

		var samplesForChannelsAsBase64 = wavFile.samplesForChannels;
		var samplesForChannelsAsBytes = Base64Encoder.stringBase64ToBytes
		(
			samplesForChannelsAsBase64
		);

		var samplesForChannels = wavFile.fromBytes_Chunks_Data_SamplesForChannels
		(
			wavFile.samplingInfo,
			samplesForChannelsAsBytes
		);

		wavFile.samplesForChannels = samplesForChannels;

		return wavFile;
	}

	WavFile.prototype.toStringJSON = function()
	{
		var samplesForChannelsToRestore = this.samplesForChannels;

		var samplesForChannelsAsBytes = this.toBytes_Chunks_Data_SamplesForChannels
		(
			this.samplesForChannels, this.samplingInfo
		);

		var samplesForChannelsAsBase64 = Base64Encoder.bytesToStringBase64
		(
			samplesForChannelsAsBytes
		);

		this.samplesForChannels = samplesForChannelsAsBase64;
		var returnValue = JSON.stringify(this);
		this.samplesForChannels = samplesForChannelsToRestore;

		return returnValue;
	}
}

////////

function WavFileSamplingInfo
(
	formatCode,
	numberOfChannels,
	samplesPerSecond,
	bitsPerSample,
	extraBytes
)
{
	this.formatCode = (formatCode || WavFileSamplingInfo.FormatCodeDefault);
	this.numberOfChannels = numberOfChannels;
	this.samplesPerSecond = samplesPerSecond;
	this.bitsPerSample = bitsPerSample;
	this.extraBytes = (extraBytes || []);
}
{
	// constants

	WavFileSamplingInfo.ChunkSizeInBytesMin = 16;
	WavFileSamplingInfo.FormatCodeDefault = 1; // Uncompressed.

	// static methods

	WavFileSamplingInfo.default = function()
	{
		var returnValue = new WavFileSamplingInfo
		(
			1, // formatCode
			1, // numberOfChannels
			44100,	 // samplesPerSecond
			16 // bitsPerSample
		);

		return returnValue;
	}

	WavFileSamplingInfo.prototype.bytesPerSample = function()
	{
		return this.bitsPerSample / Constants.BitsPerByte;
	}

	WavFileSamplingInfo.prototype.bytesPerSampleForAllChannels = function()
	{
		return this.bytesPerSample() * this.numberOfChannels;
	}

	WavFileSamplingInfo.prototype.bytesPerSecond = function()
	{
		return this.samplesPerSecond
			* this.bytesPerSampleForAllChannels();
	}

	WavFileSamplingInfo.prototype.chunkSizeInBytes = function()
	{
		return WavFileSamplingInfo.ChunkSizeInBytesMin + this.extraBytes.length;
	}
}