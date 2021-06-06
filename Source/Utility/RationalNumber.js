"use strict";
class RationalNumber {
    constructor(numerator, denominator) {
        this.numerator = numerator;
        this.denominator = denominator;
    }
    static fromString(stringToParse) {
        var numeratorAndDenominatorAsStrings = stringToParse.split("/");
        if (numeratorAndDenominatorAsStrings.length < 2) {
            numeratorAndDenominatorAsStrings[1] = "1";
        }
        var numeratorAsString = numeratorAndDenominatorAsStrings[0];
        var denominatorAsString = numeratorAndDenominatorAsStrings[1];
        var numerator = parseInt(numeratorAsString);
        var denominator = parseInt(denominatorAsString);
        return new RationalNumber(numerator, denominator);
    }
    clone() {
        return new RationalNumber(this.numerator, this.denominator);
    }
    divide(other) {
        this.numerator *= other.denominator;
        this.denominator *= other.numerator;
        return this;
    }
    isInteger() {
        var thisAsNumber = this.toNumber();
        var returnValue = (thisAsNumber == Math.floor(thisAsNumber));
        return returnValue;
    }
    multiply(other) {
        this.numerator *= other.numerator;
        this.denominator *= other.denominator;
        return this;
    }
    multiplyInteger(integerOther) {
        this.numerator *= integerOther;
        return this;
    }
    toNumber() {
        return this.numerator / this.denominator;
    }
    toString() {
        return "" + this.numerator + "/" + this.denominator;
    }
}
