import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Cookies service
import { CookieModule } from 'ngx-cookie';

// Angular authentification
import { JwtModule } from '@auth0/angular-jwt';

// Reactive forms
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Angular material
import { MatInputModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';

// Components of the web app
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { UserInfoComponent } from './component/user-info/user-info.component';
import { TeamsComponent } from './component/teams/teams.component';
import { TopBarComponent } from './component/top-bar/top-bar/top-bar.component';
import { SideBarComponent } from './component/side-bar/side-bar/side-bar.component';
import { DialogComponent, DialogContentComponent } from './component/dialog/dialog/dialog.component';
import { SnackBarComponent } from './component/snackBar/snack-bar/snack-bar.component';
import { ClassificationsComponent } from './component/classifications/classifications/classifications.component';
import { GamesComponent } from './component/games/games/games.component';
import { DataPickerComponent } from './component/data-picker/data-picker/data-picker.component';
import { IndividualsComponent } from './component/individuals/individuals/individuals.component';
import { FirebaseDemoComponent } from './component/firebaseDemo/firebase-demo/firebase-demo.component';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserInfoComponent,
    TeamsComponent,
    TopBarComponent,
    SideBarComponent,
    DialogComponent,
    DialogContentComponent,
    SnackBarComponent,
    ClassificationsComponent,
    GamesComponent,
    DataPickerComponent,
    IndividualsComponent,
    FirebaseDemoComponent
  ],
  entryComponents: [DialogContentComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // angular material
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    // firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    CookieModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:3001'],
        blacklistedRoutes: ['localhost:3001/auth/']
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
