
class SoundSourceType
{
	name: string;
	soundSourceCreate: ()=>SoundSourceChild;
	objectPrototypesSet: (objectToSet: any)=>void;

	constructor
	(
		name: string,
		soundSourceCreate: ()=>SoundSourceChild,
		objectPrototypesSet: (objectToSet: any)=>void
	)
	{
		this.name = name;
		this.soundSourceCreate = soundSourceCreate;
		this.objectPrototypesSet = objectPrototypesSet;
	}

	static _instances: SoundSourceType_Instances;
	static Instances(): SoundSourceType_Instances
	{
		if (SoundSourceType._instances == null)
		{
			SoundSourceType._instances = new SoundSourceType_Instances();
		}
		return SoundSourceType._instances;
	}
}

class SoundSourceType_Instances
{
	Clip: SoundSourceType;
	Envelope: SoundSourceType;
	Harmonics: SoundSourceType;
	Mix: SoundSourceType;
	Noise: SoundSourceType;
	PitchChange: SoundSourceType;
	Sawtooth: SoundSourceType;
	Scale: SoundSourceType;
	Silence: SoundSourceType;
	Sine: SoundSourceType;
	Square: SoundSourceType;
	Triangle: SoundSourceType;
	Vibrato: SoundSourceType;
	WavFile: SoundSourceType;

	_All: SoundSourceType[];
	_AllByName: Map<string, SoundSourceType>;

	constructor()
	{
		this.Clip = new SoundSourceType
		(
			"Clip",
			() => 
			{
				return new SoundSource_Clip(0, 1000, new SoundSource(new SoundSource_Silence()));
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Clip.prototype);
				Object.setPrototypeOf(objectToSet.child, SoundSource.prototype);
				var child = objectToSet.child.child;
				SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
			}
		);

		this.Envelope = new SoundSourceType
		(
			"Envelope",
			() => 
			{
				return SoundSource_Envelope.default();
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Envelope.prototype);
				Object.setPrototypeOf(objectToSet.child, SoundSource.prototype);
				var child = objectToSet.child.child;
				SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
			}
		);

		this.Harmonics = new SoundSourceType
		(
			"Harmonics",
			() => 
			{
				return SoundSource_Harmonics.default();
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Harmonics.prototype);
			}
		);

		this.Mix = new SoundSourceType
		(
			"Mix",
			() => 
			{
				return new SoundSource_Mix([]);
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Scale.prototype);
				Object.setPrototypeOf(objectToSet.child, SoundSource.prototype);
				var children = objectToSet.child.children;
				for (var i = 0; i < children.length; i++)
				{
					var child = children[i];
					SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
				}
			}
		);

		this.Noise = new SoundSourceType
		(
			"Noise",
			() => 
			{
				return new SoundSource_Noise();
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Noise.prototype);
			}
		);

		this.PitchChange = new SoundSourceType
		(
			"PitchChange",
			() => 
			{
				return new SoundSource_PitchChange(1, new SoundSource(new SoundSource_Silence()));
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_PitchChange.prototype);
				Object.setPrototypeOf(objectToSet.child, SoundSource.prototype);
				var child = objectToSet.child.child;
				SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
			}
		);

		this.Sawtooth = new SoundSourceType
		(
			"Sawtooth",
			() =>  { return new SoundSource_Sawtooth(); },
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Sawtooth.prototype);
			}
		);

		this.Scale = new SoundSourceType
		(
			"Scale",
			() => 
			{
				return new SoundSource_Scale(1, new SoundSource(new SoundSource_Silence()));
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Scale.prototype);
				Object.setPrototypeOf(objectToSet.child, SoundSource.prototype);
				var child = objectToSet.child.child;
				SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
			}
		);

		this.Silence = new SoundSourceType
		(
			"Silence",
			() => 
			{
				return new SoundSource_Silence()
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Silence.prototype);
			}
		);

		this.Sine = new SoundSourceType
		(
			"Sine",
			() =>  { return new SoundSource_Sine(); },
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Sine.prototype);
			}
		);

		this.Square = new SoundSourceType
		(
			"Square",
			() =>  { return new SoundSource_Square(); },
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Square.prototype);
			}
		);

		this.Triangle = new SoundSourceType
		(
			"Triangle",
			() =>  { return new SoundSource_Triangle(); },
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Triangle.prototype);
			}
		);

		this.Vibrato = new SoundSourceType
		(
			"Vibrato",
			() => 
			{
				return new SoundSource_Vibrato
				(
					16, // pitchChangesPerSecond
					// pitchMultipliers
					[
						1,
						1.004
					],
					true, // areTransitionsSmooth
					new SoundSource(new SoundSource_Sine()));
			},
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_Vibrato.prototype);
				Object.setPrototypeOf(objectToSet.child, SoundSource.prototype);
				var child = objectToSet.child.child;
				SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
			}
		);

		this.WavFile = new SoundSourceType
		(
			"WavFile",
			() =>  { return new SoundSource_WavFile("C_3", null); },
			(objectToSet: any) => 
			{
				Object.setPrototypeOf(objectToSet, SoundSource_WavFile.prototype);
				Object.setPrototypeOf(objectToSet.wavFile, WavFile.prototype);
			}
		);

		this._All =
		[
			this.Silence,

			this.Clip,
			this.Envelope,
			this.Harmonics,
			this.Mix,
			this.Noise,
			this.PitchChange,
			this.Sawtooth,
			this.Scale,
			this.Sine,
			this.Square,
			this.Triangle,
			this.Vibrato,
			this.WavFile,
		];

		this._AllByName =
			ArrayHelper.addLookups(this._All, (t: SoundSourceType) => t.name);
	}

	byName(name: string): SoundSourceType
	{
		return this._AllByName.get(name);
	}
}
