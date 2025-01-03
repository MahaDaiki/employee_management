import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeCardComponent } from './employee-card/employee-card.component';
import { MessageComponent } from './message/message.component';
import { HighlightDirective } from './highlight.directive';
import { FormatDatePipe } from './format-date.pipe';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeCardComponent,
    EmployeeFormComponent,
    MessageComponent,
    HighlightDirective,
    FormatDatePipe
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    ReactiveFormsModule
  ]
})
export class EmployeesModule { }
