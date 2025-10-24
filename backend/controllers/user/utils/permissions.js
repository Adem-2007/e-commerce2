// backend/utils/permissions.js

export const getInitialPermissionsForRole = (role) => {
    const creatorPermissions = ['/dashboard', '/dashboard/orders', '/dashboard/categories-products'];
    const pagerPermissions = ['/dashboard/hero-control', '/dashboard/info-control', '/dashboard/footer-control', '/dashboard/logo-control'];
    const adminPermissions = [
        ...creatorPermissions,
        ...pagerPermissions,
        '/dashboard/delivery-costs',
        '/dashboard/social-media',
        '/dashboard/user-manage',
        '/dashboard/messages',
    ];

    switch (role) {
        case 'admin': return adminPermissions;
        case 'creator': return creatorPermissions;
        case 'pager': return pagerPermissions;
        default: return [];
    }
};