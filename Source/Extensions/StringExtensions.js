
String.prototype.makeIdentifier = function()
{
	var returnValue = "_";
	for (var i = 0; i < this.length; i++)
	{
		var char = this[i];
		if (char == " ")
		{
			// Do nothing.
		}
		else if
		(
			char.toLowerCase() != char.toUpperCase()
			|| isNaN(char) == false
		)
		{
			returnValue += char;
		}
	}

	return returnValue;
}

String.prototype.padLeft = function(lengthToPadTo, charToPadWith)
{
	var returnValue = this;

	while (returnValue.length < lengthToPadTo)
	{
		returnValue = charToPadWith + returnValue;
	}

	return returnValue;
}

String.prototype.replaceAll = function(stringToBeReplaced, stringToReplaceWith)
{
	return this.replace(new RegExp(stringToBeReplaced, "g"), stringToReplaceWith);
}
