import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashHomeComponent } from './ch/dash/dash-home/dash-home.component';
import { DashComponent } from './ch/dash/dash.component';
import { MessagecenterComponent } from './ch/dash/messagecenter/messagecenter.component';
import { LoginComponent } from './ch/login/login.component';
import { ProfileComponent } from './ch/profile/profile.component';
import { RegisterComponent } from './ch/register/register.component';
import { ResetPassComponent } from './ch/reset-pass/reset-pass.component';
import { HomeComponent } from './cv/home/home.component';
import { ErrorHomeComponent } from './error-home/error-home.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "login", component: LoginComponent
  },
  {
    path: "signup", component: RegisterComponent
  },
  {
    path: 'resetpass', component: ResetPassComponent
  },
  {
    path: "dash", component: DashComponent,  canActivate:[AuthGuard],
    children: [
      {
        path: '',
        component: DashHomeComponent 
      },
      {
        path: 'profile',
        component: ProfileComponent 
      },
      {
        path: 'messagecenter',
        component: MessagecenterComponent 
      },
    ],
  },
  {
    path: "**", component: ErrorHomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
