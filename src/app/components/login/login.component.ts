import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import Swal from 'sweetalert2';

import { AuthResponse, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogIn = true;
  isLoading= false;
  error = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  switchMode(){
    this.isLogIn = !this.isLogIn;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    let authObs: Observable<AuthResponse>;

    if(this.isLogIn){
      authObs = this.authService.login(email, password);
    }else{
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(data =>
      {
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
    },error=>{
      this.error = error;
      this.isLoading = false;
      
    }); 

    form.reset();
  }

  onAlertOver(alert: boolean){
    if(!alert){
      this.error = null;
    }
  }

    
  }



