const inquirer = require("inquirer");
const conPassword = require("./password");
const mysql = require("mysql2");
const figlet = require("figlet");
const chalk = require("chalk");

conPassword.connect((err) => {
  if (err) throw err;
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
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
  console.log(
    `                                   ` +
      chalk.greenBright.bold("Developed By: Cody Lewis")
  );
  console.log(``);
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
  promptUser();
});

const promptUser = () => {
  inquirer
    .prompt([
      {
        name: "listChoice",
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
    ])
    .then(({ listChoice }) => {
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
        conPassword.end();
      }
    });
};

// showAllDepartments() -----------------------------------------------------------------
showAllDepartments = () => {
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
  console.log(  
    `                            ` +
      chalk.yellow.bold(`Viewing All Departments:`)
  );
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
  const sql = `SELECT * FROM department`;
  //   const conPassword = require("./password");
  conPassword
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`\n`);
      console.table(rows);
    });
  // .catch(console.log).then(() => conPassword.end());
  promptUser();
};

// showAllRoles(); -----------------------------------------------------------------
showAllRoles = () => {
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
  console.log(
    `                            ` + chalk.yellow.bold(`Viewing All Roles:`)
  );
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
  const sql = `SELECT * FROM role`;

  conPassword
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`\n`);
      console.table(rows);
    });

  promptUser();
};

// showAllEmployees();------------------------------------------------------------
showAllEmployees = () => {
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
  console.log(
    `                            ` + chalk.yellow.bold(`Viewing All Employees:`)
  );
  console.log(
    chalk.cyan.bold(
      `=====================================================================================`
    )
  );
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

  conPassword
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`\n`);
      console.table(rows);
    });

  promptUser();
};

// addDepartment = () -----------------------------------------------------------------
addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "addDepartment",
        type: "input",
        message: "Enter the name of the department you would like to add!",
      },
    ])
    .then(({ addDepartment }) => {
      let sql = `INSERT INTO department (name) VALUES (?)`;
      conPassword
        .promise()
        .query(sql, addDepartment)
        .then(() => {
          console.log(`\n`);
          console.log(
            chalk.cyan.bold(
              `=====================================================================================`
            )
          );
          console.log(`                 ` + chalk.yellow.bold(`New Department ${addDepartment} Successfully Created!`)
          );
          console.log(
            chalk.cyan.bold(
              `=====================================================================================`
            )
          );
        });
      showAllDepartments();
    });
};

// addRole(); -----------------------------------------------------------------
addRole = () => {
  let roleData;
  let salaryData;
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
          if (addSalary) {
            return true;
          } else {
            console.log("Please enter a salary");
            return false;
          }
        },
      },
    ])
    .then(({ roleName, salary }) => {
      roleData = roleName;
      salaryData = salary;
      const roleSql = `SELECT * FROM department`;
      conPassword
        .promise()
        .query(roleSql)
        .then(([rows, fields]) => {
          console.log(`\n`);
          const department = rows.map((el) => el.id + " " + el.name);
          inquirer
            .prompt([
              {
                name: "departmentName",
                type: "list",
                message:
                  "Please choose a department where you would like to add this role!",
                choices: department,
              },
            ])
            .then(({ departmentName }) => {
              let departmentId = departmentName.split(" ", 1);
              let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
              conPassword
                .promise()
                .query(sql, [roleData, salaryData, departmentId])
                .then(() => {
                  console.log(`\n`);
                  console.log(
                    chalk.cyan.bold(
                      `=====================================================================================`
                    )
                  );
                  console.log(`                 ` + chalk.yellow(
                      `New Role ${roleData} Created And Added To Roles!`
                    )
                  );
                  console.log(
                    chalk.cyan.bold(
                      `=====================================================================================`
                    )
                  );
                  showAllRoles();
                });
            });
        });
    });
};

// addEmployee(); -----------------------------------------------------------------
addEmployee = () => {
    let firstNameData;
    let lastNameData;
    let roleId;
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
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter employees last name!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
        firstNameData = answer.firstName;
        lastNameData = answer.lastName;
      //   const params = [answer.firstName, answer.lastName];

      const roleSql = `SELECT id, title FROM role`;
      conPassword
        .promise()
        .query(roleSql)
        .then(([rows, fields]) => {
          let roleNames = rows.map((el) => el.id + ' ' + el.title);
          inquirer
            .prompt([
              {
                name: "roleName",
                type: "list",
                message: "Please choose a role for the new employee!",
                choices: roleNames,
              },
            ])
            .then(({ roleName }) => {
                roleId = roleName.split(' ', 1);
              const managerSql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`;
              conPassword
                .promise()
                .query(managerSql)
                .then(([rows, fields]) => {
                  const managerNames = rows.map((el) => el.id + ' ' + el.name);

                  inquirer
                    .prompt([
                      {
                        name: "managerName",
                        type: "list",
                        message: "Please choose the employees manager!",
                        choices: managerNames,
                      },
                    ])
                    .then(({ managerName }) => {
                        let managerId = managerName.split(' ', 1);
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES (?, ?, ?, ?)`;

                      conPassword
                      .promise()
                      .query(sql, [firstNameData, lastNameData, roleId, managerId])
                      .then(() => {
                        console.log('\n');
                        console.log(
                          chalk.cyan.bold(
                            `=====================================================================================`
                          )
                        );
                        console.log(`                ` + chalk.yellow(`New Employee ${firstNameData} ${lastNameData} Has Been Added!`)
                        );
                        console.log(
                          chalk.cyan.bold(
                            `=====================================================================================`
                          )
                        );

                        showAllEmployees();
                      })
                     
                      });
                    });
                });
            });
        });
};

// updateEmployeeRole(); -----------------------------------------------------------------
updateEmployeeRole = () => {
  // first get list of employees from table
  let nameData;
  const employeeSql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`;
  conPassword
    .promise()
    .query(employeeSql)
    .then(([rows, fields]) => {
      const employeesList = rows.map((el) => el.id + " " + el.name);

      inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Please choose the employee you would like to update!",
            choices: employeesList,
          },
        ])
        .then(({ employeeName }) => {
          nameData = employeeName;
          const roleSql = `SELECT id, title FROM role`;
          conPassword
            .promise()
            .query(roleSql)
            .then(([rows, fields]) => {
              const roles = rows.map((el) => el.id + " " + el.title);
              inquirer
                .prompt([
                  {
                    name: "employeeRole",
                    type: "list",
                    message: "Please update the employees role!",
                    choices: roles,
                  },
                ])
                .then(({ employeeRole }) => {
                  let roleId = employeeRole.split(" ", 1);
                  let eId = nameData.split(" ", 1);
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                  conPassword
                    .promise()
                    .query(sql, [roleId, eId])
                    .then(() => {
                      console.log("\n");
                      console.log(
                        chalk.cyan.bold(
                          `=====================================================================================`
                        )
                      );
                      console.log(`                 ` + chalk.yellow(
                          `Employee ${nameData}'s Role Has Been Updated!`
                        )
                      );
                      console.log(
                        chalk.cyan.bold(
                          `=====================================================================================`
                        )
                      );
                    });

                  showAllEmployees();

                  promptUser();
                });
            });
        });
    });
};
