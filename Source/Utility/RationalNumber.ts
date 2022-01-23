
namespace ThisCouldBeBetter.MusicTracker
{

export class RationalNumber
{
	numerator: number;
	denominator: number;

	constructor(numerator: number, denominator: number)
	{
		this.numerator = numerator;
		this.denominator = denominator;
	}

	static fromString(stringToParse: string): RationalNumber
	{
		var numeratorAndDenominatorAsStrings = stringToParse.split("/");
		if (numeratorAndDenominatorAsStrings.length < 2)
		{
			numeratorAndDenominatorAsStrings[1] = "1";
		}
		var numeratorAsString = numeratorAndDenominatorAsStrings[0];
		var denominatorAsString = numeratorAndDenominatorAsStrings[1];

		var numerator = parseInt(numeratorAsString);
		var denominator = parseInt(denominatorAsString);

		return new RationalNumber(numerator, denominator);
	}

	clone(): RationalNumber
	{
		return new RationalNumber(this.numerator, this.denominator);
	}

	divide(other: RationalNumber): RationalNumber
	{
		this.numerator *= other.denominator;
		this.denominator *= other.numerator;
		return this;
	}

	isInteger(): boolean
	{
		var thisAsNumber = this.toNumber();
		var returnValue = (thisAsNumber == Math.floor(thisAsNumber) );
		return returnValue;
	}

	multiply(other: RationalNumber): RationalNumber
	{
		this.numerator *= other.numerator;
		this.denominator *= other.denominator;
		return this;
	}

	multiplyInteger(integerOther: number): RationalNumber
	{
		this.numerator *= integerOther;
		return this;
	}

	toNumber(): number
	{
		return this.numerator / this.denominator;
	}

	toString(): string
	{
		return "" + this.numerator + "/" + this.denominator;
	}
}

}