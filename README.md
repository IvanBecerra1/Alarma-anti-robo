# Alarma Anti Robo - App móvil con sensores del dispositivo

Aplicación móvil desarrollada con Ionic + Angular que simula una alarma anti robo utilizando los sensores físicos del dispositivo (movimiento, orientación, vibración, linterna y sonido).

El objetivo del proyecto es demostrar la integración entre software y hardware del dispositivo aplicando reglas de negocio en tiempo real ante cambios de posición.

Video demostración:  
https://www.youtube.com/watch?v=d-jiQnSwBnI

---

## Tecnologías utilizadas

- Ionic
- Angular
- Firebase Authentication
- Sensores de movimiento del dispositivo
- Vibración del dispositivo
- Linterna (flash)
- Reproducción de sonidos grabados

---

## Enunciado funcional de la aplicación

La aplicación simula un sistema de alarma anti robo que reacciona ante cambios de posición del dispositivo cuando se encuentra activada.

### Reglas de funcionamiento

1. El usuario debe iniciar sesión (registrado previamente en la base de datos).
2. La aplicación presenta un único botón que ocupa toda la pantalla.
3. Este botón permite activar y desactivar la alarma.
4. Una vez activada la alarma, se asume que el dispositivo está apoyado horizontalmente sobre una mesa.
5. Ante cambios de posición del dispositivo, se disparan distintas acciones:

   - Al mover el dispositivo hacia la izquierda: se reproduce un sonido específico.
   - Al mover el dispositivo hacia la derecha: se reproduce un sonido distinto.
   - Al colocar el dispositivo en posición vertical:
     - Se enciende la linterna por 5 segundos.
     - Se reproduce un sonido.
   - Al volver a colocarlo en posición horizontal:
     - El dispositivo vibra por 5 segundos.
     - Se reproduce otro sonido.

6. Para desactivar la alarma, el usuario debe ingresar su contraseña.
7. Si la contraseña es incorrecta:
   - Se enciende la linterna.
   - El dispositivo vibra.
   - Se reproducen sonidos.
   - Todo en simultáneo durante 5 segundos.

8. Los sonidos utilizados en la alarma fueron previamente grabados.

Ejemplos de mensajes grabados:

- Movimiento hacia la izquierda: “Están hurtando el dispositivo”.
- Movimiento hacia la derecha: “Epa, ¿Qué estás por hacer?”.

---

## Objetivo técnico del ejercicio

Este proyecto permite demostrar:

- Integración con sensores físicos del dispositivo
- Uso de APIs nativas (vibración, linterna, movimiento)
- Manejo de estados en tiempo real
- Control de flujo según eventos del hardware
- Validación de contraseña para acciones críticas
- Reproducción de sonidos personalizados

---

## Flujo de uso

1. El usuario inicia sesión.
2. Activa la alarma mediante el botón principal.
3. El sistema comienza a monitorear la posición del dispositivo.
4. Ante cada cambio, se ejecutan acciones físicas y sonoras.
5. Para desactivar, se solicita la contraseña.
6. Si es incorrecta, se dispara la alarma completa.

---

## Autor

Iván Becerra
