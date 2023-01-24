import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUser = new FormGroup({
    userFullName: new FormControl('', [Validators.required]),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPass: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
    // contactNumber: new FormControl('', [ Validators.pattern('^[0-9]*$')])
  })

  constructor(
    public router:Router,
    private _snackBar: MatSnackBar,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  get registerFormControl() {
    return this.registerUser.controls;
  }

  clearRegisterForm() {
    this.registerUser.reset()
  }

  createUser(){
    if (this.registerUser.status == "VALID") {
      let userFullName = this.registerUser.value.userFullName
      let userEmail = this.registerUser.value.userEmail
      let userPass = this.registerUser.value.userPass
      // let contactNumber = this.registerUser.value.contactNumber
      this.auth.SignUp(userEmail, userPass)
    }
    else{
      this.auth.showToast('Please fill mandatory fields', 'close');
    }
  }

  createGoogleAlc(){
    this.auth.SigninWithGoogle()
  }

}


//shekhar.chavan25121996@gmail.com