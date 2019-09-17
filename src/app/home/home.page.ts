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
    private transfer: FileTransfer
    ) { 
      this.selectedVal = 'login';
      this.isForgotPassword = false;
      // this.camera.getPicture(options)

     
  }

  // facebook(){
  //   this.authService.loginWithFaceBook()
  //   .then(res => {
  //     console.log(res);
  //     this.showMessage("success", "Successfully Logged In with Google");
  //     this.isUserLoggedIn();
  //   }, err => {
  //     this.showMessage("danger", err.message);
  //   });

    
  // }
  // twitter(){
  //   this.authService.loginWithTwitter()
  //   .then(res => {
  //     console.log(res);
  //     this.showMessage("success", "Successfully Logged In with Google");
  //     this.isUserLoggedIn();
  //   }, err => {
  //     this.showMessage("danger", err.message);
  //   });
  //}
 
  // phone(){
  //   this.router.navigateByUrl("otp")
  // }
  ngOnInit() {
    // this.plt.ready().then(() => {
    //   this.loadStoredImages();
    // });


}

  // cropUpload() {
  //   this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
  //     for (let i = 0; i < results.length; i++) {
  //         console.log('Image URI: ' + results[i]);
  //         this.crop.crop(results[i], { quality: 100 })
  //           .then(
  //             newImage => {
  //               console.log('new image path is: ' + newImage);
  //               const fileTransfer: FileTransferObject = this.transfer.create();
  //               const uploadOpts: FileUploadOptions = {
  //                  fileKey: 'file',
  //                  fileName: newImage.substr(newImage.lastIndexOf('/') + 1)
  //               };
  
  //               fileTransfer.upload(newImage, 'http://192.168.0.7:3000/api/upload', uploadOpts)
  //                .then((data) => {
  //                  console.log(data);
  //                  this.respData = JSON.parse(data.response);
  //                  console.log(this.respData);
  //                  this.fileUrl = this.respData.fileUrl;
  //                }, (err) => {
  //                  console.log(err);
  //                });
  //             },
  //             error => console.error('Error cropping image', error)
  //           );
  //     }
  //   }, (err) => { console.log(err); });
  // }

//   startUpload(imgEntry) {
//     this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
//         .then(entry => {
//             ( < FileEntry > entry).file(file => this.readFile(file))
//         })
//         .catch(err => {
//             this.presentToast('Error while reading file.');
//         });
//         this.loadStoredImages();
// }
 
// readFile(file: any) {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//         const formData = new FormData();
//         const imgBlob = new Blob([reader.result], {
//             type: file.type
//         });
//         formData.append('file', imgBlob, file.name);
//         this.uploadImageData(formData);
//     };
//     reader.readAsArrayBuffer(file);

// }
loginUser(user:User) {
  // this.responseMessage = "";
  // this.authService.login(this.user.name, this.user.password)
  //   .then(res => {
  //     console.log(res);
  //     this.showMessage("success", "Successfully Logged In!");
  //     this.isUserLoggedIn();
  //   }, err => {
  //     this.showMessage("danger", err.message);
  //   });

  this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(data => {
    // const UserID = this.afAuth.auth.currentUser.uid;
    // const Name = this.afAuth.auth.currentUser.displayName;

  //   console.log(this.nickname)
  //   this.router.navigate(['/signin'], { queryParams:{ nickname:this.nickname}});
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
logoutUser() {
  this.authService.logout()
    .then(res => {
      console.log(res);
      this.userDetails = undefined;
      localStorage.removeItem('user');
    }, err => {
      this.showMessage("danger", err.message);
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
   photoURL:''
  })
  this.afAuth.auth.currentUser.updateProfile({
    displayName:this.nickname,
    photoURL:''
      })
})
this.router.navigateByUrl("signin");

}
catch(e){

  console.error(e);
}


// this.authService.register(this.emailInput, this.passwordInput)
// .then(res => {

//   // Send Varification link in email
//   this.authService.sendEmailVerification().then(res => {
//     console.log(res);
//     this.isForgotPassword = false;
//     this.showMessage("success", "Registration Successful! Please Verify Your Email");
//   }, err => {
//     this.showMessage("danger", err.message);
//   });
//   this.isUserLoggedIn();


// }, err => {
//   this.showMessage("danger", err.message);
// });
}
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

// Open Popup to Login with Google Account
// googleLogin() {
//   this.authService.loginWithGoogle()
//     .then(res => {
//       console.log(res);
//       this.showMessage("success", "Successfully Logged In with Google");
//       this.isUserLoggedIn();
//     }, err => {
//       this.showMessage("danger", err.message);
//     });
// }

// uploadImage(imageURI){
//   return new Promise<any>((resolve, reject) => {
//     let storageRef = firebase.storage().ref();
//     let imageRef = storageRef.child('image').child('imageName');
//     this.encodeImageUri(imageURI, function(image64){
//       imageRef.putString(image64, 'data_url')
//       .then(snapshot => {
//         resolve(snapshot.downloadURL)
//       }, err => {
//         reject(err);
//       })
//     })
//   })
// }

// encodeImageUri(imageUri, callback) {
//   var c = document.createElement('canvas');
//   var ctx = c.getContext("2d");
//   var img = new Image();
//   img.onload = function () {
//     var aux:any = this;
//     c.width = aux.width;
//     c.height = aux.height;
//     ctx.drawImage(img, 0, 0);
//     var dataURL = c.toDataURL("image/jpeg");
//     callback(dataURL);
//   };
//   img.src = imageUri;
// };

// openImagePicker(){
//   this.imagePicker.hasReadPermission().then(
//     (result) => {
//       if(result == false){
//         // no callbacks required as this opens a popup which returns async
//         this.imagePicker.requestReadPermission();
//       }
//       else if(result == true){
//         this.imagePicker.getPictures({
//           maximumImagesCount: 1
//         }).then(
//           (results) => {
//             for (var i = 0; i < results.length; i++) {
//               this.uploadImageToFirebase(results[i]);
//             }
//           }, (err) => console.log(err)
//         );
//       }
//     }, (err) => {
//       console.log(err);
//     });
//   }

//   uploadImageToFirebase(image){
//     // image = normalizeURL(image);
  
//     //uploads img to firebase storage
//     this.firebaseService.uploadImage(image)
//     .then(photoURL => {
  
//       let toast = this.toastCtrl.create({
//         message: 'Image was updated successfully',
//         duration: 3000
//       });
//       toast.present();
//       })
//     }
//     openImagePickerCrop(){
//       this.imagePicker.hasReadPermission().then(
//         (result) => {
//           if(result == false){
//             // no callbacks required as this opens a popup which returns async
//             this.imagePicker.requestReadPermission();
//           }
//           else if(result == true){
//             this.imagePicker.getPictures({
//               maximumImagesCount: 1
//             }).then(
//               (results) => {
//                 for (var i = 0; i < results.length; i++) {
//                   this.cropService.crop(results[i], {quality: 75}).then(
//                     newImage => {
//                       this.uploadImageToFirebase(newImage);
//                     },
//                     error => console.error("Error cropping image", error)
//                   );
//                 }
//               }, (err) => console.log(err)
//             );
//           }
//         }, (err) => {
//           console.log(err);
//         });
//       }
}
