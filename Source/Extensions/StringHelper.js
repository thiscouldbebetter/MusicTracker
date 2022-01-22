"use strict";
class StringHelper {
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
