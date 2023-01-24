import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myApp';
  loaderView          = "display: none"
    
  constructor(public db: AngularFirestore) {
    const settings = { timestampsInSnapshots: true };
        // db.app.firestore().settings(settings);   

        
  }
  
}
