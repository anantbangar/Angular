import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import swal from 'sweetalert';

@Component({
  selector: 'app-donation',
  standalone: false,
  templateUrl: './donation.html',
  styleUrl: './donation.css'
})
export class Donation {

  amount: number | null = null;

  private baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  private hasProcessedPayment = false;
  isPaymentProcessing = false;

  paymentStart() {

    if (this.isPaymentProcessing) return;
    this.isPaymentProcessing = true;
    this.hasProcessedPayment = false;

    console.log("Payment Started...");
    if (!this.amount || this.amount <= 0) {
      swal("Failed!", "Amount is required !!!", "error");
      this.isPaymentProcessing = false;
      return;
    }

    this.http.post<any>(`${this.baseUrl}/create_order`, { amount: this.amount }).subscribe(
      response => {
        console.log("Order Created:", response);
        if (response.status === 'created') {
          swal("Good job!", "Order is created", "success");

          this.http.post(`${this.baseUrl}/save_order`, {
            razorpayOrderId: response.id,
            amount: response.amount,
            status: response.status,
            receipt: response.receipt
          }).subscribe(
            response => console.log("Order saved in DB successfully", response),
            error => console.error("Error saving order in DB", error)
          );

          const options: any = {
            key: 'rzp_test_azaaWvLGqWYr4o',
            amount: response.amount,
            currency: 'INR',
            name: 'SPB-07-Payment-Integration-Razorpay',
            description: 'Donation',
            image: 'https://cdn-icons-png.flaticon.com/512/919/919854.png',
            order_id: response.id,
            handler: (res: any) => {
              if (this.hasProcessedPayment) return;
              this.hasProcessedPayment = true;

              console.log("Response in Handler after Payment Done---", res);              
              swal("Good job!", "Payment Successful!!!", "success");
              
              this.http.post(`${this.baseUrl}/save_payment`, {
                razorpayOrderId: res.razorpay_order_id,
                razorpayPaymentId: res.razorpay_payment_id,
                razorpaySignature: res.razorpay_signature,
                status: 'success'
              }).subscribe(
                response => console.log("Payment saved in DB successfully", response),
                error => console.error("Error saving payment in DB", error),
                () => { this.isPaymentProcessing = false; }
              );
            },
            prefill: {
              name: '',
              email: '',
              contact: ''
            },
            notes: {
              address: 'Anant Bangar'
            },
            theme: {
              color: '#3399cc'
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', (res: any) => {

            if (this.hasProcessedPayment) return;
            this.hasProcessedPayment = true;

            console.log("Response in Payment Failed after Payment Failed---", res);
            
            swal("Failed!", "Payment Failed!!!", "error");
            
            this.http.post(`${this.baseUrl}/save_payment`, {
              razorpayOrderId: res.error.metadata.order_id,
              razorpayPaymentId: res.error.metadata.payment_id,
              reason: res.error.reason,
              description: res.error.description,
              status: 'failed'
            }).subscribe(
              response => console.log("Payment failure saved in DB successfully", response),
              error => console.error("Error saving payment failure in DB", error),
              () => { this.isPaymentProcessing = false; }
            );
          });
          rzp.open();
        }
      },
      error => {
        console.error("Error in order creation", error);
        alert("Something went wrong !!!");
        this.isPaymentProcessing = false;

      }
    );
  }
}
