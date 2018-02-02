
function ByteStreamLittleEndian(bytes)
{
	this.bytes = bytes;

	this.numberOfBytesTotal = this.bytes.length;
	this.byteIndexCurrent = 0;
}

{
	ByteStreamLittleEndian.prototype.hasMoreBytes = function()
	{
		return (this.byteIndexCurrent < this.numberOfBytesTotal);
	}

	ByteStreamLittleEndian.prototype.peekBytes = function(numberOfBytesToRead)
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.bytes[this.byteIndexCurrent + b];
		}

		return returnValue;
	}

	ByteStreamLittleEndian.prototype.readBytes = function(numberOfBytesToRead)
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.readByte();
		}

		return returnValue;
	}

	ByteStreamLittleEndian.prototype.readByte = function()
	{
		var returnValue = this.bytes.charCodeAt(this.byteIndexCurrent);

		this.byteIndexCurrent++;

		return returnValue;
	}

	ByteStreamLittleEndian.prototype.readInt = function()
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

	ByteStreamLittleEndian.prototype.readShort = function()
	{
		var returnValue =
		(
			(this.readByte() & 0xFF)
			| ((this.readByte() & 0xFF) << 8 )
		);

		return returnValue;
	}

	ByteStreamLittleEndian.prototype.readString = function(numberOfBytesToRead)
	{
		var returnValue = "";

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			var charAsByte = this.readByte();
			returnValue += String.fromCharCode(charAsByte);
		}

		return returnValue;
	}

	ByteStreamLittleEndian.prototype.writeBytes = function(bytesToWrite)
	{
		for (var b = 0; b < bytesToWrite.length; b++)
		{
			this.bytes.push(bytesToWrite[b]);
		}

		this.byteIndexCurrent = this.bytes.length;
	}

	ByteStreamLittleEndian.prototype.writeByte = function(byteToWrite)
	{
		this.bytes.push(byteToWrite);

		this.byteIndexCurrent++;
	}

	ByteStreamLittleEndian.prototype.writeInt = function(integerToWrite)
	{
		this.bytes.push( (integerToWrite & 0x000000FF) );
		this.bytes.push( (integerToWrite & 0x0000FF00) >>> 8 );
		this.bytes.push( (integerToWrite & 0x00FF0000) >>> 16 );
		this.bytes.push( (integerToWrite & 0xFF000000) >>> 24 );

		this.byteIndexCurrent += 4;
	}

	ByteStreamLittleEndian.prototype.writeShort = function(shortToWrite)
	{
		this.bytes.push( (shortToWrite & 0x00FF) );
		this.bytes.push( (shortToWrite & 0xFF00) >>> 8 );

		this.byteIndexCurrent += 2;
	}

	ByteStreamLittleEndian.prototype.writeString = function(stringToWrite)
	{
		for (var i = 0; i < stringToWrite.length; i++)
		{
			this.writeByte(stringToWrite.charCodeAt(i));
		}
	}
}
