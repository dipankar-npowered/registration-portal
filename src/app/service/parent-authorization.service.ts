import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParentAuthorizationService {

  constructor(
    private httpClient: HttpClient 
  ) { }

  async login(body: any) {
    return await this.httpClient.post(environment.api+'login', body, {headers: new HttpHeaders({'x-tag': '1'})}).toPromise();
  }

  async updateRegisteration(body: any) {
    return await this.httpClient.post(environment.api+'update-registration', body, {headers: new HttpHeaders({'x-tag': '1'})}).toPromise();
  }

  async getProfile(body: any) {
    return await this.httpClient.post(environment.api+'get-profile', body, {headers: new HttpHeaders({'x-tag': '1'})}).toPromise();
  }
}
