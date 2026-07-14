import { useState, useEffect } from 'react';
import axios from 'axios';
import { CourseSidebar } from '../components/CourseSidebar';
import { LessonContent } from '../components/LessonContent';
import type { LessonData } from '../data/lessonData';
import { AIChatBubble } from '../components/AIChatBubble';

export function PracticeLabPage() {
  const [currentLessonId, setCurrentLessonId] = useState('intro');
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get('http://localhost:3000/lessons');
        setLessons(response.data as LessonData[]);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchLessons();
  }, []);

  const currentLesson = lessons.find(
    (lesson) => lesson.lessonId === currentLessonId
  );

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F7F6FF]">
        <div className="font-bold text-[#6C63FF]">Loading lessons...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-bg-default">
      <CourseSidebar
        lessons={lessons}
        currentLessonId={currentLessonId}
        onSelectLesson={setCurrentLessonId}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <LessonContent
          lessons={lessons}
          lessonId={currentLessonId}
          onNextLesson={setCurrentLessonId}
        />
      </div>

      <AIChatBubble lessonTitle={currentLesson?.title} />
    </div>
  );
}
