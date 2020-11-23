import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

import { User } from '../models/user.model';
import { Router } from '@angular/router';


export interface AuthResponse{
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered? : string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenExpirationTimer: any;

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) { }
  signup(email: string, password: string){
    return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError), tap(resData =>{
      const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
      const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
      this.user.next(user);
      localStorage.setItem('userData', JSON.stringify(user));
    }));
  }

  autoLogin(){
    const userData : {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData){
      return
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }

  }

  login(email: string, password: string){
    return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, 
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError),tap(resData =>{
      const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
      const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
      this.user.next(user);
      this.autoLogout(+resData.expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
    }));;
  }


  logout(){
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }


  private handleError(errRes: HttpErrorResponse){
    let error = "An unkown Error occured!";
      if(!errRes.error || !errRes.error.error){
        return throwError(error);
      }
      switch(errRes.error.error.message){
        case 'EMAIL_EXISTS' :
           error = "Email id already exists!";
           break;
        case 'EMAIL_NOT_FOUND' :
          error = "Invalid Email Id"
          break;
        case 'INVALID_PASSWORD':
          error = "Invalid Password"
          break;

      }

      return throwError(error);
  }


}
