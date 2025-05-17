import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private companiesSubject = new BehaviorSubject<any[]>([]);
  companies$ = this.companiesSubject.asObservable();

  constructor() {
    this.init();
  }
  private init() {
    const companies = localStorage.getItem('companies');
    if (companies) {
      this.companiesSubject.next(JSON.parse(companies));
    } else {
      this.companiesSubject.next([]);
    }
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
  }

  async updateCompany(company: any) {
    const current = this.companiesSubject.getValue();
    const updated = current.map((c) => (c.id === company.id ? company : c));
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
  }

  async removeCompany(companyId: number) {
    const current = this.companiesSubject.getValue();
    const updated = current.filter((c) => c.id !== companyId);
    this.companiesSubject.next(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
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
