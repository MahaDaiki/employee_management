import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'addEmployee', 'updateEmployee']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params'], { params: of({ id: '1' }) });

    await TestBed.configureTestingModule({
      declarations: [EmployeeFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee details when employee ID is provided', () => {
    const mockEmployee = {
      id: 1,
      fullName: 'Test User',
      email: 'test.user@example.com',
      phoneNumber: '1234567890',
      dateOfHiring: new Date('2023-01-01'),
      postOccupied: 'Manager'
    };
    employeeService.getEmployees.and.returnValue(of([mockEmployee]));
    component.ngOnInit();
    expect(component.employeeForm.value.fullName).toBe(mockEmployee.fullName);
    expect(component.employeeForm.value.email).toBe(mockEmployee.email);
  });



  it('should call updateEmployee when form is submitted and employeeId is present', () => {
    component.employeeId = 1;
    const formValue = {
      fullName: 'Test Two',
      email: 'test.two@example.com',
      phoneNumber: '1231231234',
      dateOfHiring: new Date('2022-06-10'),
      postOccupied: 'HR'
    };
    component.employeeForm.setValue(formValue);

    employeeService.updateEmployee.and.returnValue(of({ employee: formValue, message: 'Employee updated successfully!' }));

    component.onSubmit();
    expect(employeeService.updateEmployee).toHaveBeenCalledWith({ ...formValue, id: 1 });

    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });


  it('should set error message when form is invalid', () => {

    component.employeeForm.setValue({
      fullName: '',
      email: '',
      phoneNumber: '',
      dateOfHiring: '',
      postOccupied: ''
    });


    component.onSubmit();

    expect(component.message).toBe('Please fix the form errors.');
    expect(component.messageType).toBe('error');
  });
});

