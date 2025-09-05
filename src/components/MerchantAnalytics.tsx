import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Store, TrendingUp, DollarSign, Percent } from 'lucide-react'

interface TopSellingItem {
  name: string
  gross_sales: number
}

interface InventoryDetails {
  merchant_name: string
  file_source: string
  total_items: number
  revenue_items: number
  non_revenue_items: number
  items_with_cost: number
  hidden_items: number
  avg_price: number
  total_inventory_value: number
}

interface MerchantData {
  total_merchants: number
  active_merchants: number
  inactive_merchants: number
  total_gross_sales: number
  total_net_sales: number
  average_profit_margin: number
  merchant_details: Array<{
    merchant_name: string
    gross_sales: number
    net_sales: number
    gross_profit: number
    gross_profit_margin: number
    status: string
    top_selling_items: TopSellingItem[]
    inventory_details?: InventoryDetails
  }>
  top_3_merchants: Array<{
    merchant_name: string
    gross_sales: number
    net_sales: number
    gross_profit_margin: number
    top_selling_items: TopSellingItem[]
    inventory_details?: InventoryDetails
  }>
}

interface MerchantAnalyticsProps {
  merchantData: MerchantData
}

export default function MerchantAnalytics({ merchantData }: MerchantAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const statusData = [
    { name: 'Active', value: merchantData.active_merchants, color: '#10B981' },
    { name: 'Inactive', value: merchantData.inactive_merchants, color: '#EF4444' }
  ]

  const salesData = merchantData.merchant_details.map(merchant => ({
    name: merchant.merchant_name.split(' ')[0], // Shortened name for chart
    gross_sales: merchant.gross_sales,
    net_sales: merchant.net_sales,
    profit_margin: merchant.gross_profit_margin
  }))

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Merchant Analytics</h2>
        <p className="text-gray-600">
          Detailed insights into merchant performance and activity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Merchants</p>
              <p className="text-2xl font-semibold text-gray-900">{merchantData.total_merchants}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Volume</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(merchantData.total_gross_sales)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Percent className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Profit Margin</p>
              <p className="text-2xl font-semibold text-gray-900">
                {merchantData.average_profit_margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round((merchantData.active_merchants / merchantData.total_merchants) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Merchant Sales Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'gross_sales' || name === 'net_sales' 
                    ? formatCurrency(value) 
                    : `${value.toFixed(1)}%`,
                  name === 'gross_sales' ? 'Gross Sales' :
                  name === 'net_sales' ? 'Net Sales' : 'Profit Margin'
                ]}
              />
              <Bar dataKey="gross_sales" fill="#0088FE" name="gross_sales" />
              <Bar dataKey="net_sales" fill="#00C49F" name="net_sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Merchant Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
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
        </div>
      </div>

      {/* Top 3 Merchants */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 3 Merchants by Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {merchantData.top_3_merchants.map((merchant, index) => (
            <div key={merchant.merchant_name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">#{index + 1}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} Top Performer
                </div>
              </div>
              <h5 className="font-medium text-gray-900 mb-2">{merchant.merchant_name}</h5>
              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Gross Sales:</span>
                  <span className="font-bold text-gray-500">{formatCurrency(merchant.gross_sales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Net Sales:</span>
                  <span className="font-bold text-gray-500">{formatCurrency(merchant.net_sales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Profit Margin:</span>
                  <span className="font-bold text-gray-500">{merchant.gross_profit_margin.toFixed(1)}%</span>
                </div>
              </div>
              
              {/* Top Selling Items */}
              {merchant.top_selling_items && merchant.top_selling_items.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h6 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Top Selling Items
                  </h6>
                  <div className="space-y-1">
                    {merchant.top_selling_items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-xs">
                        <span className="text-gray-600 truncate mr-2" title={item.name}>
                          {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                        </span>
                        <span className="font-medium text-gray-900 whitespace-nowrap">
                          {formatCurrency(item.gross_sales)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Details */}
              {merchant.inventory_details && (
                <div className="mt-4 pt-4 border-t">
                  <h6 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Inventory Details
                  </h6>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium text-gray-900">{merchant.inventory_details.total_items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue Items:</span>
                      <span className="font-medium text-gray-900">{merchant.inventory_details.revenue_items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inventory Value:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(merchant.inventory_details.total_inventory_value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Price:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(merchant.inventory_details.avg_price)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {(!merchant.top_selling_items || merchant.top_selling_items.length === 0) && 
               (!merchant.inventory_details) && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 italic">No additional data available</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow mt-8 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">All Merchants Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Top Selling Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {merchantData.merchant_details.map((merchant) => (
                <tr key={merchant.merchant_name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{merchant.merchant_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      merchant.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {merchant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(merchant.gross_sales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(merchant.net_sales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {merchant.gross_profit_margin.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4">
                    {merchant.top_selling_items && merchant.top_selling_items.length > 0 ? (
                      <div className="space-y-1 max-w-xs">
                        {merchant.top_selling_items.map((item, itemIndex) => (
                          <div key={itemIndex} className="text-xs">
                            <div className="font-medium text-gray-900 truncate" title={item.name}>
                              {item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name}
                            </div>
                            <div className="text-gray-500">{formatCurrency(item.gross_sales)}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic text-xs">No data</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {merchant.inventory_details ? (
                      <div className="space-y-1 text-xs">
                        <div className="font-medium text-gray-900">
                          {merchant.inventory_details.total_items} items
                        </div>
                        <div className="text-gray-500">
                          Value: {formatCurrency(merchant.inventory_details.total_inventory_value)}
                        </div>
                        <div className="text-gray-500">
                          Revenue: {merchant.inventory_details.revenue_items} items
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic text-xs">No inventory data</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}