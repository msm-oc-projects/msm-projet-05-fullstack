import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TopicComponent } from './topic/topic.component';
import { AuthComponent } from './auth.component';
import { FeedComponent } from './feed.component';
import { PostCreateComponent } from './post-create.component';
import { PostDetailComponent } from './post-detail.component';
import { ProfileComponent } from './profile.component';
import { authGuard } from './auth.guard';
import { authInterceptor } from './auth.interceptor';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'articles', component: FeedComponent, canActivate: [authGuard] },
  { path: 'articles/new', component: PostCreateComponent, canActivate: [authGuard] },
  { path: 'articles/:id', component: PostDetailComponent, canActivate: [authGuard] },
  { path: 'topics', component: TopicComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'articles' },
  { path: '**', redirectTo: 'articles' }
];

@NgModule({
  declarations: [
    AppComponent,
    TopicComponent,
    AuthComponent,
    FeedComponent,
    PostCreateComponent,
    PostDetailComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
