
class Base64Encoder
{
	// static methods

	static bytesToStringBase64(bytes: number[]): string
	{
		var bytesAsBinaryString = "";
		for (var i = 0; i < bytes.length; i++)
		{
			var byte = bytes[i];
			var byteAsChar = String.fromCharCode(byte);
			bytesAsBinaryString += byteAsChar;
		}

		var returnValue = btoa(bytesAsBinaryString);

		return returnValue;
	}

	static stringBase64ToBytes(stringBase64: string): number[]
	{
		var bytesAsBinaryString = atob(stringBase64);
		var bytes = [];
		for (var i = 0; i < bytesAsBinaryString.length; i++)
		{
			var byte = bytesAsBinaryString.charCodeAt(i);
			bytes.push(byte);
		}

		return bytes;
	}

}
