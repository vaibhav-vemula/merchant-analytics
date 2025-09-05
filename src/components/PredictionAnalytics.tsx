import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Calendar, Target } from 'lucide-react'

interface PredictionData {
  next_2_months: {
    month_1_forecast: number
    month_2_forecast: number
    total_2_months: number
  }
  same_period_next_year: {
    forecast: number
    growth_projection: string
  }
  methodology: string
}

interface PredictionAnalyticsProps {
  predictionData: PredictionData
  currentSales: number
}

export default function PredictionAnalytics({ predictionData, currentSales }: PredictionAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  const currentMonth = 'Aug'
  const nextMonth = 'Sep'
  const monthAfter = 'Oct'
  const monthlyAverageSales = currentSales / 4
  
  const month1Forecast = monthlyAverageSales * 1.05  // 5% increase from average
  const month2Forecast = month1Forecast * 1.07       // 7% increase from month 1 (compound)
  
  const next2MonthsData = [
    {
      period: `${currentMonth} (Current)`,
      value: monthlyAverageSales,
      type: 'current'
    },
    {
      period: `${nextMonth} (Forecast)`,
      value: month1Forecast,
      type: 'forecast'
    },
    {
      period: `${monthAfter} (Forecast)`,
      value: month2Forecast,
      type: 'forecast'
    },
  ]

  // Calculate Y-axis domain for better chart fit
  const minValue = monthlyAverageSales * 0.9  // 10% padding below minimum
  const maxValue = month2Forecast * 1.1       // 10% padding above maximum

  // Create comparison data using total sales for year-over-year
  const yearComparisonData = [
    {
      period: 'May 9 2025 - Aug 8 2025',
      value: currentSales, // Use total sales, not monthly average
      type: 'actual'
    },
    {
      period: 'May 9 2026 - Aug 8 2026',
      value: predictionData.same_period_next_year.forecast,
      type: 'forecast'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sales Predictions & Forecasting</h2>
        <p className="text-gray-600">
          AI-powered sales forecasts and growth projections for strategic planning
        </p>
      </div>

      {/* Key Prediction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Next 2 Months</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(month1Forecast + month2Forecast)}
              </p>
              <p className="text-sm text-green-600 mt-1">+5% then +7% growth</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Next Year (Same Period)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(predictionData.same_period_next_year.forecast)}
              </p>
              <p className="text-sm text-green-600 mt-1">{predictionData.same_period_next_year.growth_projection} annual growth</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Growth Potential</p>
              <p className="text-2xl font-semibold text-gray-900">+15%</p>
              <p className="text-sm text-purple-600 mt-1">Year over year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Current Month + Next 2 Months Progression */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">3-Month Sales Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={next2MonthsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                tick={{ fill: '#374151', fontSize: 12 }}
              />
              <YAxis 
                domain={[minValue, maxValue]}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                tick={{ fill: '#374151', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number, name: string, props) => [
                  formatCurrency(value), 
                  props.payload.type === 'current' ? 'Current Sales' : 'Forecasted Sales'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0088FE" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={(props) => {
                  const { payload, index } = props;
                  return (
                    <circle 
                      key={`dot-${index}-${payload.period}`}
                      cx={props.cx} 
                      cy={props.cy} 
                      r={7} 
                      fill={payload.type === 'current' ? '#10B981' : '#0088FE'}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  )
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="text-gray-500">{currentMonth} (Current):</p>
              </div>
              <p className="font-semibold">{formatCurrency(monthlyAverageSales)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-gray-500">{nextMonth}</p>
              </div>
              <p className="font-semibold">{formatCurrency(month1Forecast)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-gray-500">{monthAfter}</p>
              </div>
              <p className="font-semibold">{formatCurrency(month2Forecast)}</p>
            </div>
          </div>
        </div>

        {/* Year-over-Year Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-over-Year Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                tick={{ fill: '#374151', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                tick={{ fill: '#374151', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number, name: string, props) => [
                  formatCurrency(value), 
                  props.payload.type === 'actual' ? 'Current' : 'Projected'
                ]}
              />
              <Bar 
                dataKey="value" 
                fill="#00C49F"
                name="value"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Expected growth: <span className="font-semibold text-green-600">{predictionData.same_period_next_year.growth_projection}</span></p>
          </div>
        </div>
      </div>

      {/* Prediction Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Forecast Breakdown & Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Progression Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">3-Month Progression Detail</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <div>
                  <p className="font-medium text-gray-900">{currentMonth} (Current Month)</p>
                  <p className="text-sm text-gray-600">Monthly average from 4-month total</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(monthlyAverageSales)}
                  </p>
                  <p className="text-sm text-gray-500">Baseline</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{nextMonth} (Next Month)</p>
                  <p className="text-sm text-gray-600">5% growth from monthly average</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(month1Forecast)}
                  </p>
                  <p className="text-sm text-green-600">+5.0% growth</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{monthAfter} (Month After)</p>
                  <p className="text-sm text-gray-600">7% growth from September (compound)</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(month2Forecast)}
                  </p>
                  <p className="text-sm text-green-600">+7.0% growth</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div>
                  <p className="font-medium text-gray-900">Total 2-Month Forecast</p>
                  <p className="text-sm text-gray-600">Combined projection</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(month1Forecast + month2Forecast)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Forecast Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Annual Growth Analysis</h4>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Current Performance</h5>
                <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(currentSales)}</p>
                <p className="text-sm text-gray-600">May 9 2025 - Aug 8 2025 total</p>
              </div>

              <div className="p-4 border rounded-lg bg-green-50">
                <h5 className="font-medium text-gray-900 mb-2">Next Year Projection</h5>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(predictionData.same_period_next_year.forecast)}
                </p>
                <p className="text-sm text-green-600">
                  May 9 2026 - Aug 8 2026 ({predictionData.same_period_next_year.growth_projection} growth)
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Growth Opportunity</h5>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(predictionData.same_period_next_year.forecast - currentSales)}
                </p>
                <p className="text-sm text-gray-600">Additional revenue potential</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}