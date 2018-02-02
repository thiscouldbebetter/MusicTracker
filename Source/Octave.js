
function Octave(frequencyInHertzOfC)
{
	this.frequencyInHertzOfC = frequencyInHertzOfC;
}

{
	Octave.Instances = new Octave_Instances();
	
	function Octave_Instances()
	{
		this.Lower = new Octave(65.5);
		this.Low = new Octave(131);
		this.Middle = new Octave(262);
		this.High = new Octave(524);
		this.Higher = new Octave(1048);
	
		this._All = 
		[
			this.Lower,
			this.Low,
			this.Middle,
			this.High,
			this.Higher,
		];
	}
}
