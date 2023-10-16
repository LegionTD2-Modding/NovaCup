Helpers = {
    filterArray: function (arr, value) {
        return arr.filter(
            function (ele) {
                return ele != value
            }
        );
    },
    hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    decodeHTMLstring: function (str) {
        var txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    }
}

Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array

    while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
};
