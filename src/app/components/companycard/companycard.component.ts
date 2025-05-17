import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeformComponent } from '../employeeform/employeeform.component';
import { EmployeecardComponent } from '../employeecard/employeecard.component';
import { ChartService } from '../../services/chart.service';
import { CompanyformComponent } from '../companyform/companyform.component';

@Component({
  selector: 'app-companycard',
  imports: [CommonModule, EmployeeformComponent, EmployeecardComponent,CompanyformComponent],
  templateUrl: './companycard.component.html',
  styleUrl: './companycard.component.scss',
})
export class CompanycardComponent {
  @Input() company: any;
  @Output() deleteCompany = new EventEmitter<number>();
  showEmployeeForm = false;
  showCompanyForm = false;
  selectedCompany: any;
  cmd:string ="";

  constructor(private chart: ChartService) {}

  deleteCompanyHandler(companyId: number) {
    this.deleteCompany.emit(companyId);
  }

  openAddEmployeeForm(company: any) {
    this.showEmployeeForm = true;
    this.selectedCompany = [];
  }

  openEditCompanyForm(company: any) {
    this.showCompanyForm = true;
    this.selectedCompany = company;
    this.cmd = "edit";
  }

  deleteEmployeeHandler(employeeId: number) {
    this.chart.removeEmployeeFromCompany(this.company.id, employeeId);
  }
}
