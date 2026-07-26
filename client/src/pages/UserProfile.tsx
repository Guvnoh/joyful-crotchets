import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Package, MapPin, Camera, Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useMyOrders } from '@/hooks/useOrders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate, getInitials, statuses } from '@/lib/utils'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function UserProfile() {
  const { user, updateProfile, isAuthenticated } = useAuthStore()
  const { data: orders, isLoading: ordersLoading } = useMyOrders()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      })
    }
  }, [user, reset])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="border-sand/30 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-mocha/30 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-chocolate mb-3">Sign In Required</h2>
            <p className="text-mocha mb-6">Please sign in to view your profile.</p>
            <Link to="/login">
              <Button className="bg-gold text-white hover:bg-gold/90">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gold/10 text-gold font-display text-2xl font-bold">
              {getInitials(user?.name || 'U')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-3xl font-bold text-chocolate">{user?.name}</h1>
            <p className="text-mocha">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start bg-transparent border-b border-sand/30 rounded-none h-auto p-0 gap-0">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-chocolate font-medium px-6 py-3"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-chocolate font-medium px-6 py-3"
            >
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-chocolate font-medium px-6 py-3"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="border-sand/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-xl text-chocolate">Personal Information</CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-gold/30 text-chocolate hover:bg-gold hover:text-white"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      {...register('name')}
                      error={errors.name?.message}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Email"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      disabled={!isEditing}
                    />
                  </div>
                  <Input
                    label="Phone"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gold text-white hover:bg-gold/90"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          reset({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                          })
                        }}
                        className="border-sand/50"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card className="border-sand/30">
              <CardHeader>
                <CardTitle className="font-display text-xl text-chocolate">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-beige animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-mocha/30 mx-auto mb-4" />
                    <p className="text-mocha mb-4">No orders yet</p>
                    <Link to="/shop">
                      <Button className="bg-gold text-white hover:bg-gold/90">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="p-4 rounded-xl border border-sand/30 hover:border-gold/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-medium text-chocolate">
                                {order.orderNumber}
                              </span>
                              <Badge className={statuses[order.status]?.color || 'bg-gray-100 text-gray-800'}>
                                {statuses[order.status]?.label || order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-mocha mt-1">
                              {formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-display font-semibold text-chocolate">
                              {formatPrice(order.total)}
                            </span>
                            <Link to={`/order/${order._id}`}>
                              <Button variant="outline" size="sm" className="border-gold/30 text-chocolate hover:bg-gold hover:text-white">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="mt-6">
            <Card className="border-sand/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-xl text-chocolate">Saved Addresses</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold/30 text-chocolate hover:bg-gold hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent>
                {!user?.addresses || user.addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-mocha/30 mx-auto mb-4" />
                    <p className="text-mocha mb-4">No saved addresses</p>
                    <Button
                      variant="outline"
                      className="border-gold/30 text-chocolate hover:bg-gold hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {user.addresses.map((address, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-sand/30 relative"
                      >
                        {address.isDefault && (
                          <Badge className="absolute top-3 right-3 bg-gold text-white text-[10px]">
                            Default
                          </Badge>
                        )}
                        <p className="font-medium text-chocolate text-sm">{address.label}</p>
                        <p className="text-sm text-mocha mt-1">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm" className="text-xs text-mocha hover:text-gold">
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-mocha hover:text-destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
