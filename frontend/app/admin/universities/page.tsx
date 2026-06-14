import { redirect } from 'next/navigation';

export default function AdminUniversitiesRedirect() {
    redirect('/admin?tab=universities');
}
