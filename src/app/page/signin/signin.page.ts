import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import {finalize} from 'rxjs/operators';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import {  AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
 ref;
task: any;
uploadState: any;
uploadProgress: any;
downloadURL: string;// imageURL:string
id;
name;
url
users: AngularFirestoreDocument;
sub;
photoURL:any;
  // loadingCtrl: any;
  // toastCtrl: any;
  base64Image:string
  imageFileName: string;
  displayName: any;
  avatar: any;
  imghandler: any;
  imgurl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  moveon = true;
  user: any;
  surname: AngularFirestoreDocument<unknown>;
  email: AngularFirestoreDocument<unknown>;
  Email: string;
  constructor(private router:Router,
  //  private camera: Camera,
  private  af: AngularFireAuth,
  public afAuth: AngularFireAuth,
     private route:ActivatedRoute,
    private fire:AngularFirestore,
    public zone: NgZone, public alertCtrl: AlertController,
    private authService: AuthenticationService, public loadingCtrl: LoadingController
    ,public Storage: AngularFireStorage) { 
      
    this.af.auth.currentUser.photoURL;
      this.name=af.auth.currentUser.displayName;
       this.Email=af.auth.currentUser.email;
      this.user=fire.doc(`userCol/${this.af.auth.currentUser.uid}`)
      this.sub=this.user.valueChanges().subscribe(event=>{
       
       this.photoURL = event.photoURL
      })
    
  }

  // chooseimage() {
  
  //   this.authService.uploadimage().then((uploadedurl: any) => {
    
  //     this.zone.run(() => {
  //       this.imgurl = uploadedurl;
  //       this.moveon = false;
  //     })
  //   })
  // }
  upload(event) {
    const file= event.target.files[0];
     this.id = Math.random().toString(36).substring(2);
    const filepath=this.id;
    this.ref = this.Storage.ref(filepath);
    const task = this.Storage.upload(filepath, file);
   
    this.uploadState = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL().subscribe(url=>{
           console.log(url);
           this.af.auth.currentUser.updateProfile({
            photoURL: url
          })

           this.user.update({
             photoURL:url
           })
 
        })
      })
    ).subscribe();
  }
 
  // updateproceed() {
   
  //   this.authService.updateimage(this.imgurl).then((res: any) => {
  //     if (res.success) {
  //       this.router.navigateByUrl("chatroom");
  //     }
  //     else {
  //       alert(res);
  //     }
  //   })
  // }

  // message(arg0: string) {
  //   throw new Error("Method not implemented.");
  // }

  ngOnInit() {
     
    
  //  this.loaduserdetails();
  }



  // loaduserdetails() {
  //  // this.authService.getuserdetails().then((res: any) => {
  //     this.displayName = res.displayName;
  //     this.zone.run(() => {
  //       this.avatar = res.photoURL;
  //     })
  //   })
  //}

  enterNickname() {
   
      // this.authService.update(user, user.userID);
      // alert("user updated");
      this.router.navigateByUrl("chatroom");
  }

  // editimage() {
  //   let statusalert = this.alertCtrl.create({
  //     buttons: ['okay']
  //   });
  //   this.authService.uploadimage().then((url: any) => {
  //     this.authService.updateimage(url).then((res: any) => {
  //       if (res.success) {
  //         // statusalert.setTitle('Updated');
  //         // statusalert.setSubTitle('Your profile pic has been changed successfully!!');
  //         // // statusalert.present();
  //         this.zone.run(() => {
  //         this.avatar = url;
  //       })  
  //       }  
  //     }).catch((err) => {
  //         // statusalert.setTitle('Failed');
  //         // statusalert.setSubTitle('Your profile pic was not changed');
  //         // // statusalert.present();
  //     })
  //     })
  // }
  // uploadFile() {
  //   let loader = this.loadingCtrl.create({
  //     // content: "Uploading..."
  //   });
  //   loader.present();
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  
  //   let options: FileUploadOptions = {
  //     fileKey: 'ionicfile',
  //     fileName: 'ionicfile',
  //     chunkedMode: false,
  //     mimeType: "image/jpeg",
  //     headers: {}
  //   }
  //   fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
  //   .then((data) => {
  //   console.log(data+" Uploaded Successfully");
  //   this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
  //   loader.dismiss();
  //   this.presentToast("Image uploaded successfully");
  // }, (err) => {
  //   console.log(err);
  //   loader.dismiss();
  //   this.presentToast(err);
  // });
  // }
  // getImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //   }
  
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.imageURI = imageData;
  //   }, (err) => {
  //     console.log(err);
  //     this.presentToast(err);
  //   });
  // }
  // presentToast(msg) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 3000,
  //     position: 'bottom'
  //   });
  
  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });
  
  //   toast.present();
  // }

  
}
