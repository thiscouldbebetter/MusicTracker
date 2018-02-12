
function ByteConverter(numberOfBits)
{
	this.numberOfBits = numberOfBits;
	this.numberOfBytes = Math.floor(this.numberOfBits / 8);

	this.maxValueSigned =
		(1 << (numberOfBits - 1)) - 1;

	this.maxValueUnsigned =
		(1 << (numberOfBits));
}

{
	ByteConverter.prototype.bytesToFloat = function(bytes)
	{
		var bytesAsInteger = this.bytesToInteger(bytes);

		var returnValue = this.integerToFloat(bytesAsInteger);


		return returnValue;
	}

	ByteConverter.prototype.bytesToIntegerSignedBE = function(bytes)
	{
		// Big-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			var byte = bytes[numberOfBytes - i - 1];
			returnValue |= byte << (i * Constants.BitsPerByte);
		}

		if (returnValue > this.maxValueSigned)
		{
			returnValue -= this.maxValueUnsigned;
		}

		return returnValue;
	}

	ByteConverter.prototype.bytesToIntegerSignedLE = function(bytes)
	{
		// Little-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			returnValue |= bytes[i] << (i * Constants.BitsPerByte);
		}

		if (returnValue > this.maxValueSigned)
		{
			returnValue -= this.maxValueUnsigned;
		}

		return returnValue;
	}

	ByteConverter.prototype.bytesToIntegerUnsignedBE = function(bytes)
	{
		// Big-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			var byte = bytes[numberOfBytes - i - 1];
			returnValue |= byte << (i * Constants.BitsPerByte);
		}

		return returnValue;
	}

	ByteConverter.prototype.bytesToIntegerUnsignedLE = function(bytes)
	{
		// Little-endian.

		var returnValue = 0;

		var numberOfBytes = bytes.length;

		for (var i = 0; i < numberOfBytes; i++)
		{
			returnValue |= bytes[i] << (i * Constants.BitsPerByte);
		}

		return returnValue;
	}

	ByteConverter.prototype.floatToInteger = function(float)
	{
		return float * this.maxValueSigned;
	}

	ByteConverter.prototype.integerToBytesBE = function(integer)
	{
		// Big-endian.
		var returnValues = [];

		for (var i = 0; i < this.numberOfBytes; i++)
		{
			var byteValue = (integer >> (Constants.BitsPerByte * i)) & 0xFF;
			returnValues.splice(0, 0, byteValue);
		}

		return returnValues;
	}

	ByteConverter.prototype.integerToBytesLE = function(integer)
	{
		// Little-endian.
		var returnValues = [];

		for (var i = 0; i < this.numberOfBytes; i++)
		{
			var byteValue = (integer >> (Constants.BitsPerByte * i)) & 0xFF;
			returnValues.push(byteValue);
		}

		return returnValues;
	}

	ByteConverter.prototype.integerToFloat = function(integer)
	{
		var returnValue =
			integer / this.maxValueSigned;

		return returnValue;
	}
}
