module.exports = {
    "extends": "google",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": ["react"],
    "env" : {
        "browser": true,
        "node" : true,
        "es6" :true,
    },
    "rules": {
        "semi": ["error", "always"],
        "require-jsdoc" : "off",
        "linebreak-style":"off",
        "no-unused-vars":"off",
        "no-invalid-this": "off",
        "quotes": ["error", "single", {"avoidEscape":true}]

    }
};