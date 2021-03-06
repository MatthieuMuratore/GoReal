import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';
import { AnonymousGuardService } from './services/anonymous-guard.service';
import { Role } from './models/role.enum';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '', canActivate : [AnonymousGuardService], loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule) },
  { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'play', canActivate : [AuthGuardService], loadChildren: () => import('./modules/play/play.module').then(m => m.PlayModule) },
  { path: 'tournament', canActivate : [AuthGuardService], loadChildren: () => import('./modules/tournament/tournament.module').then(m => m.TournamentModule) },
  { path: 'leaderboards', canActivate : [AuthGuardService], loadChildren: () => import('./modules/leaderboards/leaderboards.module').then(m => m.LeaderboardsModule) },
  { path: 'learn', canActivate : [AuthGuardService], loadChildren: () => import('./modules/learn/learn.module').then(m => m.LearnModule) },
  { path: 'joseki', canActivate : [AuthGuardService], loadChildren: () => import('./modules/joseki/joseki.module').then(m => m.JosekiModule) },
  { path: 'demo', canActivate : [AuthGuardService], loadChildren: () => import('./modules/demo/demo.module').then(m => m.DemoModule) },
  { path: 'profile', canActivate : [AuthGuardService], loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'administrator', canActivate : [AuthGuardService], data: {roles: Role.SuperAdministrator}, loadChildren: () => import('./modules/administrator/administrator.module').then(m => m.AdministratorModule) },
  { path: 'settings', canActivate : [AuthGuardService], loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule) },
  //{ path: '**', redirectTo: '/notFound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
