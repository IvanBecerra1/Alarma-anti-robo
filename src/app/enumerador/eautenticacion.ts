export enum EAutenticacion {
    REGISTRO_TITULO = "Registro",
    INICIO_SESION_TITULO = "Inicio de sesión",
    SESION_EXITO = "Registro correcto; Iniciando sesión!",
    CORREO_EN_USO = "El correo ingresado ya está en uso.",
    CREDENCIALES_INVALIDAS = "Credenciales inválidas. Intente nuevamente.",
    CORREO_INVALIDO = "Ingrese un correo valído",
    CLAVE_INVALIDO = "Ingrese un minimo de 6 caracteristicas para su contraseña",
    ERROR_DESCONOCIDO = "Ocurrió un error desconocido. Intente más tarde.",
    
    CAMPOS_VACIOS = "Los campos estan vacios!",
    CAMPO_CLAVE_VACIO = "El campo clave esta vacio",
    CAMPO_CORREO_VACIO = "El campo correo esta vacio",

    EMAIL_EXISTS = "auth/email-already-in-use",
    INVALID_EMAIL = "auth/invalid-email",
    INVALID_PASSWORD = "auth/wrong-password",
    WEAK_PASSWORD = "auth/weak-password",
    ADMIN_ONLY_OPERATION = "auth/admin-restricted-operation", // CAMPOS VACIOS
    MISSING_PASSWORD = "auth/missing-password", // CAMPO VACIO
    MISSING_EMAIL = "auth/missing-email" // CAMPO VACIO
}
