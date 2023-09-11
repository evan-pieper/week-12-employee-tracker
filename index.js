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
    const query = 'SELECT * FROM department';
    db.query(query, function (err, results) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(""); // Add a line break so the table is not on the same line as the menu
        console.table(results);
    });

    menuReturn();
};

const viewAllRoles = () => { //TODO: Add department name to the role table from the department table using the department ID
    console.log('View all roles'); 
    //JOIN book_prices ON favorite_books.book_price = book_prices.id;
    const query = 'SELECT role.id, role.title, role.salary, department.department_name AS "Department" FROM role LEFT JOIN department ON role.department_id = department.id';
    db.query(query, function (err, results) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(""); // Add a line break so the table is not on the same line as the menu
        console.table(results);
    });
    menuReturn();
};

const viewAllEmployees = () => { //TODO: Add role name to the employee table from the role table using the role ID, and add manager name to the employee table from the employee table using the manager ID
    console.log('View all employees');  //formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    const query = 
    `SELECT e.id, e.first_name, e.last_name, m.first_name AS "Manager", r.title AS "Role Title" 
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN employee m ON e.manager_id = m.id`;

    db.query(query, function (err, results) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(""); // Add a line break so the table is not on the same line as the menu
        console.table(results);
    });

    menuReturn();
};

const addDepartment = () => { //THEN I am prompted to enter the name of the department and that department is added to the database
    console.log('Add a department');
    const questions = 
    [{ 
        type: 'input',
        name: 'department_name',
        message: 'enter the department name to be added: ',
    },];
    
    inquirer.prompt(questions).then(answers => {
        //console.log(answers);
        const query = 'INSERT INTO department(department_name) values(?)';
        db.query(query, answers.department_name, function (err, res) {
            if (err) {
                console.error(err);
                return;
            }
            //console.log(res);
            console.log(`Added ${answers.name} to the database`);
            viewAllDepartments(); //show the updated table
            //menuReturn(); //return to the main menu
        });
    });

    //menuReturn();
};

const addRole = () => { //prompt the user to enter the name, salary, and department (validated from database) for the role and that role is added to the database
    //TODO: show department names from the department table as a list to choose from
    console.log('Add a role');

    const query = 'SELECT department_name FROM department';
    db.query(query, function (err, results) {
        if (err) {
            console.error(err);
            return;
        }

        let departmentList = results.map(function (obj) { //create an array of department names from the department table
            return obj.department_name;
        });
        //console.log(departmentList);

        const questions = 
        [
            { 
            type: 'input',
            name: 'inputTitle',
            message: 'Enter the title for the new role: ',
            },
    
            { 
                type: 'input',
                name: 'inputSalary',
                message: 'Enter the salary for the new role: ',
                validate: function (input) { //validate that the input is a number
                    if (isNaN(input)) {
                        return "Please enter a valid salary";
                    }
                    return true;
                }
            },
    
            { 
                type: 'list',
                name: 'departmentList',
                message: 'Select the department for the new role: ',
                choices: departmentList,
            },
        ];
        inquirer.prompt(questions).then(answers => {
            //console.log(answers);
            const idQuery = 'SELECT id FROM department WHERE department_name = ?';
            db.query(idQuery, answers.departmentList, function (err, res) {
                if (err) {
                    console.error(err);
                    return;
                }

                const insertQuery = 'INSERT INTO role(title, salary, department_id) values(?,?,?)';
                console.log(res.id);
                console.log(res[0].id);
                db.query(insertQuery, [answers.inputTitle, answers.inputSalary, res[0].id], function (err, res) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(res);
                viewAllRoles(); //show the updated table (also runs menuReturn() after showing the table)
                });
            });
        });
    });
};

const addEmployee = () => { //THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    //TODO: show role names from the role table as a list to choose from
    //TODO: show manager names from the employee table as a list to choose from
    console.log('Add an employee');

    const roleQuery = 'SELECT title FROM role';
    db.query(roleQuery, function (err, results) {
        if (err) {
            console.error(err);
            return;
        }

        let roleList = results.map(function (obj) { //create an array of department names from the department table
            return obj.title;
        });

        const managerQuery = 'SELECT first_name FROM employee';

        db.query(managerQuery, function (err, results) {
            if (err) {
                console.error(err);
                return;
            }

            let managerList = results.map(function (obj) { //create an array of department names from the department table
                return obj.first_name;
            });

            managerList.push('None'); //add None as an option for employees with no manager

            const questions = 
            [
                { 
                type: 'input',
                name: 'inputFirstName',
                message: 'Enter the first name for the new employee: ',
                },
                { 
                    type: 'input',
                    name: 'inputLastName',
                    message: 'Enter the last name for the new employee: ',
                },
                { 
                    type: 'list',
                    name: 'inputRole',
                    message: 'Select the role for the new employee: ',
                    choices: roleList,
                },
                { 
                    type: 'list',
                    name: 'inputManager',
                    message: 'Select the manager for the new employee: ',
                    choices: managerList,
                },
            ];

            console.log(""); // Add a line break so the table doesn't block the input prompt
            inquirer.prompt(questions).then(answers => {
                console.log(answers);
                let roleID; //TODO: get the role ID from the role table
                let managerID; //TODO: get the manager ID from the employee table

                const roleQuery = 'SELECT id FROM role WHERE title = ?';
                const managerQuery = 'SELECT id FROM employee WHERE first_name = ?';
                const insertQuery = 'INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)';

                db.query(roleQuery, answers.inputRole, function (err, res) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    //console.log(res);
                    //console.log(res[0]);
                    roleID = res[0];
                    //console.log(roleID);
                    //console.log(roleID.id);
                    if(answers.inputManager != 'None') { //if the employee has a manager, get the manager ID
                        db.query(managerQuery, answers.inputManager, function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            //console.log(res);
                            //console.log(res[0]);
                            managerID = res[0];
                            //console.log(managerID);
                            //console.log(managerID.id);
                            

                            db.query(insertQuery, [answers.inputFirstName, answers.inputLastName, roleID.id, managerID.id], function (err, res) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                console.log(res);
                                viewAllEmployees(); //show the updated table
                                //menuReturn(); //return to the main menu
                            });
                        });
                    }

                    else { //if the employee has no manager, set the manager ID to null
                        db.query(insertQuery, [answers.inputFirstName, answers.inputLastName, roleID.id, null], function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(res);
                            viewAllEmployees(); //show the updated table
                            //menuReturn(); //return to the main menu
                        });
                    }

                });
            });
        });
    });
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
            viewAllEmployees(); //show the updated table
            //menuReturn(); //return to the main menu
        });
    });
};

if(firstIt === true) {
    firstIt = false;
    console.log('Welcome to the Employee Tracker');
    actionPrompt(); // Start the application
};

