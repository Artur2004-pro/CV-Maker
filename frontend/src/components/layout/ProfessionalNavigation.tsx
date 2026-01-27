import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProfessionalIcons } from '../ui/IconSystem';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: string;
  description?: string;
  isActive?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const ProfessionalNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'CV Completed',
      message: 'Your Software Engineer CV is ready for download',
      time: '2 minutes ago',
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'New Template Available',
      message: 'Check out our new Modern Executive template',
      time: '1 hour ago',
      read: false,
      type: 'info'
    },
    {
      id: '3',
      title: 'Profile Update',
      message: 'Your profile has been successfully updated',
      time: '3 hours ago',
      read: true,
      type: 'success'
    }
  ]);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: ProfessionalIcons.DashboardIcon,
      path: '/dashboard',
      description: 'Overview and statistics'
    },
    {
      id: 'canvas',
      label: 'Canvas Builder',
      icon: ProfessionalIcons.EditIcon,
      path: '/canvas',
      description: 'Interactive canvas CV builder',
      badge: 'New'
    },
    {
      id: 'editor',
      label: 'CV Editor',
      icon: ProfessionalIcons.EditorIcon,
      path: '/editor',
      description: 'Create and edit your CV'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: ProfessionalIcons.TemplatesIcon,
      path: '/templates',
      description: 'Browse professional templates'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: ProfessionalIcons.ChartIcon,
      path: '/analytics',
      description: 'Track your CV performance',
      badge: 'Coming Soon'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: ProfessionalIcons.SettingsIcon,
      path: '/settings',
      description: 'Account and preferences'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-menu') && !target.closest('.profile-trigger')) {
        setIsProfileMenuOpen(false);
      }
      if (!target.closest('.notifications-menu') && !target.closest('.notifications-trigger')) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <ProfessionalIcons.SuccessIcon size="sm" />;
      case 'error':
        return <ProfessionalIcons.ErrorIcon size="sm" />;
      case 'warning':
        return <ProfessionalIcons.WarningIcon size="sm" />;
      default:
        return <ProfessionalIcons.InfoIcon size="sm" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-surface border-r border-border pt-6 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-5 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-soft">
                <ProfessionalIcons.HomeIcon size="md" color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary tracking-tight">CV Maker</h1>
                <p className="text-xs text-text-tertiary">Professional</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-soft'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  <item.icon
                    size="md"
                    className={`${
                      isActive ? 'text-white' : 'text-text-tertiary group-hover:text-text-primary'
                    }`}
                  />
                  <span className="ml-3 flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-accent-light text-accent'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex-shrink-0 px-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center shadow-soft ring-2 ring-white">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-text-tertiary">Professional Plan</p>
              </div>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="profile-trigger p-1 text-text-tertiary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-hover"
              >
                <ProfessionalIcons.ChevronDownIcon
                  size="sm"
                  className={`transform transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="profile-menu absolute bottom-16 left-4 right-4 mt-2 w-56 bg-surface rounded-xl shadow-premium-lg border border-border z-50 animate-fade-in-up">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{user?.email}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">Member since 2024</p>
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    <ProfessionalIcons.ProfileIcon size="sm" className="mr-3" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/billing"
                    className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    <ProfessionalIcons.CreditCardIcon size="sm" className="mr-3" />
                    Billing & Plans
                  </Link>
                  <Link
                    to="/help"
                    className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    <ProfessionalIcons.InfoIcon size="sm" className="mr-3" />
                    Help & Support
                  </Link>
                </div>
                <div className="py-2 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                  >
                    <ProfessionalIcons.LogoutIcon size="sm" className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="bg-surface border-b border-border shadow-soft sticky top-0 z-40 backdrop-blur-sm bg-surface/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-hover"
              >
                <ProfessionalIcons.MenuIcon size="md" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search CVs, templates, or help..."
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const searchTerm = e.currentTarget.value;
                        if (searchTerm.trim()) {
                          toast.success(`Searching for: ${searchTerm}`);
                          // TODO: Implement actual search functionality
                        }
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ProfessionalIcons.SearchIcon size="sm" className="text-text-tertiary" />
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative notifications-trigger">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-hover"
                  >
                    <ProfessionalIcons.BellIcon size="md" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="notifications-menu absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-premium-lg border border-border z-50 animate-fade-in-up">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllNotificationsAsRead}
                              className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-text-tertiary">
                            <ProfessionalIcons.BellIcon size="lg" className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-border last:border-b-0 hover:bg-surface-hover transition-colors cursor-pointer ${
                                !notification.read ? 'bg-accent-light/30' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-1.5 rounded-full ${getNotificationColor(notification.type)}`}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-text-secondary mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-text-tertiary mt-1.5">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-4 border-t border-border">
                        <Link
                          to="/notifications"
                          className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <ProButton
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/editor')}
                >
                  <ProfessionalIcons.AddIcon size="sm" />
                  <span className="ml-2">New CV</span>
                </ProButton>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex flex-col w-full max-w-xs bg-white">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <ProfessionalIcons.HomeIcon size="md" color="white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">CV Maker</h1>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <ProfessionalIcons.CloseIcon size="md" />
                </button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon
                        size="md"
                        className={isActive ? 'text-white' : 'text-gray-400'}
                      />
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <ProfessionalIcons.LogoutIcon size="sm" className="mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalNavigation;
