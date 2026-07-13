// @file: Next.js page route for /admin/majors.
import { redirect } from 'next/navigation';

export default function AdminMajorsRedirect() {
    redirect('/admin?tab=majors');
}
