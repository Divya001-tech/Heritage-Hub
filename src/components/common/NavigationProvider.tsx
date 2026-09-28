import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigationHistory } from '../../lib/useNavigationHistory';
import { NavigationHistoryItem } from '../../types';

interface NavigationContextType {
  canGoBack: boolean;
  goBack: () => void;
  backLabel: string;
  historyStack: NavigationHistoryItem[];
  currentSnapshot: NavigationHistoryItem;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navHistory = useNavigationHistory();

  return (
    <NavigationContext.Provider value={navHistory}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
