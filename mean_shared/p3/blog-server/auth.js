var jwt = require('jsonwebtoken');
const jwt_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

function auth(req, res, next) {
    // Check the jwt cookie is in the HTTP header
    var token = req.cookies.jwt;
    if(!token) {
        res.status(401);
        return res.send("Missing JWT in header!");
    }
    // Check that the cookie isn't expired
    var decoded_payload = jwt.verify(token, jwt_key);
    if(Math.round(Date.now() / 1000) >= decoded_payload.exp) {
        res.status(401);
        return res.send("Stale cookie!");
    }
    // Get the username from request
    var username = req.query.username;
    if(!username) {
        if(!req.is('application/json')) {
            res.status(400);
            return res.send("Bad Content-Type for /api/posts POST method!")
        }
        username = req.body.username;
        if(!username) {
            res.status(400);
            return res.send("Missing username in JSON for /api/posts POST method!")
        }
    }
    // Check usernames match
    if(decoded_payload.usr != username) {
        res.status(401);
        return res.send("Usernames do not match! Who are you?!");
    }
    else {
        next();
    }
}

module.exports = auth;