import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeList.css'; // Import the CSS file

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);  
      try {
        //fetch acctive employee details 
        const response = await axios.get("http://localhost:8080/api/employee/GetActiveEmployees");
        setEmployees(response.data);
        setLoading(false);  
      } catch (error) {
        setError('There was an error fetching the employee data.');
        setLoading(false);  
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="employee-list-container">
      <h1 className="employee-list-header">Employee List</h1>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : employees.length === 0 ? (
        <p className="no-employees-message">No active employees found.</p>
      ) : (
        <table className="employee-list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Hire Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.hireDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
