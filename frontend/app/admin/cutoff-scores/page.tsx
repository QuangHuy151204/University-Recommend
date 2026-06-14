import { redirect } from 'next/navigation';

export default function AdminCutoffScoresRedirect() {
    redirect('/admin?tab=cutoff-scores');
}
