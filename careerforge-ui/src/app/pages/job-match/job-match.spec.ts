import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobMatch } from './job-match';

describe('JobMatch', () => {
  let component: JobMatch;
  let fixture: ComponentFixture<JobMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobMatch],
    }).compileComponents();

    fixture = TestBed.createComponent(JobMatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
