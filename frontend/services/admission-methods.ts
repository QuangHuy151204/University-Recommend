// @file: API client for the admission method catalog.
import { api } from '@/lib/api';
import type { AdmissionMethod } from '@/types';

export function listAdmissionMethods() {
    return api.get<AdmissionMethod[]>('/admission-methods');
}
