import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeData.css';

const EmployeeData = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [employeeDetails, setEmployeeDetails] = useState(null);

    useEffect(() => {
        fetchEmployees();
      }, []);
      // Function to fetch all employees
      const fetchEmployees = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/employee/GetAllEmployees');
          setEmployees(response.data);
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      };
    
      const handleClick = () => {
        fetchEmployees(); 
      };

    const handleChange = (event) => {
        setSelectedEmployeeId(event.target.value);
    };
     // Handle form submission to fetch details of the selected employee
    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.get(`http://localhost:8080/api/employee/GetEmployeeData/${selectedEmployeeId}`)
          .then(response => {
            setEmployeeDetails(response.data);
          })
          .catch(error => {
            console.error('Error fetching employee details:', error);
          });
    };

    return (
        <div className="employee-data-container">
            <h1 className="employee-data-header">Employee Data</h1>
            <form onSubmit={handleSubmit} className="employee-data-form">
                <label htmlFor="employee-select">Select Employee:</label>
                <select
                    id="employee-select"
                    value={selectedEmployeeId}
                    onChange={handleChange}
                    onClick={handleClick}
                >
                    <option value="">-- Select an employee --</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                        </option>
                    ))}
                </select>
                <button type="submit">Show Details</button>
            </form>

            {employeeDetails && (
                <div className="employee-details">
                    <h2>Employee Details</h2>
                    <p><strong>ID:</strong> {employeeDetails.id}</p>
                    <p><strong>Name:</strong> {employeeDetails.name}</p>
                    <p><strong>Position:</strong> {employeeDetails.position}</p>
                    <p><strong>Hire Date:</strong> {employeeDetails.hireDate}</p>
                    <p><strong>Direct Reports:</strong> {employeeDetails.directReportNames.join(', ')}</p>
                    <p><strong>Active:</strong> {employeeDetails.active ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeData;
