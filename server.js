const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '2Morganlane!',
    database: 'employee_db'
  },
);
db.connect(function (err){
if(err) throw err;
console.log("connected")
inquire()

})
const options = [               
  {
    type: 'list',
    message: 'Please select what and option:',
    name: 'start',
    choices: [
      'View all departments',
      'View all employees',
      'View all roles',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'View budget by department',
      'Remove a department',
      'Remove a role',
      'Remove an employee'
    ]
  }
];

const optionSetTwo = [
  {
    type: 'input',
    message: 'Input first name:',
    name: 'first'
  },
  {
    type: 'input',
    message: 'Input last name:',
    name: 'last'
  }
];
const optionSetThree = [
  {
    type: 'input',
    message: 'Input new department name:',
    name: 'department'
  }

];

function inquire() {
  inquirer
    .prompt(options)
    .then((answers) => {
      switch (answers.start) {
        case 'View all departments':
          viewDepartments()
          break;
          case 'View all roles':
            viewRoles()
            break;
        case 'View all employees':
          viewEmployees()
          break;
        case 'Add a department':
          addDepartment()
          break;
        case 'Add a role':
          addRoles()
          break;
        case 'Add an employee':
          addEmployee()
          break;
        case 'Update an employee role':
          updateEmployeeRole()
          break;
      }
    })
}

// function to view all departments as a console table
function viewDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    if(err) throw err;
    console.log("this is all deparments")
    console.table(results)
  })
}
// function to view all employees as a console table
function viewEmployees() {
  db.query('Select * FROM employee', function (err, results) {
    console.table(results)
  })
}
// function to view all roles as a console table
function viewRoles() {
  db.query('Select * FROM roles', function (err, results) {
    console.table(results)
  })
}

// promise query to select all from the employee table
function employeeChoices() {
  return db.promise().query('SELECT * FROM employee')
}
// promise query to select all from the roles table
function roleChoices() {
  return db.promise().query('SELECT * FROM roles')
}
// function to update employee role
function updateEmployeeRole() {
  // this will map the response at index 0 to create the choices for employee
  employeeChoices().then(response => {
    const eChoices = response[0].map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }))
    // this inquirer prompt will use the choices we mapped above as the employee select
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'Select an employee to update their role',
          name: 'employees',
          choices: eChoices
        }
      ])
      // mapping the roles choices and creating a variable for employee id
      .then(response => {
        let employeeId = response.employees
        roleChoices().then(response => {
          const rChoices = response[0].map(({ id, title }) => ({
            name: title,
            value: id
          }))
          inquirer
            .prompt([
              {
                type: 'list',
                message: 'Choose an updated role for this employee',
                name: 'roles',
                choices: rChoices
              }
            ])
            // db query that updates the role_id of the employee at the id we defined above
            .then(response => {
              db.query('UPDATE employee SET role_id=? WHERE id=?', [response.roles, employeeId])
            })
            .then(() => {
              console.log('Successfully updated employee role')
              inquire()
            })
        })
      })
  })
}
