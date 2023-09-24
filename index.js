var express = require('express');
var con = require('./config/database');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

var crud = require('./module/v1/crud/route');
app.use('/api/v1/crud',crud)

try {
    server = app.listen(8085);
    console.log("connected")
}
catch (err) {
    console.log("failed");
}

