// @file: Next.js page route for /admin/admission-methods.
import { redirect } from 'next/navigation';

export default function AdminAdmissionMethodsRedirect() {
    redirect('/admin?tab=admission-methods');
}
