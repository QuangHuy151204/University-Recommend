import { redirect } from 'next/navigation';

export default function AdminMajorsRedirect() {
    redirect('/admin?tab=majors');
}
