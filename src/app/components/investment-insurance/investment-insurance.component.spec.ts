import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentInsuranceComponent } from './investment-insurance.component';

describe('InvestmentInsuranceComponent', () => {
  let component: InvestmentInsuranceComponent;
  let fixture: ComponentFixture<InvestmentInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentInsuranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
