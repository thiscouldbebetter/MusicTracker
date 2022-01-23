
namespace ThisCouldBeBetter.MusicTracker
{

export class Octave
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

export class Octave_Instances
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
	Nine: Octave;

	_All: Octave[];

	constructor()
	{
		// The very low and high octaves may not be audible by all humans.

		// Also, if the frequency exceeds half the sample rate,
		// the perceived sound will be distorted.  See: Nyquist's Law.
		// For example, at the default sample rate of 8000, octaves 8 and 9
		// are distorted, and their rising C natural scales sound like
		// either a falling or seemingly chaotic series of pitches.

		this.Zero = new Octave(16.352);
		this.One = new Octave(32.703);
		this.Two = new Octave(65.406);
		this.Three = new Octave(130.81);
		this.Four = new Octave(261.63);
		this.Five = new Octave(523.25);
		this.Six = new Octave(1046.5);
		this.Seven = new Octave(2093);
		this.Eight = new Octave(4186);
		this.Nine = new Octave(8372);

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
			this.Eight,
			this.Nine
		];
	}
}

}