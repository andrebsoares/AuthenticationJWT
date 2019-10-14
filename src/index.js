var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jwt-simple");

var auth = require("../src/auth.js")();
var users = require("./UsersDB/users.js");
var config = require("../src/config.js");

var app = express();

app.use(bodyParser.json());
app.use(auth.initialize());

app.get("/", function (req, res) {
    res.json({
        message: "Hello World!!!",
        status: "My API is alive!",
        learning: "JWT (JSON Web Tokens)"
    });
});

app.get("/user", auth.authenticate(), function (req, res) {
    res.json(users[req.user.id]);
});

app.post("/token", function (req, res) {
    var { email } = req.body;
    var { password } = req.body;

    if (email && password) {
        var user = users.find(user => user.email === email && user.password === password);

        if (user) {
            var payload = { id: user.id };
            var token = jwt.encode(payload, config.jwtSecret);
            res.json({ token: token });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

app.listen(8080, function () {
    console.log("Hello World!!!");
    console.log("My API is running.");
    console.log("JWT (JSON Web Tokens)");
});

module.exports = app;