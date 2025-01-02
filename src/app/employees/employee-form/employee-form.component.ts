import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: false,

  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
  employeeForm!: FormGroup;
  message: string | null = null;
  messageType: 'success' | 'error' = 'error';

  constructor(
    private form: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void {
    this.employeeForm = this.form.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dateOfHiring: ['', [Validators.required]],
      postOccupied: ['', [Validators.required]]
    });
  }
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = this.employeeForm.value;
      this.employeeService.addEmployee(employeeData).subscribe(
        ({ employee, message }) => {
          this.message = message;
          this.messageType = 'success';
          this.router.navigate(['/employees']);
        },
        (error) => {
          this.message = 'Error adding employee. Please try again.';
          this.messageType = 'error';
        }
      );
    } else {
      this.message = 'Please fix the form errors.';
      this.messageType = 'error';
    }
  }
}
