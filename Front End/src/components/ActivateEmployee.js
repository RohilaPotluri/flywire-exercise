import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivateEmployee.css'; 

const ActivateEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [noEmployees, setNoEmployees] = useState(false); 

  useEffect(() => {
    fetchEmployees();
  }, []);

   // Function to fetch inactive employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/employee/GetInactiveEmployees');
      if (response.data.length === 0) {
        setNoEmployees(true); 
      } else {
        setNoEmployees(false); 
        setEmployees(response.data);
      }
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // PUT request to activate the employee
    axios.put(`http://localhost:8080/api/employee/ActivateEmployee/${selectedEmployeeId}`)
      .then(response => {
        alert('Employee activated successfully');
        fetchEmployees(); 
      })
      .catch(error => {
        console.error('Error activating employee:', error);
        alert('Failed to activate employee');
      });
  };

  return (
    <div className="activate-employee-container">
      <h1 className="activate-employee-header">Activate Employee</h1>
      {noEmployees ? (
        <p className="no-results-message">No inactive employees found.</p>
      ) : (
        <form onSubmit={handleSubmit} className="activate-employee-form">
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
                {employee.id} -- {employee.name}
              </option>
            ))}
          </select>
          <button type="submit" className="submit-button">Activate</button>
        </form>
      )}
    </div>
  );
};

export default ActivateEmployee;
