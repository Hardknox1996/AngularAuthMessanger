import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-all-dialogs',
  templateUrl: './all-dialogs.component.html',
  styleUrls: ['./all-dialogs.component.css']
})
export class AllDialogsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './verifyEmail.html',
})
export class verifyEmail {

  name: any
  email: any
  constructor(
    public dialogRef: MatDialogRef<verifyEmail>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './emailVerificationSent.html',
})
export class emailVerificationSent {

  name: any
  email: any
  constructor(
    public dialogRef: MatDialogRef<emailVerificationSent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
}



@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './accessToDashInvalid.html',
})
export class accessToDashInvalid {

  name: any
  email: any
  constructor(
    public dialogRef: MatDialogRef<emailVerificationSent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
}




