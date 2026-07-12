export interface LessonData {
  lessonId: string;
  module: number;
  partName: string;
  title: string;
  description: string;
  infoCards?: {
    id: string;
    icon: string;
    iconBgClass: string;
    iconTextClass: string;
    title: string;
    description: string;
  }[];
  nextLessonId?: string;
  nextLessonName?: string;
  prevLessonId?: string;
  prevLessonName?: string;
}
