import { Routes } from '@angular/router';
import { SplashComponent } from './componentes/splash/splash.component';
import { LoginComponent } from './componentes/login/login.component';
import { HomePageimplements } from './home/home.page';

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent
  },
  {
    path: 'inicio-sesion', 
    component: LoginComponent
  },
  {
    path: 'inicio',
    component:HomePageimplements
  }
  
];
