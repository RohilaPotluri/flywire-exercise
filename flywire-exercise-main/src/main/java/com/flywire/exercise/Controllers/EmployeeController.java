package com.flywire.exercise.Controllers;

import com.flywire.exercise.Models.Employee;
import com.flywire.exercise.Services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

/**
 * REST controller for employee-related operations.
 */
@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService){
        this.employeeService = employeeService;
    }

    /**
     * Retrieves list of all employees.
     */
    @RequestMapping(value = "/GetAllEmployees", method = RequestMethod.GET)
    public List<Employee> getAllEmployees(){
        return employeeService.getAllEmployees();
    }

    /**
     * Retrieves list of all active employees.
     */
    @RequestMapping(value = "/GetActiveEmployees", method = RequestMethod.GET)
    public List<Employee> getActiveEmployees(){
        return employeeService.getActiveEmployees();
    }

    /**
     * Retrieves list of all inactive employees.
     */
    @RequestMapping(value = "/GetInactiveEmployees", method = RequestMethod.GET)
    public List<Employee> getInactiveEmployees(){
        return employeeService.getInactiveEmployees();
    }

    /**
     * Deactivates employee with the specified ID.
     *
     * @param id The ID of the employee to deactivate.
     */
    @RequestMapping(value = "/DeactivateEmployee/{id}", method = RequestMethod.PUT)
    public void DeactivateEmployee(@PathVariable int id){
        employeeService.deactivateEmployee(id);
    }

    /**
     * Activates employee with the specified ID.
     *
     * @param id The ID of employee to activate.
     */
    @RequestMapping(value = "/ActivateEmployee/{id}", method = RequestMethod.PUT)
    public void ActivateEmployee(@PathVariable int id){
        employeeService.activateEmployee(id);
    }

    /**
     * Retrieves detailed data of employee with the specified ID.
     *
     * @param id The ID of the employee to retrieve.
     */
    @RequestMapping(value = "/GetEmployeeData/{id}", method = RequestMethod.GET)
    public Employee getEmployeeData(@PathVariable int id){
        return employeeService.getEmployeeData(id);
    }

    /**
     * Retrieves list of employees who were hired within the specified date range.
     *
     * @param startDate The start date of the range in MM/dd/yyyy format.
     * @param endDate The end date of the range in MM/dd/yyyy format.
     */
    @RequestMapping(value = "/DateRange", method = RequestMethod.GET)
    public List<Employee> getEmployeesByHireDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        return employeeService.getEmployeeByDateRange(startDate, endDate);
    }

    /**
     * Creates new employee.
     *
     * @param employee The employee to create.
     */
    @RequestMapping(value = "/createEmployee", method = RequestMethod.POST)
    public void createEmployee(@Validated @RequestBody Employee employee){
        employeeService.createEmployee(employee);
    }
}
