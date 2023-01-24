import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, 
    private router: Router,
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone,
    public auth: AuthService
    ){};

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.pipe(take(1)).subscribe( (user) => {
        console.log('%c Auth Check User ', 'background: #fff; color: #000')
        if (user) {
          console.log('%c User Logged In ', 'background: green; color: #fff');
          // this.afAuth.updateCurrentUser
          this.authService.userData   = user
          // this.auth.checkUserInFSore()
          // console.log('zzzz-'+user.emailVerified)

          resolve(true);
        } else {
          console.log('%c User data not found ', 'background: red; color: #fff');
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });  
  }    
}


