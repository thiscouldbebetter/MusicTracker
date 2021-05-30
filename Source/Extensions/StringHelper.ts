
class StringHelper
{
	static makeIdentifier(stringToMakeIdentifier: string): string
	{
		var returnValue = "_";
		for (var i = 0; i < stringToMakeIdentifier.length; i++)
		{
			var char = stringToMakeIdentifier[i];
			if (char == " ")
			{
				// Do nothing.
			}
			else
			{
				var charAsNumber = parseFloat(char);

				if
				(
					char.toLowerCase() != char.toUpperCase()
					|| isNaN(charAsNumber) == false
				)
				{
					returnValue += charAsNumber;
				}
			}
		}

		return returnValue;
	}

	static padLeft
	(
		stringToPad: string, lengthToPadTo: number, charToPadWith: string
	): string
	{
		var returnValue = stringToPad;

		while (returnValue.length < lengthToPadTo)
		{
			returnValue = charToPadWith + returnValue;
		}

		return returnValue;
	}

	static replaceAll
	(
		stringToReplaceWithin: string,
		stringToBeReplaced: string,
		stringToReplaceWith: string
	): string
	{
		return stringToReplaceWithin.replace
		(
			new RegExp(stringToBeReplaced, "g"), stringToReplaceWith
		);
	}
}
