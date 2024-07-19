module.exports = function convertKeys(obj) {
    const newObj = {};
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = key.replace(/-/g, '_');
            newObj[newKey] = obj[key];
        }
    }
    
    return newObj;
}