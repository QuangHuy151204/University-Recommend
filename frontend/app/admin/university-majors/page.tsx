import { redirect } from 'next/navigation';

export default function AdminUniversityMajorsRedirect() {
    redirect('/admin?tab=university-majors');
}
