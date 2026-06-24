"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserUseCase = createUserUseCase;
const admin = __importStar(require("firebase-admin"));
/**
 * Use Case: Creates a new user in Firebase Auth and assigns a custom RBAC role claim.
 */
async function createUserUseCase(data) {
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
//# sourceMappingURL=createUser.js.map