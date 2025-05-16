import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanycardComponent } from './companycard.component';

describe('CompanycardComponent', () => {
  let component: CompanycardComponent;
  let fixture: ComponentFixture<CompanycardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanycardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
