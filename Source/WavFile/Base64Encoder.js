
// classes

function Base64Encoder()
{
	// do nothing
}

{
	// static methods

	Base64Encoder.bytesToStringBase64 = function(bytes)
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

	Base64Encoder.stringBase64ToBytes = function(stringBase64)
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
