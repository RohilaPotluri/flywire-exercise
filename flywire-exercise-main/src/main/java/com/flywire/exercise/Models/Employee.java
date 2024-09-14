package com.flywire.exercise.Models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Represents employee with details.
 */
@Getter
@Setter
public class Employee {

    /**
     * Unique identifier for employee.
     */
    private int id;

    /**
     * Name of employee.
     */
    private String name;

    /**
     * Position of employee.
     */
    private String position;

    /**
     * Hire date of employee in MM/dd/yyyy format.
     */
    private String hireDate;

    /**
     * List of IDs representing direct reports of this employee.
     */
    private List<Integer> directReports;

    /**
     * List of names representing direct reports of this employee.
     */
    private List<String> directReportNames;

    /**
     * Indicates if the employee is currently active.
     */
    private boolean active;
}
