
class SoundSourceType
{
	constructor(name, soundSourceCreate, objectPrototypesSet)
	{
		this.name = name;
		this.soundSourceCreate = soundSourceCreate;
		this.objectPrototypesSet = objectPrototypesSet;
	}

	static Instances()
	{
		if (SoundSourceType._Instances == null)
		{
			SoundSourceType._Instances = new SoundSourceType_Instances();
		}
		return SoundSourceType._Instances;
	}
}
{

	function SoundSourceType_Instances()
	{
		this.Clip = new SoundSourceType
		(
			"Clip",
			() => 
			{
				return new SoundSource_Clip(0, 1000, new SoundSource(new SoundSource_Silence()));
			},
			(object) => 
			{
				object.__proto__ = SoundSource_Clip.prototype;
				object.child.__proto__ = SoundSource.prototype;
				var child = object.child.child;
				SoundSourceType.Instances()[child.typeName].objectPrototypesSet(child);
			}
		);

		this.Envelope = new SoundSourceType
		(
			"Envelope",
			() => 
			{
				return SoundSource_Envelope.default();
			},
			(object) => 
			{
				object.__proto__ = SoundSource_Envelope.prototype;
				object.child.__proto__ = SoundSource.prototype;
				var child = object.child.child;
				SoundSourceType.Instances()[child.typeName].objectPrototypesSet(child);
			}
		);

		this.Harmonics = new SoundSourceType
		(
			"Harmonics",
			() => 
			{
				return SoundSource_Harmonics.default();
			},
			(object) => 
			{
				object.__proto__ = SoundSource_Harmonics.prototype;
			}
		);

		this.Mix = new SoundSourceType
		(
			"Mix",
			() => 
			{
				return new SoundSource_Mix([]);
			},
			(object) => 
			{
				object.__proto__ = SoundSource_Scale.prototype;
				object.child.__proto__ = SoundSource.prototype;
				var children = object.child.children;
				for (var i = 0; i < children.length; i++)
				{
					var child = children[i];
					SoundSourceType.Instances()[child.typeName].objectPrototypesSet(child);
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
			(object) => 
			{
				object.__proto__ = SoundSource_Noise.prototype;
			}
		);

		this.PitchChange = new SoundSourceType
		(
			"PitchChange",
			() => 
			{
				return new SoundSource_PitchChange(1, new SoundSource(new SoundSource_Silence()));
			},
			(object) => 
			{
				object.__proto__ = SoundSource_PitchChange.prototype;
				object.child.__proto__ = SoundSource.prototype;
				var child = object.child.child;
				SoundSourceType.Instances()[child.typeName].objectPrototypesSet(child);
			}
		);

		this.Sawtooth = new SoundSourceType
		(
			"Sawtooth",
			() =>  { return new SoundSource_Sawtooth(); },
			(object) => 
			{
				object.__proto__ = SoundSource_Sawtooth.prototype;
			}
		);

		this.Scale = new SoundSourceType
		(
			"Scale",
			() => 
			{
				return new SoundSource_Scale(1, new SoundSource(new SoundSource_Silence()));
			},
			(object) => 
			{
				object.__proto__ = SoundSource_Scale.prototype;
				object.child.__proto__ = SoundSource.prototype;
				var child = object.child.child;
				SoundSourceType.Instances()[child.typeName].objectPrototypesSet(child);
			}
		);

		this.Silence = new SoundSourceType
		(
			"Silence",
			() => 
			{
				return new SoundSource_Silence()
			},
			(object) => 
			{
				object.__proto__ = SoundSource_Silence.prototype;
			}
		);

		this.Sine = new SoundSourceType
		(
			"Sine",
			() =>  { return new SoundSource_Sine(); },
			(object) => 
			{
				object.__proto__ = SoundSource_Sine.prototype;
			}
		);

		this.Square = new SoundSourceType
		(
			"Square",
			() =>  { return new SoundSource_Square(); },
			(object) => 
			{
				object.__proto__ = SoundSource_Square.prototype;
			}
		);

		this.Triangle = new SoundSourceType
		(
			"Triangle",
			() =>  { return new SoundSource_Triangle(); },
			(object) => 
			{
				object.__proto__ = SoundSource_Triangle.prototype;
			}
		);

		this.Vibrato = new SoundSourceType
		(
			"Vibrato",
			() => 
			{
				var pitches = Pitch.Instances;
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
			(object) => 
			{
				object.__proto__ = SoundSource_Vibrato.prototype;
				object.child.__proto__ = SoundSource.prototype;
				var child = object.child.child;
				SoundSourceType.Instances()[child.typeName].objectPrototypesSet(child);
			}
		);

		this.WavFile = new SoundSourceType
		(
			"WavFile",
			() =>  { return new SoundSource_WavFile("C_3"); },
			(object) => 
			{
				object.__proto__ = SoundSource_WavFile.prototype;
				object.wavFile.__proto__ = WavFile.prototype;
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
	}
}
