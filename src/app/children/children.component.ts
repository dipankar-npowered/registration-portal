import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { SlideInOutAnimation } from '../service/animations';
import { ParentAuthorizationService } from '../service/parent-authorization.service';
import {schools} from './../../assets/schools.json'; 

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
  animations: [SlideInOutAnimation]

})
export class ChildrenComponent implements OnInit {

  @Input('parentinfo') parentinfo!: Subject<any>;
  parentData: any = null;
  districts: Number[] = [...new Set(<any[]>schools.map((item: { [x: string]: any; }) => item['District Code']))];
  districtSchools!: any[];
  childrenForm!: FormGroup;
  slideinoutObj: any = {};
  successmessage: string | undefined;
  errormessage: string | undefined;
  constructor(
    private parentAuthorizationService: ParentAuthorizationService,
    private router: Router
  ) { 
  }

  ngOnInit(): void {
    this.UserProfile();
  }

  async UserProfile() {
    if (this.parentinfo) {
      this.parentinfo.subscribe(parentFormData => {
        // console.log(parentFormData.value)
        if (parentFormData.status === 'VALID') {
          this.parentData = parentFormData.value;
          this.districtSchools = schools.filter(item => item['District Code'] === parseInt(parentFormData.value.district));
          // console.log(this.districtSchools);
          this.generateForm();
        }
      })
    } else {
      let UserInfo = localStorage.getItem('user') ? JSON.parse(<string>localStorage.getItem('user')): null;
      console.log(UserInfo);
      if (UserInfo && UserInfo.email) {
        let data: any = await this.parentAuthorizationService.getProfile({email: UserInfo.email});
        console.log(data);
        if (data.data && data.data.email) {
          this.parentData = data.data;
          this.districtSchools = schools.filter(item => item['District Code'] === parseInt(this.parentData.district));
          this.generateForm(this.parentData.children);
        } else {
          localStorage.removeItem('user');
        }
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  generateForm(body?: any[]) {
    this.childrenForm = new FormGroup({
      children: new FormArray([])
    });
    if (body && body.length > 0) {
      body.forEach(item => this.addChild(item))
    } else {
      this.addChild(); 
    }
  }

  childFormGroup(item?: any) {
    return new FormGroup({
      fullname: new FormControl(item? item.fullname : '', [Validators.required, Validators.pattern(/^[a-z,',-]+(\s)[a-z,',-]+$/i)]),
      dob: new FormControl(item? item.dob : null, [Validators.required]),
      gender: new FormControl(item? item.gender : '', [Validators.required]),
      studentid: new FormControl(item? item.studentid : null, [Validators.required]),
      schoolid: new FormControl(item? item.schoolid : '', [Validators.required]),
    })
  }

  getFormArrayControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }

  getFormGroupAt(frmArr: any, i: number) {
    return frmArr.at(i) as FormGroup;
  }

  getFormGroupControls(frmGrp: FormGroup, key: string) {
    return (<FormGroup>frmGrp.controls[key]).controls;
  }

  addChild(item?: any) {
    let childrenArr = (this.childrenForm.get('children') as FormArray);
    childrenArr.push(this.childFormGroup(item));
    this.slideinout(childrenArr.length - 1);
  }

  removeChild(i: number) {
    this.slideinout(i);
    (this.childrenForm.get('children') as FormArray).removeAt(i);
  }

  async onSubmit() {
    console.log(this.childrenForm);
    let saveObj = <any>{};
    if (this.parentData) saveObj = this.parentData;
    if (this.childrenForm.valid) {
        saveObj['children'] = this.childrenForm.value.children;
        console.log(JSON.stringify(saveObj));
        let data: any = await this.parentAuthorizationService.updateRegisteration(saveObj);
        console.log(data);
        if (data && data.data && data.data._writeTime) {
          if (data.data.newUser) this.successmessage = 'Data Saved. Please check your email to verify your account.'
          else this.successmessage = 'Data Saved.'
        } else {
          this.errormessage = 'Failed. Please try again after some time.'
        }
    } else {
      this.childrenForm.markAllAsTouched();
    }
  }

  slideinout(i: number) {
    this.slideinoutObj[i] = this.slideinoutObj[i] === 'in' ? 'out' : 'in';
  }

}
