USE employee_db;

INSERT INTO department
    (department_name)
VALUES
    ('Sales'),
    ('Maintenance'),
    ('Membership'),
INSERT INTO roles
    (title, salary, department_id)
VALUES
  (supervisor, "100000", 1),
  (associate, "60000", 2),
  (jr associate, "40000", 3)
 
 INSERT INTO employee
    (id, first_name, last_name)
VALUES
    (1, "Joe", "Do"),
    (2, "Mop", "Top"),
    (3, "Ash", "Ketchum"),
    (4, "Kevin", "Durant"),
    (5, "Kumal", "Whitecastle"),
    (6, "Matida", "Boise"),
    (7, "Sassy", "Pants"),
    (8, "Timothy", "Longjohn"); 