
function FileHelper()
{
	// static class
}

{
	FileHelper.loadFileAsText = function(fileToLoad, callback)
	{
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent)
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;
			callback(fileToLoad, textFromFileLoaded);
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
	}

	FileHelper.loadFileAsBytes = function(fileToLoad, callback)
	{
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent)
		{
			var fileContentsAsBinaryString = fileLoadedEvent.target.result;
			var fileContentsAsBytes = [];
			for (var i = 0; i < fileContentsAsBinaryString.length; i++)
			{
				var byte = fileContentsAsBinaryString.charCodeAt(i);
				fileContentsAsBytes.push(byte);
			}
			callback(fileToLoad, fileContentsAsBytes);
		};
		fileReader.readAsBinaryString(fileToLoad);
	}

	FileHelper.saveBytesToFile = function(bytesToSave, filenameToSaveTo)
	{
		var numberOfBytes = bytesToSave.length;
		var bytesAsArrayBuffer = new ArrayBuffer(numberOfBytes);
		var bytesAsUIntArray = new Uint8Array(bytesAsArrayBuffer);
		for (var i = 0; i < numberOfBytes; i++)
		{
			bytesAsUIntArray[i] = bytesToSave[i];
		}

		var bytesAsBlob = new Blob
		(
			[ bytesAsArrayBuffer ],
			{type:"application/type"}
		);

		var downloadLink = document.createElement("a");
		downloadLink.href = URL.createObjectURL(bytesAsBlob);
		downloadLink.download = filenameToSaveTo;
		downloadLink.click();

	}

	FileHelper.saveTextAsFile = function(textToWrite, fileNameToSaveAs)
	{
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});

		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		downloadLink.href = URL.createObjectURL(textFileAsBlob);
		downloadLink.click();
	}
}
