import { api } from '@/lib/api';
import type {
    AuthResponse,
    MeResponse,
    MessageResponse,
    RegisterResponse,
    UpdateProfilePayload,
} from '@/types';

export function login(email: string, password: string) {
    return api.post<AuthResponse>('/auth/login', { email, password });
}

export function adminLogin(username: string, password: string) {
    return api.post<AuthResponse>('/auth/admin/login', { username, password });
}

export function register(name: string, email: string, password: string) {
    return api.post<RegisterResponse>('/auth/register', { name, email, password });
}

export function verifyEmail(email: string, code: string) {
    return api.post<AuthResponse>('/auth/verify-email', { email, code });
}

export function resendVerification(email: string) {
    return api.post<MessageResponse>('/auth/resend-verification', { email });
}

export function forgotPassword(email: string) {
    return api.post<MessageResponse>('/auth/forgot-password', { email });
}

export function resetPassword(email: string, code: string, new_password: string) {
    return api.post<MessageResponse>('/auth/reset-password', {
        email,
        code,
        new_password,
    });
}

export function logout() {
    return api.post<MessageResponse>('/auth/logout');
}

export function getMe(token?: string) {
    return api.get<MeResponse>('/users/me', { token });
}

export function updateProfile(payload: UpdateProfilePayload, token?: string) {
    return api.put<MeResponse>('/users/me/profile', payload, { token });
}
