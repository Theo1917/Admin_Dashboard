import React from 'react';
import { Calendar, Clock, Users, Plus, MoreHorizontal } from 'lucide-react';

interface GymClass {
  id: number;
  title: string;
  instructor: string;
  schedule: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  category: string;
}

const classes: GymClass[] = [
  {
    id: 1,
    title: 'Morning Yoga',
    instructor: 'Emma Davis',
    schedule: 'Mon, Wed, Fri',
    time: '08:00 AM',
    duration: '60 min',
    capacity: 20,
    enrolled: 15,
    category: 'Yoga',
  },
  {
    id: 2,
    title: 'HIIT Training',
    instructor: 'Mike Johnson',
    schedule: 'Tue, Thu',
    time: '10:30 AM',
    duration: '45 min',
    capacity: 20,
    enrolled: 18,
    category: 'Cardio',
  },
  {
    id: 3,
    title: 'Spinning Class',
    instructor: 'Sarah Williams',
    schedule: 'Mon, Wed, Fri',
    time: '12:15 PM',
    duration: '45 min',
    capacity: 15,
    enrolled: 12,
    category: 'Cardio',
  },
  {
    id: 4,
    title: 'Pilates',
    instructor: 'John Smith',
    schedule: 'Tue, Thu',
    time: '02:00 PM',
    duration: '60 min',
    capacity: 15,
    enrolled: 8,
    category: 'Core',
  },
  {
    id: 5,
    title: 'Zumba',
    instructor: 'Maria Rodriguez',
    schedule: 'Mon, Wed',
    time: '05:30 PM',
    duration: '60 min',
    capacity: 25,
    enrolled: 22,
    category: 'Dance',
  },
  {
    id: 6,
    title: 'Strength Training',
    instructor: 'David Kim',
    schedule: 'Tue, Thu, Sat',
    time: '06:00 PM',
    duration: '50 min',
    capacity: 15,
    enrolled: 10,
    category: 'Strength',
  },
];

const Classes: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <Plus className="h-5 w-5 mr-2" />
          Add New Class
        </button>
      </div>

      {/* Class Categories */}
      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg">
          All Classes
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Yoga
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Cardio
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Strength
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Dance
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Core
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((gymClass) => (
          <div key={gymClass.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{gymClass.title}</h3>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">{gymClass.category}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{gymClass.schedule}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{gymClass.time} • {gymClass.duration}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{gymClass.enrolled}/{gymClass.capacity} enrolled</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">Instructor:</p>
                  <p className="ml-2 text-sm text-gray-500">{gymClass.instructor}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="flex justify-between">
                <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                  Edit
                </button>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;