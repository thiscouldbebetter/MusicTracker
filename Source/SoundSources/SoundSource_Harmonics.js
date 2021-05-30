"use strict";
class SoundSource_Harmonics extends SoundSourceChild {
    constructor(relativeAmplitudesOfHarmonics) {
        super(SoundSourceType.Instances().Harmonics.name);
        this.relativeAmplitudesOfHarmonics = relativeAmplitudesOfHarmonics;
        this.absoluteAmplitudesOfHarmonics = [];
        this.absoluteAmplitudesOfHarmonicsCalculate();
        this._sine = new SoundSource_Sine();
    }
    static default() {
        return new SoundSource_Harmonics([1, 0, 1, 0, 1, 0, 1, 0, 1]);
    }
    absoluteAmplitudesOfHarmonicsCalculate() {
        var absoluteAmplitudes = this.absoluteAmplitudesOfHarmonics;
        absoluteAmplitudes.length = 0;
        var relativeAmplitudes = this.relativeAmplitudesOfHarmonics;
        var sumOfRelativeAmplitudes = 0;
        for (var i = 0; i < relativeAmplitudes.length; i++) {
            var relativeAmplitude = relativeAmplitudes[i];
            sumOfRelativeAmplitudes += relativeAmplitude;
        }
        for (var i = 0; i < relativeAmplitudes.length; i++) {
            var relativeAmplitude = relativeAmplitudes[i];
            var absoluteAmplitude = relativeAmplitude / sumOfRelativeAmplitudes;
            absoluteAmplitudes.push(absoluteAmplitude);
        }
    }
    relativeAmplitudesOfHarmonicsFromString(relativeAmplitudesAsString) {
        var relativeAmplitudesAsStrings = relativeAmplitudesAsString.split(",");
        var relativeAmplitudes = this.relativeAmplitudesOfHarmonics;
        relativeAmplitudes.length = 0;
        for (var i = 0; i < relativeAmplitudesAsStrings.length; i++) {
            var relativeAmplitudeAsString = relativeAmplitudesAsStrings[i];
            var relativeAmplitude = parseFloat(relativeAmplitudeAsString);
            relativeAmplitudes.push(relativeAmplitude);
        }
        this.relativeAmplitudesOfHarmonics = relativeAmplitudes;
        this.absoluteAmplitudesOfHarmonicsCalculate();
    }
    relativeAmplitudesOfHarmonicsToString() {
        var returnValue = this.relativeAmplitudesOfHarmonics.join(",");
        return returnValue;
    }
    sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
        var returnValue = 0;
        for (var i = 0; i < this.absoluteAmplitudesOfHarmonics.length; i++) {
            var amplitudeOfHarmonic = this.absoluteAmplitudesOfHarmonics[i];
            var frequencyOfHarmonic = frequencyInHertz * (i + 1);
            var sampleForHarmonic = this._sine.sampleForFrequencyAndTime(frequencyOfHarmonic, timeInSeconds);
            sampleForHarmonic *= amplitudeOfHarmonic;
            returnValue += sampleForHarmonic;
        }
        return returnValue;
    }
    // ui
    uiClear() {
        delete this.divSoundSource;
        delete this.inputRelativeAmplitudesOfHarmonics;
    }
    uiUpdate() {
        var d = document;
        if (this.divSoundSource == null) {
            this.divSoundSource = d.createElement("div");
            var labelRelativeAmplitudesOfHarmonics = d.createElement("label");
            labelRelativeAmplitudesOfHarmonics.innerText = "Relative Amplitudes of Harmonics:";
            this.divSoundSource.appendChild(labelRelativeAmplitudesOfHarmonics);
            var inputRelativeAmplitudesOfHarmonics = d.createElement("input");
            inputRelativeAmplitudesOfHarmonics.value =
                this.relativeAmplitudesOfHarmonicsToString();
            var soundSource = this;
            inputRelativeAmplitudesOfHarmonics.onchange = (event) => {
                var inputRelativeAmplitudesOfHarmonics = event.target;
                var relativeAmplitudesAsString = inputRelativeAmplitudesOfHarmonics.value;
                soundSource.relativeAmplitudesOfHarmonicsFromString(relativeAmplitudesAsString);
            };
            this.divSoundSource.appendChild(inputRelativeAmplitudesOfHarmonics);
            this.inputRelativeAmplitudesOfHarmonics = inputRelativeAmplitudesOfHarmonics;
        }
        else {
            this.inputRelativeAmplitudesOfHarmonics.value =
                this.relativeAmplitudesOfHarmonicsToString();
        }
        return this.divSoundSource;
    }
}
