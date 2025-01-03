import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: Employee[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' = 'error';
  constructor(private employeeService: EmployeeService,  private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (employees) => {
        this.employees = employees;
      },
      (error) => {
        this.message = 'Error loading employees.';
        this.messageType = 'error';
      }
    );
  }

  deleteEmployee(id: number | undefined): void {
    if (id) {
      this.employeeService.deleteEmployee(id).subscribe(
        ({ message }) => {
          this.message = message;
          this.messageType = 'success';
          this.loadEmployees();
        },
        (error) => {
          this.message = 'Error deleting employee.';
          this.messageType = 'error';
        }
      );
    } else {
      this.message = 'Employee ID is invalid.';
      this.messageType = 'error';
    }
  }
  editEmployee(employee: Employee): void {
    if (employee.id) {
      this.router.navigate(['/employees', employee.id]);
    } else {
      this.message = 'Employee ID is invalid.';
      this.messageType = 'error';
    }
  }
}
