import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagecenterComponent } from './messagecenter.component';

describe('MessagecenterComponent', () => {
  let component: MessagecenterComponent;
  let fixture: ComponentFixture<MessagecenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagecenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagecenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
