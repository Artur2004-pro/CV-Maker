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
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <ProfessionalIcons.HomeIcon size="md" color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Maker</h1>
                <p className="text-xs text-gray-500">Professional</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    size="md"
                    className={`${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className="ml-3 flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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

          {/* User Profile */}
          <div className="flex-shrink-0 px-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">Professional Plan</p>
              </div>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="profile-trigger p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ProfessionalIcons.ChevronDownIcon
                  size="sm"
                  className={`transform transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="profile-menu absolute bottom-16 left-4 right-4 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Member since 2024</p>
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ProfessionalIcons.ProfileIcon size="sm" className="mr-3" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/billing"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ProfessionalIcons.CreditCardIcon size="sm" className="mr-3" />
                    Billing & Plans
                  </Link>
                  <Link
                    to="/help"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ProfessionalIcons.InfoIcon size="sm" className="mr-3" />
                    Help & Support
                  </Link>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ProfessionalIcons.MenuIcon size="md" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search CVs, templates, or help..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <ProfessionalIcons.SearchIcon size="sm" />
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative notifications-trigger">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ProfessionalIcons.BellIcon size="md" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="notifications-menu absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllNotificationsAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <ProfessionalIcons.BellIcon size="lg" className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-1 rounded-full ${getNotificationColor(notification.type)}`}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-100">
                        <Link
                          to="/notifications"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                  size="sm"
                  onClick={() => navigate('/editor')}
                  className="shadow-lg hover:shadow-xl"
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
