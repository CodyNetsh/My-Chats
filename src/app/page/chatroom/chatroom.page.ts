import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {  Events, AlertController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  
  Message: any
  Chat: any
  MessageType: any ;
  
  uid: any;
  chatRef: any;
 message;
 users;
  mylist;
  TimeStamp: any;
  UserID: boolean;
  myrequests: any;
  myfriends: any[];


 

  constructor(private route:ActivatedRoute,private router:Router,private authService: AuthenticationService,public afAuth: AngularFireAuth,
    private fire:AngularFirestore,private events:Events,public alertCtrl: AlertController
      ,private camera: Camera,public actionSheetController: ActionSheetController
    ) { 
     this.uid =this.afAuth.auth.currentUser.uid;
      this.chatRef = this.fire.collection('userCol').snapshotChanges().subscribe(data =>{
      this.users = data.map ( e => {

        return{ 
          uid: e.payload.doc.id,
          ...e.payload.doc.data()
        } ;
      
      });
      
    })
  
    this.takePhoto();
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

  sign(users){
   
      this.router.navigate(['/signin'], {queryParams:{uid: this.afAuth.auth.currentUser.uid,  displayName: users.displayName, photoURL: users.photoURL}})
     
  }
  search(){
    this.router.navigateByUrl("add-friend")
  }
  add(){
    this.router.navigateByUrl("add-friend")
  }
  logoutUser() {
    this.authService.logout()
      
  }
  
accept(item) {
  this.authService.acceptrequest(item).then(() => {

    let newalert = this.alertCtrl.create({
    });
    // newalert.present();
  })
}
isDupe(chat){
  // do some logic to ensure that dupe is not displayed
  return true; // if dupe
}
buddychat(chat) {
  this.authService.initializebuddy(chat);
  this.router.navigateByUrl("chat");

}

private(userChat){
this.router.navigate(['/chat'], { queryParams:{ displayName:userChat.displayName,photoURL:userChat.photoURL,uid:userChat.uid}});
}

ignore(item) {
  this.authService.deleterequest(item).then(() => {
     alert('Request ignored');
  }).catch((err) => {
    alert(err);
  })
}

  group(){
    this.router.navigateByUrl("collection")
  }
  showMessages() {
  
  }
 

  ngOnInit() {


}
async presentActionSheet() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Albums',
    buttons: [
   
    {
      text: 'Profile Update',
      icon: 'person',
      handler: () => {
        console.log('signin clicked');
      this.router.navigate(['/signin'], {queryParams:{uid: this.afAuth.auth.currentUser.uid,  displayName: this.chatRef.displayName, lastname:this.chatRef.lastname,photoURL: this.chatRef.photoURL}})

      }
    }, {
      text: 'LogOut',
      icon: 'arrow-dropright-circle',
      handler: () => {
        console.log('LogOut clicked');
        this.authService.logout()
      }
    }]
  });
  await actionSheet.present();
}
}
