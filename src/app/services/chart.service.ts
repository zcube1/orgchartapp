import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private companiesSubject = new BehaviorSubject<any[]>([]);
  companies$ = this.companiesSubject.asObservable();

  private requestQueueSubject = new BehaviorSubject<any[]>([]);
  requestQueue$ = this.requestQueueSubject.asObservable();
  private _toProcessQueue = new BehaviorSubject<boolean>(true);
  toProcessQueue$ = this._toProcessQueue.asObservable();
  
  constructor(private http:HttpService) {
    this.init();
  }

  private init() {
    const companies = localStorage.getItem('companies');
    if (companies) {
      this.companiesSubject.next(JSON.parse(companies));
    } else {
      this.companiesSubject.next([]);
    }

    //queues
    const savedQueue = localStorage.getItem('queues');
    if (savedQueue) {
      this.requestQueueSubject.next(JSON.parse(savedQueue));
    }
    this.processQueue();
  }

  private addQueue(processType: string, jsondata: any) {
    const current = this.requestQueueSubject.getValue();
    const unique_id = this.generateUniqueId();
    const newItem = {
      process: processType,
      data: jsondata,
      created_at: Date.now(),
      id: unique_id
    };
    
    const updated = [...current, newItem];
    this.requestQueueSubject.next(updated);
    localStorage.setItem('queues', JSON.stringify(updated));
  }

  private removeQueue(id: number) {
    const updated = this.requestQueueSubject.getValue().filter((e: any) => e.id !== id);
    this.requestQueueSubject.next(updated);
    localStorage.setItem('queues', JSON.stringify(updated));
  }


  setQueueProcessing(enabled: boolean) {
    this._toProcessQueue.next(enabled);
  }
  
  private processQueue() {
    setInterval(async () => {
      if (!this._toProcessQueue.getValue()) return;

      const queue = this.requestQueueSubject.getValue();
      if (queue.length === 0) return;

      const item = queue[0];

      console.log('Processing item:', item);

      try {
        await this.handleProcess(item);
        this.removeQueue(item.id);
      } catch (error) {
        console.error('Error processing item:', error);
      }
    }, 5000);
  }

  private async handleProcess(item: any): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Processed:', item);
        resolve();
      }, 1000); // simulate 1s task
    });
  }


  async addCompany(company: any) {
    const current = this.companiesSubject.getValue();
    //generate a unique id for the company
    company.id = current.length + 1;
    //generate a unique id for the employees
    if (!company.employees) {
      company.employees = [];
    } else {
      company.employees = company.employees.map((employee: any) => {
        employee.id = current.length + 1;
        return employee;
      });
    }
    company.employees = company.employees.map((employee: any) => {
      employee.id = current.length + 1;
      return employee;
    });

    const updated = [...current, company];
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    //add to queue
    this.addQueue("add company",company);
  }

  async updateCompany(company: any) {
    const current = this.companiesSubject.getValue();
    const updated = current.map((c) => (c.id === company.id ? company : c));
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    this.addQueue("update company",company);
  }

  async removeCompany(companyId: number) {
    const current = this.companiesSubject.getValue();
    const updated = current.filter((c) => c.id !== companyId);
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));

    let jsondata ={"id":companyId};
    this.addQueue("add company",jsondata);
  }

  generateUniqueId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  async addEmployeeToCompany(companyId: number, employee: any) {
    const current = this.companiesSubject.getValue();
    const newEmployeeId = this.generateUniqueId();
    const employeeWithId = { ...employee, id: newEmployeeId };

    const updated = current.map((c) =>
      c.id === companyId
        ? { ...c, employees: [...c.employees, employeeWithId] }
        : c
    );
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    let jsondata = {
      "companyId":companyId,
      "employeeData":employee
    }
    this.addQueue("add employee to company",jsondata);
  }

  async addEmployeetoEmployee(
    companyId: number,
    managerId: number,
    newEmployee: any
  ) {
    const current = this.companiesSubject.getValue();

    const assignId = (emp: any) => ({
      ...emp,
      id: this.generateUniqueId(),
      employees: [],
    });

    const addToManager = (employees: any[]): any[] =>
      employees.map((emp) => {
        if (emp.id === managerId) {
          return {
            ...emp,
            employees: [...(emp.employees || []), assignId(newEmployee)],
          };
        }

        if (emp.employees?.length) {
          return {
            ...emp,
            employees: addToManager(emp.employees),
          };
        }

        return emp;
      });

    const updated = current.map((c) =>
      c.id === companyId
        ? { ...c, employees: addToManager(c.employees || []) }
        : c
    );

    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));

    let jsondata= {
      "parentEmployeeId":managerId,
      "employeeData":newEmployee
    }
    this.addQueue("add employee to employee",jsondata);
  }

  async removeEmployeeFromCompany(companyId: number, employeeId: number) {
    const current = this.companiesSubject.getValue();
    const updated = current.map((c) =>
      c.id === companyId
        ? {
            ...c,
            employees: c.employees.filter(
              (e: { id: number }) => e.id !== employeeId
            ),
          }
        : c
    );
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    let jsondata= {
      "id":employeeId
    }
    this.addQueue("remove employee",jsondata);
  }




 removeEmployeeRecursive(employees: any[], employeeIdToRemove: number): any[] {
  return employees
    .filter(employee => employee.id !== employeeIdToRemove)
    .map(employee => ({
      ...employee,
      employees: this.removeEmployeeRecursive(employee.employees || [], employeeIdToRemove)
    }));
}

async removeEmployeeById(employeeIdToRemove: number) {
  const currentCompanies = this.companiesSubject.getValue();

  const updatedCompanies = currentCompanies.map(company => ({
    ...company,
    employees: this.removeEmployeeRecursive(company.employees || [], employeeIdToRemove)
  }));

  this.companiesSubject.next(updatedCompanies);
  localStorage.setItem('companies', JSON.stringify(updatedCompanies));
  let jsondata ={
    "id":employeeIdToRemove
  }
  this.addQueue("remove employee",jsondata);
}


  async updateEmployeeInCompany(companyId: number, employee: any) {
    const current = this.companiesSubject.getValue();
    const updated = current.map((c) =>
      c.id === companyId
        ? {
            ...c,
            employees: c.employees.map((e: { id: number }) =>
              e.id === employee.id ? employee : e
            ),
          }
        : c
    );

    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));

    this.addQueue("update employee",employee);
  }


  updateEmployeeRecursive(
    employees: any[],
    employeeIdToUpdate: number,
    updatedData: Partial<any>
  ): any[] {
    return employees.map(employee => {
      if (employee.id === employeeIdToUpdate) {
        // Merge existing employee data with updated data
        return {
          ...employee,
          ...updatedData,
          employees: this.updateEmployeeRecursive(employee.employees || [], employeeIdToUpdate, updatedData)
        };
      } else {
        // Recurse into children anyway to catch nested matches
        return {
          ...employee,
          employees: this.updateEmployeeRecursive(employee.employees || [], employeeIdToUpdate, updatedData)
        };
      }
    });
  }

  async editEmployee(employeeIdToUpdate: number, updatedData: Partial<any>) {
    const currentCompanies = this.companiesSubject.getValue();

    const updatedCompanies = currentCompanies.map(company => ({
      ...company,
      employees: this.updateEmployeeRecursive(company.employees || [], employeeIdToUpdate, updatedData)
    }));

    this.companiesSubject.next(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    this.addQueue("update employee",updatedData);
  }


  async resetCompany(){
    const current = this.companiesSubject.getValue();
    const updated = current.map((c) => {
      c.employees = [];
      return c;
    });
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    

    
  }
}
