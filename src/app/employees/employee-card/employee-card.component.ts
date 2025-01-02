import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Employee} from '../employee.model';

@Component({
  selector: 'app-employee-card',
  standalone: false,
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() delete = new EventEmitter<number>();

  onDelete(): void {
    if (this.employee.id) {
      this.delete.emit(this.employee.id);
    }
  }
}
