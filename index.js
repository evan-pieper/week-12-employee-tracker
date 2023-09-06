const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2'); 
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to ${process.env.DB_NAME} database.`)
  );
  

function init() {
    const questions = [
        {
            type: 'list',
            name: 'option',
            message: 'What do you want to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }
    ];

    inquirer.prompt(questions).then(answers => {
        switch (answers.option) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
        }
    });
}

const viewAllDepartments = () => {
    console.log('View all departments');
    db.query('SELECT * departments', function (err, results) {
        console.log(results);
      });

};

const viewAllRoles = () => {
    console.log('View all roles');
    db.query('SELECT * roles', function (err, results) {
        console.log(results);
    });
}

const viewAllEmployees = () => {
    console.log('View all employees');
    db.query('SELECT * employees', function (err, results) {
        console.log(results);
    });
}

const addDepartment = () => {
    console.log('Add a department');
}

const addRole = () => {
    console.log('Add a role');
}

const addEmployee = () => {
    console.log('Add an employee');
}

const updateEmployeeRole = () => {
    console.log('Update an employee role');
}


init(); // Start the application

