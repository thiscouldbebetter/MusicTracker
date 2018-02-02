
function Pitch(name, code, frequencyMultiplier)
{
	this.name = name;
	this.code = code;
	this.frequencyMultiplier = frequencyMultiplier;
}

{
	Pitch.Instances = new Pitch_Instances();
	
	function Pitch_Instances()
	{
		var twelvthRootOfTwo = Math.pow(2, 1/12);
	
		this.C = new Pitch("C", "C_", 1);
		this.CSharp = new Pitch("C Sharp", "C#", twelvthRootOfTwo);
		this.D = new Pitch("D", "D_", Math.pow(twelvthRootOfTwo, 2));
		this.DSharp = new Pitch("D Sharp", "D#", twelvthRootOfTwo, 3);
		this.E = new Pitch("E", "E_", Math.pow(twelvthRootOfTwo, 4));
		this.F = new Pitch("F", "F_", Math.pow(twelvthRootOfTwo, 5));
		this.FSharp = new Pitch("F Sharp", "F#", twelvthRootOfTwo, 6);
		this.G = new Pitch("G", "G_", Math.pow(twelvthRootOfTwo, 7));
		this.GSharp = new Pitch("G Sharp", "G#", twelvthRootOfTwo, 8);		
		this.A = new Pitch("A", "A_", Math.pow(twelvthRootOfTwo, 9));
		this.ASharp = new Pitch("A Sharp", "A#", twelvthRootOfTwo, 10);
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
		].addLookups("code");
	}
}
