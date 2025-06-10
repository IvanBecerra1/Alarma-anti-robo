import { Injectable } from '@angular/core';
import { inject } from '@angular/core';

import { collection, addDoc, setDoc, doc, getDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, fetchSignInMethodsForEmail, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private static readonly TABLA_USUARIOS = "usuarios";

  private firestore : Firestore = inject(Firestore);
  private fireAuth : Auth = inject(Auth);

  async registrar(correo : string , clave : string, nombre : string) : Promise<any>{
    try{
      const credencial = await createUserWithEmailAndPassword(this.fireAuth, correo, clave);
      const idUsuario = credencial.user.uid;
      const refDocumento = doc(this.firestore, AutenticacionService.TABLA_USUARIOS, idUsuario);
      
      await setDoc(refDocumento, {
        FECHA_REGISTRO : serverTimestamp(),
        ULTIMA_CONEXION : serverTimestamp(),
        CORREO : correo,
        NOMBRE : nombre,
        ID : idUsuario
      })
      
      return credencial;
    } catch (error){
      throw error;
    }
  }
  async getCurrentUserIdAsync(): Promise<string | null> {
    const user = this.fireAuth.currentUser;
    return user ? user.uid : null;
  }

  async iniciarSesion(correo : string , clave : string ) : Promise <any>{
    try {
      const credencial = await signInWithEmailAndPassword(this.fireAuth, correo, clave);
      const idUsuario = credencial.user.uid;
      const refDocumento = doc(this.firestore, AutenticacionService.TABLA_USUARIOS, idUsuario);

      await updateDoc(refDocumento, {
        ULTIMA_CONEXION : serverTimestamp()
      });

      return credencial;
    } catch (error){
      throw error;
    }
  }
  

  public async obtenerDatosUsuario(): Promise<any> {
    const usuario = this.fireAuth.currentUser;
    if (!usuario) {
      return Promise.reject("No hay un usuario autenticado.");
    }
  
    const refDocumento = doc(this.firestore, AutenticacionService.TABLA_USUARIOS, usuario.uid);
    const snapshotUsuario = await getDoc(refDocumento);
  
    return snapshotUsuario.exists() ? (snapshotUsuario.data()) : null;
  }
  
  public obtenerUsuario() : User  | null {
    return this.fireAuth.currentUser;
  }

  cerrarSesion() : Promise<void>{
    return signOut(this.fireAuth).then(()=>console.log("SESION CERRADO CON EXITO")).catch(error=>error);
  }
}
