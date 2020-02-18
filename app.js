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
                "Update or delete Employee",
                "EXIT"
            ]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Add Department":
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
                case "Update or delete Employee":
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
    var query = "INSERT INTO department SET ?";
    inquirer
        .prompt([
            {
                name: "depName",
                type: "input",
                message: "What is the name of the department?"
            }
        ]).then(function (answer) {
            connection.query(
                query,
                {
                    name: answer.depName
                },
                function (err) {
                    if (err) throw err;
                    console.log("You have added the " + answer.depName + " deapartment successfully!");
                    // re-prompt the user for if they want to bid or post
                    startquestions();
                }
            );
        });
};
// veiw the departments
function viewDepartments() {
    var query = "SELECT * from department";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " " + "Name: " + res[i].name);

        }
    })
    startquestions();
};
// Add role to role data
function addRole() {
    var query = "INSERT INTO role SET ?";
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the name of the Role that you want to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "Please enter the salary?",
                validate: function (salary) {
                    if (isNaN(salary) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "depid",
                type: "input",
                message: "Please enter the Department ID number?",
                validate: function (depid) {
                    if (isNaN(depid) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query(
                query,
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.depid
                },
                function (err) {
                    if (err) throw err;
                    console.log("You have added " + answer.title + " as a new role successfully!");
                    // re-prompt the user for if they want to bid or post
                    startquestions();
                }
            );
        })
}
// view roles
function viewRoles() {
    var query = "SELECT * from role";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {

        }
        console.table(res);
    })
    startquestions();
}
// need to save employees to variable for choices when user wantes to update or view
function addEmployee() {
    // make a constructor that will take in all the data for a new employee
    // then push it to the database
}
// view all employees
function viewEmployees() {
    var query = "SELECT * from employee";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
        }
        console.table(res);
    })

    startquestions();
}
// creating a variable that stores the employees
var employees = connection.query("SELECT * from employee", function (err, res) {
    for (var i = 0; i < res.length; i++) {
        return res.name;
    }
})
// update employee, or delete
function updateEmployee() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Update Employee data",
                "Delete Employee"
            ]
        })
        .then(function (answer) {
            switch (answer.choice) {
                case "Update Employee data":
                    // add function to update employees
                    // veiw all employees as a choice list
                    // let employeeList = [employees];
                    inquirer
                        .prompt([
                            {
                                name: "employee",
                                type: "list",
                                choices: [
                                    employees
                                ]
                            }
                        ])

                    break;
                case "Delete Employee":
                    // add function to delete employees
                    // veiw all employees as a choice list
                    break;
            }
        })
}


//  need questions for roles


//  Employee


