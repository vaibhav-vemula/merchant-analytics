import { DollarSign, Users, Store, TrendingUp } from 'lucide-react'

interface DashboardOverviewProps {
  data: {
    summary: {
      total_entities_onboarded: number
      total_platform_volume: number
      overall_active_rate: number
      comprehensive_breakdown: {
        individual_customers: number
        merchants: number
        business_customers: number
      }
    }
    merchants: {
      total_merchants: number
      active_merchants: number
      inactive_merchants: number
    }
    customers: {
      total_onboarded: number
      active_customers: number
      inactive_customers: number
    }
    business_customers: {
      total_business_accounts: number
      active_accounts: number
      total_mtd_volume: number
    }
  }
}

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      name: 'Total Platform Volume',
      value: formatCurrency(data.summary.total_platform_volume),
      icon: DollarSign,
      change: 'Combined merchant + business volume',
      changeType: 'positive',
    },
    {
      name: 'Total Entities',
      value: data.summary.total_entities_onboarded.toLocaleString(),
      icon: Users,
      change: '3 entity types tracked',
      changeType: 'positive',
    },
    {
      name: 'Business Customers',
      value: data.business_customers.total_business_accounts.toLocaleString(),
      icon: Store,
      change: `${data.business_customers.active_accounts} active`,
      changeType: 'positive',
    },
    {
      name: 'Overall Active Rate',
      value: `${data.summary.overall_active_rate}%`,
      icon: TrendingUp,
      change: 'All entity types',
      changeType: 'positive',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Overview</h2>
        <p className="text-gray-600">
          Key metrics and performance indicators for your merchant platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'bg-green-100 text-green-800'
                    : stat.changeType === 'negative'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Entity Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {data.summary.comprehensive_breakdown.business_customers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Business Customers</div>
            <div className="text-xs mt-1">
              <span className="font-bold text-gray-900">${data.business_customers.total_mtd_volume.toLocaleString()}</span> <span className="text-gray-500">MTD volume</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {data.summary.comprehensive_breakdown.merchants}
            </div>
            <div className="text-sm text-gray-600">Merchants</div>
            <div className="text-xs text-gray-500 mt-1">
              ${data.merchants.active_merchants * 262000} avg revenue
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-gray-900">Business Performance</h4>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-bold text-gray-900">{data.business_customers.total_business_accounts}</span> business customers generating <span className="font-bold text-gray-900">{formatCurrency(data.business_customers.total_mtd_volume)}</span> monthly
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium text-gray-900">Operational Scale</h4>
            <p className="text-sm text-gray-600 mt-1">
              {data.merchants.total_merchants} active merchants with comprehensive inventory management across the platform
            </p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-medium text-gray-900">Growth Opportunity</h4>
            <p className="text-sm text-gray-600 mt-1">
              Focus on individual customer onboarding and engagement to expand platform reach
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}