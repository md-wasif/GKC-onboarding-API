const mongoose = require('mongoose');
const atob = require('atob');


const parseJwt = async (token) => {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
      return JSON.parse(jsonPayload);
};


exports.userTokenFilter = async (token) => {
    const filterId = await parseJwt(token);
    const userId = mongoose.Types.ObjectId(filterId.id)
    return userId;
}
