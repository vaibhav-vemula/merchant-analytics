import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CustomerData {
  total_onboarded: number
  active_customers: number
  inactive_customers: number
  customers_with_names: number
  recent_signups_30days: number
}

interface CustomerAnalyticsProps {
  customerData: CustomerData
}

export default function CustomerAnalytics({ customerData }: CustomerAnalyticsProps) {
  const statusData = [
    { name: 'Active', value: customerData.active_customers, color: '#10B981' },
    { name: 'Inactive', value: customerData.inactive_customers, color: '#EF4444' },
    { name: 'Unknown', value: Math.max(0, customerData.total_onboarded - customerData.active_customers - customerData.inactive_customers), color: '#6B7280' }
  ].filter(item => item.value > 0)

  const completionRate = customerData.total_onboarded > 0 
    ? (customerData.customers_with_names / customerData.total_onboarded) * 100 
    : 0

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Analytics</h2>
        <p className="text-gray-600">
          Customer onboarding and engagement metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{customerData.total_onboarded}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{customerData.active_customers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inactive Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{customerData.inactive_customers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Signups (30d)</p>
              <p className="text-2xl font-semibold text-gray-900">{customerData.recent_signups_30days}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Status Distribution</h3>
          {customerData.total_onboarded > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300 text-gray-500">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No customer data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Completion Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Customers with Names</span>
                <span className="font-medium">{customerData.customers_with_names}/{customerData.total_onboarded}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{completionRate.toFixed(1)}% completion rate</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{customerData.customers_with_names}</div>
                <div className="text-xs text-gray-500">Complete Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{customerData.total_onboarded - customerData.customers_with_names}</div>
                <div className="text-xs text-gray-500">Incomplete Profiles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Insights & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current Status */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {customerData.total_onboarded === 0 ? (
                <p>No customer data is currently being tracked in the system.</p>
              ) : (
                <>
                  <p>• {customerData.total_onboarded} customers registered</p>
                  <p>• {customerData.active_customers} currently active</p>
                  <p>• {customerData.recent_signups_30days} joined in last 30 days</p>
                </>
              )}
            </div>
          </div>

          {/* Opportunities */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Growth Opportunities</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {customerData.total_onboarded === 0 ? (
                <p>Implement customer registration and tracking system</p>
              ) : (
                <>
                  <p>• Improve profile completion rate</p>
                  <p>• Focus on customer retention</p>
                  <p>• Analyze inactive customer patterns</p>
                </>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {customerData.total_onboarded === 0 ? (
                <>
                  <p>• Set up customer data collection</p>
                  <p>• Implement user analytics</p>
                  <p>• Create engagement tracking</p>
                </>
              ) : (
                <>
                  <p>• Incentivize profile completion</p>
                  <p>• Create re-engagement campaigns</p>
                  <p>• Monitor customer journey</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Data Quality Notice */}
        {customerData.total_onboarded === 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Limited Customer Data Available
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    The current customer dataset appears to have limited trackable information. 
                    Consider implementing a more comprehensive customer data collection system 
                    to get better insights into customer behavior and engagement patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}