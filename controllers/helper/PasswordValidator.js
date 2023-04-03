"use strict";
function validatePasswordFormat(password){
    //must be at least 6 characters and have at least one special character
    var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    return regex.test(password);
}
module.exports = validatePasswordFormat;