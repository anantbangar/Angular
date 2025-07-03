import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  private baseUrl = "http://localhost:8080";

  sendEmail(data: any) {
    console.log("Sending email with data:", data);
    return this.http.post(`${this.baseUrl}/email/toOnePerson`, data);

  }
}
