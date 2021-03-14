const inquirer = require("inquirer");
const conPassword = require("./password");
const mysql = require("mysql2");
const figlet = require("figlet");
const chalk = require("chalk");

conPassword.connect((err) => {
  if (err) throw err;
  console.log(
    chalk.cyan.bold(
      `===========================================================================`
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
    `                                        ` +
      chalk.greenBright.bold("Developed By: Cody Lewis")
  );
  console.log(``);
  console.log(
    chalk.cyan.bold(
      `===========================================================================`
    )
  );
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
  console.log(
    chalk.cyan.bold(
      `======================================================================`
    )
  );
  console.log(
    `                              ` +
      chalk.yellow.bold(`Viewing All Departments:`)
  );
  console.log(
    chalk.cyan.bold(
      `======================================================================`
    )
  );
  const sql = `SELECT * FROM department`;

  conPassword.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// showAllRoles(); -----------------------------------------------------------------
showAllRoles = () => {
  console.log(
    chalk.cyan.bold(
      `======================================================================`
    )
  );
  console.log(
    `                              ` + chalk.yellow.bold(`Viewing All Roles:`)
  );
  console.log(
    chalk.cyan.bold(
      `======================================================================`
    )
  );
  const sql = `SELECT * FROM role`;

  conPassword.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// showAllEmployees();------------------------------------------------------------
showAllEmployees = () => {
  console.log(
    chalk.cyan.bold(
      `======================================================================`
    )
  );
  console.log(
    `                              ` +
      chalk.yellow.bold(`Viewing All Employees:`)
  );
  console.log(
    chalk.cyan.bold(
      `======================================================================`
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
  conPassword.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// addDepartment = () -----------------------------------------------------------------
addDepartment = () => {
  inquirer.prompt([
      {
        name: 'addDepartment',
        type: 'input',
        message: "Enter the name of the department you would like to add!",
        validate: validate.validateString,
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.addDepartment, (err, response) => {
        if (err) throw err;
        console.log(``);
        console.log(
          chalk.yellow(
            answer.addDepartment + ` New Department Successfully Created!`
          )
        );
        console.log(``);
        showAllDepartments();
      });
    });
};

// addRole(); -----------------------------------------------------------------
addRole = () => {
    const newRoleSql = 'SELECT * FROM department'
  conPassword.promise().query(newRoleSql, (err, data) => {
      if (err) throw err;
      let departmentNames = [];
      data.forEach((department) => {departmentNames.push(department.department_name);});
      departmentNames.push('Create New Department');
    inquirer.prompt([
      {
        name: 'departmentChoice',
        type: 'input',
        message: 'Choose the department the new role will be in!',
       choices: departmentNames
      }
    ])
    .then((answer) => {
      if (answer.departmentChoice === 'Create Department') {
          this.addDepartment();
      } else {
          addNewRole(answer);
      }
  )};

    addNewRole = (departmentData) => {
      inquirer.prompt([
          {
            name: 'newRole',
            type: 'input',
            message: 'Enter the name of your new role!',
            validate: validate.validateString  
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Please enter the salary of the new role!',
            validate: validate.validateSalary
          }
      ]) 
      .then((answer) => {
          let createNewRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
          }); 

            let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let params = [createNewRole, answer.salary, departmentId];

            conPassword.query(sql, params, (err, res) => {
                if (err) throw err;
                console.log(chalk.cyan.bold(`====================================================================================`));
                console.log(chalk.yellow(`New Role Created!`));
                console.log(chalk.cyan.bold(`====================================================================================`));
                showAllRoles();
            });
    });
};
    
 


// // addEmployee(); -----------------------------------------------------------------
// addEmployee();

// // updateEmployeeRole(); -----------------------------------------------------------------
// updateEmployeeRole();

module.exports = app;
