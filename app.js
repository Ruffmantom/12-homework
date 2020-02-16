var mysql = require("mysql");
var inquirer = require("inquirer");

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
    runSearch();
});

//  need choice question for department


//  need questions for roles


//  Employee
