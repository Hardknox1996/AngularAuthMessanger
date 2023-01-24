import { Component, OnInit, NgZone } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName = new FormControl('', [Validators.required, Validators.email]);
  userPass = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);

  constructor(
    public router:Router,
    private _snackBar: MatSnackBar,
    private auth: AuthService,
    ) { }
  
  ngOnInit(): void {
  }
  
  // this.userName       = "test@test.com"
  // this.userPass       = "Test@1234"

  logInCustom(){
    if(this.userName.hasError('required') || this.userName.hasError('email') ||
    this.userPass.hasError('required') || this.userPass.hasError('pattern') )
    {
      this.auth.showToast('Please enter valid values', 'close')
    }
    else{
      this.auth.SignIn(this.userName.value, this.userPass.value)
    }
    
  }
  clearLogInForm(){
    this.userName.setValue("")
    this.userPass.setValue("")
    // this.auth.SignOut();
  }

  logInGoogleAlc(){
    this.auth.SigninWithGoogle();
   }
  
}




// https://www.telerik.com/blogs/angular-basics-canactivate-introduction-routing-guards

// https://www.positronx.io/full-angular-firebase-authentication-system/