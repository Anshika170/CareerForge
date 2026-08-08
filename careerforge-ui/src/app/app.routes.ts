import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Resume } from './pages/resume/resume';
import { Analysis } from './pages/analysis/analysis';

export const routes: Routes = [
      {
    path: 'login',
    component: Login
  },
   {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
  path: 'resume',
  component: Resume
},
{
  path: 'analysis',
  component: Analysis
}
];
