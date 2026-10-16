import { redirect } from 'next/navigation';
import { isAdmin } from '../../lib/admin-auth';
import AdminBannerManager from '../../components/AdminBannerManager';

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage() {
    if (!(await isAdmin())) {
        redirect('/admin/login');
    }
    return <AdminBannerManager />;
}
