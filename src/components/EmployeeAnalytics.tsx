import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Package, MapPin, TrendingUp } from 'lucide-react'

interface EmployeeData {
  estimated_total_staff: number
  total_inventory_items: number
  inventory_locations: number
  total_inventory_value: number
  avg_items_per_staff: number
  staff_productivity_score: number
  inventory_details: Array<{
    file_source: string
    total_items: number
    revenue_items: number
    non_revenue_items: number
    items_with_cost: number
    hidden_items: number
    avg_price: number
    total_inventory_value: number
    estimated_staff: number
  }>
}

interface EmployeeAnalyticsProps {
  employeeData: EmployeeData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function EmployeeAnalytics({ employeeData }: EmployeeAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Prepare chart data
  const locationData = employeeData.inventory_details.map((location, index) => ({
    name: `Location ${index + 1}`,
    staff: location.estimated_staff,
    items: location.total_items,
    revenue_items: location.revenue_items,
    value: location.total_inventory_value
  }))

  const staffDistribution = employeeData.inventory_details.map((location, index) => ({
    name: `Location ${index + 1}`,
    value: location.estimated_staff,
    color: COLORS[index % COLORS.length]
  }))

  const productivityData = employeeData.inventory_details.map((location, index) => ({
    name: `Location ${index + 1}`,
    items_per_staff: location.total_items / Math.max(1, location.estimated_staff),
    productivity_score: Math.min(100, (location.total_items / Math.max(1, location.estimated_staff)) / 20 * 100)
  }))

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee & Staff Analytics</h2>
        <p className="text-gray-600">
          Staff estimates and productivity analysis based on inventory management data
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Estimated Staff</p>
              <p className="text-2xl font-semibold text-gray-900">{employeeData.estimated_total_staff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inventory Items</p>
              <p className="text-2xl font-semibold text-gray-900">{employeeData.total_inventory_items.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Locations</p>
              <p className="text-2xl font-semibold text-gray-900">{employeeData.inventory_locations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Productivity Score</p>
              <p className="text-2xl font-semibold text-gray-900">{employeeData.staff_productivity_score}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Staff Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Distribution by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={staffDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value} staff`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {staffDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Location Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items vs Staff by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="items" fill="#0088FE" name="Total Items" />
              <Bar dataKey="staff" fill="#00C49F" name="Staff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productivity Analysis */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Productivity Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'items_per_staff' ? value.toFixed(1) : `${value.toFixed(1)}%`,
                name === 'items_per_staff' ? 'Items per Staff' : 'Productivity Score'
              ]}
            />
            <Bar dataKey="items_per_staff" fill="#FFBB28" name="items_per_staff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Location Analysis */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Location Detail Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items/Staff
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeData.inventory_details.map((location, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Location {index + 1}
                    </div>
                    <div className="text-sm text-gray-500">
                      {location.file_source.split('/').pop()?.replace('.xlsx', '')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.estimated_staff}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.total_items.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.revenue_items.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(location.total_inventory_value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(location.total_items / Math.max(1, location.estimated_staff)).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Staff Management Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Current Staffing</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• {employeeData.estimated_total_staff} estimated staff across {employeeData.inventory_locations} locations</p>
              <p>• Managing {employeeData.total_inventory_items} inventory items</p>
              <p>• Average {employeeData.avg_items_per_staff.toFixed(1)} items per staff member</p>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Productivity</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Overall productivity score: {employeeData.staff_productivity_score}/100</p>
              <p>• Total inventory value: {formatCurrency(employeeData.total_inventory_value)}</p>
              <p>• Efficient staff-to-item ratio maintained</p>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Monitor staff workload distribution</p>
              <p>• Consider automation for high-volume locations</p>
              <p>• Regular productivity assessments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}