const inquirer = require('inquirer');
const conPassword = require('./password');
const mysql = require('mysql2');
const figlet = require('figlet');
const chalk = require('chalk');

conPassword.connect(err => {
    if (err) throw err;
    console.log(chalk.cyan.bold(`====================================================================================`));
    console.log(``);
    console.log(chalk.bgCyan.bold(figlet.textSync('Employee Tracker', {
        font: 'Big Money-nw',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true 
    })));
    console.log(``);
    console.log(`                                                ` + chalk.greenBright.bold('Developed By: Cody Lewis'));
    console.log(``);
    console.log(chalk.cyan.bold(`====================================================================================`));
    promptUser();
});

const promptUser = () => {
    inquirer.prompt([
        {
        name: 'choiceList',
        type: 'list',
        message: 'Please choose action from the list below',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',]   
    }
    ])
    then((choice) => {
        const { listChoice } = choice;

        if (listChoice === 'View all departments') {
            showAllDepartments();
        }
        if (listChoice === 'View all roles') {
            showAllRoles();
        }
        if (listChoice ===  'View all employees') {
            showAllEmployees();
        }
        if (listChoice === 'Add a department') {
            addDepartment();
        }
        if (listChoice === 'Add a role') {
            addRole();
        }
        if (listChoice === 'Add an employee') {
            addEmployee();
        }
        if (listChoice === 'Update an employee role') {
            updateEmployeeRole();
        }
        if (listChoice === 'Exit') {
            connection.end();
        } 
    });
};








module.exports = app;