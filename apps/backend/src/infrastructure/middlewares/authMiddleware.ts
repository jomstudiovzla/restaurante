import * as functions from 'firebase-functions';

/**
 * Middleware: Ensures the caller is authenticated and has the 'admin' role.
 * Throws a standard HttpsError if the requirements are not met.
 */
export function requireAdmin(context: functions.https.CallableContext) {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'El usuario no está autenticado. Debe iniciar sesión.'
    );
  }

  // Extract custom claim role
  const role = context.auth.token.role;
  
  // Verify Admin privilege
  if (role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Acceso denegado. Esta acción está restringida exclusivamente a Administradores.'
    );
  }
}
