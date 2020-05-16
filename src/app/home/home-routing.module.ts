import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('./friends/friends.module').then(m => m.FriendsPageModule)
          }
        ]
      },
      {
        path: 'user/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('./user/user.module').then( m => m.UserPageModule)
          }
        ]
      },
      {
        path: 'game',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('./game/game.module').then(m => m.GamePageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('./profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'profile/edit',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('./profile/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'game',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full'
  },
  {
    path: 'search-modal-user',
    loadChildren: () => import('./friends/search-modal-user/search-modal-user.module').then( m => m.SearchModalUserPageModule)
  },
  {
    path: 'select-level-modal',
    loadChildren: () => import('./game/select-level-modal/select-level-modal.module').then( m => m.SelectLevelModalPageModule)
  },
  {
    path: 'game/match/:id',
    loadChildren: () => import('./game/match/match.module').then( m => m.MatchPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'game/practise/:type/:level',
    loadChildren: () => import('./game/practise/practise.module').then( m => m.PractisePageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {

  constructor() {
  }
}
