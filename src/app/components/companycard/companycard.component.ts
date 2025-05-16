import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeformComponent } from '../employeeform/employeeform.component';
import { EmployeecardComponent } from '../employeecard/employeecard.component';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-companycard',
  imports: [CommonModule, EmployeeformComponent, EmployeecardComponent],
  templateUrl: './companycard.component.html',
  styleUrl: './companycard.component.scss',
})
export class CompanycardComponent {
  @Input() company: any;
  @Output() deleteCompany = new EventEmitter<number>();
  showEmployeeForm = false;
  selectedCompany: any;

  constructor(private chart: ChartService) {}

  deleteCompanyHandler(companyId: number) {
    this.deleteCompany.emit(companyId);
  }

  openAddEmployeeForm(company: any) {
    this.showEmployeeForm = true;
    this.selectedCompany = company;
  }

  deleteEmployeeHandler(employeeId: number) {
    this.chart.removeEmployeeFromCompany(this.company.id, employeeId);
  }
}
