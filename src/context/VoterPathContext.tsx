import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TabType, ReadinessAnswerState } from '../types/election';
import { safeGetStorage, safeSetStorage } from '../utils/storage';

interface VoterPathContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleSound: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  readinessAnswers: ReadinessAnswerState;
  setReadinessAnswers: React.Dispatch<React.SetStateAction<ReadinessAnswerState>>;
  resetReadiness: (mode?: 'blank' | 'sample') => void;
  totalSimulationsRun: number;
  incrementSimulations: () => void;
  announceMessage: string | null;
  setAnnounceMessage: (msg: string | null) => void;
}

export const blankAnswers: ReadinessAnswerState = {
  is18OrAbove: null,
  qualifyingDateAcknowledged: null,
  isIndianCitizen: null,
  isNameOnRoll: null,
  hasEpicCard: null,
  selectedAlternateId: null,
  knowsPollingStation: null,
  hasVoterSlipOrApp: null,
};

export const sampleReadyAnswers: ReadinessAnswerState = {
  is18OrAbove: true,
  qualifyingDateAcknowledged: true,
  isIndianCitizen: true,
  isNameOnRoll: true,
  hasEpicCard: true,
  selectedAlternateId: null,
  knowsPollingStation: true,
  hasVoterSlipOrApp: true,
};

const VoterPathContext = createContext<VoterPathContextType | undefined>(undefined);

export const VoterPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    return safeGetStorage<TabType>('voterpath_tab', 'simulator');
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return safeGetStorage<boolean>('voterpath_sound', true);
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return safeGetStorage<'light' | 'dark'>('voterpath_theme', 'dark');
  });

  const [readinessAnswers, setReadinessAnswers] = useState<ReadinessAnswerState>(() => {
    return safeGetStorage<ReadinessAnswerState>('voterpath_readiness_v2', blankAnswers);
  });

  const [totalSimulationsRun, setTotalSimulationsRun] = useState<number>(() => {
    return safeGetStorage<number>('voterpath_sim_count', 0);
  });

  const [announceMessage, setAnnounceMessage] = useState<string | null>(null);

  const setActiveTab = useCallback((tab: TabType) => {
    setActiveTabState(tab);
    safeSetStorage('voterpath_tab', tab);
  }, []);

  const setSoundEnabled = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setSoundEnabledState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      safeSetStorage('voterpath_sound', next);
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, [setSoundEnabled]);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    safeSetStorage('voterpath_theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      safeSetStorage('voterpath_theme', next);
      return next;
    });
  }, []);

  // Synchronize documentElement class and attribute with current theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const resetReadiness = useCallback((mode: 'blank' | 'sample' = 'blank') => {
    const target = mode === 'sample' ? sampleReadyAnswers : blankAnswers;
    setReadinessAnswers(target);
    safeSetStorage('voterpath_readiness_v2', target);
  }, []);

  const incrementSimulations = useCallback(() => {
    setTotalSimulationsRun((prev) => {
      const next = prev + 1;
      safeSetStorage('voterpath_sim_count', next);
      return next;
    });
  }, []);

  // Sync readiness state to storage
  useEffect(() => {
    safeSetStorage('voterpath_readiness_v2', readinessAnswers);
  }, [readinessAnswers]);

  return (
    <VoterPathContext.Provider
      value={{
        activeTab,
        setActiveTab,
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        theme,
        setTheme,
        toggleTheme,
        readinessAnswers,
        setReadinessAnswers,
        resetReadiness,
        totalSimulationsRun,
        incrementSimulations,
        announceMessage,
        setAnnounceMessage,
      }}
    >
      {children}
    </VoterPathContext.Provider>
  );
};

export function useVoterPath(): VoterPathContextType {
  const context = useContext(VoterPathContext);
  if (!context) {
    throw new Error('useVoterPath must be used within a VoterPathProvider');
  }
  return context;
}
