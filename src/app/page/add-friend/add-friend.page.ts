import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';
import { connreq } from 'src/app/module/connreq';
import * as firebase from 'firebase'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {
  newrequest = {} as connreq;
  temparr = [];
  filteredusers = [];
  myrequests: any;
  firereq: any;
  firefriends: any;
  myfriends: any[];
  uid: any;
  chatRef: any;
  goalList: any[];
  loadedGoalList: any[];
  itemList: Item[];
  item = {Message:"",
  Name:"",
  TimeStamp:"",
  UserID:""
  } ;
  constructor(private router:Router,
    private authService: AuthenticationService, 
    public events: Events,public afAuth: AngularFireAuth,  private fire:AngularFirestore) {
    this.authService.getallusers().then((res: any) => {
      this.filteredusers = res;
      this.temparr = res;
   })
   this.uid =this.afAuth.auth.currentUser.uid;
    this.chatRef = this.fire.collection('userCol',ref=>ref.orderBy('TimeStamp')).valueChanges();
  

   }
  back(){
    this.router.navigateByUrl("chatroom")
  }
  ngOnInit() {
    // this.authService.getmyrequests();
    // this.events.subscribe('gotrequests', () => {
    //   this.myrequests = [];
    //   this.myrequests = this.authService.userdetails;
    // })

    this.fire.collection(`userCol`).valueChanges()
    .subscribe(goalList => {
      this.goalList = goalList;
      this.loadedGoalList = goalList;
  });
  }
  searchuser(searchbar) {
    this.filteredusers = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }
    // this.uid =this.afAuth.auth.currentUser.uid;
    
    this.uid =this.afAuth.auth.currentUser.uid;
    this.chatRef = this.fire.collection('userCol').snapshotChanges().subscribe(data =>{

      this.filteredusers = data.map ( e => {

        return{ 
          Name: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Item;
      
      });
      
  // console.log(this.filteredusers);
    })
    this.filteredusers = this.filteredusers.filter((uid) => {
      if (this.afAuth.auth.currentUser.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })

    // this.initializeItems();

    // const searchTerm = searchbar.srcElement.value;
  
    // if (!searchTerm) {
    //   return;
    // }
  
    // this.goalList = this.goalList.filter(currentUser => {
    //   if (currentUser.Name && searchTerm) {
    //     if (currentUser.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
    //       return true;
    //     }
    //     return false;
    //   }
    // });

  }
//   initializeItems() {
//   this.goalList = this.loadedGoalList;
// }

// filterList(evt) {
//   this.initializeItems();

//   const searchTerm = evt.srcElement.value;

//   if (!searchTerm) {
//     return;
//   }

//   this.goalList = this.goalList.filter(currentGoal => {
//     if (currentGoal.goalName && searchTerm) {
//       if (currentGoal.goalName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
//         return true;
//       }
//       return false;
//     }
//   });
// }

sendreq(recipient) {
    this.newrequest.sender = firebase.auth().currentUser.uid;
    this.newrequest.recipient = recipient.uid;
    if (this.newrequest.sender === this.newrequest.recipient)
      alert('You are your friend always');
    else {
      // let successalert = this.alertCtrl.create({
        // title: 'Request sent',
        // subTitle: 'Your request was sent to ' + recipient.displayName,
        // buttons: ['ok']
      // });
    
      this.authService.sendrequest(this.newrequest).then((res: any) => {
        if (res.success) {
          // successalert.present();
          let sentuser = this.filteredusers.indexOf(recipient);
          this.filteredusers.splice(sentuser, 1);
        }
      }).catch((err) => {
        alert(err);
      })
    }
  }
  //==================================add request==========
  acceptrequest(buddy) {
    var myfriends = [];
    var promise = new Promise((resolve, reject) => {
      this.firefriends.child(firebase.auth().currentUser.uid).push({
        uid: buddy.uid
      }).then(() => {
        this.firefriends.child(buddy.uid).push({
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.deleterequest(buddy).then(() => {
          resolve(true);
        })
        
        }).catch((err) => {
          reject(err);
         })
        }).catch((err) => {
          reject(err);
      })
    })
    return promise;
  }
 
  deleterequest(buddy) {
    var promise = new Promise((resolve, reject) => {
     this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
          let somekey;
          for (var key in snapshot.val())
            somekey = key;
          this.firereq.child(firebase.auth().currentUser.uid).child(somekey).remove().then(() => {
            resolve(true);
          })
         })
          .then(() => {
          
        }).catch((err) => {
          reject(err);
        })
    })
    return promise; 
  }
  getmyfriends() {
    let friendsuid = [];
    this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allfriends = snapshot.val();
      this.myfriends = [];
      for (var i in allfriends)
        friendsuid.push(allfriends[i].uid);
        
      this.authService.getallusers().then((users) => {
        this.myfriends = [];
        for (var j in friendsuid)
          for (var key in this.authService) {
            if (friendsuid[j] === users[key].uid) {
              this.myfriends.push(users[key]);
            }
          }
        this.events.publish('friends');
      }).catch((err) => {
        alert(err);
      })
    
    })
  }
}
