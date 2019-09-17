import { Component, OnInit, Inject } from '@angular/core';
// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
// import { Chat, MessageType,Message } from 'src/app/module/chats';
// import { NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
export * from '../../module/chats';
// import { Messages } from 'api/collections';
// import { NavParams } from '@ionic/angular';
// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Chat , Message, MessageType} from 'src/app/module/chats';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase'
import { AuthenticationService } from 'src/app/service/authentication.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorageModule ,AngularFireStorage } from '@angular/fire/storage';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
  // chat: Chat;

  messages: Observable<Message[]>;
  ownership: string;
  Messages: any;
  autoScroller: MutationObserver;
  scrollOffset = 0;
   data= {} as Data;
  keyCode: any;
  message: string;
  uid:  string;
  chatRef: any;
  nickname:string;
  id: any;
  ref: any;
  uploadState: any;
  downloadURL: any;
  chat: any;
  uploadPercent: any;
  key: string;

  constructor( private router:Router,private route:ActivatedRoute,public Storage: AngularFireStorage,private authService: AuthenticationService,public afAuth: AngularFireAuth,  private fire:AngularFirestore

   
    ) {
   
  this.key =this.afAuth.auth.currentUser.uid;
    this.chatRef = this.fire.collection('userCol',ref=>ref.orderBy('TimeStamp')).valueChanges();
   }

   back(){
    this.router.navigateByUrl("chatroom")
  }
 
  ngOnInit() {

     }

   
   send(){
   
     if(this.message != ''){
     
       this.fire.collection('userCol').add({
        Name: this.afAuth.auth.currentUser.displayName,
        Message: this.message,
        UserID: this.afAuth.auth.currentUser.uid,
        TimeStamp:firebase.firestore.FieldValue.serverTimestamp(),
        
       });
       this.message='';
     }
    
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
           this.fire.collection('userCol').add({
            Name: this.afAuth.auth.currentUser.displayName,
            image:urlfile,
            UserID: this.afAuth.auth.currentUser.uid,
            TimeStamp:firebase.firestore.FieldValue.serverTimestamp(),
          });
         
          });
        })
      ).subscribe();
    }
 
    logoutUser() {
      this.authService.logout()
        
    }
}
