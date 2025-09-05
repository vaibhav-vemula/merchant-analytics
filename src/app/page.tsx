'use client'

import { useState } from 'react'
import DashboardOverview from '@/components/DashboardOverview'
import MerchantAnalytics from '@/components/MerchantAnalytics'
import BusinessCustomerAnalytics from '@/components/BusinessCustomerAnalytics'
import PredictionAnalytics from '@/components/PredictionAnalytics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import data from './data.json'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Merchant Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Platform analytics: {data.summary.total_entities_onboarded.toLocaleString()} entities tracked
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Data as of: {new Date(data.summary.data_processing_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
            <TabsTrigger value="business-customers">Business Customers</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview data={data} />
          </TabsContent>

          <TabsContent value="merchants">
            <MerchantAnalytics merchantData={data.merchants} />
          </TabsContent>

          <TabsContent value="business-customers">
            <BusinessCustomerAnalytics businessCustomerData={data.business_customers} />
          </TabsContent>

          <TabsContent value="predictions">
            <PredictionAnalytics predictionData={data.predictions} currentSales={data.merchants.total_gross_sales} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
