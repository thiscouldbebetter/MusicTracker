
namespace ThisCouldBeBetter.MusicTracker
{

export class Pitch
{
	name: string;
	code: string;
	frequencyMultiplier: number;

	constructor(name: string, code: string, frequencyMultiplier: number)
	{
		this.name = name;
		this.code = code;
		this.frequencyMultiplier = frequencyMultiplier;
	}

	static _instances: Pitch_Instances;
	static Instances(): Pitch_Instances
	{
		if (Pitch._instances == null)
		{
			Pitch._instances = new Pitch_Instances();
		}
		return Pitch._instances;
	}
}

export class Pitch_Instances
{
	C: Pitch;
	CSharp:Pitch;
	D: Pitch;
	DSharp: Pitch;
	E: Pitch;
	F: Pitch;
	FSharp: Pitch;
	G: Pitch;
	GSharp: Pitch;
	A: Pitch;
	ASharp: Pitch;
	B: Pitch;

	_All: Pitch[];
	_AllByCode: Map<string, Pitch>;

	constructor()
	{
		var twelvthRootOfTwo = Math.pow(2, 1/12);

		this.C = new Pitch("C", "C_", 1);
		this.CSharp = new Pitch("C Sharp", "C#", twelvthRootOfTwo);
		this.D = new Pitch("D", "D_", Math.pow(twelvthRootOfTwo, 2));
		this.DSharp = new Pitch("D Sharp", "D#", Math.pow(twelvthRootOfTwo, 3));
		this.E = new Pitch("E", "E_", Math.pow(twelvthRootOfTwo, 4));
		this.F = new Pitch("F", "F_", Math.pow(twelvthRootOfTwo, 5));
		this.FSharp = new Pitch("F Sharp", "F#", Math.pow(twelvthRootOfTwo, 6));
		this.G = new Pitch("G", "G_", Math.pow(twelvthRootOfTwo, 7));
		this.GSharp = new Pitch("G Sharp", "G#", Math.pow(twelvthRootOfTwo, 8));
		this.A = new Pitch("A", "A_", Math.pow(twelvthRootOfTwo, 9));
		this.ASharp = new Pitch("A Sharp", "A#", Math.pow(twelvthRootOfTwo, 10));
		this.B = new Pitch("B", "B_", Math.pow(twelvthRootOfTwo, 11));

		this._All =
		[
			this.C,
			this.CSharp,
			this.D,
			this.DSharp,
			this.E,
			this.F,
			this.FSharp,
			this.G,
			this.GSharp,
			this.A,
			this.ASharp,
			this.B,
		];

		this._AllByCode = ArrayHelper.addLookups(this._All, (p: Pitch) => p.code);
	}

	byCode(code: string): Pitch
	{
		return this._AllByCode.get(code);
	}
}

}