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
const options = [               //changed questoins to options
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
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Double check to see where else code will fuck up
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
inquire()
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
// promise query to select all from the department table
function departmentChoices() {
  return db.promise().query('SELECT * FROM department')

}
// function to add roles
function addRoles() {
  departmentChoices().then(response => {
    // mapping the response at index 0 to create the department choices
    const dChoices = response[0].map(({ id, department_name }) => ({
      name: department_name,
      value: id
    }))
    // inquirer prompt that uses dChoices const created above
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Input new role name:',
          name: 'role'
        },
        {
          type: 'input',
          message: 'Input a salary:',
          name: 'salary'
        },
        {
          type: 'list',
          message: 'Choose a department:',
          name: 'departmentChoice',
          choices: dChoices
        }
      ])
      // creating the new role with the answers above.
      .then(answer => {
        let roleName = {
          title: answer.role,
          salary: answer.salary,
          department_id: answer.departmentChoice,
        }
        // inserting the new role creating into the roles table
        db.promise().query('INSERT INTO roles SET ?', roleName)
          .then(() => {
            console.log('successfully added role')
            inquire()
          })
      })
  }
  )
}
// function to add an employee
function addEmployee() {
  inquirer
    .prompt(optionSetTwo)
    // used the answers object from the prompt to create variables for name
    .then(answers => {
      let firstName = answers.first;
      let lastName = answers.last;
      // db promise query that is mapped to create a title with an id for role choices
      db.promise().query('SELECT * FROM roles').then(response => {
        let roleChoices = response[0].map(({ id, title }) => ({
          name: title,
          value: id
        }))
        // inquirer prompt using the roleChoices variable
        inquirer
          .prompt({
            type: 'list',
            message: 'What is employees role?',
            name: 'roleid',
            choices: roleChoices
          })
          // promise query selects the employee table content and is mapped for the first and last name with id included
          .then(response => {
            let roleid = response.roleid
            db.promise().query('SELECT * FROM employee').then(response => {
              let managerChoices = response[0].map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }))
              // added no manager with value null to the top of choices for manager
              managerChoices.unshift({ name: 'none', value: null })
              inquirer
                .prompt({
                  type: 'list',
                  message: 'What is employees manager?',
                  name: 'managerid',
                  choices: managerChoices
                })
                // created the employee object with all the variables above so we can insert the object into the table
                .then(response => {
                  let employee = {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleid,
                    manager_id: response.managerid
                  }
                  // inserts employee object into table
                  db.promise().query('INSERT INTO employee SET ?', employee)
                    .then(() => {
                      console.log('successfully added employee')
                    })
                  .then(() => {
                    inquire()
                  })
                })
            })
          })
      })
    })
}
// promise query that uses left join to create a table with grouping of department and budget of said department
function viewBudget() {
  return db.promise().query('SELECT department.id, department.department_name, SUM(roles.salary) AS utilized_budget FROM employee LEFT JOIN roles ON employee.role_id=roles.id LEFT JOIN department ON roles.department_id=department.id GROUP BY department.id, department.department_name')
}




