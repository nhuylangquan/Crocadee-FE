import { CourseSidebar } from '../components/CourseSidebar';
import { LessonContent } from '../components/LessonContent';

export function PracticeLabPage() {
  return (
    <div className="flex h-full w-full bg-bg-default">
      {/* Left Sidebar */}
      <CourseSidebar />

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <LessonContent />
      </div>
    </div>
  );
}
