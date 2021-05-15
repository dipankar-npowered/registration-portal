import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SlideInOutAnimation } from '../service/animations';
import { ParentAuthorizationService } from '../service/parent-authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [SlideInOutAnimation]
})
export class LoginComponent implements OnInit {

  registration1 = 'in';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/(.+)@(.+){2,}\.(.+){2,}/)]),
    password: new FormControl('', [Validators.required, /* Validators.minLength(6), Validators.maxLength(18) */]),
  });
  errorMessage!: string;
  constructor(
    private parentAuthorizationService: ParentAuthorizationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleShowDiv(divName: string) {
    if (divName === 'registration1') {
      this.registration1 = this.registration1 === 'out' ? 'in' : 'out';
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      let data: any = await this.parentAuthorizationService.login(this.loginForm.value);
      console.log(data);
      if (data['data'].length > 0) {
        localStorage.setItem('user', JSON.stringify({email: this.loginForm.value.email}))
        this.router.navigate(['/child-information']);
      } else {
        this.errorMessage = 'Invalid email address or password'
      }
    }
  }
}
