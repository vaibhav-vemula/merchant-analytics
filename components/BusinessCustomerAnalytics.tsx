import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";

interface BusinessCustomerData {
  total_business_accounts: number;
  active_accounts: number;
  live_accounts: number;
  total_mtd_volume: number;
  total_last_month_volume: number;
  high_volume_accounts: number;
  avg_volume_per_account: number;
  volume_categories: {
    high: number;
    medium: number;
    low: number;
  };
  top_3_business_customers: Array<{
    business_name: string;
    dba_name: string;
    customer_id: number;
    total_volume: number;
    mtd_volume: number;
    last_month_volume: number;
    account_status: string;
    volume_category: string;
  }>;
}

interface BusinessCustomerAnalyticsProps {
  businessCustomerData: BusinessCustomerData;
}

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export default function BusinessCustomerAnalytics({
  businessCustomerData,
}: BusinessCustomerAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare chart data
  const volumeCategoryData = [
    {
      name: "High Volume",
      value: businessCustomerData.volume_categories.high,
      color: COLORS[0],
    },
    {
      name: "Medium Volume",
      value: businessCustomerData.volume_categories.medium,
      color: COLORS[1],
    },
    {
      name: "Low Volume",
      value: businessCustomerData.volume_categories.low,
      color: COLORS[2],
    },
  ];

  const topCustomersChart = businessCustomerData.top_3_business_customers.map(
    (customer) => ({
      name:
        customer.business_name.length > 15
          ? `${customer.business_name.substring(0, 15)}...`
          : customer.business_name,
      full_name: customer.business_name,
      mtd_volume: customer.mtd_volume,
      last_month_volume: customer.last_month_volume,
      total_volume: customer.total_volume,
    })
  );

  const statusData = [
    {
      name: "Active",
      value: businessCustomerData.active_accounts,
      color: "#10B981",
    },
    {
      name: "Live",
      value: businessCustomerData.live_accounts,
      color: "#3B82F6",
    },
    {
      name: "Other",
      value:
        businessCustomerData.total_business_accounts -
        businessCustomerData.live_accounts,
      color: "#6B7280",
    },
  ].filter((item) => item.value > 0);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Business Customer Analytics
        </h2>
        <p className="text-gray-600">
          Comprehensive analysis of business customer accounts and transaction
          volumes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Accounts
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {businessCustomerData.total_business_accounts.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Live Accounts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {businessCustomerData.live_accounts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">MTD Volume</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(businessCustomerData.total_mtd_volume)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Volume</p>
              <p className="text-2xl font-semibold text-gray-900">
                {businessCustomerData.high_volume_accounts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Avg per Account
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(businessCustomerData.avg_volume_per_account)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Volume Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={volumeCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${((percent || 0) * 100).toFixed(1)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {volumeCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Status Distribution
          </h3>
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

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 3 Business Customers by Volume
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topCustomersChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "mtd_volume"
                  ? "MTD Volume"
                  : name === "last_month_volume"
                  ? "Last Month Volume"
                  : "Total Volume",
              ]}
              labelFormatter={(label) => {
                const item = topCustomersChart.find((c) => c.name === label);
                return item ? item.full_name : label;
              }}
            />
            <Bar dataKey="mtd_volume" fill="#0088FE" name="mtd_volume" />
            <Bar
              dataKey="last_month_volume"
              fill="#00C49F"
              name="last_month_volume"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {businessCustomerData.top_3_business_customers.map(
          (customer, index) => (
            <div
              key={customer.customer_id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">#{index + 1}</h4>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer.volume_category === "High"
                      ? "bg-green-100 text-green-800"
                      : customer.volume_category === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.volume_category} Volume
                </div>
              </div>

              <h5 className="font-medium text-gray-900 mb-1">
                {customer.business_name}
              </h5>
              {customer.dba_name && (
                <p className="text-sm text-gray-600 mb-3">
                  DBA: {customer.dba_name}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer ID:</span>
                  <span className="font-medium text-gray-500">
                    {customer.customer_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`font-medium ${
                      customer.account_status === "Live"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {customer.account_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">MTD Volume:</span>
                  <span className="font-medium text-gray-500">
                    {formatCurrency(customer.mtd_volume)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Month:</span>
                  <span className="font-medium text-gray-500">
                    {formatCurrency(customer.last_month_volume)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-700 font-medium">
                    Total Volume:
                  </span>
                  <span className="font-bold text-lg text-gray-800">
                    {formatCurrency(customer.total_volume)}
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Business Customer Performance Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(
                (businessCustomerData.live_accounts /
                  businessCustomerData.total_business_accounts) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Account Activation Rate</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(
                (businessCustomerData.high_volume_accounts /
                  businessCustomerData.total_business_accounts) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-600">High Volume Customers</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatCurrency(businessCustomerData.total_last_month_volume)}
            </div>
            <div className="text-sm text-gray-600">Last Month Volume</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Account Health</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                • {businessCustomerData.live_accounts} live accounts (
                {Math.round(
                  (businessCustomerData.live_accounts /
                    businessCustomerData.total_business_accounts) *
                    100
                )}
                %)
              </p>
              <p>• {businessCustomerData.active_accounts} active accounts</p>
              <p>• Strong account activation rate</p>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Volume Analysis</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                • {formatCurrency(businessCustomerData.total_mtd_volume)} MTD
                volume
              </p>
              <p>
                • {businessCustomerData.high_volume_accounts} high-volume
                accounts
              </p>
              <p>
                • {formatCurrency(businessCustomerData.avg_volume_per_account)}{" "}
                average per account
              </p>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Growth Opportunities
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Focus on converting low-volume to medium</p>
              <p>• Engage inactive accounts</p>
              <p>• Expand high-volume customer base</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
