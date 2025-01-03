import { Injectable } from '@angular/core';
import {Employee} from './employee.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 private localStorage = 'employees';
  private id: number = 1;
  constructor() {
    const employees = this.getEmployeesFromLocalStorage();
    if (employees.length > 0) {
      this.id = Math.max(...employees.map(emp => emp.id || 0)) + 1;
    }
  }
  private getEmployeesFromLocalStorage(): Employee[] {
    return JSON.parse(localStorage.getItem(this.localStorage) || '[]');
  }
  getEmployees(): Observable<Employee[]> {
    const employees = this.getEmployeesFromLocalStorage();
    return of(employees);
  }
  addEmployee(employee: Employee): Observable<{ employee: Employee; message: string }> {
    const errors = this.validateEmployeeData(employee);
    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    }
    const employees = this.getEmployeesFromLocalStorage();
    employee.id = this.id++;
    employees.push(employee);
    localStorage.setItem(this.localStorage, JSON.stringify(employees));
    return of({employee, message:'Employee added successfully!'});
  }
  updateEmployee(updatedEmployee: Employee): Observable<{ employee: Employee; message: string }> {
    const errors = this.validateEmployeeData(updatedEmployee);
    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    }
    const employees = this.getEmployeesFromLocalStorage();
    const index = employees.findIndex(emp => emp.id === updatedEmployee.id);

    if (index !== -1) {
      employees[index] = updatedEmployee;
      localStorage.setItem(this.localStorage, JSON.stringify(employees));
      return of({ employee: updatedEmployee, message: 'Employee updated successfully!' });
    }
    else{ return throwError(() => new Error('Employee not found.'));
    }
  }


  deleteEmployee(id: number): Observable<{ message: string }> {
    let employees = this.getEmployeesFromLocalStorage();
    employees = employees.filter(emp => emp.id !== id);

    localStorage.setItem(this.localStorage, JSON.stringify(employees));
    return of({ message: 'Employee deleted successfully!' });
  }
  validateEmployeeData(employee: Employee): string[] {
    const errors: string[] = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!employee.fullName.trim()) {
      errors.push('Full name is required.');
    }
    if (!emailPattern.test(employee.email)) {
      errors.push('Invalid email format.');
    }
    if (!phonePattern.test(employee.phoneNumber)) {
      errors.push('Phone number should have exactly 10 digits.');
    }
    if (new Date(employee.dateOfHiring) > new Date()) {
      errors.push('Hiring date cannot be in the future.');
    }
    if (!employee.postOccupied.trim()) {
      errors.push('The post occupied cannot be empty.');
    }

    return errors;
  }
}
