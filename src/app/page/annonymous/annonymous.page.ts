import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/File/ngx';

@Component({
  selector: 'app-annonymous',
  templateUrl: './annonymous.page.html',
  styleUrls: ['./annonymous.page.scss'],
})
export class AnnonymousPage implements OnInit {
  text = 'Check out the Ionic Academy!';
  url = 'https://ionicacademy.com';
 
  constructor(private socialSharing: SocialSharing, private file: File) { }

  ngOnInit() {
  }
  // firebase.auth().signInAnonymously().catch(function(error) {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   // ...
  // });
  async shareTwitter() {
    // Either URL or Image
    this.socialSharing.shareViaTwitter(null, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }
 
  async shareWhatsApp() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }
 
  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/imgs/`, 'academy.jpg', this.file.cacheDirectory, `${new Date().getTime()}.jpg`);
  }
 
  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }
 
  async shareEmail() {
    let file = await this.resolveLocalFile();
 
    this.socialSharing.shareViaEmail(this.text, 'My custom subject', ['saimon@devdactic.com'], null, null, file.nativeURL).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
  }
 
  async shareFacebook() {
    let file = await this.resolveLocalFile();
 
    // Image or URL works
    this.socialSharing.shareViaFacebook(null, file.nativeURL, null).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
  }

}
