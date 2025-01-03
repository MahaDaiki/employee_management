import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { of, throwError } from 'rxjs';

describe('EmployeeService', () => {
  let service: EmployeeService;

  const mockEmployees: Employee[] = [
    { id: 1, fullName: 'test1', email: 'test1@example.com', phoneNumber: '1234567890', dateOfHiring: new Date('2022-01-01'), postOccupied: 'Manager' },
    { id: 2, fullName: 'test2', email: 'test2@example.com', phoneNumber: '0987654321', dateOfHiring: new Date('2021-05-20'), postOccupied: 'Developer' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService],
    });
    service = TestBed.inject(EmployeeService);

    spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify(mockEmployees));
    spyOn(localStorage, 'setItem').and.callFake(() => {});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of employees', (done) => {
    service.getEmployees().subscribe((employees) => {
      const expectedEmployees = mockEmployees.map(emp => ({
        ...emp,
        dateOfHiring: new Date(emp.dateOfHiring).getTime()
      }));
      const result = employees.map(emp => ({
        ...emp,
        dateOfHiring: new Date(emp.dateOfHiring).getTime()
      }));
      expect(result).toEqual(expectedEmployees);
      done();
    });
  });
  it('should add a new employee successfully', (done) => {
    const newEmployee: Employee = {
      id: 0,
      fullName: 'test',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      dateOfHiring: new Date('2023-01-01'),
      postOccupied: 'Designer'
    };

    service.addEmployee(newEmployee).subscribe(response => {
      expect(response.message).toBe('Employee added successfully!');
      done();
    });
  });

  it('should throw an error for invalid employee data', (done) => {
    const invalidEmployee: Employee = {
      id: 0,
      fullName: '',
      email: 'invalidemail',
      phoneNumber: '123',
      dateOfHiring: new Date('2023-01-01'),
      postOccupied: ''
    };

    service.addEmployee(invalidEmployee).subscribe(
      () => {},
      (error) => {
        expect(error.message).toContain('Full name is required.');
        expect(error.message).toContain('Invalid email format.');
        expect(error.message).toContain('Phone number should have exactly 10 digits.');
        expect(error.message).toContain('The post occupied cannot be empty.');
        done();
      }
    );
  });

  it('should update an existing employee successfully', (done) => {
    const updatedEmployee: Employee = {
      id: 1,
      fullName: 'test Updated',
      email: 'testupdated@example.com',
      phoneNumber: '1112223333',
      dateOfHiring: new Date('2022-01-01'),
      postOccupied: 'Senior Manager'
    };

    service.updateEmployee(updatedEmployee).subscribe(response => {
      expect(response.message).toBe('Employee updated successfully!');
      done();
    });
  });

  it('should throw an error if employee not found for update', (done) => {
    const nonExistentEmployee: Employee = {
      id: 999,
      fullName: 'Non Existent Employee',
      email: 'nonexistent@example.com',
      phoneNumber: '0000000000',
      dateOfHiring: new Date('2022-01-01'),
      postOccupied: 'Non-existent'
    };

    service.updateEmployee(nonExistentEmployee).subscribe(
      () => {},
      (error) => {
        expect(error.message).toBe('Employee not found.');
        done();
      }
    );
  });

  it('should delete an employee successfully', (done) => {
    service.deleteEmployee(1).subscribe(response => {
      expect(response.message).toBe('Employee deleted successfully!');
      done();
    });
  });

  it('should return errors for invalid employee data', () => {
    const invalidEmployee: Employee = {
      id: 0,
      fullName: '',
      email: 'invalidemail',
      phoneNumber: '123',
      dateOfHiring: new Date('2023-01-01'),
      postOccupied: ''
    };

    const errors = service.validateEmployeeData(invalidEmployee);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('Full name is required.');
    expect(errors).toContain('Invalid email format.');
    expect(errors).toContain('Phone number should have exactly 10 digits.');
    expect(errors).toContain('The post occupied cannot be empty.');
  });

  it('should return an empty array for valid employee data', () => {
    const validEmployee: Employee = {
      id: 0,
      fullName: 'testn',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      dateOfHiring: new Date('2023-01-01'),
      postOccupied: 'Developer'
    };

    const errors = service.validateEmployeeData(validEmployee);
    expect(errors.length).toBe(0);
  });
});
