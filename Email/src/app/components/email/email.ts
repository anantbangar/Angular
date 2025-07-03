import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { EmailService } from '../../services/email-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-email',
  standalone: false,
  templateUrl: './email.html',
  styleUrl: './email.css'
})
export class Email {

  constructor(
    private emailService: EmailService,
    private snakBar: MatSnackBar

  ) {

  }

  data = {
    to: "",
    subject: "",
    msg: ""
  }

  flag: boolean = false;

  doSubmitForm() {
    console.log("Form submitted");
    console.log("Data---", this.data);

    if (!this.data.to || !this.data.subject || !this.data.msg) {
      this.snakBar.open("Please fill all fields", "Close");
      return;
    }

    this.flag = true;

    this.emailService.sendEmail(this.data).subscribe(
      response => {
        console.log("Email sent successfully", response);
        this.snakBar.open("Email sent successfully", "Close");
        this.flag = false;
      },
      error => {
        console.error("Error sending email", error);
        this.snakBar.open("Error sending email", "Close");
        this.flag = false;
      }
    );
  }

}




