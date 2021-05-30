
class ArrayHelper
{
	static addLookups<K, E>(array: E[], getKeyForElement: (e: E) => K ): Map<K, E>
	{
		var returnLookup = new Map<K, E>();
		for (var i = 0; i < array.length; i++)
		{
			var element = array[i];
			var key = getKeyForElement(element);
			returnLookup.set(key, element);
		}
		return returnLookup;
	}

	static clone(array: any[]): any[]
	{
		var returnValues = [];
		for (var i = 0; i < array.length; i++)
		{
			var elementToClone = array[i];
			var elementCloned = elementToClone.clone();
			returnValues.push(elementCloned);
		}
		return returnValues;
	}

	static contains(array: any[], element: any): boolean
	{
		return (array.indexOf(element) >= 0);
	}

	static insertElementAt(array: any[], element: any, index: number): any[]
	{
		array.splice(index, 0, element);
		return array;
	}

	static remove(array: any[], element: any): any[]
	{
		if (ArrayHelper.contains(array, element) )
		{
			ArrayHelper.removeAt(array, array.indexOf(element) );
		}
		return array;
	}

	static removeAt(array: any[], index: number): any[]
	{
		array.splice(index, 1);
		return array;
	}
}
