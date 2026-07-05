import { CourseSidebar } from '../components/CourseSidebar';
import { LessonContent } from '../components/LessonContent';

export function PracticeLabPage() {
  return (
    <div className="flex h-full gap-4 p-4">
      {/* Left Sidebar */}
      <CourseSidebar />

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-shade-white shadow-sm">
        <LessonContent />
      </div>
    </div>
  );
}
