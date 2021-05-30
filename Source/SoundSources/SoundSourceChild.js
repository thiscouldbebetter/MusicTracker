"use strict";
class SoundSourceChild {
    constructor(typeName) {
        this.typeName = typeName;
    }
    sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
        throw new Error("Must be implemented in subclass!");
    }
    uiClear() { }
    uiUpdate() {
        throw new Error("Must be implemented in subclass!");
    }
}
