import * as admin from 'firebase-admin';

export interface CreateUserDTO {
  email: string;
  password?: string;
  displayName: string;
  role: 'mesero' | 'cocinero' | 'cajero' | 'admin';
}

/**
 * Use Case: Creates a new user in Firebase Auth and assigns a custom RBAC role claim.
 */
export async function createUserUseCase(data: CreateUserDTO) {
  // 1. Validate Input
  if (!data.email || !data.role) {
    throw new Error('Email and role are required');
  }

  const validRoles = ['mesero', 'cocinero', 'cajero', 'admin'];
  if (!validRoles.includes(data.role)) {
    throw new Error('Invalid role specified');
  }

  // 2. Create User Identity
  const userRecord = await admin.auth().createUser({
    email: data.email,
    password: data.password || 'TemporaryPass123!',
    displayName: data.displayName,
  });

  // 3. Set Custom Claims for Role-Based Access Control (RBAC)
  await admin.auth().setCustomUserClaims(userRecord.uid, {
    role: data.role,
  });

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    role: data.role,
  };
}
