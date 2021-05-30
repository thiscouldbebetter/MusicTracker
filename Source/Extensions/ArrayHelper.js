"use strict";
class ArrayHelper {
    static addLookups(array, getKeyForElement) {
        var returnLookup = new Map();
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var key = getKeyForElement(element);
            returnLookup.set(key, element);
        }
        return returnLookup;
    }
    static clone(array) {
        var returnValues = [];
        for (var i = 0; i < array.length; i++) {
            var elementToClone = array[i];
            var elementCloned = elementToClone.clone();
            returnValues.push(elementCloned);
        }
        return returnValues;
    }
    static contains(array, element) {
        return (array.indexOf(element) >= 0);
    }
    static insertElementAt(array, element, index) {
        array.splice(index, 0, element);
        return array;
    }
    static remove(array, element) {
        if (ArrayHelper.contains(array, element)) {
            ArrayHelper.removeAt(array, array.indexOf(element));
        }
        return array;
    }
    static removeAt(array, index) {
        array.splice(index, 1);
        return array;
    }
}
