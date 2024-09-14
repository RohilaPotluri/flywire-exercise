import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import EmployeeDateRange from './components/EmployeeDateRange';
import DeactivateEmployee from './components/DeactivateEmployee';
import EmployeeData from './components/EmployeeData';
import ActivateEmployee from './components/ActivateEmployee';



function App(){
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/form" element={<EmployeeForm />} />
        <Route path="/all" element={<EmployeeList />} />
        <Route path="/date-range" element={<EmployeeDateRange />} />\
        <Route path="/deactivate" element={<DeactivateEmployee />} />
        <Route path="/employee" element={<EmployeeData />} />
        <Route path="/activate" element={<ActivateEmployee />} />
        
      </Routes>
    </Router>
    // <div className='App'>
    //   <Navbar></Navbar>
    //   {/* <EmployeeList></EmployeeList> */}
    // </div>
  );
}

export default App;