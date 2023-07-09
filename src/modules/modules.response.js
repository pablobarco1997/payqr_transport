

function response({ error = "", success = "", warning = "", data = "", errorAlert }) {
    return { error, success, warning, data, errorAlert };
}

module.exports.response = response; 