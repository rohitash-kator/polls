import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivePollsComponent } from './live-polls.component';

describe('LivePollsComponent', () => {
  let component: LivePollsComponent;
  let fixture: ComponentFixture<LivePollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivePollsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivePollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
