import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParentAuthorizationService } from '../service/parent-authorization.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  successmessage!: string;
  errormessage!: string;
  constructor(
    private route: ActivatedRoute,
    private parentAuthorizationService: ParentAuthorizationService,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(item => this.checkEmailVerification(item));
  }

  async checkEmailVerification(body: any) {
    let data: any = await this.parentAuthorizationService.updateRegisteration(body);
    console.log(data);
    if (data && data.data && data.data._writeTime) this.successmessage = 'Your account has been verified.'
    else this.errormessage = 'Not Found';
  }



}
