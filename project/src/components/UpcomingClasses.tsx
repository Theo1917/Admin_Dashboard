import React from 'react';
import { format } from 'date-fns';
import { Users } from 'lucide-react';

interface ClassSession {
  id: number;
  title: string;
  instructor: string;
  time: Date;
  duration: number; // in minutes
  attendees: number;
  maxAttendees: number;
}

const upcomingClasses: ClassSession[] = [
  {
    id: 1,
    title: 'Morning Yoga',
    instructor: 'Emma Davis',
    time: new Date(new Date().setHours(8, 0, 0, 0)),
    duration: 60,
    attendees: 12,
    maxAttendees: 20,
  },
  {
    id: 2,
    title: 'HIIT Training',
    instructor: 'Mike Johnson',
    time: new Date(new Date().setHours(10, 30, 0, 0)),
    duration: 45,
    attendees: 18,
    maxAttendees: 20,
  },
  {
    id: 3,
    title: 'Spinning Class',
    instructor: 'Sarah Williams',
    time: new Date(new Date().setHours(12, 15, 0, 0)),
    duration: 45,
    attendees: 15,
    maxAttendees: 15,
  },
  {
    id: 4,
    title: 'Pilates',
    instructor: 'John Smith',
    time: new Date(new Date().setHours(14, 0, 0, 0)),
    duration: 60,
    attendees: 8,
    maxAttendees: 15,
  },
];

const UpcomingClasses: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Classes</h3>
      <div className="space-y-4">
        {upcomingClasses.map((session) => (
          <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
              <p className="text-xs text-gray-500">
                {format(session.time, 'h:mm a')} • {session.duration} min • {session.instructor}
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>
                {session.attendees}/{session.maxAttendees}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
          View full schedule
        </button>
      </div>
    </div>
  );
};

export default UpcomingClasses;