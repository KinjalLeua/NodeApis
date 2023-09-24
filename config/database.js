var mysql = require('mysql');

var con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "practical_node"
});
module.exports = con