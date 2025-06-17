import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor,
  iconBgColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
      <div className={`${iconBgColor} p-3 rounded-lg mr-4`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline mt-1">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;