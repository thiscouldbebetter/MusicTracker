"use strict";
class ByteStreamLittleEndian {
    constructor(bytes) {
        this.bytes = bytes;
        this.numberOfBytesTotal = this.bytes.length;
        this.byteIndexCurrent = 0;
    }
    hasMoreBytes() {
        return (this.byteIndexCurrent < this.numberOfBytesTotal);
    }
    peekBytes(numberOfBytesToRead) {
        var returnValue = [];
        for (var b = 0; b < numberOfBytesToRead; b++) {
            returnValue[b] = this.bytes[this.byteIndexCurrent + b];
        }
        return returnValue;
    }
    readBytes(numberOfBytesToRead) {
        var returnValue = [];
        for (var b = 0; b < numberOfBytesToRead; b++) {
            returnValue[b] = this.readByte();
        }
        return returnValue;
    }
    readByte() {
        var returnValue = this.bytes[this.byteIndexCurrent];
        this.byteIndexCurrent++;
        return returnValue;
    }
    readInt() {
        var returnValue = ((this.readByte() & 0xFF)
            | ((this.readByte() & 0xFF) << 8)
            | ((this.readByte() & 0xFF) << 16)
            | ((this.readByte() & 0xFF) << 24));
        return returnValue;
    }
    readShort() {
        var returnValue = ((this.readByte() & 0xFF)
            | ((this.readByte() & 0xFF) << 8));
        return returnValue;
    }
    readString(numberOfBytesToRead) {
        var returnValue = "";
        for (var b = 0; b < numberOfBytesToRead; b++) {
            var charAsByte = this.readByte();
            returnValue += String.fromCharCode(charAsByte);
        }
        return returnValue;
    }
    writeBytes(bytesToWrite) {
        for (var b = 0; b < bytesToWrite.length; b++) {
            this.bytes.push(bytesToWrite[b]);
        }
        this.byteIndexCurrent = this.bytes.length;
    }
    writeByte(byteToWrite) {
        this.bytes.push(byteToWrite);
        this.byteIndexCurrent++;
    }
    writeInt(integerToWrite) {
        this.bytes.push((integerToWrite & 0x000000FF));
        this.bytes.push((integerToWrite & 0x0000FF00) >>> 8);
        this.bytes.push((integerToWrite & 0x00FF0000) >>> 16);
        this.bytes.push((integerToWrite & 0xFF000000) >>> 24);
        this.byteIndexCurrent += 4;
    }
    writeShort(shortToWrite) {
        this.bytes.push((shortToWrite & 0x00FF));
        this.bytes.push((shortToWrite & 0xFF00) >>> 8);
        this.byteIndexCurrent += 2;
    }
    writeString(stringToWrite) {
        for (var i = 0; i < stringToWrite.length; i++) {
            this.writeByte(stringToWrite.charCodeAt(i));
        }
    }
}
