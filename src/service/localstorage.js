let localstorage;
if (window.localStorage && window.localStorage.getItem) {
    localstorage = window.localStorage;
} else {
    localstorage = {
        data: {},
        getItem: function (key) {
            return this.data[key]
        },
        removeItem: function (key) {
            delete this.data[key]
        },
        setItem: function (key, value) {
            this.data[key] = value
        }
    }
}
export default {
    get: function (key) {
        return localstorage.getItem(key);
    },
    del: function (key) {
        return localstorage.removeItem(key);
    },
    set: function (key, value) {
        return localstorage.setItem(key, value);
    }
}
