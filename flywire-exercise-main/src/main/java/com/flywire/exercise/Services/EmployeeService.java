package com.flywire.exercise.Services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flywire.exercise.Models.Employee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);
    private List<Employee> employeeList;
    private final String path = "src/main/resources/json/data.json";
    private final ObjectMapper obj;

    public EmployeeService(ObjectMapper obj) throws IOException {
        this.obj = obj;
        try (InputStream inputStream = getClass().getResourceAsStream("/json/data.json")) {
            if (inputStream == null) {
                throw new RuntimeException("data.json file not found in classpath");
            }
            employeeList = obj.readValue(inputStream, new TypeReference<List<Employee>>() {});
            logger.info("Employee data loaded successfully.");
        }
    }

    /**
     * Retrieves all employees.
     *
     */
    public List<Employee> getAllEmployees() {
        logger.debug("Fetching all employees.");
        return employeeList;
    }

    /**
     * Retrieves all active employees, sorted by last name.
     *
     */
    public List<Employee> getActiveEmployees() {
        logger.debug("Fetching active employees.");
        return employeeList.stream()
                .filter(Employee::isActive)
                .sorted(Comparator.comparing(employee -> getLastName(employee.getName())))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all inactive employees, sorted by last name.
     *
     */
    public List<Employee> getInactiveEmployees() {
        logger.debug("Fetching inactive employees.");
        return employeeList.stream()
                .filter(employee -> !employee.isActive())
                .sorted(Comparator.comparing(employee -> getLastName(employee.getName())))
                .collect(Collectors.toList());
    }

    private String getLastName(String fullName) {
        String[] nameParts = fullName.split(" ");
        return nameParts[nameParts.length - 1];
    }

    /**
     * Deactivates an employee by ID.
     *
     * @param id The ID of the employee to deactivate.
     * @throws RuntimeException If the employee with the given ID is not found.
     */
    public void deactivateEmployee(int id) {
        logger.debug("Deactivating employee with ID: {}", id);
        Optional<Employee> employeeRecord = employeeList.stream()
                .filter(employee -> employee.getId() == id)
                .findFirst();

        if (employeeRecord.isPresent()) {
            Employee employee = employeeRecord.get();
            employee.setActive(false);
            saveData();
            logger.info("Employee with ID {} deactivated successfully.", id);
        } else {
            logger.error("Employee with ID {} not found for deactivation.", id);
            throw new RuntimeException("Employee with ID " + id + " not found");
        }
    }

    /**
     * Activates an employee by ID.
     *
     * @param id The ID of the employee to activate.
     * @throws RuntimeException If the employee with the given ID is not found.
     */
    public void activateEmployee(int id) {
        logger.debug("Activating employee with ID: {}", id);
        Optional<Employee> employeeRecord = employeeList.stream()
                .filter(employee -> employee.getId() == id)
                .findFirst();

        if (employeeRecord.isPresent()) {
            Employee employee = employeeRecord.get();
            employee.setActive(true);
            saveData();
            logger.info("Employee with ID {} activated successfully.", id);
        } else {
            logger.error("Employee with ID {} not found for activation.", id);
            throw new RuntimeException("Employee with ID " + id + " not found");
        }
    }

    /**
     * Retrieves employee data by ID, including direct report names.
     *
     * @param id The ID of the employee to retrieve.
     * @throws RuntimeException If the employee with the given ID is not found.
     */
    public Employee getEmployeeData(int id) {
        logger.debug("Fetching employee data for ID: {}", id);
        Optional<Employee> employeeRecord = employeeList.stream()
                .filter(employee -> employee.getId() == id)
                .findFirst();

        if (employeeRecord.isPresent()) {
            Employee employee = employeeRecord.get();

            List<String> directReportNames = employee.getDirectReports().stream()
                    .map(reportId -> employeeList.stream()
                            .filter(emp -> emp.getId() == reportId)
                            .map(Employee::getName)
                            .findFirst()
                            .orElse(null)
                    )
                    .filter(name -> name != null)
                    .collect(Collectors.toList());

            employee.setDirectReportNames(directReportNames);
            logger.info("Employee data for ID {} retrieved successfully.", id);
            return employee;
        } else {
            logger.error("Employee with ID {} not found.", id);
            throw new RuntimeException("Employee with ID " + id + " not found");
        }
    }

    /**
     * Retrieves employees who were hired within a specific date range.
     *
     * @param startDate The start date of the range (MM/dd/yyyy).
     * @param endDate The end date of the range (MM/dd/yyyy).
     * @return List of employees hired within the specified date range.
     * @throws IllegalArgumentException If the date format is invalid.
     */
    public List<Employee> getEmployeeByDateRange(String startDate, String endDate) {
        logger.debug("Fetching employees hired between {} and {}", startDate, endDate);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");

        LocalDate start;
        LocalDate end;
        try {
            start = LocalDate.parse(startDate, formatter);
            end = LocalDate.parse(endDate, formatter);
        } catch (Exception e) {
            logger.error("Invalid date format. Please use MM/dd/yyyy.", e);
            throw new IllegalArgumentException("Invalid date format. Please use MM/dd/yyyy.");
        }

        // Filtering employees based on hire date range
        return employeeList.stream()
                .filter(employee -> {
                    try {
                        LocalDate hireDate = LocalDate.parse(employee.getHireDate(), formatter);
                        return (hireDate.isAfter(start) || hireDate.isEqual(start)) &&
                                (hireDate.isBefore(end) || hireDate.isEqual(end));
                    } catch (Exception e) {
                        return false;  // In case of invalid hire date in the data
                    }
                })
                .sorted(Comparator.comparing(employee -> LocalDate.parse(employee.getHireDate(), formatter)))  // Sort by hire date
                .collect(Collectors.toList());
    }

    /**
     * Creates a new employee.
     *
     * @param employee The employee to create.
     * @throws IllegalArgumentException If an employee with the same ID already exists or if any direct report IDs are invalid.
     */
    public void createEmployee(@Validated @RequestBody Employee employee) {
        logger.debug("Creating new employee with ID: {}", employee.getId());
        Optional<Employee> existingEmployee = employeeList.stream()
                .filter(emp -> emp.getId() == employee.getId())
                .findFirst();

        if (existingEmployee.isPresent()) {
            logger.error("Employee with ID {} already exists.", employee.getId());
            throw new IllegalArgumentException("Employee with ID " + employee.getId() + " already exists.");
        }

        for (Integer directReportId : employee.getDirectReports()) {
            boolean reportExists = employeeList.stream()
                    .anyMatch(emp -> emp.getId() == directReportId);
            if (!reportExists) {
                logger.error("Invalid direct report ID: {}", directReportId);
                throw new IllegalArgumentException("Invalid direct report ID: " + directReportId);
            }
        }

        employeeList.add(employee);
        saveData();
        logger.info("Employee with ID {} created successfully.", employee.getId());
    }

    private void saveData() {
        try {
            obj.writeValue(new File(path), employeeList);
            logger.info("Employee data saved successfully.");
        } catch (IOException e) {
            logger.error("Failed to save employee data to file", e);
            throw new RuntimeException("Failed to save employee data to file", e);
        }
    }
}