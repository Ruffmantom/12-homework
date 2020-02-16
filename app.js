var mysql = require("mysql");
var inquirer = require("inquirer");
var cTabel = require("console.table");

// need to connect db to js file
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "employeeDB"
});
connection.connect(function (err) {
    if (err) throw err;
});

//  need choice question for department

// need to save employees to variable for choices when user wantes to update or view

// result from inquirer pass "INSERT INTO" table 

//  need questions for roles


//  Employee


