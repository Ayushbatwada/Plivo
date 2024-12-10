const mongoose = require("mongoose");

module.exports = {
    isValidArray: (array) => {
        return array && Array.isArray(array) && array.length > 0;
    },

    isEmptyArray(array) {
        return array && Array.isArray(array) && array.length === 0;
    },

    isValidString(string) {
        return string && typeof string === 'string' && string.trim().length > 0;
    },

    isEmptyString(string) {
        return string && typeof string === 'string' && string.trim().length === 0;
    },

    isNumber(number) {
        return !isNaN(number) && number >= 0;
    },

    isValidObject(object) {
        return object && typeof object === 'object' && Object.keys(object).length > 0;
    },

    isEmptyObject(object) {
        return object && typeof object === 'object' && Object.keys(object).length === 0;
    },

    isValidId(id) {
        return id && mongoose.Types.ObjectId.isValid(id)
    },

    isValidDate(date) {
        return date && !isNaN(Date.parse(date));
    },

    isBoolean(boolean) {
        return typeof boolean === 'boolean';
    },

    isValidObjectArray(objectArray) {
        return Array.isArray(objectArray) && objectArray.length > 0 && this.isValidObject(objectArray[0]);
    },

    isValidFunction(functionParam) {
        return functionParam && typeof functionParam === 'function';
    },

    isValidUrl: function(url) {
        return true
    }
}
