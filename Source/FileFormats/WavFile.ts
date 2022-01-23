
namespace ThisCouldBeBetter.MusicTracker
{

export class WavFile //
{
	filePath: string;
	samplingInfo: WavFileSamplingInfo;
	samplesForChannels: any; // number[][];

	constructor
	(
		filePath: string,
		samplingInfo: WavFileSamplingInfo,
		samplesForChannels: number[][]
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

	// constants

	static NumberOfBytesInRiffWaveAndFormatChunks = 36;

	// static methods

	appendClipFromWavFileBetweenTimesStartAndEnd
	(
		wavFileToClipFrom: WavFile,
		timeStartInSeconds: number,
		timeEndInSeconds: number
	): WavFile
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

		// var samplesForChannelsInClip = [];

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

	clipBetweenTimes(timeStartInSeconds: number, timeEndInSeconds: number): WavFile
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

	durationInSamples(): number
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

	durationInSeconds(): number
	{
		var durationInSamples = this.durationInSamples();
		var returnValue =
			durationInSamples
			/ this.samplingInfo.samplesPerSecond;
		return returnValue;
	}

	extendOrTrimSamples(numberOfSamplesToExtendOrTrimTo: number): void
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

			for (var s2 = samplesForChannelOld.length; s2 < numberOfSamplesToExtendOrTrimTo; s2++)
			{
				samplesForChannelNew[s2] = 0;
			}

			samplesForChannelsNew[c] = samplesForChannelNew;
		}

		this.samplesForChannels = samplesForChannelsNew;
	}

	// bytes

	// read

	static fromBytes(name: string, bytes: number[]): WavFile
	{
		var returnValue = new WavFile(name, null, null);
		var reader = new ByteStreamLittleEndian(bytes);
		returnValue.fromBytes_Chunks(reader);
		return returnValue;
	}

	fromBytes_Chunks(reader: ByteStreamLittleEndian): void
	{
		// var riffStringAsBytes = 
		reader.readBytes(4);

		// var numberOfBytesInFile =
		reader.readInt();

		// var waveStringAsBytes =
		reader.readBytes(4);

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

	fromBytes_Chunks_Data(reader: ByteStreamLittleEndian): void
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

	fromBytes_Chunks_Data_SamplesForChannels
	(
		samplingInfo: WavFileSamplingInfo,
		bytesToConvert: number[]
	): number[][]
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

				var sampleValueAsInteger = byteConverter.bytesToIntegerUnsignedLE
				(
					sampleValueAsBytes
				);

				returnSamples[c][s] = sampleValueAsInteger;
			}
		}

		return returnSamples;
	}

	fromBytes_Chunks_Format(reader: ByteStreamLittleEndian): void
	{
		var chunkSizeInBytes = reader.readInt();
		var formatCode = reader.readShort();

		var numberOfChannels = reader.readShort();
		var samplesPerSecond = reader.readInt();

		// var bytesPerSecond =
		reader.readInt(); // samplesPerSecond * numberOfChannels * bitsPerSample / 8
		// var bytesPerSampleForAllChannels =
		reader.readShort(); // numberOfChannels * bitsPerSample / 8
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

	fromBytes_Chunks_Unrecognized(reader: ByteStreamLittleEndian): void
	{
		var chunkDataSizeInBytes = reader.readInt();
		// var chunkData =
		reader.readBytes(chunkDataSizeInBytes);
	}

	// write

	toBytes(): number[]
	{
		var writer = new ByteStreamLittleEndian([]);
		this.toBytes_Chunks(writer);
		return writer.bytes;
	}

	toBytes_Chunks(writer: ByteStreamLittleEndian): void
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

	toBytes_Chunks_Data(writer: ByteStreamLittleEndian): void
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

	toBytes_Chunks_Data_SamplesForChannels
	(
		samplesForChannelsToConvert: number[][],
		samplingInfo: WavFileSamplingInfo
	)
	{
		var returnBytes = null;

		var numberOfChannels = samplingInfo.numberOfChannels;

		var samplesPerChannel = samplesForChannelsToConvert[0].length;

		var bitsPerSample = samplingInfo.bitsPerSample;

		var bytesPerSample = bitsPerSample / Constants.BitsPerByte;

		// var numberOfBytes = numberOfChannels * samplesPerChannel * bytesPerSample;

		returnBytes = [];

		var b = 0;

		var byteConverter = new ByteConverter(bitsPerSample);

		for (var s = 0; s < samplesPerChannel; s++)
		{
			for (var c = 0; c < numberOfChannels; c++)
			{
				var sampleAsInteger = samplesForChannelsToConvert[c][s];

				var sampleAsBytes = byteConverter.integerToBytesLE
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

	toBytes_Chunks_Format(writer: ByteStreamLittleEndian): void
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

	static fromStringJSON(wavFileAsJSON: string): WavFile
	{
		var wavFile = JSON.parse(wavFileAsJSON);
		wavFile = WavFile.objectPrototypesSet(wavFile);
		return wavFile;
	}

	static objectPrototypesSet(wavFile: any): WavFile
	{
		Object.setPrototypeOf(wavFile, WavFile.prototype);

		Object.setPrototypeOf(wavFile.samplingInfo, WavFileSamplingInfo.prototype);

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

	toStringJSON(): string
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

export class WavFileSamplingInfo
{
	formatCode: number;
	numberOfChannels: number;
	samplesPerSecond: number;
	bitsPerSample: number;
	extraBytes: number[];

	constructor
	(
		formatCode: number,
		numberOfChannels: number,
		samplesPerSecond: number,
		bitsPerSample: number,
		extraBytes: number[]
	)
	{
		this.formatCode = (formatCode || WavFileSamplingInfo.FormatCodeDefault);
		this.numberOfChannels = numberOfChannels;
		this.samplesPerSecond = samplesPerSecond;
		this.bitsPerSample = bitsPerSample;
		this.extraBytes = (extraBytes || []);
	}

	// constants

	static ChunkSizeInBytesMin = 16;
	static FormatCodeDefault = 1; // Uncompressed.

	// static methods

	static default(): WavFileSamplingInfo
	{
		var returnValue = new WavFileSamplingInfo
		(
			1, // formatCode
			1, // numberOfChannels
			44100, // samplesPerSecond
			16, // bitsPerSample
			null // ?
		);

		return returnValue;
	}

	bytesPerSample(): number
	{
		return this.bitsPerSample / Constants.BitsPerByte;
	}

	bytesPerSampleForAllChannels(): number
	{
		return this.bytesPerSample() * this.numberOfChannels;
	}

	bytesPerSecond(): number
	{
		return this.samplesPerSecond
			* this.bytesPerSampleForAllChannels();
	}

	chunkSizeInBytes(): number
	{
		return WavFileSamplingInfo.ChunkSizeInBytesMin + this.extraBytes.length;
	}

	samplesDenormalize(samplesToDenormalize: number[]): number[]
	{
		var sampleDenormalizedMax = Math.pow(2, this.bitsPerSample) - 1;
		var samplesDenormalized = [];
		for (var i = 0; i < samplesToDenormalize.length; i++)
		{
			var sampleToDenormalize = samplesToDenormalize[i];
			var sampleDenormalized = Math.round
			(
				(sampleToDenormalize + 1) / 2 * sampleDenormalizedMax
			);
			samplesDenormalized.push(sampleDenormalized);
		}

		if (this.bitsPerSample > 8)
		{
			samplesToDenormalize = samplesDenormalized;
			var sampleDenormalizedMaxHalf = Math.pow(2, this.bitsPerSample - 1);
			for (var i = 0; i < samplesToDenormalize.length; i++)
			{
				samplesToDenormalize[i] -= sampleDenormalizedMaxHalf;
			}
		}

		return samplesDenormalized;
	}

	samplesNormalize(samplesToNormalize: number[]): number[]
	{
		var sampleDenormalizedMax = Math.pow(2, this.bitsPerSample) - 1;
		var samplesNormalized = [];

		if (this.bitsPerSample > 8)
		{
			var sampleDenormalizedMaxHalf = Math.pow(2, this.bitsPerSample - 1);
			for (var i = 0; i < samplesToNormalize.length; i++)
			{
				var sampleToNormalize = samplesToNormalize[i];
				if (sampleToNormalize < sampleDenormalizedMaxHalf)
				{
					sampleToNormalize += sampleDenormalizedMaxHalf;
				}
				else
				{
					// Negative number.
					// todo - Two's complement?
					sampleToNormalize -= sampleDenormalizedMaxHalf;
				}
				samplesNormalized.push(sampleToNormalize);
			}
			samplesToNormalize = samplesNormalized;
			samplesNormalized = [];
		}

		for (var i = 0; i < samplesToNormalize.length; i++)
		{
			var sampleToNormalize = samplesToNormalize[i];
			var sampleNormalized = (sampleToNormalize / sampleDenormalizedMax) * 2 - 1;
			samplesNormalized.push(sampleNormalized);
		}
		return samplesNormalized;
	}
}

}