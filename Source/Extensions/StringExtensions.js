
function StringExtensions()
{
	// Extension class.
}

{
	String.prototype.padLeft = function(lengthToPadTo, charToPadWith)
	{
		var returnValue = this;
		
		while (returnValue.length < lengthToPadTo)
		{
			returnValue = charToPadWith + returnValue;
		}
		
		return returnValue;
	}
}
