import { Component, OnInit, ViewChild, NgZone, ɵConsole } from '@angular/core';
import { NavController, Events, AlertController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  // @ViewChild('content') content: Content;
  
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
  // uid: string;
  sendTo;
  keyuid: string;
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
      private socialSharing: SocialSharing) { 
        
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
   
  //  zoom(url){
  //     this.Viewer.show(url.Image, "" ,{share:true, copyToReference: true});
  //   }
  ngOnInit() {
  }


}
