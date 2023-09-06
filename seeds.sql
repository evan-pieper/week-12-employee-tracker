insert into department (name) values 
('Sales'),
('Marketing'),
('Engineering'),
('Finance'),
('Legal');

insert into role (title, salary, department_id) values 
('Sales Lead', 100000, 1);
('Salesperson', 80000, 1);
('Lead Engineer', 150000, 3);
('Software Engineer', 120000, 3);
('Account Manager', 160000, 4);
('Accountant', 125000, 4);
('Legal Team Lead', 250000, 5);
('Lawyer', 190000, 5);

insert into employee (first_name, last_name, role_id, manager_id) values 
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, null),
('Kevin', 'Tupik', 4, 2),
('Malia', 'Brown', 5, null),
('Sarah', 'Lourd', 6, 3),
('Tom', 'Allen', 7, null),
('Sam', 'Clemens', 8, 5);