
function WavFileSample()
{
	// do nothing
}

{
	// static methods

	WavFileSample.samplesForChannelsFromBytes = function
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

	WavFileSample.samplesForChannelsToBytes = function
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
}
