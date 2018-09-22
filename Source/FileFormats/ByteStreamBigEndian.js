
function ByteStreamBigEndian(bytes)
{
	this.bytes = bytes;

	this.numberOfBytesTotal = this.bytes.length;
	this.byteIndexCurrent = 0;
}

{
	ByteStreamBigEndian.prototype.hasMoreBytes = function()
	{
		return (this.byteIndexCurrent < this.numberOfBytesTotal);
	}

	ByteStreamBigEndian.prototype.peekBytes = function(numberOfBytesToRead)
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.bytes[this.byteIndexCurrent + b];
		}

		return returnValue;
	}

	ByteStreamBigEndian.prototype.readBytes = function(numberOfBytesToRead)
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.readByte();
		}

		return returnValue;
	}

	ByteStreamBigEndian.prototype.readByte = function()
	{
		var returnValue = this.bytes[this.byteIndexCurrent];

		this.byteIndexCurrent++;

		return returnValue;
	}

	ByteStreamBigEndian.prototype.readInt = function()
	{
		var returnValue =
		(
			(this.readByte() & 0xFF) << 24
			| ((this.readByte() & 0xFF) << 16 )
			| ((this.readByte() & 0xFF) << 8 )
			| ((this.readByte() & 0xFF) )
		);

		return returnValue;
	}

	ByteStreamBigEndian.prototype.readShort = function()
	{
		var returnValue =
		(
			(this.readByte() & 0xFF) << 8
			| ((this.readByte() & 0xFF) )
		);

		return returnValue;
	}

	ByteStreamBigEndian.prototype.readString = function(numberOfBytesToRead)
	{
		var returnValue = "";

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			var charAsByte = this.readByte();
			returnValue += String.fromCharCode(charAsByte);
		}

		return returnValue;
	}

	ByteStreamBigEndian.prototype.writeBytes = function(bytesToWrite)
	{
		for (var b = 0; b < bytesToWrite.length; b++)
		{
			this.bytes.push(bytesToWrite[b]);
		}

		this.byteIndexCurrent = this.bytes.length;
	}

	ByteStreamBigEndian.prototype.writeByte = function(byteToWrite)
	{
		this.bytes.push(byteToWrite);

		this.byteIndexCurrent++;
	}

	ByteStreamBigEndian.prototype.writeInt = function(integerToWrite)
	{
		this.bytes.push( (integerToWrite & 0xFF000000) >>> 24 );
		this.bytes.push( (integerToWrite & 0x00FF0000) >>> 16 );
		this.bytes.push( (integerToWrite & 0x0000FF00) >>> 8 );
		this.bytes.push( (integerToWrite & 0x000000FF) );

		this.byteIndexCurrent += 4;
	}

	ByteStreamBigEndian.prototype.writeShort = function(shortToWrite)
	{
		this.bytes.push( (shortToWrite & 0xFF00) >>> 8 );
		this.bytes.push( (shortToWrite & 0x00FF) );

		this.byteIndexCurrent += 2;
	}

	ByteStreamBigEndian.prototype.writeString = function(stringToWrite)
	{
		for (var i = 0; i < stringToWrite.length; i++)
		{
			this.writeByte(stringToWrite.charCodeAt(i));
		}
	}
}
