
class StringHelper
{
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
