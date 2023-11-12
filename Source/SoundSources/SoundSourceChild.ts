
namespace ThisCouldBeBetter.MusicTracker
{

export class SoundSourceChild
{
	typeName: string;

	divChild: any;
	divSoundSource: any;

	constructor(typeName: string)
	{
		this.typeName = typeName;
	}

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		throw new Error("Must be implemented in subclass!");
	}

	// Serialization.

	compressForSerialization(): void
	{
		// By default, do nothing.
	}

	decompressAfterDeserialization(): void
	{
		// By default, do nothing.
	}

	// UI.

	uiClear(): void
	{}

	uiUpdate(): any
	{
		throw new Error("Must be implemented in subclass!");
	}

}

}