import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompanyformComponent } from './components/companyform/companyform.component';
import { CommonModule } from '@angular/common';
import { CompanycardComponent } from './components/companycard/companycard.component';
import { ChartService } from './services/chart.service';

@Component({
  selector: 'app-root',
  imports: [CompanyformComponent, CommonModule, CompanycardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Organization Chart App Demo';
  showCompanyForm = false;

  companies: any[] = [];

  constructor(private chartService: ChartService) {
    this.chartService.companies$.subscribe((companies) => {
      this.companies = companies;
      console.log('Companies:', this.companies);
    });
  }

  openCompanyForm() {
    this.showCompanyForm = true;
  }

  onDeleteCompany(id: number) {
    this.chartService.removeCompany(id);
  }
}
