import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDialogsComponent } from './all-dialogs.component';

describe('AllDialogsComponent', () => {
  let component: AllDialogsComponent;
  let fixture: ComponentFixture<AllDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDialogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
