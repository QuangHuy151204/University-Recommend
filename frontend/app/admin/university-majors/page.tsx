// @file: Next.js page route for /admin/university-majors.
import { redirect } from 'next/navigation';

export default function AdminUniversityMajorsRedirect() {
    redirect('/admin?tab=university-majors');
}
