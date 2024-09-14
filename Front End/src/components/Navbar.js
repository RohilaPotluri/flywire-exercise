import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const PageNavigation = (path) => {
    navigate(path); 
  };

  return (
    <nav className="navbar">
      <h4 className='navbar-header'>Employee Portal</h4>
      <ul className="navbar-list">
        <li className="navbar-item">
          <button onClick={() => PageNavigation('/all')} className="navbar-button">Active Employees</button>
        </li>
        <li className="navbar-item">
          <button onClick={() => PageNavigation('/employee')} className="navbar-button">Employee Details</button>
        </li>
        <li className="navbar-item">
          <button onClick={() => PageNavigation('/date-range')} className="navbar-button">Employees by Hire Date</button>
        </li>
        <li className="navbar-item">
          <button onClick={() => PageNavigation('/form')} className="navbar-button">Create New Employee</button>
        </li>
        <li className="navbar-item">
          <button onClick={() => PageNavigation('/deactivate')} className="navbar-button">Deactivate Employee</button>
        </li>
        <li className="navbar-item">
          <button onClick={() => PageNavigation('/activate')} className="navbar-button">Activate Employee</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
