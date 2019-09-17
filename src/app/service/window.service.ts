import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor(public afAuth: AngularFireAuth,
    public router: Router,public nav: NavController,private fire:AngularFirestore) { }


  
 get windowRef() {
  return window
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
}
