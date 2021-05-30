Music Tracker
=============

The code in this repository implements a simple music tracker in TypeScript.

To see it in action, open the file Source/MusicTracker.html in a web browser that runs JavaScript.

To build, run the command "tsc" from within the Source directory.  Note that, since the transpiled JavaScript files are included in the repository, it should not be necessary to build before running.

![Screenshot](/Screenshot.png "Screenshot")

Usage
-----
A music tracker allows the user to compose a song.  The structure of a music tracker song is illustrated below.

	Song
	|
	+---Name
	+---Instruments
	+---SequenceOrder
	+---Sequences
		|
		+---TicksPerSecond
		+---DurationInTicks
		+---Tracks
			|
			+---Instrument
			+---Ticks
				|
				+---Note
					|
					+---Pitch
					+---Octave
					+---Volume
					+---Duration

To put the diagram above into words:

	* A song contains various instruments, each of which makes a different kind of sound.
	* A song contains one or more sequences that play in a specified order.
	* A sequence lasts a specified number of ticks, at a specified number of ticks per second ("tempo").
	* A sequence contains one or more tracks.
	* All tracks in a particular sequence play simultaneously.
	* A track is associated with only one of the song's instruments.
	* A track contains a series of ticks.
	* A tick is a short period of time of constant duration.
	* A particular tick may have a note associated with it, or it may be silent.
	* A note represents a musical tone or sound of specified pitch, volume, and duration.
	* A note may belong to any of 10 octaves, each containing 12 tones, starting with C (rather than A).
	* A note's volume may be between 0 (silent) and 99 (maximum) inclusive.

A note is specified in the interface as shown in the example below:

	C_4-25-0004

This notation is made of three parts, delimited by hyphens ("-").

The first part, "C_4", indicates that the pitch is C natural of octave 4.

The second part, "25", indicates that the note is to be played at 25/99 (~25%) of the maximum possible volume.

The third part, "0004", indicates that the note will sound for four ticks.  The duration of a note is determined by the number of ticks specified divided by the sequence's tempo in ticks per second.
