import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './component/login/login.component'
import { RegisterComponent } from './component/register/register.component'
import { EditComponent } from './component/edit/edit.component'
import { UserInfoComponent } from './component/user-info/user-info.component';
import { TeamsComponent } from './component/teams/teams.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'edit', component:EditComponent},
  { path: 'userinfo', component:UserInfoComponent},
  { path: 'teams', component: TeamsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



