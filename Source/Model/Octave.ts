
class Octave
{
	frequencyInHertzOfC: number;

	constructor(frequencyInHertzOfC: number)
	{
		this.frequencyInHertzOfC = frequencyInHertzOfC;
	}

	static _instances: Octave_Instances;
	static Instances(): Octave_Instances
	{
		if (Octave._instances == null)
		{
			Octave._instances = new Octave_Instances();
		}
		return Octave._instances;
	}
}

class Octave_Instances
{
	Zero: Octave;
	One: Octave;
	Two: Octave;
	Three: Octave;
	Four: Octave;
	Five: Octave;
	Six: Octave;
	Seven: Octave;
	Eight: Octave;

	_All: Octave[];

	constructor()
	{
		this.Zero = new Octave(16.352);
		this.One = new Octave(32.703);
		this.Two = new Octave(65.406);
		this.Three = new Octave(130.81);
		this.Four = new Octave(261.63);
		this.Five = new Octave(523.25);
		this.Six = new Octave(1046.5);
		this.Seven = new Octave(2093);
		this.Eight = new Octave(4186);

		this._All =
		[
			this.Zero,
			this.One,
			this.Two,
			this.Three,
			this.Four,
			this.Five,
			this.Six,
			this.Seven,
			this.Eight
		];
	}
}


