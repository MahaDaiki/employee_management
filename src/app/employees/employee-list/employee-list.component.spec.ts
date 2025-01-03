import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Employee } from '../employee.model';
import { EmployeeListComponent } from './employee-list.component';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', [
      'getEmployees',
      'deleteEmployee',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on initialization', () => {
    const mockEmployees: Employee[] = [
      {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        dateOfHiring: new Date('2022-01-01'),
        postOccupied: 'Developer',
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phoneNumber: '0987654321',
        dateOfHiring: new Date('2021-05-20'),
        postOccupied: 'Designer',
      },
    ];
    mockEmployeeService.getEmployees.and.returnValue(of(mockEmployees));

    component.ngOnInit();

    expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
  });

  it('should display an error message if loading employees fails', () => {
    mockEmployeeService.getEmployees.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.message).toBe('Error loading employees.');
    expect(component.messageType).toBe('error');
  });

  it('should delete an employee and reload employees', () => {
    mockEmployeeService.deleteEmployee.and.returnValue(of({ message: 'Employee deleted successfully' }));
    spyOn(component, 'loadEmployees');

    component.deleteEmployee(1);

    expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(1);
    expect(component.message).toBe('Employee deleted successfully');
    expect(component.messageType).toBe('success');
    expect(component.loadEmployees).toHaveBeenCalled();
  });

  it('should display an error message if deleting an employee fails', () => {
    mockEmployeeService.deleteEmployee.and.returnValue(throwError(() => new Error('Error')));

    component.deleteEmployee(1);

    expect(component.message).toBe('Error deleting employee.');
    expect(component.messageType).toBe('error');
  });

  it('should display an error message if the employee ID is invalid', () => {
    component.deleteEmployee(undefined);

    expect(component.message).toBe('Employee ID is invalid.');
    expect(component.messageType).toBe('error');
  });

  it('should navigate to the edit route if employee ID is valid', () => {
    const employee: Employee = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      dateOfHiring: new Date('2022-01-01'),
      postOccupied: 'Developer',
    };

    component.editEmployee(employee);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees', 1]);
  });

  it('should display an error message if the employee ID is invalid', () => {
    const employee: Employee = {
      id: undefined,
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      dateOfHiring: new Date('2022-01-01'),
      postOccupied: 'Developer',
    };

    component.editEmployee(employee);

    expect(component.message).toBe('Employee ID is invalid.');
    expect(component.messageType).toBe('error');
  });
});
