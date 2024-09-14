import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeactivateEmployee.css'; 

const DeactivateEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [noEmployeesMessage, setNoEmployeesMessage] = useState('');
  const [loading, setLoading] = useState(false);  

  useEffect(() => {
    fetchEmployees();
  }, []);
// Function to fetch active employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/employee/GetActiveEmployees');
      const employeesData = response.data;
      setEmployees(employeesData);
      if (employeesData.length === 0) {
        setNoEmployeesMessage('No active employees available to deactivate.');
      } else {
        setNoEmployeesMessage('');
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
  // Form submission to deactivate the selected employee
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedEmployeeId) return;  

    setLoading(true); 
    try {
      await axios.put(`http://localhost:8080/api/employee/DeactivateEmployee/${selectedEmployeeId}`);
      alert('Employee deactivated successfully');
      fetchEmployees();
      setSelectedEmployeeId(''); 
    } catch (error) {
      console.error('Error deactivating employee:', error);
      alert('Failed to deactivate employee');
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="deactivate-employee-container">
      <h1 className="deactivate-employee-header">Deactivate Employee</h1>
      {noEmployeesMessage ? (
        <p className="no-employees-message">{noEmployeesMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className="deactivate-employee-form">
          <label htmlFor="employee-select">Select Employee:</label>
          <select
            id="employee-select"
            value={selectedEmployeeId}
            onChange={handleChange}
            onClick={handleClick}
            disabled={loading} 
          >
            <option value="">-- Select an employee --</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.id} -- {employee.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Deactivating...' : 'Deactivate'}
          </button>
        </form>
      )}
    </div>
  );
};

export default DeactivateEmployee;
