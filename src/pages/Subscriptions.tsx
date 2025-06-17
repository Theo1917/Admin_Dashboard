import React from 'react';
import { Check, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityChart from '../components/ActivityChart';

interface Plan {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 1,
    name: 'Basic',
    price: 29.99,
    period: 'month',
    features: [
      'Access to gym facilities',
      'Standard equipment usage',
      'Locker room access',
      '2 group classes per week',
    ],
  },
  {
    id: 2,
    name: 'Premium',
    price: 49.99,
    period: 'month',
    features: [
      'Full access to gym facilities',
      'All equipment usage',
      'Locker room access',
      'Unlimited group classes',
      '1 personal training session/month',
      'Access to swimming pool',
    ],
    popular: true,
  },
  {
    id: 3,
    name: 'Elite',
    price: 79.99,
    period: 'month',
    features: [
      'Full access to gym facilities',
      'All equipment usage',
      'Locker room access with towel service',
      'Unlimited group classes',
      '4 personal training sessions/month',
      'Access to swimming pool and sauna',
      'Nutrition consultation',
      'Free protein shake after workout',
    ],
  },
];

const Subscriptions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <Plus className="h-5 w-5 mr-2" />
          Create New Plan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Subscriptions" 
          value="1,156" 
          change="8%" 
          isPositive={true}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatCard 
          title="New Subscriptions" 
          value="124" 
          change="12%" 
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatCard 
          title="Cancellations" 
          value="28" 
          change="5%" 
          isPositive={false}
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Subscription Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Trends</h3>
        <div className="h-80">
          <ActivityChart title="" />
        </div>
      </div>

      {/* Subscription Plans */}
      <h2 className="text-xl font-semibold text-gray-900 mt-8">Membership Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`bg-white rounded-lg shadow-md overflow-hidden relative ${
              plan.popular ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-semibold">
                Most Popular
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900">${plan.price}</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <button className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                plan.popular 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
              }`}>
                Edit Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;