import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase'
  import { FileChooser } from '@ionic-native/file-chooser';
import { connreq } from '../module/connreq';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  buddymessages: any[];
  chat: any;
  [x: string]: any;
  list: any;
  firedata: any;
  firestore: any;
  firereq = firebase.database().ref('/requests');
  userdetails;
  // firebuddychats = firebase.database().ref('/chat');

  constructor(public afAuth: AngularFireAuth,
    public router: Router,public nav: NavController,private fire:AngularFirestore,
    //  public filechooser: FileChooser,
    ) { 

      afAuth.auth.onAuthStateChanged((user)=>{
          if(user){
            this.nav.navigateRoot("chatroom");
          }else{
            this.nav.navigateRoot("");
          }
         
        })

   afAuth.authState.subscribe(userResponse  => {
     // this.authState = auth;
     if (userResponse ) {
       localStorage.setItem('user', JSON.stringify(userResponse ));
     } else {
       localStorage.setItem('user', null);
     }
   }); 
 }
//  getbuddymessages() {
    
//   let temp;
//   this.firebuddychats.set(firebase.auth().currentUser.uid).set(this.chat.uid).on('value', (snapshot) => {
//     this.buddymessages = [];
//     temp = snapshot.val();
//     for (var tempkey in temp) {
//       this.buddymessages.push(temp[tempkey]);
//     }
//     this.events.publish('newmessage');
//   })
// }
// update(user, uid){
//   this.chatRef = this.fire.doc<User>('userCol/'+ uid);
//   this.chatRef.update(user);
//  }
delete(uid){
  this.fire.doc('userCol/' + uid).delete();
 
 }
 addnewmessage(msg) {
  if (this.chat) {
    var promise = new Promise((resolve, reject) => {
      this.firebuddychats.set(firebase.auth().currentUser.uid).set(this.chat.uid).push({
        sentby: firebase.auth().currentUser.uid,
        message: msg,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        this.firebuddychats.get(this.chat.uid).get(firebase.auth().currentUser.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          resolve(true);
          }).catch((err) => {
            reject(err);
        })
      })
    })
    return promise;
  }
}
 
 initializebuddy(chat:string) {
  this.chat.uid = chat;
   }

 uploadimage() {
  var promise = new Promise((resolve, reject) => {
      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                imageStore.put(imgBlob).then((res) => {
                  this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                    resolve(url);
                  }).catch((err) => {
                      reject(err);
                  })
                }).catch((err) => {
                  reject(err);
                })
              }
            })
          })
        })
    })
  })    
   return promise;   
}
  nativepath(nativepath: any, arg1: (res: any) => void) {
    throw new Error("Method not implemented.");
  }
//   get authenticated(): boolean {
//     return this.authState !== null;
//   }
// // Returns current user
// get currentUser(): any {
//   return this.authenticated ? this.authState.auth : null;
// }

// // Returns current user UID
// get currentUserId(): string {
//   return this.authenticated ? this.authState.uid : '';
// }


// getuserdetails() {
//     var promise = new Promise((resolve, reject) => {
//     this.firedata.collection(firebase.auth().currentUser.uid).once('value', (snapshot) => {
//       resolve(snapshot.val());
//     }).catch((err) => {
//       reject(err);
//       })
//     })
//     return promise;
//   }
getallusers() {
  var promise = new Promise((resolve, reject) => {
    this.firedata.get('uid').once('value', (snapshot) => {
      let userdata = snapshot.val();
      let temparr = [];
      for (var key in userdata) {
        temparr.push(userdata[key]);
      }
      resolve(temparr);
    }).catch((err) => {
      reject(err);
    })
  })
  return promise;
}

 async login(email: string, password: string) {
 
 return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
 }

 async register(email: string, password: string) {
   return await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
 }

 signInWithEmail(credentials) {
   console.log('Sign in with email');
   return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password);
 }
 signUp(credentials) {
   return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
 }
 async sendEmailVerification() {
   return await this.afAuth.auth.currentUser.sendEmailVerification();
 }
 async logout() {
   return await this.afAuth.auth.signOut();
 }


 isUserLoggedIn() {
   return JSON.parse(localStorage.getItem('user'));
 }

//  async  loginWithGoogle() {
//    return await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())

//  }
//  async  loginWithFaceBook() {
//    return await this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())

//  }
//  async  loginWithTwitter() {
//    return await this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider())

//  }
sendrequest(req: connreq) {
  var promise = new Promise((resolve, reject) => {
    this.firereq.child(req.recipient).push({
    sender: req.sender
    }).then(() => {
      resolve({ success: true });
      }).catch((err) => {
        resolve(err);
  })
  })
  return promise;  
}
getmyrequests() {
  let allmyrequests;
  var myrequests = [];
  this.firereq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
    allmyrequests = snapshot.val();
    myrequests = [];
    for (var i in allmyrequests) {
      myrequests.push(allmyrequests[i].sender);
    }
    this.userservice.getallusers().then((res) => {
      var allusers = res;
      this.userdetails = [];
      for (var j in myrequests)
        for (var key in allusers) {
          if (myrequests[j] === allusers[key].uid) {
            this.userdetails.push(allusers[key]);
          }
        }
      this.events.publish('gotrequests');
    })

})
}  

updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.currentUser.updateProfile({
      displayName: newname,
      photoURL: this.afAuth.auth.currentUser.photoURL
    }).then(() => {
      this.firedata.child(firebase.auth().currentUser.uid).update({
        displayName: newname,
        photoURL: this.afAuth.auth.currentUser.photoURL,
        uid: this.afAuth.auth.currentUser.uid
      }).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
      }).catch((err) => {
        reject(err);
    })
    })
    return promise;
  }

  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  updateimage(imageurl) {
    var promise = new Promise((resolve, reject) => {
        this.afAuth.auth.currentUser.updateProfile({
            displayName: this.afAuth.auth.currentUser.displayName,
            photoURL: imageurl      
        }).then(() => {
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
            displayName: this.afAuth.auth.currentUser.displayName,
            photoURL: imageurl,
            uid: firebase.auth().currentUser.uid
            }).then(() => {
                resolve({ success: true });
                }).catch((err) => {
                    reject(err);
                })
        }).catch((err) => {
              reject(err);
           })  
    })
    return promise;
}

  adduser(newuser) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
        this.afAuth.auth.currentUser.updateProfile({
          displayName: newuser.displayName,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
        }).then(() => {
          this.firedata.child(this.afAuth.auth.currentUser.uid).set({
            uid: this.afAuth.auth.currentUser.uid,
            displayName: newuser.displayName,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
          }).then(() => {
            resolve({ success: true });
            }).catch((err) => {
              reject(err);
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
 

 async sendPasswordResetEmail(passwordResetEmail: string) {
   return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
 }
 getChat(){
  // //this.list = this.db;
  return this.fire.collection('userCol').valueChanges();
   }
   getChatList()
   {
     return this.fire.collection('userCol').snapshotChanges();
   }
//    encodeImageUri(imageUri, callback) {
//     var c = document.createElement('canvas');
//     var ctx = c.getContext("2d");
//     var img = new Image();
//     img.onload = function () {
//       var aux:any = this;
//       c.width = aux.width;
//       c.height = aux.height;
//       ctx.drawImage(img, 0, 0);
//       var dataURL = c.toDataURL("image/jpeg");
//       callback(dataURL);
//     };
//     img.src = imageUri;
//   };
 }
