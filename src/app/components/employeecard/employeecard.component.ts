import { EventEmitter, Input, Output } from '@angular/core';
import { Component } from '@angular/core';
import { EmployeeformComponent } from '../employeeform/employeeform.component';
import { CommonModule } from '@angular/common';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-employeecard',
  imports: [EmployeeformComponent, CommonModule],
  templateUrl: './employeecard.component.html',
  styleUrl: './employeecard.component.scss',
})
export class EmployeecardComponent {
  @Input() employee: any;
  @Input() company: any;
  @Output() deleteEmployee = new EventEmitter<number>();
  showEmployeeForm = false;
  cmd = "";

  constructor(private chart: ChartService) {}

  deleteEmployeeHandler(employeeId: number) {
    this.deleteEmployee.emit(employeeId);
  }

  onDeleteEmployee(employeeId: number) {
    this.chart.removeEmployeeById(employeeId);
  }

  openAddEmployeeForm() {
    this.showEmployeeForm = true;
    this.cmd = "add";	
  }

  openEditEmployeeForm() {
    this.showEmployeeForm = true;
    this.cmd = "edit";
  }
}
