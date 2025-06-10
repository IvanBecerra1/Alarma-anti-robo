import { Component, inject, OnInit } from '@angular/core';
import { LottieComponent } from 'ngx-lottie';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  imports: [IonContent, LottieComponent, NgIf, IonContent]
})
export class SplashComponent implements OnInit {

  private router = inject(Router);
  constructor(){}
  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/inicio-sesion'); // o '/home'
    }, 5000); // duración deseada del splash
  }
  options = {
    path: 'assets/animaciones/splash.json',
    autoplay: true,
    loop: true
  };

  onAnimationCreated(animationItem: any) {
    animationItem.addEventListener('complete', () => {
      console.log('Animación terminada!');
      // redirigir con Router aquí si querés
    });
  }
}
