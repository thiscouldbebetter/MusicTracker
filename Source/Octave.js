
function Octave(frequencyInHertzOfC)
{
	this.frequencyInHertzOfC = frequencyInHertzOfC;
}

{
	Octave.Instances = new Octave_Instances();

	function Octave_Instances()
	{
		this.Zero = new Octave(16.352);
		this.One = new Octave(32.703);
		this.Two = new Octave(65.406);
		this.Three = new Octave(130.81);
		this.Four = new Octave(261.63);
		this.Five = new Octave(523.25);
		this.Six = new Octave(1046.5);
		this.Seven = new Octave(2093);

		this._All =
		[
			this.Zero,
			this.One,
			this.Two,
			this.Three,
			this.Four,
			this.Five,
			this.Six,
			this.Seven
		];
	}
}
