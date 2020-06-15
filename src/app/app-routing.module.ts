import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './features/authentication/login/login.component';
import { DashboardComponent } from './features/kanban/dashboard/dashboard.component';
import { RegistrationComponent } from './features/authentication/registration/registration.component';
import { AuthGuard } from './shared/services/auth.guard.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },

  { path: '*', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
