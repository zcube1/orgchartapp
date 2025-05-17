import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() company: any;

  constructor(private fb: FormBuilder, private chartService: ChartService) {
    this.createForm();
  }
  onClose() {
    this.closed.emit(); // Emit the "closed" event
  }
  
  ngOnInit(){
    //patch value
    if(this.company){
      this.companyForm.patchValue({
        name: this.company.name,
        id: this.company.id,
        employees: this.company.employees
      });
    }
  }

  createForm() {
    this.companyForm = this.fb.group({
        name: [''],
        employees: [],
        id: [''],
      });
    
  }

  onSubmit() {
    
    if(this.company){
      this.chartService.updateCompany(this.companyForm.value);
    }else{
      
      this.chartService.addCompany(this.companyForm.value);
      this.companyForm.reset();
    }
    
  }

  onCancel() {
    this.companyForm.reset();
  }
}
