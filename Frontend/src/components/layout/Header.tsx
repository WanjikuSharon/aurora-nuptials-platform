import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Venues', href: '/venues' },
        { name: 'Vendors', href: '/vendors' },
        { name: 'Inspiration', href: '/inspiration' },
      ];
    }

    switch (user?.role) {
      case 'COUPLE':
        return [
          { name: 'Dashboard', href: '/couple/dashboard' },
          { name: 'Venues', href: '/venues' },
          { name: 'Vendors', href: '/vendors' },
          { name: 'Registry', href: '/couple/registry' },
          { name: 'Bookings', href: '/couple/bookings' },
        ];
      case 'VENDOR':
        return [
          { name: 'Dashboard', href: '/vendor/dashboard' },
          { name: 'My Venues', href: '/vendor/venues' },
          { name: 'Bookings', href: '/vendor/bookings' },
          { name: 'Profile', href: '/vendor/profile' },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Users', href: '/admin/users' },
          { name: 'Venues', href: '/admin/venues' },
          { name: 'Vendors', href: '/admin/vendors' },
        ];
      default:
        return [
          { name: 'Home', href: '/' },
          { name: 'Venues', href: '/venues' },
          { name: 'Vendors', href: '/vendors' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-rose-gold" />
            <span className="text-2xl font-serif font-bold text-gray-900">
              Aurora Nuptials
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-rose-gold transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-rose-gold transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.name || 'User'}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-rose-gold capitalize">{user?.role?.toLowerCase()}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-rose-gold transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-rose-gold hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-rose-gold transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-100">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-rose-gold capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 hover:text-rose-gold transition-colors duration-200 font-medium mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-gray-700 hover:text-rose-gold transition-colors duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-rose-gold transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;