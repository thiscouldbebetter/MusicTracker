
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

	ByteConverter.prototype.bytesToInteger = function(bytes)
	{
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

	ByteConverter.prototype.floatToInteger = function(float)
	{
		return float * this.maxValueSigned;
	}

	ByteConverter.prototype.integerToBytes = function(integer)
	{
		var returnValues = [];

		for (var i = 0; i < this.numberOfBytes; i++)
		{
			var byteValue = (integer >> (8 * i)) & 0xFF;
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
