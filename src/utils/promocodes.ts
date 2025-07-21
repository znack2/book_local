export interface ChapterPromocodes {
  [chapterKey: string]: string[];
}

export interface Chapter {
  id: number;
  title: string;
}

export interface PromocodeUsage {
  promocode: string;
  user_id: string;
  used_at: string;
}

// Local storage keys
const USED_PROMOCODES_KEY = 'usedPromocodes';
const USER_PROMOCODES_KEY = 'userPromocodes';

export const generateChapterPromocodes = (chapters: Chapter[]): ChapterPromocodes => {
  const promocodes: ChapterPromocodes = {};
  
  chapters.forEach((chapter) => {
    // Generate only 1 promocode per chapter
    const chapterCode = generateRandomCode();
    promocodes[`chapter_${chapter.id}`] = [chapterCode];
  });
  
  return promocodes;
};

const generateRandomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const validatePromocode = (
  inputCode: string, 
  promocodes: ChapterPromocodes
): { isValid: boolean; chapterId?: number; chapterTitle?: string } => {
  const upperCode = inputCode.toUpperCase().trim();
  
  for (const [chapterKey, codes] of Object.entries(promocodes)) {
    if (codes.includes(upperCode)) {
      const chapterId = parseInt(chapterKey.replace('chapter_', ''));
      return { isValid: true, chapterId };
    }
  }
  
  return { isValid: false };
};

// Get globally used promocodes from localStorage
export const getGloballyUsedPromocodes = (): string[] => {
  try {
    const stored = localStorage.getItem(USED_PROMOCODES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading globally used promocodes:', error);
    return [];
  }
};

// Save globally used promocodes to localStorage
export const saveGloballyUsedPromocodes = (promocodes: string[]): void => {
  try {
    localStorage.setItem(USED_PROMOCODES_KEY, JSON.stringify(promocodes));
  } catch (error) {
    console.error('Error saving globally used promocodes:', error);
  }
};

// Get user's promocodes from localStorage
export const getUserPromocodes = (userId: string): string[] => {
  try {
    const stored = localStorage.getItem(`${USER_PROMOCODES_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading user promocodes:', error);
    return [];
  }
};

// Save user's promocodes to localStorage
export const saveUserPromocodes = (userId: string, promocodes: string[]): void => {
  try {
    localStorage.setItem(`${USER_PROMOCODES_KEY}_${userId}`, JSON.stringify(promocodes));
  } catch (error) {
    console.error('Error saving user promocodes:', error);
  }
};

// Check if a promocode is available (not used by anyone)
export const isPromocodeAvailable = (promocode: string): boolean => {
  const globallyUsed = getGloballyUsedPromocodes();
  return !globallyUsed.includes(promocode.toUpperCase().trim());
};

// Get all used promocodes (from localStorage)
export const getUsedPromocodes = (): PromocodeUsage[] => {
  const globallyUsed = getGloballyUsedPromocodes();
  const usedPromocodes: PromocodeUsage[] = [];
  
  // Get all user-specific localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(USER_PROMOCODES_KEY)) {
      const userId = key.replace(`${USER_PROMOCODES_KEY}_`, '');
      const userPromocodes = getUserPromocodes(userId);
      
      userPromocodes.forEach(promocode => {
        usedPromocodes.push({
          promocode,
          user_id: userId,
          used_at: new Date().toISOString() // Approximate timestamp
        });
      });
    }
  }
  
  return usedPromocodes;
};

// Get promocodes used by a specific user
export const getUserSpecificPromocodes = (userId: string): PromocodeUsage[] => {
  const userPromocodes = getUserPromocodes(userId);
  
  return userPromocodes.map(promocode => ({
    promocode,
    user_id: userId,
    used_at: new Date().toISOString()
  }));
};

// Generate a batch of unique promocodes
export const generateUniquePromocodes = (count: number): string[] => {
  const codes: string[] = [];
  const globallyUsed = getGloballyUsedPromocodes();
  const maxAttempts = count * 10; // Prevent infinite loops
  let attempts = 0;

  while (codes.length < count && attempts < maxAttempts) {
    const newCode = generateRandomCode();
    
    // Check if this code is already in our batch or globally used
    if (!codes.includes(newCode) && !globallyUsed.includes(newCode)) {
      codes.push(newCode);
    }
    
    attempts++;
  }

  if (codes.length < count) {
    console.warn(`Only generated ${codes.length} unique codes out of ${count} requested`);
  }

  return codes;
};

// Remove a promocode from a user (admin function)
export const revokePromocodeFromUser = (promocode: string, userId: string): boolean => {
  try {
    const userPromocodes = getUserPromocodes(userId);
    const upperCode = promocode.toUpperCase().trim();
    
    // Remove the promocode from user's list
    const updatedPromocodes = userPromocodes.filter(code => code !== upperCode);
    saveUserPromocodes(userId, updatedPromocodes);
    
    // Check if any other user still has this promocode
    let isStillUsed = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(USER_PROMOCODES_KEY) && key !== `${USER_PROMOCODES_KEY}_${userId}`) {
        const otherUserId = key.replace(`${USER_PROMOCODES_KEY}_`, '');
        const otherUserPromocodes = getUserPromocodes(otherUserId);
        if (otherUserPromocodes.includes(upperCode)) {
          isStillUsed = true;
          break;
        }
      }
    }
    
    // If no other user has this promocode, remove from global list
    if (!isStillUsed) {
      const globallyUsed = getGloballyUsedPromocodes();
      const updatedGlobal = globallyUsed.filter(code => code !== upperCode);
      saveGloballyUsedPromocodes(updatedGlobal);
    }
    
    return true;
  } catch (error) {
    console.error('Error in revokePromocodeFromUser:', error);
    return false;
  }
};

// Get promocode usage statistics
export const getPromocodeStats = (): {
  totalUsed: number;
  totalUsers: number;
  usageByUser: { [userId: string]: number };
} => {
  const globallyUsed = getGloballyUsedPromocodes();
  const stats = {
    totalUsed: globallyUsed.length,
    totalUsers: 0,
    usageByUser: {} as { [userId: string]: number }
  };

  // Count users and their usage
  const userIds = new Set<string>();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(USER_PROMOCODES_KEY)) {
      const userId = key.replace(`${USER_PROMOCODES_KEY}_`, '');
      const userPromocodes = getUserPromocodes(userId);
      
      if (userPromocodes.length > 0) {
        userIds.add(userId);
        stats.usageByUser[userId] = userPromocodes.length;
      }
    }
  }
  
  stats.totalUsers = userIds.size;
  return stats;
};

// Clear all promocode data (admin function - use with caution)
export const clearAllPromocodeData = (): void => {
  try {
    // Remove global used promocodes
    localStorage.removeItem(USED_PROMOCODES_KEY);
    
    // Remove all user-specific promocode data
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(USER_PROMOCODES_KEY)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('All promocode data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing promocode data:', error);
  }
};

// Export a backup of all promocode data
export const exportPromocodeData = (): string => {
  const data = {
    globallyUsed: getGloballyUsedPromocodes(),
    users: {} as { [userId: string]: string[] }
  };
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(USER_PROMOCODES_KEY)) {
      const userId = key.replace(`${USER_PROMOCODES_KEY}_`, '');
      data.users[userId] = getUserPromocodes(userId);
    }
  }
  
  return JSON.stringify(data, null, 2);
};

// Import promocode data from backup
export const importPromocodeData = (dataString: string): boolean => {
  try {
    const data = JSON.parse(dataString);
    
    // Import global data
    if (data.globallyUsed) {
      saveGloballyUsedPromocodes(data.globallyUsed);
    }
    
    // Import user data
    if (data.users) {
      Object.entries(data.users).forEach(([userId, promocodes]) => {
        saveUserPromocodes(userId, promocodes as string[]);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error importing promocode data:', error);
    return false;
  }
};