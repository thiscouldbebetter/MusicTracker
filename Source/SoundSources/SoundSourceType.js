"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
        class SoundSourceType {
            constructor(name, soundSourceCreate, objectPrototypesSet) {
                this.name = name;
                this.soundSourceCreate = soundSourceCreate;
                this.objectPrototypesSet = objectPrototypesSet;
            }
            static Instances() {
                if (SoundSourceType._instances == null) {
                    SoundSourceType._instances = new SoundSourceType_Instances();
                }
                return SoundSourceType._instances;
            }
        }
        MusicTracker.SoundSourceType = SoundSourceType;
        class SoundSourceType_Instances {
            constructor() {
                this.Clip = new SoundSourceType("Clip", () => {
                    return new MusicTracker.SoundSource_Clip(0, 1000, new MusicTracker.SoundSource(new MusicTracker.SoundSource_Silence()));
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Clip.prototype);
                    Object.setPrototypeOf(objectToSet.child, MusicTracker.SoundSource.prototype);
                    var child = objectToSet.child.child;
                    SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
                });
                this.Envelope = new SoundSourceType("Envelope", () => {
                    return MusicTracker.SoundSource_Envelope.default();
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Envelope.prototype);
                    Object.setPrototypeOf(objectToSet.child, MusicTracker.SoundSource.prototype);
                    var child = objectToSet.child.child;
                    SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
                });
                this.Harmonics = new SoundSourceType("Harmonics", () => {
                    return MusicTracker.SoundSource_Harmonics.default();
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Harmonics.prototype);
                });
                this.Mix = new SoundSourceType("Mix", () => {
                    return new MusicTracker.SoundSource_Mix([]);
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Scale.prototype);
                    Object.setPrototypeOf(objectToSet.child, MusicTracker.SoundSource.prototype);
                    var children = objectToSet.child.children;
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
                    }
                });
                this.Noise = new SoundSourceType("Noise", () => {
                    return new MusicTracker.SoundSource_Noise();
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Noise.prototype);
                });
                this.PitchChange = new SoundSourceType("PitchChange", () => {
                    return new MusicTracker.SoundSource_PitchChange(1, new MusicTracker.SoundSource(new MusicTracker.SoundSource_Silence()));
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_PitchChange.prototype);
                    Object.setPrototypeOf(objectToSet.child, MusicTracker.SoundSource.prototype);
                    var child = objectToSet.child.child;
                    SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
                });
                this.Sawtooth = new SoundSourceType("Sawtooth", () => { return new MusicTracker.SoundSource_Sawtooth(); }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Sawtooth.prototype);
                });
                this.Scale = new SoundSourceType("Scale", () => {
                    return new MusicTracker.SoundSource_Scale(1, new MusicTracker.SoundSource(new MusicTracker.SoundSource_Silence()));
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Scale.prototype);
                    Object.setPrototypeOf(objectToSet.child, MusicTracker.SoundSource.prototype);
                    var child = objectToSet.child.child;
                    SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
                });
                this.Silence = new SoundSourceType("Silence", () => {
                    return new MusicTracker.SoundSource_Silence();
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Silence.prototype);
                });
                this.Sine = new SoundSourceType("Sine", () => { return new MusicTracker.SoundSource_Sine(); }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Sine.prototype);
                });
                this.Square = new SoundSourceType("Square", () => { return new MusicTracker.SoundSource_Square(); }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Square.prototype);
                });
                this.Triangle = new SoundSourceType("Triangle", () => { return new MusicTracker.SoundSource_Triangle(); }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Triangle.prototype);
                });
                this.Vibrato = new SoundSourceType("Vibrato", () => {
                    return new MusicTracker.SoundSource_Vibrato(16, // pitchChangesPerSecond
                    // pitchMultipliers
                    [
                        1,
                        1.004
                    ], true, // areTransitionsSmooth
                    new MusicTracker.SoundSource(new MusicTracker.SoundSource_Sine()));
                }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_Vibrato.prototype);
                    Object.setPrototypeOf(objectToSet.child, MusicTracker.SoundSource.prototype);
                    var child = objectToSet.child.child;
                    SoundSourceType.Instances().byName(child.typeName).objectPrototypesSet(child);
                });
                this.WavFile = new SoundSourceType("WavFile", () => { return new MusicTracker.SoundSource_WavFile("C_3", null); }, (objectToSet) => {
                    Object.setPrototypeOf(objectToSet, MusicTracker.SoundSource_WavFile.prototype);
                    Object.setPrototypeOf(objectToSet.wavFile, MusicTracker.WavFile.prototype);
                });
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
                    MusicTracker.ArrayHelper.addLookups(this._All, (t) => t.name);
            }
            byName(name) {
                return this._AllByName.get(name);
            }
        }
        MusicTracker.SoundSourceType_Instances = SoundSourceType_Instances;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
