import { Component, NgZone } from '@angular/core';
import { ChatroomPage } from '../page/chatroom/chatroom.page';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
 import { FilePath } from '@ionic-native/file-path/ngx';
 import { ImagePicker } from '@ionic-native/image-picker/ngx'
 import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase';
import {  ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  photoURL: any;
  sub: any;
  downloadURL: any;
  uploadState: any;
  ref: any;
  id: string;
  [x: string]: any;
  title = 'firebaseLogin';
  user = {} as User;
  selectedVal: string;
  responseMessage: string = '';
  responseMessageType: string = '';
  emailInput: string;
  passwordInput: string;
 name:string
  isForgotPassword: boolean;
  userDetails: any;
nickname:"";
fileUrl: any = null;
respData: any;
  //  provider = new firebase.auth.FacebookAuthProvider();
  users: AngularFirestoreDocument;
  constructor(private router:Router,
    private authService: AuthenticationService,public afAuth: AngularFireAuth,
    // private fbk: Facebook
    private fire:AngularFirestore, private file: File, private http: HttpClient, private webview: WebView,
    private filePath: FilePath,private imagePicker: ImagePicker,
    private  af: AngularFireAuth,
     private route:ActivatedRoute,
    public zone: NgZone, public alertCtrl: AlertController,
     public loadingCtrl: LoadingController
    ,public Storage: AngularFireStorage,
    private transfer: FileTransfer,public toastController: ToastController

    ) { 
      this.selectedVal = 'login';
      this.isForgotPassword = false;
      // this.camera.getPicture(options)

     
  }


 
  ngOnInit() {

}

loginUser(user:User) {
  

  this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(data => {
    this.router.navigateByUrl("signin")
  })
}
showMessage(type, msg) {
  this.responseMessageType = type;
  this.responseMessage = msg;
  setTimeout(() => {
    this.responseMessage = "";
  }, 2000);
}
public onValChange(val: string) {
  this.showMessage("", "");
  this.selectedVal = val;
}
isUserLoggedIn() {
  this.userDetails = this.authService.isUserLoggedIn();
  this.router.navigateByUrl("signin")
}
  async logoutUser() {
  
  this.authService.logout()
    .then(res => {
      console.log(res);
      this.userDetails = undefined;
      localStorage.removeItem('user');
    }, err => {
      this.showMessage("danger", err.message);
    });
    const toast = await this.toastController.create({
      message: 'Successfully logged in.',
      duration: 1500,
      position: 'top'
    });
}

registerUser() {
  this.authService.register(this.emailInput, this.passwordInput)
    .then(res => {

      // Send Varification link in email
      this.authService.sendEmailVerification().then(res => {
        console.log(res);
        this.isForgotPassword = false;
        this.showMessage("success", "Registration Successful! Please Verify Your Email");
      }, err => {
        this.showMessage("danger", err.message);
      });
      this.isUserLoggedIn();


    }, err => {
      this.showMessage("danger", err.message);
    });
}
ann(){
  this.af.auth.signInAnonymously().then(() => {
    localStorage.setItem('userid', this.af.auth.currentUser.uid);
    this.router.navigateByUrl("chatroom");
  }).catch(err => {
    alert(err.message);
  });
  this.fire.collection('userCol').add({
    displayName: 'Anonymous',
    photoURL: 'assets/img/ClientLogincol2.png'
})
this.afAuth.auth.currentUser.updateProfile({
  displayName: 'Anonymous',
  photoURL: 'assets/img/ClientLogincol2.png'
})
}
async register(user: User){
  try{
 const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password).then(data=>{
  localStorage.setItem('userid', this.afAuth.auth.currentUser.uid)
  
   this.fire.collection('userCol').doc(data.user.uid).set({
    displayName: this.nickname,
   lastname: this.lastname,
   userID:this.afAuth.auth.currentUser.uid,
   photoURL:'assets/img/ClientLogincol2.png'
  })
  this.afAuth.auth.currentUser.updateProfile({
    displayName:this.nickname,
    photoURL:'assets/img/ClientLogincol2.png'
      })
})
this.router.navigateByUrl("signin");
const toast = await this.toastController.create({
  message: 'Account have been created.',
  duration: 1500,
  position: 'top'
});
}
catch(e){

  console.error(e);
}}


// Send link on given email to reset password
forgotPassword() {
  this.authService.sendPasswordResetEmail(this.emailInput)
    .then(res => {
      console.log(res);
      this.isForgotPassword = false;
      this.showMessage("success", "Please Check Your Email");
    }, err => {
      this.showMessage("danger", err.message);
    });
}

}
