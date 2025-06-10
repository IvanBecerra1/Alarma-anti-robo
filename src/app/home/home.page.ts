import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController,IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { keyOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { AutenticacionService } from '../servicio/autenticacion.service';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import { Motion } from '@capacitor/motion';
import { Haptics } from '@capacitor/haptics';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { EstadoOrientacion } from '../enumerador/estado-orientacion';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonButton, IonItem, 
    CommonModule, IonInput, IonIcon, FormsModule, IonFabButton, IonFab, IonHeader, IonToolbar, IonTitle, IonContent, LottieComponent],
})
export class HomePageimplements implements OnInit {
  private router: Router = inject(Router);
  private toastCtrl: ToastController = inject(ToastController);
  private autenticacion : AutenticacionService = inject(AutenticacionService);
  private bufferPosiciones: EstadoOrientacion[] = [];
  private readonly POSICIONES_REQUERIDAS = 3;
  alarmaActiva: boolean = false;
  botonesBloqueados: boolean = false;
sonidosActivos: HTMLAudioElement[] = [];

  estadoAnterior: EstadoOrientacion = EstadoOrientacion.HORIZONTAL;
  animation!: any;
  isPlaying: boolean = false;
  claveIngresada: string = '';
  aceleracion = { x: 0, y: 0, z: 0 };

  posicion = 'Desconocida';
  ultimaDireccion: 'izquierda' | 'derecha' | null = null;

  constructor() {
    addIcons({ 'key-outline': keyOutline });
  }

  
ngOnInit() {
  Motion.addListener('accel', (event) => {
    if (!this.alarmaActiva) return;
    
    const { x, y, z } = event.acceleration ?? { x: 0, y: 0, z: 0 };
    this.aceleracion = event.acceleration ?? { x: 0, y: 0, z: 0 };
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const absZ = Math.abs(z);

    let estadoActual: EstadoOrientacion = EstadoOrientacion.INTERMEDIA;

    if (absZ > 6 && absZ > absX && absZ > absY) {
      estadoActual = EstadoOrientacion.HORIZONTAL;
    } else if (absY > absZ && absY > absX && absY > 1) {
      estadoActual = EstadoOrientacion.VERTICAL;
    } else if (x > 1.5 && absX > absY && absX > absZ) {
      estadoActual = EstadoOrientacion.IZQUIERDA;
    } else if (x < -1.5 && absX > absY && absX > absZ) {
      estadoActual = EstadoOrientacion.DERECHA;
    }

    // Agregamos al buffer
    this.bufferPosiciones.push(estadoActual);
    if (this.bufferPosiciones.length > this.POSICIONES_REQUERIDAS) {
      this.bufferPosiciones.shift(); // Mantener solo los últimos X valores
    }

    // Si todas las últimas posiciones son iguales, considerar estable
    const todasIguales = this.bufferPosiciones.every(p => p === estadoActual);

    if (todasIguales && estadoActual !== this.estadoAnterior) {
      this.estadoAnterior = estadoActual;

      switch (estadoActual) {
        case EstadoOrientacion.DERECHA:
          this.reproducirSonido('derecha.wav');
          break;
        case EstadoOrientacion.IZQUIERDA:
          this.reproducirSonido('izquierda.wav');
          break;
        case EstadoOrientacion.VERTICAL:
          this.activarLuzYSonido('vertical.wav');
          break;
        case EstadoOrientacion.HORIZONTAL:
          this.vibrarYSonar('horizontal.wav');
          break;
      }
    }
  });
}

  options: AnimationOptions = {
    path: '../../../assets/megafono.json',
    autoplay: false,
    loop: true
  };

  onAnimationCreated(animationItem: any) {
    this.animation = animationItem;
    this.animation.stop(); 
  }

 togglePlayPause() {
  if (!this.animation) return;

  if (!this.isPlaying) {
    this.animation.play();
    this.isPlaying = true;
    this.alarmaActiva = true; // ✅ Activa la alarma
  }
}

  async probarLinterna() {
    try {
      const disponible = await CapacitorFlash.isAvailable();
      if (disponible.value) {
        await CapacitorFlash.switchOn({ intensity: 1.0 });
        setTimeout(() => CapacitorFlash.switchOff(), 5000);
      } else {
        this.mostrarToast('Linterna no disponible', 'danger');
      }
    } catch (err) {
      console.error('Error al encender linterna', err);
      this.mostrarToast('Error linterna', 'danger');
    }
  }

  async activarLuzYSonido(nombre: string) {
    try {
      await CapacitorFlash.switchOn({ intensity: 1.0 });
      this.reproducirSonido(nombre);
      setTimeout(() => CapacitorFlash.switchOff(), 5000);
    } catch (error) {
      console.error('Error linterna', error);
    }
  }

  async vibrarYSonar(nombre: string) {
    await Haptics.vibrate();
    this.reproducirSonido(nombre);
  }

  reproducirSonido(nombre: string) {
    const audio = new Audio(`assets/sonidos/${nombre}`);
    audio.play();
    
  this.sonidosActivos.push(audio);
  }
detenerTodosLosSonidos() {
  this.sonidosActivos.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  this.sonidosActivos = [];
}
  async apagarAlarma() {
  const usuario = this.autenticacion.obtenerUsuario();

  if (!usuario || !usuario.email) {
    this.reproducirSonido('claveIncorrecta.wav');
    return;
  }

  const credential = EmailAuthProvider.credential(usuario.email, this.claveIngresada);

  try {
    await reauthenticateWithCredential(usuario, credential);

      this.detenerTodosLosSonidos(); // 🔇 detener todo

    // ✅ Contraseña válida: apagar la alarma
    this.animation.pause();
    this.isPlaying = false;
    this.claveIngresada = '';
    this.alarmaActiva = false;
    navigator.vibrate?.(0);

  } catch (error) {
    
      this.mostrarToast('Contraseña incorrecta... espera 5 segundos para volver a intentar', 'danger');
  this.botonesBloqueados = true; // ⛔ Bloquea botones
  this.reproducirSonido('claveIncorrecta.wav');

  await CapacitorFlash.switchOn({ intensity: 1.0 });
  setTimeout(() => CapacitorFlash.switchOff(), 3000);

  Haptics.vibrate({ duration: 3000 });

  const sonidos = ['izquierda.wav', 'derecha.wav', 'horizontal.wav', 'vertical.wav'];
  sonidos.forEach((sonido, i) => {
    setTimeout(() => this.reproducirSonido(sonido), (i + 1) * 1000);
  });

  // ✅ Reactiva los botones después de 5 segundos
  setTimeout(() => {
    this.botonesBloqueados = false;
  }, 5000);
}}


  async mostrarToast(mensaje: string, color: 'success' | 'danger' = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'middle',
      color: color,
    });
    await toast.present();
  }

  async cerrarSesion() {
    try {
      await this.autenticacion.cerrarSesion();
      
      this.detenerTodosLosSonidos(); // 🔇 detener todo
      this.mostrarToast('Sesión cerrada!', 'success');
      this.router.navigate(['/inicio-sesion']);
    } catch(error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}