// src/pages/Dashboard/UserManage/navigationConfig.js

import {
  LayoutDashboard, Image, FolderKanban, Info, ToyBrick, Truck,
  Sparkles, Share2, User, Package, MessageSquare
} from 'lucide-react';

// Central configuration for all navigation items in the dashboard
export const navigationConfig = [
  {
    section: "Content Management",
    items: [
      { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, allowedRoles: ['admin', 'creator'] },
      { path: '/dashboard/orders', label: 'Orders', icon: Package, allowedRoles: ['admin', 'creator'] },
      { path: '/dashboard/categories-products', label: 'Categories & Products', icon: FolderKanban, allowedRoles: ['admin', 'creator'] },
    ]
  },
  {
    section: "Appearance",
    items: [
      { path: '/dashboard/hero-control', label: 'Home Control', icon: Image, allowedRoles: ['admin', 'pager'] },
      { path: '/dashboard/info-control', label: 'Info Control', icon: Info, allowedRoles: ['admin', 'pager'] },
      { path: '/dashboard/footer-control', label: 'Footer Control', icon: ToyBrick, allowedRoles: ['admin', 'pager'] },
      { path: '/dashboard/logo-control', label: 'Brand Identity', icon: Sparkles, allowedRoles: ['admin', 'pager'] },
    ]
  },
  {
    section: "Administration",
    items: [
      { path: '/dashboard/delivery-costs', label: 'Delivery Costs', icon: Truck, allowedRoles: ['admin'] },
      { path: '/dashboard/social-media', label: 'Social Media', icon: Share2, allowedRoles: ['admin'] },
      { path: '/dashboard/user-manage', label: 'User Management', icon: User, allowedRoles: ['admin'] },
      { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare, allowedRoles: ['admin'] },
      { path: '/dashboard/image', label: 'Image', icon: User, allowedRoles: ['admin'] },
    ]
  }
];