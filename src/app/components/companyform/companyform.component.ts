import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-companyform',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './companyform.component.html',
  styleUrl: './companyform.component.scss',
})
export class CompanyformComponent {
  companyForm: any;
  @Output() closed = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private chartService: ChartService) {
    this.createForm();
  }
  onClose() {
    this.closed.emit(); // Emit the "closed" event
  }

  createForm() {
    this.companyForm = this.fb.group({
      name: [''],
      employees: [],
    });
  }

  onSubmit() {
    this.chartService.addCompany(this.companyForm.value);
    this.companyForm.reset();
  }

  onCancel() {
    this.companyForm.reset();
  }
}
