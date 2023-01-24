import { Injectable, NgZone, Input, Output, EventEmitter } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { fireUser } from "./../auth/user"
import { getDatabase, ref, set, onValue } from "firebase/database";

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { NavigationStart, Router, Event, NavigationEnd } from '@angular/router';
import "firebase/auth";
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { accessToDashInvalid, emailVerificationSent, verifyEmail } from 'src/app/dialogs/all-dialogs/all-dialogs.component';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs';
import { DashComponent } from '../ch/dash/dash.component';
import { NgxImageCompressService } from "ngx-image-compress";
import { MessagecenterComponent } from '../ch/dash/messagecenter/messagecenter.component';


// import { SwUpdate, SwPush } from '@angular/service-worker';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() updatedUserData: EventEmitter<any> = new EventEmitter();
  @Output() updatedLoaderStatus: EventEmitter<any> = new EventEmitter();

  isLoggedIn: any;
  userData: any;
  canWeOpenLB: boolean = true
  onDocChange: any
  showHomeLoader: boolean = false

  currentChatOpen: any



  userProfileImage: any = "../assets/images/defaultProfile.jpg"

  userPrifileLoading: any = '../assets/images/loading.gif'

  noImage: any = '../assets/images/noimage.png'

  uploadDataPathProfile: any = "/projectData/uploadedData/profilePictures"

  thisUserDB: any


  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public imageCompress: NgxImageCompressService,
    // private mgsCenter: MessagecenterComponent,
    public router: Router) {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Show progress spinner or progress bar
        // console.log('Route change detected');

      }
    });

  }



  // isAuthenticated() {
  //   return this.userData;
  // }

  SignIn(email: any, password: any) {
    try {
      this.afAuth.fetchSignInMethodsForEmail(email).then(data => {
        if (data.length <= 0) {
          this.showToast(`${email} - email user is not exist.`, 'close')
        }
        else {
          this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then(result => {
              this.afAuth.authState.subscribe((user) => {
                if (user) {
                  this.loggedSucess();
                }
              });
            }).catch((error) => {
              this.SignOut()
              this.showToast('Please enter valid credentials', 'close')
            });
        }
      })


    } catch (err) {
      console.error(err);
    }
  }


  SignUp(email: any, password: any) {
    try {
      this.afAuth.fetchSignInMethodsForEmail(email).then(data => {
        if (data.length <= 0) {
          console.log('Creating User')
          this.afAuth.createUserWithEmailAndPassword(email, password).then(result => {
            this.showToast('User Createrd.', 'close', 'default');
            this.ngZone.run(() => {
              this.router.navigate(['/login'])
            })
          }).catch((error) => {
            console.log(error)
          });
        }
        else {
          this.showToast(`${email} - email id is already used.`, 'close')
        }
      })

    } catch (err) {
      console.error(err);
    }
    // console.log(email, password)
  }

  OAuthProvider(provider: any) {
    return this.afAuth.signInWithPopup(provider)
      .then((res) => {
        this.loggedSucess()
      }).catch((error) => {
        // window.alert(error)
      })
  }

  SigninWithGoogle() {
    return this.OAuthProvider(new auth.GoogleAuthProvider())
      .then(res => {
        console.log('Successfully logged in!')
      }).catch(error => {
        console.log(error)
      });
  }



  loggedSucess() {
    this.isLoggedIn = true
    this.ngZone.run(() => {
      this.router.navigate(['/dash'])
    })
  }
  // // Sign out
  SignOut() {
    this.isLoggedIn = false
    return this.afAuth.signOut().then((user) => {
      // this.afAuth.signOut();
      this.router.navigate(['/login']);
    });
  }


  showToast(mgs: any, btn: any, toastType: string = 'bg-danger') {
    this._snackBar.open(mgs, btn, {
      horizontalPosition: "end",
      verticalPosition: "bottom",
      duration: 4 * 1000,
      panelClass: toastType
    });
  }

  creatUserCollDefault() {

    console.log('Creating user')
    let userRef = this.afs.doc(`users/${this.userData.uid}`)
    let userData = {
      uid: this.userData.uid,
      email: this.userData.email,
      displayName: this.userData.displayName,
      photoURL: this.userData.photoURL,
      emailVerified: this.userData.emailVerified,
      accessToDash: true
    };
    this.checkUserInFSore()
    return userRef.set(userData, {
      merge: true,
    });
  }




  // .pipe(take(2))

  checkUserInFSore() {
    // console.log(1)
    try {
      this.afAuth.authState.pipe(take(1)).subscribe((user) => {
        if (user) {
          try {
            this.afs.collection('users').doc(this.userData.uid).valueChanges().pipe(take(1)).subscribe(val => {
              if (val) {
                let emailVerifedByGoogle = this.userData.emailVerified

                // console.log(emailVerifedByGoogle)

                this.userData = val
                // check users access
                // console.log(emailVerifedByGoogle, this.userData.emailVerified)
                if (!this.userData.emailVerified) {
                  if (emailVerifedByGoogle) {
                    console.log('notMatching')
                    let userData = {
                      emailVerified: emailVerifedByGoogle,
                    };
                    this.afs.doc(`users/${this.userData.uid}`).update(userData)
                  }
                  else {
                    if (user) {
                      this.verifyEmailDiaLog()
                    }

                  }
                }

                this.updatedUserData.emit(this.userData)

                console.log("UserUpdateFireStore \n", this.userData)
                if (emailVerifedByGoogle && !this.userData.accessToDash) {
                  this.accessToDashInvalid()
                }
              }
              else {
                console.log(1)
                this.creatUserCollDefault()

              }
            })
          } catch (err) {
            console.log(err)
          }
        }
      })
      this.showProgressBar(false)
    } catch (err) {
      console.log(err)
    }

  }






  // Update user in all components automactically
  updateUserProfile() {
    // // Use below line when service is going to update a vaiable
    // this.updatedUserData.emit(this.userData)
    return this.userData
  }

  updateUserMessangers() {
    // // Use below line when service is going to update a vaiable
    // this.updatedUserData.emit(this.userData)
    return this.userData
  }



  //////////////////////////// ALL DB CALL FUNCTIONS HERE //////////////////////////////////
  verifyEmailDiaLog() {
    if (this.canWeOpenLB) {
      let dialogRef = this.dialog.open(verifyEmail, {
        data: { name: this.userData.displayName, email: this.userData.email },
        disableClose: true
      });

      dialogRef.afterOpened().subscribe(result => {
        this.canWeOpenLB = false
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log(`Dialog result: ${result}`);
        this.canWeOpenLB = true
        if (result) {
          this.SendVerificationMail()
        }
      });
    }
  }

  accessToDashInvalid() {
    if (this.canWeOpenLB) {
      let dialogRef = this.dialog.open(accessToDashInvalid, {
        data: { name: this.userData.displayName, email: this.userData.email },
        disableClose: true,
      })

      dialogRef.afterOpened().subscribe(result => {
        this.canWeOpenLB = false
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log(`Dialog result: ${result}`);
        this.canWeOpenLB = true
        this.SignOut()
      });
    }

  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((user: any) => {
        try {
          user?.sendEmailVerification();
        } catch (error) {
          console.log(error)
          this.SignOut()
        }

      })
      .then(() => {
        // this.router.navigate(['']);
        let dialogRef = this.dialog.open(emailVerificationSent, {
          data: { name: this.userData.displayName, email: this.userData.email },
          disableClose: true
        })
        dialogRef.afterClosed().subscribe(result => {
          this.SignOut()
        });

      });
  }
  //////////////////////////// ALL DB CALL FUNCTIONS HERE //////////////////////////////////





  //////////////////////////// COMMON JS FUNCTIONS //////////////////////////////////
  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  formatDateTimeString(getDate: any) {
    var d = getDate,
      dformat = [d.getMonth() + 1,
      d.getDate(),
      d.getFullYear()].join('/') + ' ' +
        [d.getHours(),
        d.getMinutes(),
        d.getSeconds()].join(':');
    return dformat
  }


  // Convert compressed file path to blob
  dataURItoBlob(dataURI: any) {
    const binary = window.atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob(
      [new Uint8Array(array)],
      {
        type: 'image/jpeg',
      },
    );
  }


  // Convert Blob to File
  blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  //////////////////////////// COMMON JS FUNCTIONS //////////////////////////////////


  //////////////////////////// LOADER STATUS //////////////////////////////////
  showProgressBar(status: boolean) {
    // console.log(this.showHomeLoader)
    this.showHomeLoader = status
    this.updatedLoaderStatus.emit(this.showHomeLoader)
  }
  updatedLoaderStatusFun() {
    // // Use below line when service is going to update a vaiable
    // this.updatedUserData.emit(this.userData)
    return this.showHomeLoader
  }
  //////////////////////////// LOADER STATUS //////////////////////////////////



  



  //////////////////////////// CHAT SECTION //////////////////////////////////
  realTimeDB = getDatabase();
  currentOpenChatForSoket:any
  websoketPanel(ToUserID: any, postThisMgs: any) {
    set(ref(this.realTimeDB, `${ToUserID}`), {
      messageData: postThisMgs,
      messageByName: this.userData.displayName,
      messageByID: this.userData.uid,
      chaboxId:this.currentOpenChatForSoket || '',
      unseenMgsData: {
        sender : this.userData.displayName,
        count: 1 
      }
    });
  }
  
  setWebSoketDetection() {
    try {
      const starCountRef = ref(this.realTimeDB, `${this.userData.uid}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        try{
          if (data.messageData) {
            console.log(data)
            if (this.currentChatOpen != data.messageByID) {
              this.showToast(`🔔 ${data.messageByName}`, 'close', 'default')
            }
            set(ref(this.realTimeDB, `${this.userData.uid}`), {
              messageData: '',
              messageByName: this.userData.displayName,
              messageByID: this.userData.uid,
            });
          }
        }
        catch(err){
          console.log(err)
        }
      })
    }
    catch (err) {
      console.log(err)
    }
  }



  //////////////////////////// CHAT SECTION //////////////////////////////////


}
