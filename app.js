var mysql = require("mysql");
var inquirer = require("inquirer");
var cTabel = require("console.table");
var clear = require('clear');
var opening = require("./opening");

// variable to hold emploee data for updating
let employeeArray = [];
let employeeObjects = [];
let roleArray = [];
// var roleObjects = [];
let depArray = [];

opening();
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
// set the roll list up so its ready for action
pushIntoRoleArr();
pushIntoDeparray();
pushIntoEmployee();
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
        console.log("---------------------------------------------------------------")
        console.table(res);
        console.log("---------------------------------------------------------------")
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
                    pushIntoRoleArr();
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
                    pushIntoRoleArr();
                    break;
                case "Employee":
                    addEmployee();
                    break;
                case "Go back":
                    startquestions();
                    break;
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
                    console.log("---------------------------------------------------------------")
                    console.log("You have added the " + answer.depName + " deapartment successfully!");
                    console.log("---------------------------------------------------------------")
                    startquestions();
                    pushIntoDeparray();
                }
            );
        });

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
                name: "dep",
                type: "list",
                message: "What is the department for this Role?",
                choices: depArray
            }
        ]).then(function (answer) {
            connection.query(
                query,
                {
                    title: answer.title.trim(),
                    salary: answer.salary,
                    department_id: parseInt(answer.dep.split(" ")[0])
                },
                function (err) {
                    if (err) throw err;
                    console.log("---------------------------------------------------------------")
                    console.log("You have added " + answer.title + " as a new role successfully!");
                    console.log("---------------------------------------------------------------")
                    //add new role to role array
                    pushIntoDeparray();
                    pushIntoRoleArr();
                    startquestions();
                }
            );
        })
}
// need to save employees to variable for choices when user wantes to update or view
function addEmployee() {
    var query = "INSERT INTO employee SET ?";
    inquirer
        .prompt([
            {
                name: "fName",
                type: "input",
                message: "What is thier First name?"
            },
            {
                name: "lName",
                type: "input",
                message: "What is thier Last Name?",
            },
            {
                name: "role",
                type: "list",
                message: "What is thier Role?",
                choices: roleArray
            }
        ]).then(function (answer) {
            connection.query(
                query,
                {
                    first_name: answer.fName.trim(),
                    last_name: answer.lName.trim(),
                    role_id: parseInt(answer.role.split(" ")[0])
                },
                function (err) {
                    if (err) throw err;
                    console.log("---------------------------------------------------------------")
                    console.log("You have added " + answer.fName + " to the team!");
                    console.log("---------------------------------------------------------------")
                    // re-prompt the user for if they want to bid or post
                    startquestions();
                }
            );
        })
}
// 
// //////////
// //////////////
// ////////////////// View functions
function viewRoles() {
    var query = "SELECT * from role";
    connection.query(query, function (err, res) {
        console.log("---------------------------------------------------------------")
        console.table(res);
        console.log("---------------------------------------------------------------")
        startquestions();
    })
};
// veiw the departments
function viewDepartments() {
    var query = "SELECT * from department";
    connection.query(query, function (err, res) {
        console.log("---------------------------------------------------------------")
        console.table(res);
        console.log("---------------------------------------------------------------")
        startquestions();
    })
};
// view all employees
function viewEmployees() {
    var query = "SELECT * from employee";
    connection.query(query, function (err, res) {
        console.log("---------------------------------------------------------------")
        console.table(res);
        console.log("---------------------------------------------------------------")
        startquestions();
    })

}
// 
// //////////
// //////////////
// ////////////////// Update functions
// update employee, or delete
function updateOrDelete() {
    pushIntoRoleArr();
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

function updateEmployee() {
    if (err) throw err;
    inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                choices: employeeArray
            }

        ])
        .then(function (answer) {
            connection.query("SELECT * FROM role", function (err, roleList) {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            name: "firstName",
                            type: "value",
                            message: "What is the new First Name?"
                        },
                        {
                            name: "lastName",
                            type: "value",
                            message: "What is the new Last Name?"
                        },
                        {
                            name: "Roll",
                            type: "list",
                            message: "What is the new Role?",
                            // THIS NEEDS MORE LOGIC TO GET THE ID FROM THE CHOICE
                            choices: roleArray
                        }
                    ]).then(function (updated) {
                        let x = parseInt(updated.Roll.split(" ")[0]);
                        let nameID = parseInt(answer.choice.split(" ")[0]);
                        var query = `UPDATE employee set first_name="${updated.firstName}",last_name="${updated.lastName}",role_id = ${x} WHERE id=${nameID}`;
                        connection.query(query, function (err, res) {
                            if (err) throw err;
                            console.log("---------------------------------------------------------------")
                            console.log(`You have successfully updated ${updated.firstName} with a role of ${updated.Roll}!`);
                            console.log("---------------------------------------------------------------")
                            startquestions();
                        })
                    })
            });
        });

};

function deleteEmployee() {
    pushIntoEmployee();
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: employeeArray
                }
            ]).then(function (res) {
                var query = `DELETE FROM employee WHERE id = ${parseInt(res.choice.split(" ")[0])};`
                connection.query(query, function (err, deleted) {
                    if (err) throw err;
                    console.log("---------------------------------------------------------------")
                    console.log(`You have successfully deleted ${res.choice}!`);
                    console.log("---------------------------------------------------------------")
                    startquestions();

                })
            })
    })
}

function pushIntoEmployee() {
    employeeArray = [];
    connection.query("SELECT * FROM employee", function (err, results) {
        for (var i = 0; i < results.length; i++) {
            var fullName = `${results[i].id} ${results[i].first_name} ${results[i].last_name}`
            employeeArray.push(fullName);
            employeeObjects.push(results);
        }
    })
}
function pushIntoDeparray() {
    depArray = [];
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var deptitle = `${res[i].id} ${res[i].name}`;
            depArray.push(deptitle);
        }
    });
}
function pushIntoRoleArr() {
    roleArray = [];
    connection.query("SELECT * FROM role", function (err, roleList) {
        if (err) throw err;
        for (var i = 0; i < roleList.length; i++) {
            var title = `${roleList[i].id} ${roleList[i].title}`;
            // var lO = roleList[i].id;
            roleArray.push(title);
            // roleObjects.push(lO);
        }
    });
}
// RUN APP

viewCompany();
