import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes } from '@angular/router';
import * as firebase from 'firebase';

import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
 import { FilePath } from '@ionic-native/file-path/ngx';
 import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { IonicStorageModule } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import 'firebase/auth'; 
import 'firebase/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { NavParams} from '@ionic/angular';
import { ChatPage } from './page/chat/chat.page';
// import { Chat , Message, MessageType} from 'src/app/module/chats';

// const routes: Routes = [
//   {
//     path: ':uid',
//     component: ChatPage
//   }  
// ];

const firebaseConfig = {
  apiKey: "AIzaSyC-TcnZPdzaFC3QUY1TdWXGI8ZRPgz70Fo",
  authDomain: "chattingapp-dc2f5.firebaseapp.com",
  databaseURL: "https://chattingapp-dc2f5.firebaseio.com",
  projectId: "chattingapp-dc2f5",
  storageBucket: "chattingapp-dc2f5.appspot.com",
  messagingSenderId: "747924927394",
  appId: "1:747924927394:web:b036a72b71a126e9"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig ,'chattingapp-dc2f5'),
    AngularFirestoreModule ,
    ReactiveFormsModule,FormsModule,
    MomentModule ,
    HttpClientModule,
    // IonicStorageModule.forRoot()
    AngularFireStorageModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    SocialSharing,
    WebView,
    FilePath,
    ImagePicker,FileTransfer,  FileTransferObject ,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
