import React from 'react';
import { format } from 'date-fns';

interface Activity {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  timestamp: Date;
}

const activities: Activity[] = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    action: 'checked in for Yoga class',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: 2,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    action: 'renewed monthly subscription',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
  {
    id: 3,
    user: {
      name: 'Mike Williams',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    action: 'booked a personal training session',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    id: 4,
    user: {
      name: 'Emma Davis',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    action: 'checked in for HIIT class',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
  },
  {
    id: 5,
    user: {
      name: 'Robert Chen',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    action: 'purchased a protein shake',
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
  },
];

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  return format(date, 'MMM d');
};

const RecentActivities: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <img
              src={activity.user.avatar}
              alt={activity.user.name}
              className="h-10 w-10 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                <span className="font-semibold">{activity.user.name}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;