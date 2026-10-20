import { redirect } from 'next/navigation';
import { isAdmin } from '../../lib/admin-auth';
import AdminWikiManager from '../../components/AdminWikiManager';

export const dynamic = 'force-dynamic';

export default async function AdminWikiPage() {
    if (!(await isAdmin())) {
        redirect('/admin/login');
    }
    return <AdminWikiManager />;
}
