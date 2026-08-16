// src/data/dashboardData.js
// ============================================================
// BLISSICO ADMIN DASHBOARD - COMPLETE DATA
// ============================================================

/**
 * MAIN STATS - Dashboard ke top par
 */
export const mainStats = [
  {
    id: 1,
    title: 'Total Orders',
    value: '1,248',
    growth: 18.6,
    icon: 'FiShoppingBag',
    color: '#7c3aed',
    bgColor: '#f5f3ff'
  },
  {
    id: 2,
    title: 'Total Revenue',
    value: '$12,560',
    growth: 22.4,
    icon: 'FiDollarSign',
    color: '#10b981',
    bgColor: '#ecfdf5'
  },
  {
    id: 3,
    title: 'Total Cards',
    value: '356',
    growth: 8.7,
    icon: 'FiGrid',
    color: '#3b82f6',
    bgColor: '#eff6ff'
  },
  {
    id: 4,
    title: 'Total Customers',
    value: '842',
    growth: 15.3,
    icon: 'FiUsers',
    color: '#f59e0b',
    bgColor: '#fffbeb'
  },
];

/**
 * QUICK STATS - Small stats below main
 */
export const quickStats = [
  { id: 1, label: 'Total Products', value: 162, icon: 'FiPackage' },
  { id: 2, label: 'Low Stock Items', value: 8, icon: 'FiPackage', warning: true },
  { id: 3, label: 'Total Categories', value: 24, icon: 'FiTag' },
  { id: 4, label: 'Active Coupons', value: 5, icon: 'FiStar' },
];

/**
 * QUICK ACTIONS - 4 Action buttons
 */
export const quickActions = [
  { id: 1, label: 'Add New Card', icon: '➕', path: '/admin/cards/add', color: '#7c3aed' },
  { id: 2, label: 'Add Collection', icon: '📁', path: '/admin/collections/add', color: '#3b82f6' },
  { id: 3, label: 'Create Occasion', icon: '🎉', path: '/admin/occasions/add', color: '#10b981' },
  { id: 4, label: 'Manage Homepage', icon: '🏠', path: '/admin/homepage', color: '#f59e0b' },
];

/**
 * REVENUE DATA - Sales Overview Chart
 */
export const revenueData = {
  daily: [
    { date: 'Mon', revenue: 1200 },
    { date: 'Tue', revenue: 1800 },
    { date: 'Wed', revenue: 1500 },
    { date: 'Thu', revenue: 2200 },
    { date: 'Fri', revenue: 2800 },
    { date: 'Sat', revenue: 2450 },
    { date: 'Sun', revenue: 1900 },
  ],
  weekly: [
    { date: 'May 16', revenue: 2450 },
    { date: 'May 17', revenue: 1800 },
    { date: 'May 18', revenue: 3200 },
    { date: 'May 19', revenue: 2100 },
    { date: 'May 20', revenue: 2800 },
    { date: 'May 21', revenue: 3500 },
    { date: 'May 22', revenue: 2900 },
  ],
  monthly: [
    { date: 'Week 1', revenue: 8200 },
    { date: 'Week 2', revenue: 9400 },
    { date: 'Week 3', revenue: 11200 },
    { date: 'Week 4', revenue: 12560 },
  ],
};

/**
 * RECENT ORDERS - Latest 5 orders
 */
export const recentOrders = [
  { id: 'ORD-1250', customer: 'Sarah Johnson', date: 'May 31, 2025', amount: '$12.00', status: 'Paid' },
  { id: 'ORD-1249', customer: 'Michael Brown', date: 'May 31, 2025', amount: '$8.00', status: 'Paid' },
  { id: 'ORD-1248', customer: 'Ayesha Khan', date: 'May 30, 2025', amount: '$15.00', status: 'Paid' },
  { id: 'ORD-1247', customer: 'Emily Davis', date: 'May 30, 2025', amount: '$10.00', status: 'Pending' },
  { id: 'ORD-1246', customer: 'David Wilson', date: 'May 30, 2025', amount: '$12.00', status: 'Paid' },
];

/**
 * BEST SELLING CARDS
 */
export const bestSellingCards = [
  { id: 1, name: 'Birthday Blooms', sales: 248, revenue: '$2,480.00' },
  { id: 2, name: 'Elegant Wedding', sales: 186, revenue: '$2,790.00' },
  { id: 3, name: 'Baby Arrival', sales: 154, revenue: '$1,540.00' },
  { id: 4, name: 'Eid Mubarak', sales: 132, revenue: '$1,584.00' },
  { id: 5, name: 'Anniversary Love', sales: 120, revenue: '$1,440.00' },
];

/**
 * TOP CATEGORIES
 */
export const topCategories = [
  { id: 1, name: 'Birthday', count: 248, color: '#7c3aed' },
  { id: 2, name: 'Wedding', count: 186, color: '#ec4899' },
  { id: 3, name: 'Baby', count: 154, color: '#3b82f6' },
  { id: 4, name: 'Religious', count: 132, color: '#10b981' },
  { id: 5, name: 'Others', count: 120, color: '#f59e0b' },
];

/**
 * TOP OCCASIONS
 */
export const topOccasions = [
  { id: 1, name: 'Birthday', count: 248 },
  { id: 2, name: 'Wedding', count: 186 },
  { id: 3, name: 'Anniversaries', count: 154 },
  { id: 4, name: 'Baby Shower', count: 132 },
  { id: 5, name: 'Eid', count: 120 },
  { id: 6, name: 'Others', count: 86 },
];

/**
 * ACTIVE DISCOUNTS
 */
export const activeDiscounts = [
  { id: 1, code: 'WELCOME10', description: '10% off on all orders', usage: 245 },
  { id: 2, code: 'BIRTHDAY15', description: '15% off on Birthday cards', usage: 120 },
  { id: 3, code: 'EID20', description: '20% off on Eid collection', usage: 80 },
  { id: 4, code: 'SAVE5', description: '$5 off on orders above $30', usage: 310 },
];

/**
 * CATEGORIES (Recipients) - Sidebar categories
 * ✅ FIXED: Added this export
 */
export const categories = [
  { id: 1, name: 'Occasions', icon: '🎉', count: 248 },
  { id: 2, name: 'Collections', icon: '📁', count: 186 },
  { id: 3, name: 'Orders', icon: '📦', count: 1248 },
  { id: 4, name: 'Customers', icon: '👥', count: 842 },
  { id: 5, name: 'Discounts & Coupons', icon: '🏷️', count: 5 },
];

/**
 * MARKETING MENU
 */
export const marketingMenu = [
  { id: 1, label: 'Media Library', icon: '🖼️', path: '/admin/media' },
  { id: 2, label: 'Signature Design', icon: '✍️', path: '/admin/signature' },
  { id: 3, label: 'Content Management', icon: '📝', path: '/admin/content' },
  { id: 4, label: 'Reports & Analytics', icon: '📊', path: '/admin/reports' },
  { id: 5, label: 'Settings', icon: '⚙️', path: '/admin/settings' },
  { id: 6, label: 'Payment Settings', icon: '💳', path: '/admin/payments' },
  { id: 7, label: 'Users & Roles', icon: '👤', path: '/admin/users' },
];

// ============================================================
// DEFAULT EXPORT - All data in one object
// ============================================================
const dashboardData = {
  mainStats,
  quickStats,
  quickActions,
  revenueData,
  recentOrders,
  bestSellingCards,
  topCategories,
  topOccasions,
  activeDiscounts,
  categories,
  marketingMenu,
};

export default dashboardData;