import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler){

        // return this.authService.user.pipe(take(1)).subscribe();
        // return this.http.get();

        //we use the below rxjs operators also because we want to use the user token from user observable and then 
        //also use that token and return the http observable
        

        return this.authService.user.pipe(take(1),
        exhaustMap(user => {
            if(!user){
                return next.handle(req);
            }
            const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)})
            return next.handle(modifiedReq);
        })
        );

        //Interceptor Example
        // intercept(req: HttpRequest<any>, next: HttpHandler) {
        //     const modifiedRequest = req.clone({
        //       headers: req.headers.append('Auth', 'xyz')
        //     });
        //     return next.handle(modifiedRequest);
        //   }

    }

}