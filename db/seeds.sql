INSERT INTO departments (department_name)
VALUES
('Human Resources'),
('Sales'),
('Service'),
('Quality Assurance'),
('Customer Service'),
('Accouting');

INSERT INTO role (title, salary, department_id)
VALUES
('Human Resources Manager', 175000, 1),
('Health and Safety', 125000, 1),
('Training and development', 105000, 1), 
('Sales Manager', 75000, 2), 
('Inside Sales Rep', 50000, 2), 
('Outside Sales Rep', 60000, 2), 
('Service Manager', 76000, 3), 
('Business Service Rep', 4000, 3), 
('Telephone Support', 35000, 3), 
('Quality Assurance Manager', 85000, 4), 
('Quality Assurance Rep', 75600, 4), 
('Quality Assurance Tester', 67000, 4), 
('Customer Service Manager', 60000, 5), 
('Customer Relationship Specialist', 52000, 5), 
('Customer Service Associate', 35000, 5), 
('Accouting Manager', 78000, 6), 
('Account Specialist', 72000, 6), 
('Account Representative', 51000, 6); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Shirleen', 'Kincer', 1, null),  
('Hugo', 'Cardenas', 2, 1),  
('Ying', 'Estill', 3, 1),  
('Jamie', 'Capehart', 4, null),  
('Man', 'Johanson', 5, 4),  
('Mendy', 'Isabell', 6, 4),  
('Malvina', 'Showers', 7, null),  
('Edwin', 'Salgado', 8, 7),  
('Nerissa', 'Bledsoe', 9, 7),  
('Krista', 'Mitts', 10, null),  
('Zetta', 'Boutwell', 11, 10),  
('Denver', 'Dyer', 12, 10),  
('Gary', 'Lanphere', 13, null),  
('Graham', 'Glueck', 14, 13),  
('Lucretia', 'Porco', 15, 13),  
('Ninfa', 'Bruening', 16, null),  
('Belle', 'Gaul', 17, 16),  
('Reginald', 'Slabaugh', 18, 16),  
('Kellye', 'Nogle', 14, 13),  
('Adelle', 'Boley', 18, 16);  
