import { useEffect, useRef, useState, useCallback } from 'react';
import { useCultureStore } from '../store/useCultureStore';
import { NavigationHistoryItem } from '../types';

export function useNavigationHistory() {
  const {
    currentView,
    setView,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedEntry,
    setSelectedEntry,
  } = useCultureStore();

  const [historyStack, setHistoryStack] = useState<NavigationHistoryItem[]>([
    { view: 'home', title: 'Home' },
  ]);
  const isNavigatingBackRef = useRef(false);

  // Current navigation state snapshot
  const currentSnapshot: NavigationHistoryItem = {
    view: currentView,
    stateId: selectedState?.id || null,
    districtId: selectedDistrict?.id || null,
    entryId: selectedEntry?.id || null,
    title: selectedEntry
      ? selectedEntry.title
      : selectedDistrict
      ? `${selectedDistrict.name} District`
      : selectedState
      ? selectedState.name
      : currentView === 'map'
      ? 'Interactive Atlas'
      : currentView === 'discover'
      ? 'Archive Exploration'
      : currentView === 'contribute'
      ? 'Field Intake Portal'
      : currentView === 'moderation'
      ? 'Moderator Council'
      : currentView === 'bookmarks'
      ? 'Folio Bookmarks'
      : 'Hindustan Atlas',
  };

  // Push new state onto history when user navigates forward
  useEffect(() => {
    if (isNavigatingBackRef.current) {
      isNavigatingBackRef.current = false;
      return;
    }

    setHistoryStack((prev) => {
      const last = prev[prev.length - 1];
      const isIdentical =
        last &&
        last.view === currentSnapshot.view &&
        last.stateId === currentSnapshot.stateId &&
        last.districtId === currentSnapshot.districtId &&
        last.entryId === currentSnapshot.entryId;

      if (isIdentical) return prev;

      // Sync with window.history.pushState
      try {
        window.history.pushState(
          { ...currentSnapshot },
          currentSnapshot.title || '',
          `#${currentSnapshot.view}`
        );
      } catch {
        // Safe iframe environment fallback
      }

      return [...prev, currentSnapshot];
    });
  }, [currentView, selectedState?.id, selectedDistrict?.id, selectedEntry?.id]);

  // Go Back Logic: Hierarchical return
  const goBack = useCallback(() => {
    // 1. If currently inside a Culture Entry Dossier Modal -> return to previous context
    if (selectedEntry) {
      setSelectedEntry(null);
      return;
    }

    // 2. If inside a District View on Atlas -> return to State View
    if (currentView === 'map' && selectedDistrict) {
      setSelectedDistrict(null);
      return;
    }

    // 3. If inside a State View on Atlas -> return to National Atlas
    if (currentView === 'map' && selectedState) {
      setSelectedState(null);
      return;
    }

    // 4. If on Atlas or other views -> return to previous page in history
    setHistoryStack((prev) => {
      if (prev.length <= 1) {
        if (currentView !== 'home') {
          setView('home');
        }
        return [{ view: 'home', title: 'Home' }];
      }

      const nextStack = [...prev];
      nextStack.pop(); // remove current
      const previous = nextStack[nextStack.length - 1];

      isNavigatingBackRef.current = true;
      if (previous) {
        setView(previous.view as any);
        if (!previous.stateId) setSelectedState(null);
        if (!previous.districtId) setSelectedDistrict(null);
        if (!previous.entryId) setSelectedEntry(null);
      }

      return nextStack;
    });
  }, [
    selectedEntry,
    selectedDistrict,
    selectedState,
    currentView,
    setView,
    setSelectedState,
    setSelectedDistrict,
    setSelectedEntry,
  ]);

  // Label for what Back button will return to
  const getBackLabel = (): string => {
    if (selectedEntry) {
      if (selectedDistrict) return `Back to ${selectedDistrict.name} District`;
      if (selectedState) return `Back to ${selectedState.name}`;
      return 'Back to Explorer';
    }
    if (currentView === 'map') {
      if (selectedDistrict) return `Back to ${selectedState?.name || 'State'} View`;
      if (selectedState) return 'Back to National Atlas';
      return 'Back to Homepage';
    }
    if (currentView !== 'home') {
      return 'Back to Homepage';
    }
    return '';
  };

  const canGoBack =
    Boolean(selectedEntry) ||
    Boolean(selectedDistrict) ||
    Boolean(selectedState) ||
    currentView !== 'home' ||
    historyStack.length > 1;

  // Keyboard navigation support: Backspace / Escape / Alt+Left
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      if (isInput) return;

      if (e.key === 'Escape' || (e.altKey && e.key === 'ArrowLeft')) {
        e.preventDefault();
        goBack();
      } else if (e.key === 'Backspace' && !isInput) {
        e.preventDefault();
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goBack]);

  // Browser popstate listener (Native Back Button)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        goBack();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [goBack]);

  return {
    canGoBack,
    goBack,
    backLabel: getBackLabel(),
    historyStack,
    currentSnapshot,
  };
}
