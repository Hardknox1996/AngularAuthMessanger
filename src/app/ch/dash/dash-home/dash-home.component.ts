import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { data } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { verifyEmail } from 'src/app/dialogs/all-dialogs/all-dialogs.component';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable, take } from 'rxjs';

@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.css']
})
export class DashHomeComponent implements OnInit {

  userData: any = this.auth.userData

  

  uid: any = ""
  displayName: any = ""
  email: any = ""
  photoURL: any = ""
  resetPhotoURL: any = ""
  accessToDash: any = ""
  emailVerified: any = ""
  birthDate: any = ""
  updateProfile: any = ""
  startDate: any


  constructor(public router: Router,
    private auth: AuthService,
    public afs: AngularFirestore,
    private mainApp: AppComponent,
    public dialog: MatDialog,
    public fireStorage: AngularFireStorage,) { }

  ngOnInit(): void {
    this.setValuesUpdated()
    this.auth.updatedUserData.subscribe((data) => {
      this.userData = this.auth.updateUserProfile()
      this.setValuesUpdated()

    })
  }
  setValuesUpdated() {

    this.uid = this.userData.uid
    this.displayName = this.userData.displayName || "User"
    this.email = this.userData.email
    this.photoURL = this.userData.photoURL || this.auth.userProfileImage
    this.resetPhotoURL = this.userData.photoURL || this.auth.userProfileImage
    this.accessToDash = this.userData.accessToDash
    this.emailVerified = this.userData.emailVerified
    this.birthDate = this.userData.birthDate

    let setBirthday = this.birthDate
    this.startDate = new Date(setBirthday)

  }
}
