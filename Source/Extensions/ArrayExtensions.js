
// extensions

function ArrayExtensions()
{
	// Extension class.
}

{
	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var key = element[keyName];
			this[key] = element;
		}
		return this;
	}
	
	Array.prototype.contains = function(element)
	{
		return (this.indexOf(element) >= 0);
	}
	
	Array.prototype.insertElementAt = function(element, index)
	{
		this.splice(index, 0, element);
		return this;
	}
	
	Array.prototype.remove = function(element)
	{
		if (this.contains(element) == true)
		{
			this.removeAt(this.indexOf(element));
		}
		return this;
	}
	
	Array.prototype.removeAt = function(index)
	{
		this.splice(index, 1);
		return this;
	}
}
