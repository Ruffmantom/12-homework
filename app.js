var mysql = require("mysql");
var inquirer = require("inquirer");
var cTabel = require("console.table");
var clear = require('clear');


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
// 
// //////////
// //////////////
// ////////////////// START UP FUNCTION TO VIEW ALL
// make this a three table join
function viewCompany() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee INNER JOIN role ON employee.role_id=role.id;"
    connection.query(query, function (err, res) {
        if (err) {
            throw err;
        }
        console.table(res);
        startquestions();
    })
}
// 
// //////////
// //////////////
// ////////////////// START APP FUNCTION
//  need choice question for department
function startquestions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department, Role, Employee",
                "View Departments, Roles, Employees",
                "Update or delete Employee",
                "EXIT"
            ]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Add Department, Role, Employee":
                    mainADDER();
                    break;
                case "View Departments, Roles, Employees":
                    // insert function
                    mainView();
                    break;
                case "Update or delete Employee":
                    // insert function
                    updateOrDelete();
                    break;
                case "EXIT":
                    // insert function
                    connection.end();
                    break;
            }
        })
}
// 
// //////////
// //////////////
// ////////////////// MAIN ADDING FUNCTION
function mainADDER() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee",
                "Go back"
            ]
        }).then(function (answer) {
            switch (answer.choice) {
                case "Department":
                    addDepartment();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;
                case "Go back":
                    startquestions();
            }
        })
}
// 
// //////////
// //////////////
// ////////////////// MAIN VIEW FUNCTION
function mainView() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to View?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "View all"
            ]
        }).then(function (answer) {
            switch (answer.choice) {
                case "Departments":
                    viewDepartments();
                    break;
                case "Roles":
                    viewRoles();
                    break;
                case "Employees":
                    viewEmployees();
                    break;
                case "View all":
                    viewCompany();
                    break;

            }
        })

}
// 
// //////////
// //////////////
// ////////////////// add functions
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

                }
            );
        });
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
                    title: answer.title.trim(" "),
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
// need to save employees to variable for choices when user wantes to update or view
function addEmployee() {
    // make a constructor that will take in all the data for a new employee
    // then push it to the database
}
// 
// //////////
// //////////////
// ////////////////// View functions
function viewRoles() {

    var query = "SELECT * from role";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {

        }
        console.table(res);
    })
    startquestions();

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
// 
// //////////
// //////////////
// ////////////////// Update functions
// update employee, or delete
function updateOrDelete() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                choices: [
                    "Update an Eployee",
                    "Delete Employee"
                ]
            }

        ]).then(function (res) {
            switch (res.choice) {
                case "Update an Eployee":
                    updateEmployee();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;

            }
        })
}

// variable to hold emploee data for updating
var employeeArray = [];
var employeeObjects = [];




function updateEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: function () {
                        for (var i = 0; i < results.length; i++) {
                            var fullName = `${results[i].first_name} ${results[i].last_name}`
                            employeeArray.push(fullName);
                            employeeObjects.push(results);
                        }
                        return employeeArray;
                    }
                }
            ])
            .then(function (answer) {
                connection.query("SELECT * FROM role", function (err, roleList) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            // {
                            //     name: "firstName",
                            //     type: "value",
                            //     message: "What is the new First Name?"
                            // },
                            // {
                            //     name: "lastName",
                            //     type: "value",
                            //     message: "What is the new Last Name?"
                            // },
                            {
                                name: "Roll",
                                type: "list",
                                message: "What is the new Role?",
                                choices: function () {
                                    for (var i = 0; i > roleList.length; i++) {
                                        var roleArray = [];
                                        roleArray.push(roleList[i].title)
                                        console.log(roleArray)
                                    }
                                    return roleArray;
                                }
                            }
                        ]).then(function (updated) {
                            // var query = `UPDATE table set first_name = ${updated.firstName.trim()}, last_name = ${updated.lastName.trim()}, role_id = ${} `

                            connection.query(
                                query,
                                {
                                    title: updated.title.trim(),
                                    salary: updated.salary,
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
                });


            });
    })
};


// RUN APP
viewCompany();