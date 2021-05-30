
class ByteConverter
{
	numberOfBits: number;
	numberOfBytes: number;
	maxValueSigned: number;
	maxValueUnsigned: number;

	constructor(numberOfBits: number)
	{
		this.numberOfBits = numberOfBits;
		this.numberOfBytes = Math.floor(this.numberOfBits / 8);

		this.maxValueSigned =
			(1 << (numberOfBits - 1)) - 1;

		this.maxValueUnsigned =
			(1 << (numberOfBits));
	}

	bytesToFloat(bytes: number[]): number
	{
		var bytesAsInteger = this.bytesToIntegerSignedBE(bytes); // Signed or unsigned?  BE or LE?

		var returnValue = this.integerToFloat(bytesAsInteger);

		return returnValue;
	}

	bytesToIntegerSignedBE(bytes: number[]): number
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

	bytesToIntegerSignedLE(bytes: number[]): number
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

	bytesToIntegerUnsignedBE(bytes: number[]): number
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

	bytesToIntegerUnsignedLE(bytes: number[]): number
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

	floatToInteger(float: number): number
	{
		return float * this.maxValueSigned;
	}

	integerToBytesBE(integer: number): number[]
	{
		// Big-endian.
		var returnValues = new Array<number>();

		for (var i = 0; i < this.numberOfBytes; i++)
		{
			var byteValue = (integer >> (Constants.BitsPerByte * i)) & 0xFF;
			returnValues.splice(0, 0, byteValue);
		}

		return returnValues;
	}

	integerToBytesLE(integer: number): number[]
	{
		// Little-endian.
		var returnValues = new Array<number>();

		for (var i = 0; i < this.numberOfBytes; i++)
		{
			var byteValue = (integer >> (Constants.BitsPerByte * i)) & 0xFF;
			returnValues.push(byteValue);
		}

		return returnValues;
	}

	integerToFloat(integer: number): number
	{
		var returnValue =
			integer / this.maxValueSigned;

		return returnValue;
	}
}
