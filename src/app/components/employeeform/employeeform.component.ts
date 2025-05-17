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
  @Input() cmd: string = '';
  @Output() closed = new EventEmitter<void>();

  employeeForm: any;
  constructor(private fb: FormBuilder, private chartService: ChartService) {
    this.createForm();
  }

  ngOnInit(){
    //patch value
    if(this.employee && this.cmd == "edit"){
      this.employeeForm.patchValue({
        first_name: this.employee.first_name,
        last_name: this.employee.last_name,
        role: this.employee.role,
        id: this.employee.id,
        //address
        address: {
          street: this.employee.address.street,
          street_2: this.employee.address.street_2,
          city: this.employee.address.city,
          country: this.employee.address.country,
        },
      });
    }
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
  if (typeof this.employee == 'undefined') {
    //add to company
    this.chartService.addEmployeeToCompany(
      this.company.id,
      this.employeeForm.value
    );
  } else {
    if(this.cmd == "edit"){
      //edit employee
      this.chartService.editEmployee(
        this.employee.id,
        this.employeeForm.value
      );
    }else{
      //add to parent employee
      this.chartService.addEmployeetoEmployee(
        this.company.id,
        this.employee.id,
        this.employeeForm.value
      );
    }
    
  }

  this.employeeForm.reset();
}

}
