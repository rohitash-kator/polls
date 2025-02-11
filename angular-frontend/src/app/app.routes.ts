import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { PollFormComponent } from './components/poll-form/poll-form.component';
import { NotFoundErrorComponent } from './components/shared/not-found-error/not-found-error.component';
import { ProfileComponent } from './components/shared/profile/profile.component';
import { CreatePollFormComponent } from './components/admin/create-poll-form/create-poll-form.component';
import { PollResultComponent } from './components/admin/poll-result/poll-result.component';

export const routes: Routes = [
  // Routes for unauthenticated users (guest routes like login/signup)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Admin routes with role-based protection (only for Admin users)
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/create', component: CreatePollFormComponent },
  { path: 'admin/poll/result/:pollId', component: PollResultComponent },

  // User routes with role-based protection (only for User users)
  { path: 'user', component: UserDashboardComponent },
  { path: 'user/poll/:pollId', component: PollFormComponent },

  // Profile route (only for authenticated users)
  { path: 'profile', component: ProfileComponent },

  // Default route (redirect to login page)
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Wildcard route (for 404 - not found errors)
  { path: '**', component: NotFoundErrorComponent },
];
