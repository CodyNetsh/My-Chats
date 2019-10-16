import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  
  newmessage;
  id: string;
  ref: any;
  uploadState: any;
  downloadURL: any;
  bchat: any;
  uploadPercent: any;
  Image: any;
  sendto: any;
  userChat={
    displayName:"",
    photoURL:"",
    uid:""
  }
  sendTo;
  keyuid: string;
  selectedVal: string;
  responseMessage: string;
  responseMessageType: any;
  constructor(
    public navCtrl: NavController,
    private route:ActivatedRoute,
    private router:Router,
    public afAuth: AngularFireAuth,
    private fire:AngularFirestore,
    public alertCtrl: AlertController,
    public zone: NgZone, 
    public loadingCtrl: LoadingController
      ,public Storage: AngularFireStorage,
      private socialSharing: SocialSharing,
        private camera: Camera,public actionSheetController: ActionSheetController) { 
        
      this.keyuid =this.afAuth.auth.currentUser.uid;
      this.bchat=this.fire.collection('personal',ref=>ref.orderBy('TimeStamp')).valueChanges();
          
          
      this.route.queryParams
      .subscribe(params =>
   {
       
        this.userChat.displayName = params.displayName;
        this.userChat.photoURL = params.photoURL;
        this.userChat.uid = params.uid
        this.sendTo=params.uid
        console.log(this.userChat.displayName,this.userChat.photoURL,this.userChat.uid)
    });

    }
    send(){
   
      if(this.newmessage != ''){
  
        this.fire.collection('personal').add({
         Name: this.afAuth.auth.currentUser.displayName,
         Message: this.newmessage,
         UserID: this.afAuth.auth.currentUser.uid,
         sendto:this.sendTo,
         TimeStamp:firebase.firestore.FieldValue.serverTimestamp(),

          });
          
        this.newmessage='';
        console.log("mee2 " +  this.afAuth.auth.currentUser.uid)
      }
     
   }

   back(){
    this.router.navigateByUrl("chatroom")
  }

   upload(event) {
    const file= event.target.files[0];
     this.id = Math.random().toString(36).substring(2);
    const filepath=this.id;
    this.ref = this.Storage.ref(filepath);
    const task = this.Storage.upload(filepath, file);
   this.uploadState = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL().subscribe(urlfile=>{
           console.log(urlfile);
           this.fire.collection('personal').add({
            Name: this.afAuth.auth.currentUser.displayName,
            Image:urlfile,
            UserID: this.afAuth.auth.currentUser.uid,
            sendto:this.sendTo, 
            TimeStamp:firebase.firestore.FieldValue.serverTimestamp(),
          });
       
          });
        })
      ).subscribe();
    }
   
    share(buddy){
      this.socialSharing.share(buddy.Message, buddy.Image).then(()=>{
      }).catch(()=>{
      })
    }
   
  //  zoom(urlfile){
  //     this.Viewer.show(urlfile.Image, "" ,{share:true, copyToReference: true});
  //   }
  ngOnInit() {
  }
 
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((urlfile) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.fire.collection('personal').add({
       Name: this.afAuth.auth.currentUser.displayName,
       image:urlfile,
       UserID: this.afAuth.auth.currentUser.uid,
       TimeStamp:firebase.firestore.FieldValue.serverTimestamp(),
     });
      let base64Image = 'data:image/jpeg;base64,' + urlfile;
     }, (err) => {
      // Handle error
     });
   }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [
     
      {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log('Camera clicked');
          this.takePhoto()  
        }
      }, {
        text: 'Gallery',
        icon: 'down-arrow',
        handler: () => {
          console.log('Gallery clicked');
        
         this.upload(event);
        }
      }]
    });
    await actionSheet.present();
  }


}
