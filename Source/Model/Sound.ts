
namespace ThisCouldBeBetter.MusicTracker
{

export interface Sound
{
	play(): void;
	playThenCallCallback(callback: () => void): void;
	stop(): void;
}

}