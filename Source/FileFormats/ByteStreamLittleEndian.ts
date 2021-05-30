
class ByteStreamLittleEndian
{
	bytes: number[];

	numberOfBytesTotal: number;
	byteIndexCurrent: number;

	constructor(bytes: number[])
	{
		this.bytes = bytes;

		this.numberOfBytesTotal = this.bytes.length;
		this.byteIndexCurrent = 0;
	}

	hasMoreBytes(): boolean
	{
		return (this.byteIndexCurrent < this.numberOfBytesTotal);
	}

	peekBytes(numberOfBytesToRead: number): number[]
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.bytes[this.byteIndexCurrent + b];
		}

		return returnValue;
	}

	readBytes(numberOfBytesToRead: number): number[]
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.readByte();
		}

		return returnValue;
	}

	readByte(): number
	{
		var returnValue = this.bytes[this.byteIndexCurrent];

		this.byteIndexCurrent++;

		return returnValue;
	}

	readInt(): number
	{
		var returnValue =
		(
			(this.readByte() & 0xFF)
			| ((this.readByte() & 0xFF) << 8 )
			| ((this.readByte() & 0xFF) << 16)
			| ((this.readByte() & 0xFF) << 24)
		);

		return returnValue;
	}

	readShort(): number
	{
		var returnValue =
		(
			(this.readByte() & 0xFF)
			| ((this.readByte() & 0xFF) << 8 )
		);

		return returnValue;
	}

	readString(numberOfBytesToRead: number): string
	{
		var returnValue = "";

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			var charAsByte = this.readByte();
			returnValue += String.fromCharCode(charAsByte);
		}

		return returnValue;
	}

	writeBytes(bytesToWrite: number[]): void
	{
		for (var b = 0; b < bytesToWrite.length; b++)
		{
			this.bytes.push(bytesToWrite[b]);
		}

		this.byteIndexCurrent = this.bytes.length;
	}

	writeByte(byteToWrite: number): void
	{
		this.bytes.push(byteToWrite);

		this.byteIndexCurrent++;
	}

	writeInt(integerToWrite: number): void
	{
		this.bytes.push( (integerToWrite & 0x000000FF) );
		this.bytes.push( (integerToWrite & 0x0000FF00) >>> 8 );
		this.bytes.push( (integerToWrite & 0x00FF0000) >>> 16 );
		this.bytes.push( (integerToWrite & 0xFF000000) >>> 24 );

		this.byteIndexCurrent += 4;
	}

	writeShort(shortToWrite: number): void
	{
		this.bytes.push( (shortToWrite & 0x00FF) );
		this.bytes.push( (shortToWrite & 0xFF00) >>> 8 );

		this.byteIndexCurrent += 2;
	}

	writeString(stringToWrite: string): void
	{
		for (var i = 0; i < stringToWrite.length; i++)
		{
			this.writeByte(stringToWrite.charCodeAt(i));
		}
	}
}
