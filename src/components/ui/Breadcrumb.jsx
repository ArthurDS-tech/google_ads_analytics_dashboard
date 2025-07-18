import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();

  const breadcrumbMap = {
    '/dashboard': [{ label: 'Dashboard', path: '/dashboard' }],
    '/campaign-management': [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Campanhas', path: '/campaign-management' }
    ],
    '/campaign-analytics': [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Análises', path: '/campaign-analytics' }
    ],
    '/keyword-performance': [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Palavras-chave', path: '/keyword-performance' }
    ],
    '/reports': [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Relatórios', path: '/reports' }
    ]
  };

  const currentBreadcrumbs = breadcrumbMap[location.pathname] || [];

  if (currentBreadcrumbs.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {currentBreadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          {index === currentBreadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <button
              onClick={() => handleNavigation(crumb.path)}
              className="hover:text-foreground transition-colors duration-200"
            >
              {crumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;