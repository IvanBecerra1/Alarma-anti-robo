import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EAutenticacion } from 'src/app/enumerador/eautenticacion';
import { AutenticacionService } from 'src/app/servicio/autenticacion.service';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { IonItem, IonContent, IonButton, IonInput, IonLabel, IonNote, IonFooter, IonRadio } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRadioGroup} from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],  imports: [IonRadio, IonNote, 
    IonLabel, IonButton, IonInput, IonItem, IonContent, ReactiveFormsModule, NgIf,FormsModule, IonRadioGroup
  ]
})
export class LoginComponent  implements OnInit {
  usuarioTipo = 1;
  form!: FormGroup;
  enProceso = false;

  private fb = inject(FormBuilder);
  private auth = inject(AutenticacionService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  private toastCtrl: ToastController = inject(ToastController);
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit() {
    
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  seleccionarUsuario(tipo : number){
    this.usuarioTipo = tipo;
    switch (tipo){
      case 1: {
        this.form.setValue({
          correo : "normal@gmail.com",
          clave : "1234567890"
        })

        break;
      }
      case 2: {
        this.form.setValue({
          correo : "tester@gmail.com",
          clave : "1234567890"
        })
        break;
      }
      case 3: {
        this.form.setValue({
          correo : "tecnico@gmail.com",
          clave : "1234567890"
        })
        break;
      }
      

    }
  }

  moverArriba() {
    const container = this.el.nativeElement.querySelector('.contenedor-login');
    this.renderer.addClass(container, 'mover');
  }

  moverAbajo() {
    const container = this.el.nativeElement.querySelector('.contenedor-login');
    this.renderer.removeClass(container, 'mover');
  }
  async login() {
    if (this.enProceso) return;
    this.enProceso = true;
    const { correo, clave } = this.form.value;

    try {
      await this.auth.iniciarSesion(correo, clave);
      this.form.setValue({
        correo : "",
        clave : ""
      })
      this.mostrarToast('Inicio exitoso!', 'success');
      this.router.navigate(['/inicio']);
    } catch (error : any) {
          console.error(error);
    
          const mensajesError = new Map<string, EAutenticacion>([
            ["auth/email-already-in-use", EAutenticacion.CORREO_EN_USO],
            ["auth/weak-password", EAutenticacion.CLAVE_INVALIDO],
            ["auth/invalid-email", EAutenticacion.CORREO_INVALIDO],
            ["auth/missing-email", EAutenticacion.CAMPO_CORREO_VACIO],
            ["auth/missing-password", EAutenticacion.CAMPO_CLAVE_VACIO],
            ["auth/admin-restricted-operation", EAutenticacion.CAMPOS_VACIOS],
            ["auth/invalid-credential", EAutenticacion.CREDENCIALES_INVALIDAS]
          ]);
          const mensaje = mensajesError.get(error.code) || EAutenticacion.ERROR_DESCONOCIDO;
          this.mostrarToast(mensaje);
        } finally {
          this.enProceso = false;
        }
      }
      async mostrarToast(mensaje: string, color: 'success' | 'danger' = 'danger') {
        const toast = await this.toastCtrl.create({
          message: mensaje,
          duration: 2500,
          position: 'middle',
          color: color,
        });
        await toast.present();
      }

  opcionesAnimacion: AnimationOptions = {
    path: 'assets/animaciones/splash.json', 
    autoplay: true,
    loop: true,
  };

  registro() {
    this.router.navigate(["/registro"]);
  }
}
