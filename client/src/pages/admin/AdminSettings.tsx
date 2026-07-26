import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Settings,
  Save,
  Store,
  Truck,
  Share2,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/services/api'
import type { SiteSettings } from '@/types'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState<SiteSettings>({})

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings')
      return data.data as SiteSettings
    },
  })

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const updateMutation = useMutation({
    mutationFn: async (data: SiteSettings) => {
      const { data: res } = await api.put('/settings', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] })
      toast.success('Settings saved successfully')
    },
    onError: () => toast.error('Failed to save settings'),
  })

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const updateNestedField = (parent: string, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] || {}), [key]: value },
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">Settings</h1>
          <p className="text-chocolate-500 text-sm mt-1">Manage your store settings</p>
        </div>
        <Button
          className="bg-gold hover:bg-gold-muted text-white"
          onClick={handleSave}
          loading={updateMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-chocolate-100 p-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-white gap-2">
            <Store className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:bg-white gap-2">
            <Truck className="w-4 h-4" /> Shipping
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white gap-2">
            <Share2 className="w-4 h-4" /> Social Media
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-white gap-2">
            <Search className="w-4 h-4" /> SEO
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Store Name</Label>
                  <Input
                    value={formData.storeName || ''}
                    onChange={(e) => updateField('storeName', e.target.value)}
                    placeholder="Joyful Crotchets"
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={formData.tagline || ''}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    placeholder="Premium Handmade Crochet"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={formData.contactEmail || ''}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    placeholder="hello@joyfulcrotchets.com"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.contactPhone || ''}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <Label>Store Address</Label>
                <Textarea
                  value={formData.storeAddress || ''}
                  onChange={(e) => updateField('storeAddress', e.target.value)}
                  placeholder="123 Crochet Lane, Yarn City, YC 12345"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping">
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800">Shipping Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Free Shipping Threshold ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.freeShippingThreshold || ''}
                    onChange={(e) => updateField('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                    placeholder="75.00"
                  />
                </div>
                <div>
                  <Label>Standard Shipping Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.standardShippingRate || ''}
                    onChange={(e) => updateField('standardShippingRate', parseFloat(e.target.value) || 0)}
                    placeholder="5.99"
                  />
                </div>
              </div>
              <div>
                <Label>Shipping Policy</Label>
                <Textarea
                  value={formData.shippingPolicy || ''}
                  onChange={(e) => updateField('shippingPolicy', e.target.value)}
                  placeholder="Shipping policy details..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social">
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800">Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Instagram URL</Label>
                <Input
                  value={formData.instagram || ''}
                  onChange={(e) => updateField('instagram', e.target.value)}
                  placeholder="https://instagram.com/joyfulcrotchets"
                />
              </div>
              <div>
                <Label>Facebook URL</Label>
                <Input
                  value={formData.facebook || ''}
                  onChange={(e) => updateField('facebook', e.target.value)}
                  placeholder="https://facebook.com/joyfulcrotchets"
                />
              </div>
              <div>
                <Label>Pinterest URL</Label>
                <Input
                  value={formData.pinterest || ''}
                  onChange={(e) => updateField('pinterest', e.target.value)}
                  placeholder="https://pinterest.com/joyfulcrotchets"
                />
              </div>
              <div>
                <Label>TikTok URL</Label>
                <Input
                  value={formData.tiktok || ''}
                  onChange={(e) => updateField('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@joyfulcrotchets"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Meta Title</Label>
                <Input
                  value={formData.seoTitle || ''}
                  onChange={(e) => updateField('seoTitle', e.target.value)}
                  placeholder="Joyful Crotchets - Premium Handmade Crochet"
                />
              </div>
              <div>
                <Label>Default Meta Description</Label>
                <Textarea
                  value={formData.seoDescription || ''}
                  onChange={(e) => updateField('seoDescription', e.target.value)}
                  placeholder="Discover premium handmade crochet products..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Meta Keywords</Label>
                <Input
                  value={formData.seoKeywords || ''}
                  onChange={(e) => updateField('seoKeywords', e.target.value)}
                  placeholder="crochet, handmade, blanket, amigurumi"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          className="bg-gold hover:bg-gold-muted text-white shadow-lg h-12 px-6"
          onClick={handleSave}
          loading={updateMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  )
}
