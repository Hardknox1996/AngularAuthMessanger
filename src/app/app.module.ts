import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './cv/home/home.component';
import { LoginComponent } from './ch/login/login.component';
import { DashComponent } from './ch/dash/dash.component';
import { RegisterComponent } from './ch/register/register.component';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { RouterModule } from '@angular/router';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';




import { AngularFireModule } from '@angular/fire/compat';
import { ProfileComponent } from './ch/profile/profile.component';
import { DashHomeComponent } from './ch/dash/dash-home/dash-home.component';
import { ErrorHomeComponent } from './error-home/error-home.component';


// For Dialogs
import { 
  AllDialogsComponent, 
  verifyEmail,
  emailVerificationSent,
  accessToDashInvalid
} from './dialogs/all-dialogs/all-dialogs.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ResetPassComponent } from './ch/reset-pass/reset-pass.component';
import { HttpClientModule } from '@angular/common/http';
import { MessagecenterComponent } from './ch/dash/messagecenter/messagecenter.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashComponent,
    RegisterComponent,
    ProfileComponent,
    DashHomeComponent,
    ErrorHomeComponent,
    AllDialogsComponent,
    accessToDashInvalid,
    
    verifyEmail,
    emailVerificationSent,
    ResetPassComponent,
    MessagecenterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LazyLoadImageModule,

    MatSidenavModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    MatProgressBarModule,
    MatDialogModule,
    MatGridListModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireStorageModule,
    HttpClientModule,
    MatTooltipModule,
    MatBadgeModule,
    
    
    

    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [AuthService, AuthGuard, MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    private auth: AuthService,
  ) { 

    
  }

}



