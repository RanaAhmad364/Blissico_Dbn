// src/data/userData.js

export const userStats = {
  totalOrders: 12,
  totalDownloads: 48,
  activeSubscriptions: 1,
  savedItems: 23,
};

export const recentOrders = [
  {
    id: '#BLIS-1250',
    date: 'May 25, 2025',
    items: 3,
    amount: '$65.00',
    status: 'Completed'
  },
  {
    id: '#BLIS-1249',
    date: 'May 20, 2025',
    items: 2,
    amount: '$45.50',
    status: 'Completed'
  },
  {
    id: '#BLIS-1248',
    date: 'May 18, 2025',
    items: 1,
    amount: '$29.00',
    status: 'Completed'
  },
  {
    id: '#BLIS-1247',
    date: 'May 15, 2025',
    items: 2,
    amount: '$55.00',
    status: 'Processing'
  },
];

export const currentPlan = {
  name: 'Premium Plan',
  renewsOn: 'June 25, 2025',
  features: [
    'Unlimited downloads',
    'Premium design access',
    'Commercial license',
    'Exclusive discounts'
  ]
};

export const walletBalance = {
  balance: 45.60,
  currency: '$'
};

export const userInfo = {
  name: 'Ayesha Khan',
  email: 'ayesha.khan@example.com',
  memberSince: 'March 12, 2025',
  accountType: 'Premium Member'
};

export const notifications = [
  {
    id: 1,
    message: 'Your order #BLIS-1250 is delivered!',
    date: 'May 25, 2025 - 10:30 AM',
    read: false
  },
  {
    id: 2,
    message: 'New exclusive offer for premium members',
    date: 'May 24, 2025 - 09:15 AM',
    read: false
  },
  {
    id: 3,
    message: 'Your subscription will renew on June 25, 2025',
    date: 'May 20, 2025 - 11:20 AM',
    read: true
  }
];

export const quickActions = [
  { id: 1, label: 'Browse Products', icon: '🛍️', desc: 'Explore new products' },
  { id: 2, label: 'Pricing Plans', icon: '💎', desc: 'Choose the best plan' },
  { id: 3, label: 'My Coupons', icon: '🎫', desc: 'View available offers' },
  { id: 4, label: 'Support Center', icon: '🎧', desc: 'Get help & support' },
];

export const sidebarMenu = {
  main: [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Orders', path: '/dashboard/orders', icon: '📦' },
    { label: 'Downloads', path: '/dashboard/downloads', icon: '⬇️' },
    { label: 'Subscriptions', path: '/dashboard/subscriptions', icon: '🔄' },
    { label: 'Pricing Plans', path: '/dashboard/pricing-plans', icon: '💎' },
    { label: 'Saved Items', path: '/dashboard/saved-items', icon: '❤️' },
    { label: 'Coupons', path: '/dashboard/coupons', icon: '🎫' },
  ],
  settings: [
    { label: 'Addresses', path: '/dashboard/addresses', icon: '📍' },
    { label: 'Payment Methods', path: '/dashboard/payments', icon: '💳' },
    { label: 'Account Settings', path: '/dashboard/account-settings', icon: '⚙️' },
    { label: 'Notifications', path: '/dashboard/notifications', icon: '🔔' },
    { label: 'Reviews', path: '/dashboard/reviews', icon: '⭐' },
    { label: 'Support', path: '/dashboard/support', icon: '🎧' },
  ]
};