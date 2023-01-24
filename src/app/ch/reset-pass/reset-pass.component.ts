import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {


  resetPass = new FormGroup({
    userPass: new FormControl('', [Validators.required, Validators.email])
  })


  constructor(
    public router: Router,
    private auth: AuthService,
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  clearLogInForm() {
    this.resetPass.reset()
  }
  sendResePass() {
    if (this.resetPass.status == "VALID") {
      let userEmail = this.resetPass.value.userPass?.toString()
      this.auth.afAuth.sendPasswordResetEmail(userEmail!!).then((data: any) => {
        console.log(data)
        this.auth.showToast('ResetPassword link sent to email id', 'close', 'bg-success')
        this.router.navigate(['/login']);
      }).catch((err: any) => {
        console.log('Err:', err);
        this.auth.showToast('Something went wrong.', 'close')
        this.clearLogInForm()
      })
    }
    else{
      this.auth.showToast('Please enter valid email', 'close')
    }



  }

}
