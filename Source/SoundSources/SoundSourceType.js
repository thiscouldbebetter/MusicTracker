
function SoundSourceType(name, soundSourceCreate, objectPrototypesSet)
{
	this.name = name;
	this.soundSourceCreate = soundSourceCreate;
	this.objectPrototypesSet = objectPrototypesSet;
}

{
	SoundSourceType.Instances = function ()
	{
		if (SoundSourceType._Instances == null)
		{
			SoundSourceType._Instances = new SoundSourceType_Instances();
		}
		return SoundSourceType._Instances;
	}

	function SoundSourceType_Instances()
	{
		this.Clip = new SoundSourceType
		(
			"Clip",
			function create()
			{
				return new SoundSource_Clip(0, 1000, new SoundSource(new SoundSource_Silence()));
			},
			function objectPrototypesSet(object)
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
			function create()
			{
				return SoundSource_Envelope.default();
			},
			function objectPrototypesSet(object)
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
			function create()
			{
				return SoundSource_Harmonics.default();
			},
			function objectPrototypesSet(object)
			{
				object.__proto__ = SoundSource_Harmonics.prototype;
			}
		);

		this.Mix = new SoundSourceType
		(
			"Mix",
			function create()
			{
				return new SoundSource_Mix([]);
			},
			function objectPrototypesSet(object)
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
			function create()
			{
				return new SoundSource_Noise();
			},
			function objectPrototypesSet(object)
			{
				object.__proto__ = SoundSource_Noise.prototype;
			}
		);

		this.PitchChange = new SoundSourceType
		(
			"PitchChange",
			function create()
			{
				return new SoundSource_PitchChange(1, new SoundSource(new SoundSource_Silence()));
			},
			function objectPrototypesSet(object)
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
			function create() { return new SoundSource_Sawtooth(); },
			function objectPrototypesSet(object)
			{
				object.__proto__ = SoundSource_Sawtooth.prototype;
			}
		);

		this.Scale = new SoundSourceType
		(
			"Scale",
			function create()
			{
				return new SoundSource_Scale(1, new SoundSource(new SoundSource_Silence()));
			},
			function objectPrototypesSet(object)
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
			function create()
			{
				return new SoundSource_Silence()
			},
			function objectPrototypesSet(object)
			{
				object.__proto__ = SoundSource_Silence.prototype;
			}
		);

		this.Sine = new SoundSourceType
		(
			"Sine",
			function create() { return new SoundSource_Sine(); },
			function objectPrototypesSet(object)
			{
				object.__proto__ = SoundSource_Sine.prototype;
			}
		);

		this.Square = new SoundSourceType
		(
			"Square",
			function create() { return new SoundSource_Square(); },
			function objectPrototypesSet(object)
			{
				object.__proto__ = SoundSource_Square.prototype;
			}
		);

		this.Triangle = new SoundSourceType
		(
			"Triangle",
			function create() { return new SoundSource_Triangle(); },
			function objectPrototypesSet(object)
			{
				object.__proto__ = SoundSource_Triangle.prototype;
			}
		);

		this.WavFile = new SoundSourceType
		(
			"WavFile",
			function create() { return new SoundSource_WavFile("C_3"); },
			function objectPrototypesSet(object)
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
			this.WavFile,
		];
	}
}
