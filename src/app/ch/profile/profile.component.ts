import { Component, OnInit, Inject } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { data, fn } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { verifyEmail } from 'src/app/dialogs/all-dialogs/all-dialogs.component';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable, take } from 'rxjs';
// import { NgxImageCompressService } from "ngx-image-compress";






@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


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
  contactNumber: any
  // lazyLoading: any

  loadView: any  =  false


  constructor(
    public router: Router,
    private auth: AuthService,
    public afs: AngularFirestore,
    private mainApp: AppComponent,
    public dialog: MatDialog,
    public fireStorage: AngularFireStorage,
    
  ) { }







  ngOnInit(): void {
    // Map All Values
    this.setValuesUpdated()

    // Recall User Data on update
    this.auth.updatedUserData.subscribe((data) => {
      this.userData = this.auth.updateUserProfile()
      this.setValuesUpdated()
      
    })
  }



  // ReCall All Values
  setValuesUpdated() {
    if(this.userData.accessToDash)
    {
      this.loadView = true
    }
    this.uid = this.userData.uid
    this.displayName = this.userData.displayName || "User"
    this.email = this.userData.email
    this.photoURL = this.userData.photoURL || this.auth.userProfileImage
    this.resetPhotoURL = this.userData.photoURL || this.auth.userProfileImage
    this.accessToDash = this.userData.accessToDash
    this.emailVerified = this.userData.emailVerified
    this.birthDate = this.userData.birthDate
    this.contactNumber = this.userData.phoneNumber
    
    // this.lazyLoading = this.auth.userPrifileLoading


    let setBirthday = this.birthDate
    this.startDate = new Date(setBirthday)

    this.updateProfile = new FormGroup({
      userFullName: new FormControl({ value: this.displayName!!, disabled: false }, [Validators.required]),
      userEmail: new FormControl({ value: this.email, disabled: true }, [Validators.required, Validators.email]),
      userBirthDate: new FormControl({ value: this.startDate!!, disabled: false }),
      contactNumber: new FormControl({ value: this.contactNumber, disabled: false }, [Validators.pattern('^[0-9]*$')])

    })
    this.reCreateTimeStamp()
    this.auth.showProgressBar(false)
  }


  resetProfileForm() {
    this.setValuesUpdated()
  }


  errImage($event: any) {
    $event.target.src = this.auth.noImage
  }





  updateProfileCondtions(){
    // if(this.setDPWithForm){
    //   this.uploadDPClick()
    // }
    // else{
    //   console.log('zz')
    // }

    
    this.updateUserProfile()
  }



  // Update User Profile
  updateUserProfile() {

    

    let letsUpdateSomeProfileData
    if (this.updateProfile.status == "VALID") {
      this.auth.showProgressBar(true)
      letsUpdateSomeProfileData = {
        displayName: this.updateProfile.value.userFullName,
        birthDate: this.updateProfile.value.userBirthDate.toString(),
        phoneNumber: this.updateProfile.value.contactNumber || ''
      }
      // console.log('Ready To Submit', this.updateProfile.status,  letsUpdateSomeProfileData)
      this.afs.collection('users').doc(this.userData.uid).update(letsUpdateSomeProfileData).then(data => {
        this.auth.checkUserInFSore()
        this.auth.showProgressBar(false)
        this.auth.showToast('Data Updated Sucessfully', 'close', 'default');
        
      })
    }
    else {
      this.auth.showToast('Please fill mandatory fields', 'close');
    }

    
  }




  // Upload Profile photo
  tempProfilePath: any
  uploadProfielLoader: any = true
  uploadPofileStatus: any
  uploadCTADisabled = true
  profileImageInp: any

  // geting url
  photoTM = Date.now() + ".png"
  storPath = this.auth.uploadDataPathProfile + "/" + this.userData.email + "/" + this.displayName + "-" + this.photoTM
  fileRef = this.fireStorage.ref(this.storPath);
  downloadURL: Observable<string> | undefined

  reCreateTimeStamp() {
    this.profileImageInp = ""
    this.uploadProfielLoader = true
    this.uploadCTADisabled = true
    this.photoTM = Date.now() + ".png"
    this.storPath = this.auth.uploadDataPathProfile + "/" + this.userData.email + "/" + this.displayName + "-" + this.photoTM
    this.fileRef = this.fireStorage.ref(this.storPath);
  }



  // Validating image and updating the UI with new image
  setDPWithForm = false
  uploadDPChange($event: any) {
    this.tempProfilePath = $event.target.files[0]
    let fName = $event.target.files[0].name
    // console.log(this.tempProfilePath)
    console.log(typeof this.tempProfilePath)

    // Load HTML Input Image Temp
    const reader = new FileReader()
    reader.readAsDataURL($event.target.files[0])
    if (this.tempProfilePath) {

      if (this.tempProfilePath.type == "image/jpeg" || this.tempProfilePath.type == "image/png") {
        reader.onload = (eve) => {
          const img = new Image()
          let newDPBlob = eve.target?.result
          img.src = newDPBlob?.toString() || ""
          img.src = img.src.replace('data:image/png', 'data:image/jpeg')

          img.onload = () => {
            var width = img.width
            var height = img.height
            let totalBytes = this.tempProfilePath.size
            let fileInMB = Math.floor(totalBytes / 1000000)
            // console.log(fileInMB)
            // if (fileInMB < 3 && width == height) { // For Square Image
            if (fileInMB < 3) {

              // console.log(img.src)


              // With Image compress
              this.auth.imageCompress
                .compressFile(img.src, 100, 100) // 50% ratio, 50% quality
                .then(
                  (compressedImage) => {
                    compressedImage = compressedImage.replace('data:image/jpeg', 'data:image/png')
                    this.photoURL = compressedImage
                    
                    //imageFile created below is the new compressed file which can be send to API in form data
                    const imageFile = this.auth.blobToFile(this.auth.dataURItoBlob(compressedImage), fName)
                    this.tempProfilePath = imageFile

                    console.log(this.tempProfilePath)

                    this.uploadCTADisabled  = false

                    this.setDPWithForm      = true
                  }
                );


              // Without Compress
              // this.photoURL = newDPBlob
              // this.uploadCTADisabled = false
              // console.log(this.tempProfilePath)

            } else {
              // this.auth.showToast('Image must be SQUARE & size must be below 3MB', 'close'); // For Square Image
              this.auth.showToast('Size must be below 3MB', 'close');

              this.tempProfilePath = ""
              this.photoURL = this.resetPhotoURL
              this.uploadCTADisabled = true
            }
            this.setDPWithForm      = false
          }
        }
      }
      else {
        this.auth.showToast('Please select Image file for profile', 'close');
        this.tempProfilePath = ""
        this.photoURL = this.resetPhotoURL
        this.setDPWithForm      = false
      }
    }
    else {
      this.auth.showToast('Profile picture is not selected', 'close');
      this.setDPWithForm      = false
    }

  }

  // Uploading Image to firestore
  uploadDPClick() {
    this.auth.showProgressBar(true)
    // this.photoURL             = this.resetPhotoURL
    // + this.userData.uid
    if (this.tempProfilePath) {
      // this.tempProfilePath    = tinify.fromFile(this.tempProfilePath)
      // console.log('We are uploading this', this.tempProfilePath)

      this.fireStorage.upload(this.storPath, this.tempProfilePath).percentageChanges().subscribe(
        data => {
          this.uploadProfielLoader = false
          this.uploadPofileStatus = data
          if (data == 100) {

            this.downloadURL = this.fileRef.getDownloadURL();
            this.downloadURL.pipe(take(1)).subscribe(url => {
              if (url) {
                this.afs.collection('users').doc(this.userData.uid).update({ photoURL: url }).then(() => {
                  this.auth.checkUserInFSore()
                  console.log(url)
                  this.photoURL = url
                  this.auth.showProgressBar(false)
                  this.uploadProfielLoader = true
                  this.auth.showToast('Profile image updated successfully ', 'close', 'default');
                  setTimeout(() => {
                    this.reCreateTimeStamp()
                  }, 1000)
                  this.setDPWithForm      = false

                  return true
                })
              }

            })
          }
          // console.log(data)
          this.uploadCTADisabled = true
        }
      )
    }












  }
































}







