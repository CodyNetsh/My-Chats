import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  Observable, of} from 'rxjs';
import { fromEvent } from 'rxjs';
import * as firebase from 'firebase'

import { map } from 'rxjs/operators';
 import * as moment from 'moment';
 import { MessageType, Chat } from '../../module/chats';
import { CollectionPage } from '../collection/collection.page';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, Events, AlertController } from '@ionic/angular';
// import { NavController } from '@ionic/angular';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  
  Message: any
  Chat: any
  MessageType: any ;
  chats: Observable<any[]>;

  // item = {Message:"",
  // Name:"",
  // TimeStamp:"",
  // UserID:""
  // } ;
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
      
    ) { 
    //  this.chats = this.findChats();
     this.uid =this.afAuth.auth.currentUser.uid;
      this.chatRef = this.fire.collection('userCol').snapshotChanges().subscribe(data =>{
      this.users = data.map ( e => {

        return{ 
          uid: e.payload.doc.id,
          ...e.payload.doc.data()
        } ;
      
      });
      
  // console.log(this.itemList);

    })
  
    // this.groceryList = this.grocery.getGrocery();


    // this.mylist = this.authService.list;
    // console.log(this.mylist);

    // this.events.subscribe('gotrequests', () => {
    //   this.myrequests = [];
    //   this.myrequests = this.authService.userdetails;
    // })
    
    // this.events.subscribe('gotrequests', () => {
    //   this.myrequests = [];
    //   this.myrequests = this.authService.userdetails;
    // })
  }

  add(){
    this.router.navigateByUrl("add-friend")
  }
  

accept(item) {
  this.authService.acceptrequest(item).then(() => {

    let newalert = this.alertCtrl.create({
      // title: 'Friend added',
      // subTitle: 'Tap on the friend to chat with him',
      // buttons: ['Okay']
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
// console.log(this.user.displayName,this.user.photoURL)
this.router.navigate(['/chat'], { queryParams:{ displayName:userChat.displayName,photoURL:userChat.photoURL,uid:userChat.uid}});
}

ignore(item) {
  this.authService.deleterequest(item).then(() => {
     alert('Request ignored');
  }).catch((err) => {
    alert(err);
  })
}
//   groupUserID(UserID){

//      let sortedUserID = UserID;
//     let currentLetter = false;
//     let currentUserID = [];

//     sortedUserID.forEach((value, index) => {

//         if(value.charAt(0) != currentLetter){

//             currentLetter = value.charAt(0);

//             let newGroup = {
//                 letter: currentLetter,
//                 UserID: []
//             };

//             currentUserID = newGroup.UserID;
//             this.itemList.push(newGroup);

//         } 

//         currentUserID.push(value);

//     });

// }
  // private 
  // findChats(): Observable<any[]> {
  //   return of([
  //     {
  //       id: 'H0lHiShCnBL03UmbOaMQ',
  //       name: 'Ethan Gonzalez',
  //       picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
  //       lastMessage: {
  //         content: 'You on your way?',
  //         createdAt: moment().subtract(1, 'hours').toDate()
  //         ,  type: MessageType.TEXT
  //       }
  //     },
  //     {
  //       id: 'VlMcUK9fActSzRiTP1T3',
  //       name: 'Bryan Wallace',
  //       picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
  //       lastMessage: {
  //         content: 'Hey, it\'s me',
  //         createdAt: moment().subtract(2, 'hours').toDate()
  //         ,  type: MessageType.TEXT
  //       }
  //     },
  //     {
  //       id: '2',
  //       name: 'Avery Stewart',
  //       picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
  //       lastMessage: {
  //         content: 'I should buy a boat',
  //         createdAt: moment().subtract(1, 'days').toDate()
  //         ,  type: MessageType.TEXT
  //       }
  //     },
  //     {
  //       id: '3',
  //       name: 'Katie Peterson',
  //       picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
  //       lastMessage: {
  //         content: 'Look at my mukluks!',
  //         createdAt: moment().subtract(4, 'days').toDate()
  //         ,  type: MessageType.TEXT
  //       }
  //     },
  //     {
  //       id: '37rXvBfcTQAylBd3E4Fo',
  //       name: 'Ray Edwards',
  //       picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
  //       lastMessage: {
  //         content: 'This is wicked good ice cream.',
  //         createdAt: moment().subtract(2, 'weeks').toDate(), 
  //          type: MessageType.TEXT
  //       }
  //     }
  //   ]);
  // }
  group(){
    this.router.navigateByUrl("collection")
  }
  showMessages() {
    // this.router.navigateByUrl("collection");
    // this.push.listChannels(CollectionPage, {chat});
    // console.log(this.chat.id,this.user.displayName,this.chat.picture,this.chat.lastMessage)
    // this.router.navigate(['/collection'], { queryParams:{ id:this.chat.id,displayName:this.user.displayName,picture:this.chat.picture,lastMessage:this.chat.lastMessage}});
  
  }
  removeChat(chat: Chat) {
    this.chats = this.chats.pipe(map((chatsArray: Chat[]) => {
      const chatIndex = chatsArray.indexOf(chat);
      if (chatIndex !== -1) {
        chatsArray.splice(chatIndex, 1);
      }
 
      return chatsArray;
    }));
    this.Chat.remove({_id: chat.id}).subscribe(() => {
    });
  }

  ngOnInit() {

   
//     this.route.queryParams
//     .subscribe(params =>
//  {
     
//       this.user.displayName= params.displayName;

//       console.log(this.user.displayName)
//   });
  
  // this.authService.getmyrequests();
  // this.authService.getmyfriends();
  // this.myfriends = [];
  // this.events.subscribe('gotrequests', () => {
  //   this.myrequests = [];
  //   this.myrequests = this.authService.userdetails;
  // })
  // this.events.subscribe('friends', () => {
  //   this.myfriends = [];
  //   this.myfriends = this.authService.myfriends; 
  // })
}

}
