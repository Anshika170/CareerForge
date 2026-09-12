import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dark mode state and update body class', () => {
    const bodyClassList = document.body.classList;
    bodyClassList.remove('dark-mode');

    component.toggleTheme();

    expect(component.isDarkMode).toBeTrue();
    expect(bodyClassList.contains('dark-mode')).toBeTrue();

    component.toggleTheme();

    expect(component.isDarkMode).toBeFalse();
    expect(bodyClassList.contains('dark-mode')).toBeFalse();
  });
});
