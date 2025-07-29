import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
    { label: 'Campanhas', path: '/campaign-management', icon: 'Target' },
    { label: 'Palavras-chave', path: '/keyword-performance', icon: 'Hash' },
    { label: 'Análises', path: '/campaign-analytics', icon: 'TrendingUp' },
    { label: 'Relatórios', path: '/reports', icon: 'FileText' },
    { label: 'Umbler', path: '/umbler', icon: 'Globe' },
    { label: 'IA', path: '/ia', icon: 'Brain' },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="BarChart3" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                Google Ads Analytics
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
            </Button>

            {/* User Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleUserDropdown}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <span className="hidden lg:block text-sm font-medium">
                  João Silva
                </span>
                <Icon name="ChevronDown" size={16} />
              </Button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-[1200] animate-fade-in">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium">João Silva</p>
                    <p className="text-xs text-muted-foreground">joao@empresa.com</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2">
                      <Icon name="User" size={16} />
                      <span>Perfil</span>
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2">
                      <Icon name="Settings" size={16} />
                      <span>Configurações</span>
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2">
                      <Icon name="Building" size={16} />
                      <span>Trocar Conta</span>
                    </button>
                    <div className="border-t border-border my-1"></div>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted text-error flex items-center space-x-2">
                      <Icon name="LogOut" size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[1100] bg-black bg-opacity-50 md:hidden"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed top-0 left-0 h-full w-80 bg-card border-r border-border z-[1100] md:hidden animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <Icon name="BarChart3" size={20} color="white" />
                  </div>
                  <span className="text-lg font-semibold">Google Ads Analytics</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors duration-200 ${
                      isActiveRoute(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Click outside handler for user dropdown */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-[1150]"
          onClick={() => setIsUserDropdownOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Header;