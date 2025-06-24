export interface ChapterPromocodes {
  [chapterKey: string]: string[];
}

export interface Chapter {
  id: number;
  title: string;
}

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