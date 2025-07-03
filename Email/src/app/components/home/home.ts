import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  
  constructor(private snack : MatSnackBar) {}

  ngOnInit(): void {
    // Initialization logic can go here
  }

  btnClick()
  {
    console.log("Button clicked");
    this.snack.open("Welcome Anant Bangar", "Close");
  }
}
    
