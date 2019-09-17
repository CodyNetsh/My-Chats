import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService} from 'src/app/service/window.service';
import * as firebase from 'firebase';
import { PhoneNumber } from 'src/app/Module/phoneNumber';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {

 
  verificationCode: string;
  user = {} as User;

  windowRef: any;
  phoneNumber=new PhoneNumber();
 

  constructor(private win:WindowService,private router:Router,private route:ActivatedRoute) {}

 
  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;

    
    const num = this.phoneNumber.e164;
    console.log(num);
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;

            })
            .catch( error => console.log(error) );

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then( result => {

                    this.user = result.user;

                    
                    console.log(this.user.displayName)
                    this.router.navigate(['/collection'], { queryParams:{ displayName:this.user.displayName}});
                  

    })
    .catch( error => console.log(error, "Incorrect code entered?"));
  
  }
  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')

    this.windowRef.recaptchaVerifier.render();

    
    this.route.queryParams
    .subscribe(params =>
 {
     
      this.user.displayName= params.nickname;

      console.log(this.user.displayName)
  });
  
  }

}
