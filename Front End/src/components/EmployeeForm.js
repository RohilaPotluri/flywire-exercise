import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeForm.css'; 

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
};

const EmployeeForm = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({
    id: '',
    name: '',
    position: '',
    hireDate: '',
    directReports: [],
    active: false
  });
  const [errorMessage, setErrorMessage] = useState(''); 

  useEffect(() => {
    axios.get('http://localhost:8080/api/employee/GetAllEmployees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === 'directReports') {
      setEmployeeDetails(prevState => ({
        ...prevState,
        directReports: Array.from(event.target.selectedOptions, option => Number(option.value))
      }));
    } else {
      setEmployeeDetails(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
  
    // Validate if employee ID is positive
    if (employeeDetails.id <= 0) {
      setErrorMessage('Employee ID must be a positive number.');
      return; 
    }
  
    const formattedHireDate = formatDate(employeeDetails.hireDate);
  
    // Check if employee ID already exists in employees
    const duplicateEmployee = employees.find(employee => employee.id === Number(employeeDetails.id));
  
    if (duplicateEmployee) {
      setErrorMessage(`Employee ID ${employeeDetails.id} already exists. Please choose a unique ID.`);
      return; 
    }
  
    axios.post('http://localhost:8080/api/employee/createEmployee', {
      ...employeeDetails,
      hireDate: formattedHireDate
    })
      .then(response => {
        alert('Employee details created successfully');
      })
      .catch(error => {
        console.error('Error creating employee details:', error);
        alert('Failed to create employee details');
      });
  };

  return (
    <div className="employee-form-container">
      <h1 className="employee-form-header">Employee Form</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {}
      <form onSubmit={handleSubmit} className="employee-form">
        <div>
          <label htmlFor="id">ID:</label>
          <input
            required
            type="number"
            id="id"
            name="id"
            value={employeeDetails.id}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="name">Name:</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            value={employeeDetails.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="position">Position:</label>
          <input
            required
            type="text"
            id="position"
            name="position"
            value={employeeDetails.position}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="hireDate">Hire Date:</label>
          <input
            required
            type="date"
            id="hireDate"
            name="hireDate"
            value={employeeDetails.hireDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="directReports">Direct Reports:</label>
          <select
            id="directReports"
            name="directReports"
            multiple
            value={employeeDetails.directReports}
            onChange={handleChange}
          >
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="active">Active:</label>
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={employeeDetails.active}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
