import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SlideInOutAnimation } from '../service/animations';
import {schools} from './../../assets/schools.json'; 

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [SlideInOutAnimation]

})
export class RegistrationComponent implements OnInit {
  registration1 = 'in';
  registration2 = 'out';

  districts: any[] = [...new Set(<any[]>schools.map((item: { [x: string]: any; }) => item['District Code']))].map(item => schools.find(di => di['District Code'] === item));
  userform = new FormGroup({
    fullname: new FormControl('', [Validators.required, Validators.pattern(/^[a-z,',-]+(\s)[a-z,',-]+$/i)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/(.+)@(.+){2,}\.(.+){2,}/)]),
    password: new FormControl('', [Validators.required, /* Validators.minLength(6), Validators.maxLength(18) */]),
    state: new FormControl('MA', [Validators.required]),
    district: new FormControl('', [Validators.required]),
  });

  parnetinfo = new Subject<any>();

  constructor() { }

  ngOnInit(): void {
    // console.log(this.userform)
  }

  toggleShowDiv(divName: string) {
    if (divName === 'registration1') {
      this.registration1 = this.registration1 === 'out' ? 'in' : 'out';
    }
    if (divName === 'registration2') {
      this.registration2 = this.registration2 === 'out' ? 'in' : 'out';
    }
  }

  addChild() {
    if (this.userform.valid) {
      this.parnetinfo.next(this.userform);
      this.registration1 = this.registration1 === 'out' ? 'in' : 'out';
      this.registration2 = this.registration2 === 'out' ? 'in' : 'out';
    } else {
      this.userform.markAllAsTouched();
    }
  }
}
