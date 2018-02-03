
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
		this.samplingInfo = WavFileSamplingInfo.buildDefault();
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

	WavFile.fromBytes = function(bytes)
	{
		var returnValue = new WavFile();
		var reader = new ByteStreamLittleEndian(bytes);
		returnValue.readFromFile_ReadChunks(reader);
		return returnValue;

	}

	WavFile.readFromFile = function(fileToReadFrom, callback)
	{
		var fileReader = new FileReader();
		fileReader.onloadend = function(fileLoadedEvent)
		{
			if (fileLoadedEvent.target.readyState == FileReader.DONE)
			{
				var bytesFromFile = fileLoadedEvent.target.result;
				var returnValue = WavFile.fromBytes(bytesFromFile);
				returnValue.filePath = fileToReadFrom.name;
				callback(returnValue);
			}
		}

		fileReader.readAsBinaryString(fileToReadFrom);
	}

	// instance methods

	WavFile.prototype.readFromFile_ReadChunks = function(reader)
	{
		var riffStringAsBytes = reader.readBytes(4);

		var numberOfBytesInFile = reader.readInt();

		var waveStringAsBytes = reader.readBytes(4);

		while (reader.hasMoreBytes() == true)
		{
			var chunkTypeAsString = reader.readString(4);

			if (chunkTypeAsString == "data")
			{
				this.readFromFile_ReadChunks_Data(reader);
			}
			else if (chunkTypeAsString == "fmt ")
			{
				this.readFromFile_ReadChunks_Format(reader);
			}
			else
			{
				this.readFromFile_ReadChunks_Unrecognized(reader);
			}
		}
	}

	WavFile.prototype.readFromFile_ReadChunks_Data = function(reader)
	{
		var subchunk2SizeInBytes = reader.readInt();

		var samplesForChannelsMixedAsBytes = reader.readBytes(subchunk2SizeInBytes);

		var samplesForChannels = WavFileSample.samplesForChannelsFromBytes
		(
			this.samplingInfo,
			samplesForChannelsMixedAsBytes
		);

		this.samplesForChannels = samplesForChannels;
	}

	WavFile.prototype.readFromFile_ReadChunks_Format = function(reader)
	{
		var chunkSizeInBytes = reader.readInt();
		var formatCode = reader.readShort();

		var numberOfChannels = reader.readShort();
		var samplesPerSecond = reader.readInt();

		var bytesPerSecond = reader.readInt(); // samplesPerSecond * numberOfChannels * bitsPerSample / 8
		var bytesPerSampleForAllChannels = reader.readShort(); // numberOfChannels * bitsPerSample / 8
		var bitsPerSample = reader.readShort();

		var numberOfBytesInChunkSoFar = 16;
		var numberOfExtraBytesInChunk =
			chunkSizeInBytes
			- numberOfBytesInChunkSoFar;

		var extraBytes = reader.readBytes(numberOfExtraBytesInChunk);

		var samplingInfo = new WavFileSamplingInfo
		(
			"[from file]",
			chunkSizeInBytes,
			formatCode,
			numberOfChannels,
			samplesPerSecond,
			bitsPerSample,
			extraBytes
		);

		this.samplingInfo = samplingInfo;
	}

	WavFile.prototype.readFromFile_ReadChunks_Unrecognized = function(reader)
	{
		var chunkDataSizeInBytes = reader.readInt();
		var chunkData = reader.readBytes(chunkDataSizeInBytes);
	}

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

	WavFile.prototype.toBytes = function()
	{
		var writer = new ByteStreamLittleEndian([]);
		this.toBytes_WriteChunks(writer);
		return writer.bytes;
	}

	WavFile.prototype.toBytes_WriteChunks = function(writer)
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

		this.toBytes_WriteChunks_Format(writer);
		this.toBytes_WriteChunks_Data(writer);
	}

	WavFile.prototype.toBytes_WriteChunks_Data = function(writer)
	{
		writer.writeString("data");

		var samplesForChannelsMixedAsBytes = WavFileSample.samplesForChannelsToBytes
		(
			this.samplesForChannels,
			this.samplingInfo
		);

		writer.writeInt(samplesForChannelsMixedAsBytes.length);

		writer.writeBytes(samplesForChannelsMixedAsBytes);
	}

	WavFile.prototype.toBytes_WriteChunks_Format = function(writer)
	{
		writer.writeString("fmt ");

		writer.writeInt(this.samplingInfo.chunkSizeInBytes);
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
		var samplesForChannels = WavFileSample.samplesForChannelsFromBytes
		(
			wavFile.samplingInfo,
			samplesForChannelsAsBytes
		);

		for (var c = 0; c < samplesForChannels.length; c++)
		{
			var samplesForChannel = samplesForChannels[c];

			for (var s = 0; s < samplesForChannel.length; s++)
			{
				var sample = samplesForChannel[s];
				sample.__proto__ = WavFileSample.prototype;
			}
		}

		wavFile.samplesForChannels = samplesForChannels;

		return wavFile;
	}

	WavFile.prototype.toStringJSON = function()
	{
		var samplesForChannelsToRestore = this.samplesForChannels;

		var samplesForChannelsAsBytes = WavFileSample.samplesForChannelsToBytes
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
