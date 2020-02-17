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
function startquestions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "View Departments",
                "Add A Role",
                "View Roles",
                "Add Employee",
                "View Employees",
                "Update Employee Role",
                "EXIT"
            ]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Add Department?":
                    // insert function
                    addDepartment();
                    break;
                case "View Departments":
                    // insert function
                    viewDepartments();
                    break;
                case "Add A Role":
                    // insert function
                    addRole();
                    break;
                case "View Roles":
                    // insert function
                    viewRoles();
                    break;
                case "Add Employee":
                    // insert function
                    addEmployee();
                    break;
                case "View Employees":
                    // insert function
                    viewEmployees();
                    break;
                case "Update employee role":
                    // insert function
                    updateEmployee();
                    break;
                case "EXIT":
                    // insert function
                    connection.end();
                    break;
            }
        })
}
startquestions();

// 
// //////////
// //////////////
// //////////////////

function addDepartment() {
    var query = "INSERT INTO department (name)";
    inquirer
        .prompt({
            name: "depName",
            type: "input",
            message: "What is the name of the deartment?"
        }).then(function (answer) {
            connection.query(query, answer.depName);
        })
};
// veiw the departments
function viewDepartments() {
    var query = "SELECT * from department";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " " + "Name: " + res[i].name);

        }
        startquestions();
    })
};

function addRole() {
    var query = "SELECT position, song, year FROM top5000 WHERE ?";
}
function viewRoles() {
    var query = "SELECT position, song, year FROM top5000 WHERE ?";
}
// need to save employees to variable for choices when user wantes to update or view
function addEmployee() {
    var query = "SELECT position, song, year FROM top5000 WHERE ?";
}
function viewEmployees() {
    var query = "SELECT position, song, year FROM top5000 WHERE ?";
}
function updateEmployee() {
    var query = "SELECT position, song, year FROM top5000 WHERE ?";
}
// result from inquirer pass "INSERT INTO" table

//  need questions for roles


//  Employee


