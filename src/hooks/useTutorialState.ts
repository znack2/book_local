import { useState, useEffect } from 'react';

const TUTORIAL_STORAGE_KEY = 'canvas_tutorial_completed';

export const useTutorialState = () => {
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (tutorialCompleted === 'true') {
      setHasSeenTutorial(true);
    }
  }, []);

  const markTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setHasSeenTutorial(true);
    setShowTutorial(false);
  };

  const showTutorialIfNeeded = () => {
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setHasSeenTutorial(false);
    setShowTutorial(true);
  };

  return {
    hasSeenTutorial,
    showTutorial,
    setShowTutorial,
    markTutorialComplete,
    showTutorialIfNeeded,
    resetTutorial
  };
};