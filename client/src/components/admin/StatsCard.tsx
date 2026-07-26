import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  color?: 'gold' | 'green' | 'blue' | 'purple' | 'amber'
  index?: number
}

const colorMap = {
  gold: 'bg-amber-50 text-amber-600',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
}

const iconBgMap = {
  gold: 'from-amber-400 to-yellow-300',
  green: 'from-emerald-400 to-emerald-300',
  blue: 'from-blue-400 to-blue-300',
  purple: 'from-purple-400 to-purple-300',
  amber: 'from-amber-400 to-amber-300',
}

export function StatsCard({ title, value, change, icon: Icon, color = 'gold', index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden border-chocolate-100 hover:shadow-lg transition-shadow duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/5 to-transparent rounded-bl-full" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-chocolate-500">{title}</p>
              <p className="text-3xl font-bold text-chocolate-800 font-display">{value}</p>
              {change !== undefined && (
                <div className="flex items-center gap-1">
                  {change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      change >= 0 ? 'text-emerald-600' : 'text-red-600'
                    )}
                  >
                    {change >= 0 ? '+' : ''}{change}%
                  </span>
                  <span className="text-xs text-chocolate-400">vs last month</span>
                </div>
              )}
            </div>
            <div className={cn('p-3 rounded-xl bg-gradient-to-br shadow-md', iconBgMap[color])}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
