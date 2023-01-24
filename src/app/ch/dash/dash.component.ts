import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  userData      = this.auth.userData
  
  dashName: any = "Hardknox"
  
  showHomeLoader: any  =  false

  constructor(
    public router:Router,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.auth.checkUserInFSore()
    this.auth.setWebSoketDetection()
    
    this.auth.updatedUserData.subscribe((data) => {
      this.userData = this.auth.updateUserProfile()
    })

    
    this.auth.updatedLoaderStatus.subscribe((data) => {
      this.showHomeLoader = this.auth.updatedLoaderStatusFun()
    })
  }
  
  
  showProgressBar(status:any){
    this.auth.showProgressBar(status)
  }

  logOutUser(){
    this.auth.SignOut();
  }

}
