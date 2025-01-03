import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { ActivatedRoute,Router } from '@angular/router';

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
  employeeId: number | null = null;

  constructor(
    private form: FormBuilder,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.employeeId = params['id'] ? +params['id'] : null;
      this.createForm();

      if (this.employeeId) {

        this.loadEmployeeDetails(this.employeeId);
      }
    });
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
  loadEmployeeDetails(employeeId: number): void {
    this.employeeService.getEmployees().subscribe(employees => {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        this.employeeForm.patchValue(employee);
      } else {
        this.message = 'Employee not found!';
        this.messageType = 'error';
      }
    });
  }
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = this.employeeForm.value;
      if (this.employeeId) {
        // Update
        this.employeeService.updateEmployee({ ...employeeData, id: this.employeeId }).subscribe(
            ({ employee, message }) => {
              this.message = message;
              this.messageType = 'success';
              this.router.navigate(['/employees']);
            },
            error => {
              this.message = error.message;
              this.messageType = 'error';
            }
        );
      } else {
        // Add  employee
        this.employeeService.addEmployee(employeeData).subscribe(
            ({ employee, message }) => {
              this.message = message;
              this.messageType = 'success';
              this.router.navigate(['/employees']);
            },
            error => {
              this.message = error.message;
              this.messageType = 'error';
            }
        );
      }
    } else {
      this.message = 'Please fix the form errors.';
      this.messageType = 'error';
    }
  }
}
