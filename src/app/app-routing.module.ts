import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'signin', loadChildren: './page/signin/signin.module#SigninPageModule'  },
  { path: 'otp', loadChildren: './page/otp/otp.module#OtpPageModule'  },
  { path: 'chatroom', loadChildren: './page/chatroom/chatroom.module#ChatroomPageModule' ,canActivate:[AuthGuard ] },
  { path: 'collection', loadChildren: './page/collection/collection.module#CollectionPageModule'},
  { path: 'chat', loadChildren: './page/chat/chat.module#ChatPageModule' },
  { path: 'add-friend', loadChildren: './page/add-friend/add-friend.module#AddFriendPageModule' },
  { path: 'annonymous', loadChildren: './page/annonymous/annonymous.module#AnnonymousPageModule' },
  // ,canActivate:[AuthGuard ] 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
