const inquirer = require("inquirer");
const conPassword = require("./password");
const mysql = require("mysql2");
const figlet = require("figlet");
const chalk = require("chalk");

conPassword.connect((err) => {
  if (err) throw err;
  console.log(chalk.cyan.bold(`======================================================================`));
  console.log(``);
  console.log(
    chalk.bgCyan.bold(
      figlet.textSync("Employee Tracker", {
        font: "Big Money-nw",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    )
);
  console.log(``);
  console.log(`                                   ` +chalk.greenBright.bold("Developed By: Cody Lewis"));
  console.log(``);
  console.log(chalk.cyan.bold(`======================================================================`));
  promptUser();
});

const promptUser = () => {
  inquirer.prompt([
    {
      name: "choiceList",
      type: "list",
      message: "Please choose action from the list below",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
  ]);
  then((choice) => {
    const { listChoice } = choice;

    if (listChoice === "View all departments") {
      showAllDepartments();
    }
    if (listChoice === "View all roles") {
      showAllRoles();
    }
    if (listChoice === "View all employees") {
      showAllEmployees();
    }
    if (listChoice === "Add a department") {
      addDepartment();
    }
    if (listChoice === "Add a role") {
      addRole();
    }
    if (listChoice === "Add an employee") {
      addEmployee();
    }
    if (listChoice === "Update an employee role") {
      updateEmployeeRole();
    }
    if (listChoice === "Exit") {
      connection.end();
    }
  });
};

// showAllDepartments() -----------------------------------------------------------------
showAllDepartments = () => {
  console.log(chalk.cyan.bold(`======================================================================`));
  console.log(`                  ` +chalk.yellow.bold( `Viewing All Departments:` ));
  console.log(chalk.cyan.bold(`======================================================================`));
  const sql = `SELECT * FROM department`;

  conPassword.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// showAllRoles(); -----------------------------------------------------------------
showAllRoles = () => {
  console.log(chalk.cyan.bold(`======================================================================`));
  console.log(`                  ` + chalk.yellow.bold( `Viewing All Roles:` ));
  console.log(chalk.cyan.bold(`======================================================================`));
  const sql = `SELECT * FROM role`;

  conPassword.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// showAllEmployees();------------------------------------------------------------
showAllEmployees = () => {
  console.log(chalk.cyan.bold(`======================================================================`));
  console.log(`                  ` +chalk.yellow.bold( `Viewing All Employees:` ));
  console.log(chalk.cyan.bold(`======================================================================`));
  const sql = `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.name AS department,
                    role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  conPassword.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// addDepartment = () -----------------------------------------------------------------
addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "addDepartment",
        type: "input",
        message: "Enter the name of the department you would like to add!",
        validate: validate.validateString,
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.addDepartment, (err, response) => {
        if (err) throw err;
        console.log(chalk.cyan.bold(`======================================================================`));
        console.log(chalk.yellow.bold( `New Department` + answer.addDepartment +  `Successfully Created!` ));
        console.log(chalk.cyan.bold(`======================================================================`));
        showAllDepartments();
      });
    });
};

// addRole(); -----------------------------------------------------------------
addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "Please enter the new role you would like to add!",
        validate: (addRoleName) => {
          if (addRoleName) {
            return true;
          } else {
            console.log("Please enter a new role!");
            return false;
          }
        },
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter the salary for this role!",
        validate: (addSalary) => {
          if (isNAN(addSalary)) {
            return true;
          } else {
            console.log("Please enter a salary");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.roleName, answer.salary];

      const roleSql = `SELECT * FROM department`;

      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const departmentNames = data.map(({ name, id }) => ({
          name: name,
          value: id,
        }));

        inquirer
          .prompt([
            {
              name: "departmentName",
              type: "list",
              message:
                "Please choose a department where you would like to add this role!",
              choices: departmentNames,
            },
          ])
          .then((departmentNameChoice) => {
            const departmentName = departmentNameChoice.departmentName;
            params.push(departmentName);

            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

            connection.query(sql, params, (err, res) => {
              if (err) throw err;
              console.log(chalk.cyan.bold(`======================================================================`));
              console.log(chalk.yellow( `New Role` + answer.role + `Created And Added To Roles!` ));
              console.log(chalk.cyan.bold(`======================================================================`));

              showAllRoles();
            });
          });
      });
    });
};

// addEmployee(); -----------------------------------------------------------------
addEmployee = () => {
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Please enter the new employees first name!",
          validate: (addFirstName) => {
            if (addFirstName) {
              return true;
            } else {
              console.log("Please enter employees first name!");
              return false;
            }
          },
        },
        {
          name: "lastName",
          type: "input",
          message: "Please enter the new employees last name!",
          validate: (addLastName) => {
            if (isNAN(addLastName)) {
              return true;
            } else {
              console.log("Please enter employees last name!");
              return false;
            }
          },
        },
      ])
      .then((answer) => {
        const params = [answer.firstName, answer.lastName];
  
        const roleSql =  `SELECT role.id, role.title FROM role`;
        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err;
  
          const roleNames = data.map(({ title, id }) => ({
            name: title,
            value: id,
          }));
  
          inquirer
            .prompt([
              {
                name: "roleName",
                type: "list",
                message:
                  "Please choose a role for the new employee!",
                choices: roleNames,
              },
            ])
            .then((roleNameChoice) => {
              const roleName = roleNameChoice.roleName;
              params.push(roleName);

              const managerSql = `SELECT * FROM employee`;
              connection.promise().query(managerSql, (err, data) => {
                if (err) throw err;
        
                const managerNames = data.map(({ first_name, last_name, id }) => ({
                  name: first_name + " " + last_name,
                  value: id,
                }));
                
              inquirer
                .prompt([
                  {
                    name: "managerName",
                    type: "list",
                    message: "Please choose the employees manager!",
                    choices: managerNames,
                  },
                ])
                .then((managerNameChoice) => {
                  const managerName = managerNameChoice.managerName;
                  params.push(managerName);
      
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES (?, ?, ?, ?)`;
      
                  connection.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log(chalk.cyan.bold(`======================================================================`));
                    console.log(chalk.yellow( `New Employee` + answer.firstName + answer.lastName + `Has Been Added!` ));
                    console.log(chalk.cyan.bold(`======================================================================`));
      
                showAllEmployees();
                });
            });
          });
        });
      });
    });
};

// updateEmployeeRole(); -----------------------------------------------------------------
updateEmployeeRole = () => {
// first get list of employees from table
    const employeeSql = `SELECT * FROM employee`;
        connection.promise().query(employeeSql, (err, data) => {
            if (err) throw (err);

    const employeesList = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
    }));

          inquirer
            .prompt([
              {
                name: "employeeName",
                type: "list",
                message:"Please choose the employee you would like to update!",
                choices: employeesList,
              },
            ])

            .then((employeeChoice) => {
              const employeeName = employeeChoice.employeeName;
              const params = [];
              params.push(employeeName);

              const roleSql = `SELECT * FROM role`;
              connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;
        
                const roles = data.map(({ id, title }) => ({
                  name: title,
                  value: id,
                }));
                
          inquirer
              .prompt([
                {
                  name: "employeeRole",
                  type: "list",
                  message: "Please update the employees role!",
                  choices: roles,
                },
              ])
            .then((employeeChoice) => {
                const employeeRole = employeeChoice.employee;
                params.push(employeeRole);

                let employeeName = params[0]
                params[0] = employeeRole
                params[1] = employeeName 
    
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                connection.query(sql, params, (err, res) => {
                  if (err) throw err;
                  console.log(chalk.cyan.bold(`======================================================================`));
                  console.log(chalk.yellow( `Employee` + answer.firstName + answer.lastName + `Role Has Been Updated!` ));
                  console.log(chalk.cyan.bold(`======================================================================`));     
      
                showAllEmployees();
                });
            });
          });
        });
    });
};

module.exports = app;
