"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var MusicTracker;
    (function (MusicTracker) {
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
        MusicTracker.StringHelper = StringHelper;
    })(MusicTracker = ThisCouldBeBetter.MusicTracker || (ThisCouldBeBetter.MusicTracker = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
