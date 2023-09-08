const inquirer = require('inquirer');
const mysql = require('mysql2'); 
require('dotenv').config();

let firstIt = true;

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to ${process.env.DB_NAME} database.`)
  );
  

const actionPrompt = () => {
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
                'Update an employee role',
                'Quit'
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
            case 'Quit':
                console.log('Goodbye');
                process.exit(); // Exit the application
        }
    });
};

const menuReturn = () => {
    /* const questions = [
        {
            type: 'input',
            name: 'menuReturn',
            message: 'Press enter to return to the main menu',
        },
    ];

    inquirer.prompt(questions).then(answers => {
        actionPrompt();
    }); */
    actionPrompt();
};


const viewAllDepartments = () => {
    console.log('View all departments');
    db.query('SELECT * FROM department', function (err, results) {
        console.log(results);
    });

    menuReturn();
};

const viewAllRoles = () => { //TODO: Add department name to the role table from the department table using the department ID
    console.log('View all roles'); 
    //JOIN book_prices ON favorite_books.book_price = book_prices.id;
    const query = 'SELECT role.id, role.title, role.salary, department.name FROM role left JOIN department ON role.department_id = department.id';
    db.query(query, function (err, results) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(results);
    });
    menuReturn();
};

const viewAllEmployees = () => { //TODO: Add role name to the employee table from the role table using the role ID, and add manager name to the employee table from the employee table using the manager ID
    console.log('View all employees');
    db.query('SELECT * FROM employee left JOIN manager ON employee.manager_id = employee.id', function (err, results) {
        console.log(results);
    });

    menuReturn();
};

const addDepartment = () => { //THEN I am prompted to enter the name of the department and that department is added to the database
    console.log('Add a department');
    const questions = 
    [{ 
        type: 'input',
        name: 'addDepartment',
        message: 'enter the department name to be added: ',
    },];
    
    inquirer.prompt(questions).then(answers => {
        console.log(answers);
        const query = 'INSERT INTO department(department_name) values(?)';
        db.query(query, answers, function (err, res) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(res);
        });
    });

    menuReturn();
};

const addRole = () => { //THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
    console.log('Add a role');
    const questions = 
    [
        { 
        type: 'input',
        name: 'roleName',
        message: 'Enter the role name: ',
        },

        { 
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the role salary: ',
        },

        { 
            type: 'input',
            name: 'roleDepartment',
            message: 'Enter the role department: ',
        },
    ];
    inquirer.prompt(questions).then(answers => {
        console.log(answers);
        const query = 'INSERT INTO role(roleName, roleSalary, roleDepartment) values(?,?,?)';
        db.query(query, answers, function (err, res) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(res);
        });
    });

    menuReturn();
};

const addEmployee = () => { //THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    console.log('Add an employee');
    const questions = 
    [
        { 
        type: 'input',
        name: 'firstName',
        message: '?',
        },
        { 
            type: 'input',
            name: 'addDepartment',
            message: '?',
        },
        { 
            type: 'input',
            name: 'addDepartment',
            message: '?',
        },
        { 
            type: 'input',
            name: 'addDepartment',
            message: '?',
        },
    ];

    inquirer.prompt(questions).then(answers => {
        console.log(answers);
        const query = 'INSERT INTO role(roleName, roleSalary, roleDepartment) values(?,?,?)';
        db.query(query, answers, function (err, res) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(res);
        });
    });

    menuReturn();
};

const updateEmployeeRole = () => { //THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
    console.log('Update an employee role');
    const questions = 
    [{ 
        type: 'input',
        name: 'addDepartment',
        message: '?',
    },];

    inquirer.prompt(questions).then(answers => {
        console.log(answers);
        const query = 'INSERT INTO role(roleName, roleSalary, roleDepartment) values(?,?,?)';
        db.query(query, answers, function (err, res) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(res);
        });
    });

    menuReturn();
};

if(firstIt === true) {
    firstIt = false;
    console.log('Welcome to the Employee Tracker');
    actionPrompt(); // Start the application
};

