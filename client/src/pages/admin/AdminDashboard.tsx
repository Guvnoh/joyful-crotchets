import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowRight,
  Plus,
  Eye,
  FolderTree,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsCard } from '@/components/admin/StatsCard'
import { useDashboardStats } from '@/hooks/useOrders'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice, formatDateShort, statuses } from '@/lib/utils'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats()
  const { user } = useAuthStore()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-chocolate-500 text-sm mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/products/new">
            <Button className="bg-gold hover:bg-gold-muted text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats?.totalRevenue || 0)}
          change={12.5}
          icon={DollarSign}
          color="gold"
          index={0}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={8.2}
          icon={ShoppingBag}
          color="blue"
          index={1}
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          change={5.1}
          icon={Users}
          color="green"
          index={2}
        />
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          change={-2.3}
          icon={Package}
          color="purple"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-chocolate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display text-chocolate-800">Revenue Overview</CardTitle>
            <TrendingUp className="w-5 h-5 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.revenueByMonth?.map((month, i) => {
                const maxRevenue = Math.max(...(stats.revenueByMonth?.map((m) => m.revenue) || [1]))
                const width = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0
                return (
                  <div key={month.month} className="flex items-center gap-3">
                    <span className="text-sm text-chocolate-600 w-12 shrink-0">
                      {month.month}
                    </span>
                    <div className="flex-1 h-8 bg-chocolate-50 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-lg flex items-center justify-end pr-2"
                      >
                        {width > 20 && (
                          <span className="text-xs font-medium text-white">
                            {formatPrice(month.revenue)}
                          </span>
                        )}
                      </motion.div>
                    </div>
                    {width <= 20 && (
                      <span className="text-xs font-medium text-chocolate-600">
                        {formatPrice(month.revenue)}
                      </span>
                    )}
                  </div>
                )
              })}
              {(!stats?.revenueByMonth || stats.revenueByMonth.length === 0) && (
                <div className="text-center py-8 text-chocolate-400">
                  <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No revenue data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-chocolate-100">
          <CardHeader>
            <CardTitle className="text-lg font-display text-chocolate-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/products/new">
              <Button variant="outline" className="w-full justify-start h-12 border-chocolate-200 hover:border-gold hover:bg-amber-50">
                <Plus className="w-5 h-5 mr-3 text-gold" />
                Add New Product
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full justify-start h-12 border-chocolate-200 hover:border-gold hover:bg-amber-50">
                <Eye className="w-5 h-5 mr-3 text-gold" />
                View All Orders
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline" className="w-full justify-start h-12 border-chocolate-200 hover:border-gold hover:bg-amber-50">
                <FolderTree className="w-5 h-5 mr-3 text-gold" />
                Manage Categories
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-chocolate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display text-chocolate-800">Recent Orders</CardTitle>
            <Link to="/admin/orders" className="text-sm text-gold hover:text-gold-muted flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentOrders?.slice(0, 5).map((order) => {
                const statusInfo = statuses[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' }
                return (
                  <Link
                    key={order._id}
                    to={`/admin/orders/${order._id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-chocolate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-chocolate-800 truncate">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-chocolate-500 truncate">
                        {order.user?.name || 'Guest'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                      <span className="text-sm font-semibold text-chocolate-700">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </Link>
                )
              })}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <p className="text-center py-6 text-chocolate-400 text-sm">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-chocolate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display text-chocolate-800">Top Products</CardTitle>
            <Link to="/admin/products" className="text-sm text-gold hover:text-gold-muted flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topProducts?.slice(0, 5).map((item, i) => (
                <div key={item.product._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-chocolate-50 transition-colors">
                  <span className="text-sm font-bold text-gold w-6">#{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-chocolate-100 shrink-0">
                    {item.product.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-chocolate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-chocolate-800 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-chocolate-500">
                      {item.totalSold} sold
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-chocolate-700">
                    {formatPrice(item.revenue)}
                  </span>
                </div>
              ))}
              {(!stats?.topProducts || stats.topProducts.length === 0) && (
                <p className="text-center py-6 text-chocolate-400 text-sm">No product data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {stats?.orderStatusBreakdown && stats.orderStatusBreakdown.length > 0 && (
        <Card className="border-chocolate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display text-chocolate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Order Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {stats.orderStatusBreakdown.map((item) => {
                const statusInfo = statuses[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-800' }
                return (
                  <div key={item.status} className="flex items-center gap-2 px-4 py-2 bg-chocolate-50 rounded-lg">
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                    <span className="text-sm font-semibold text-chocolate-700">{item.count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
