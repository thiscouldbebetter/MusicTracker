
function WavFileSamplingInfo
(
	name,
	chunkSizeInBytes,
	formatCode,
	numberOfChannels,
	samplesPerSecond,
	bitsPerSample,
	extraBytes
)
{
	this.name = name;
	this.chunkSizeInBytes = chunkSizeInBytes;
	this.formatCode = formatCode;
	this.numberOfChannels = numberOfChannels;
	this.samplesPerSecond = samplesPerSecond;
	this.bitsPerSample = bitsPerSample;
	this.extraBytes = extraBytes;
}
{
	WavFileSamplingInfo.buildDefault = function()
	{
		var returnValue = new WavFileSamplingInfo
		(
			"Default",
			16, // chunkSizeInBytes
			1, // formatCode
			1, // numberOfChannels
			44100,	 // samplesPerSecond
			16, // bitsPerSample
			null // extraBytes
		);

		return returnValue;
	}

	WavFileSamplingInfo.prototype.bytesPerSecond = function()
	{
		return this.samplesPerSecond
			* this.numberOfChannels
			* this.bitsPerSample / Constants.BitsPerByte;
	}

	WavFileSamplingInfo.prototype.toString = function()
	{
		var returnValue =
			"<SamplingInfo "
			+ "chunkSizeInBytes='" + this.chunkSizeInBytes + "' "
			+ "formatCode='" + this.formatCode + "' "
			+ "numberOfChannels='" + this.numberOfChannels + "' "
			+ "samplesPerSecond='" + this.samplesPerSecond + "' "
			+ "bitsPerSample='" + this.bitsPerSample + "' "
			+ "/>";

		return returnValue;
	}
}
