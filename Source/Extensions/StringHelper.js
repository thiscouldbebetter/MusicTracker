"use strict";
class StringHelper {
    static makeIdentifier(stringToMakeIdentifier) {
        var returnValue = "_";
        for (var i = 0; i < stringToMakeIdentifier.length; i++) {
            var char = stringToMakeIdentifier[i];
            if (char == " ") {
                // Do nothing.
            }
            else {
                var charAsNumber = parseFloat(char);
                if (char.toLowerCase() != char.toUpperCase()
                    || isNaN(charAsNumber) == false) {
                    returnValue += charAsNumber;
                }
            }
        }
        return returnValue;
    }
    static padLeft(stringToPad, lengthToPadTo, charToPadWith) {
        var returnValue = stringToPad;
        while (returnValue.length < lengthToPadTo) {
            returnValue = charToPadWith + returnValue;
        }
        return returnValue;
    }
    static replaceAll(stringToReplaceWithin, stringToBeReplaced, stringToReplaceWith) {
        return stringToReplaceWithin.replace(new RegExp(stringToBeReplaced, "g"), stringToReplaceWith);
    }
}
