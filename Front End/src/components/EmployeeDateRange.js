import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import './EmployeeDateRange.css'; 

const EmployeeDateRange = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employees, setEmployees] = useState([]);
  // State to hold any error messages
  const [error, setError] = useState("");
  const [noResults, setNoResults] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate if both start and end dates are selected
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      setNoResults(false); 
      return;
    }
    // Validate if start date is not later than end date
    if (startDate > endDate) {
      setError("Start date cannot be later than end date");
      setNoResults(false); 
      return;
    }

    // Format dates to MM/dd/yyyy
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    try {
      // Fetch employees based on the selected date range
      const response = await axios.get("http://localhost:8080/api/employee/DateRange", {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });
      // Check if the response contains any employee data
      if (response.data.length === 0) {
        setNoResults(true); 
        setEmployees([]); 
      } else {
        setEmployees(response.data);
        setNoResults(false);
      }
      
      setError("");
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Error fetching employees. Please try again.");
      setNoResults(false); 
    }
  };

  // function to format dates
  const formatDate = (date) => {
    if (!date) return "";
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="container">
      <h1 className="page-heading">Employee Data based on Hire Date</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select Start Date"
            className="date-picker"
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select End Date"
            className="date-picker"
          />
        </div>

        <button type="submit" className="submit-button">Fetch Employees</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {noResults && !error && <p className="no-results-message">No employees found for the selected date range.</p>}

      {employees.length > 0 && !noResults && (
        <div className="employee-list">
          <h3>Employees:</h3>
          <ul>
            {employees.map((employee) => (
              <li key={employee.id}>
                {employee.name} - {employee.position} (Hired: {employee.hireDate})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeeDateRange;
