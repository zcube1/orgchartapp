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
  title = 'Org Chart Demo';
  showCompanyForm = false;

  companies: any[] = [];
  requestQueues:any[] = [];
  toProcessQueue = false;

  constructor(private chartService: ChartService) {
    this.chartService.companies$.subscribe((companies) => {
      this.companies = companies;
    });

    this.chartService.requestQueue$.subscribe((queues)=>{
      this.requestQueues = queues;
    });

    this.chartService.setQueueProcessing(this.toProcessQueue);
  }

  toggleQueue(event: any) {
    this.toProcessQueue = event.target.checked;
    this.chartService.setQueueProcessing(this.toProcessQueue);
  }

  openCompanyForm() {
    this.showCompanyForm = true;
  }

  onDeleteCompany(id: number) {
    this.chartService.removeCompany(id);
  }
}
