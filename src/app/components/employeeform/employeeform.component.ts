import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-employeeform',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './employeeform.component.html',
  styleUrl: './employeeform.component.scss',
})
export class EmployeeformComponent {
  @Input() company: any;
  @Input() employee: any;
  @Output() closed = new EventEmitter<void>();

  employeeForm: any;
  constructor(private fb: FormBuilder, private chartService: ChartService) {
    this.createForm();
  }

  createForm() {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: ['', Validators.required],
      address: this.fb.group({
        street: [''],
        street_2: [''],
        city: [''],
        country: [
          '',
          [Validators.required, Validators.pattern(/^(NZ|AU|UK)$/)],
        ],
      }),
    });
  }
  onClose() {
    this.closed.emit(); // Emit the "closed" event
  }
  onSubmit() {
    if (this.employee) {
      this.chartService.addEmployeetoEmployee(
        this.company.id,
        this.employee.id,
        this.employeeForm.value
      );
    } else {
      this.chartService.addEmployeeToCompany(
        this.company.id,
        this.employeeForm.value
      );
    }

    this.employeeForm.reset();
  }
}
