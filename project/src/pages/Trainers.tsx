import React from 'react';
import { Phone, Mail, Star, Plus } from 'lucide-react';

interface Trainer {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  clients: number;
  phone: string;
  email: string;
  avatar: string;
  availability: string;
}

const trainers: Trainer[] = [
  {
    id: 1,
    name: 'Mike Johnson',
    specialization: 'Strength & Conditioning',
    rating: 4.9,
    clients: 28,
    phone: '(555) 123-4567',
    email: 'mike.j@fitflix.com',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availability: 'Mon-Fri, 8AM-4PM',
  },
  {
    id: 2,
    name: 'Emma Davis',
    specialization: 'Yoga & Pilates',
    rating: 4.8,
    clients: 32,
    phone: '(555) 234-5678',
    email: 'emma.d@fitflix.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availability: 'Mon-Wed, Fri, 9AM-6PM',
  },
  {
    id: 3,
    name: 'David Kim',
    specialization: 'Bodybuilding',
    rating: 4.7,
    clients: 24,
    phone: '(555) 345-6789',
    email: 'david.k@fitflix.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availability: 'Tue-Sat, 10AM-7PM',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    specialization: 'Cardio & HIIT',
    rating: 4.9,
    clients: 30,
    phone: '(555) 456-7890',
    email: 'sarah.w@fitflix.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availability: 'Mon-Fri, 7AM-3PM',
  },
  {
    id: 5,
    name: 'Robert Chen',
    specialization: 'Nutrition & Weight Loss',
    rating: 4.6,
    clients: 22,
    phone: '(555) 567-8901',
    email: 'robert.c@fitflix.com',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availability: 'Mon, Wed, Fri, 9AM-5PM',
  },
  {
    id: 6,
    name: 'Maria Rodriguez',
    specialization: 'Dance & Zumba',
    rating: 4.8,
    clients: 35,
    phone: '(555) 678-9012',
    email: 'maria.r@fitflix.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availability: 'Tue-Thu, Sat, 11AM-8PM',
  },
];

const Trainers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <Plus className="h-5 w-5 mr-2" />
          Add New Trainer
        </button>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="h-16 w-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
                  <p className="text-sm text-gray-500">{trainer.specialization}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{trainer.rating} ({trainer.clients} clients)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{trainer.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{trainer.email}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">Availability:</p>
                  <p className="ml-2 text-sm text-gray-500">{trainer.availability}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="flex justify-between">
                <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                  View Schedule
                </button>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trainers;