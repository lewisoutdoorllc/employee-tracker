DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db; 

DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL, 
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    CONSTRAINT fk_department 
        FOREIGN KEY (department_id) 
        REFERENCES department(id) 
        ON DELETE CASCADE
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    CONSTRAINT fk_role 
        FOREIGN KEY (role_id) 
        REFERENCES role(id) 
        ON DELETE CASCADE,
    manager_id INTEGER,
    CONSTRAINT fk_manager 
        FOREIGN KEY (manager_id) 
        REFERENCES employee(id) 
        ON DELETE SET NULL
);
