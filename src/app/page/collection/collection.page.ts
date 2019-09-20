import { Component, OnInit } from '@angular/core';
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
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
// import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

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

  constructor( private router:Router,
    private camera: Camera,
    private route:ActivatedRoute,
    public Storage: AngularFireStorage,private authService: AuthenticationService,public afAuth: AngularFireAuth,  private fire:AngularFirestore
    ,public actionSheetController: ActionSheetController    ) {
   
  this.key =this.afAuth.auth.currentUser.uid;
    this.chatRef = this.fire.collection('userCol',ref=>ref.orderBy('TimeStamp')).valueChanges();

    this.takePhoto();

   }

   back(){
    this.router.navigateByUrl("chatroom")
  }
 
  ngOnInit() {

     }

    //  zoom(urlfile){
    //   this.Viewer.show(urlfile.image, "" ,{share:true, copyToReference: true});
    // }

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
 
    takePhoto() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      
      this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64 (DATA_URL):
       let base64Image = 'data:image/jpeg;base64,' + imageData;
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
