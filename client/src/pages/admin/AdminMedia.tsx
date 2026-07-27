import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Grid3X3,
  List,
  Image as ImageIcon,
  FileImage,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/services/api'
import { formatDateShort } from '@/lib/utils'
import toast from 'react-hot-toast'

interface MediaItem {
  _id: string
  url: string
  publicId: string
  filename: string
  mimetype: string
  size: number
  createdAt: string
}

export default function AdminMedia() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const { data: media, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const { data } = await api.get('/media')
      return data.data as MediaItem[]
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] })
      toast.success('File uploaded successfully')
    },
    onError: () => toast.error('Upload failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (publicId: string) => {
      await api.delete('/upload/image', { data: { publicId } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] })
      toast.success('File deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete file'),
  })

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      uploadMutation.mutate(file)
    })
    e.target.value = ''
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    toast.success('URL copied to clipboard')
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const files = media || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">Media Library</h1>
          <p className="text-chocolate-500 text-sm mt-1">{files.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-chocolate-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-white text-chocolate-800' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 ${viewMode === 'list' ? 'bg-white text-chocolate-800' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button
            className="bg-gold hover:bg-gold-muted text-white"
            onClick={() => fileInputRef.current?.click()}
            loading={uploadMutation.isPending}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </motion.div>

      {/* Files */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileImage className="w-12 h-12 text-chocolate-300 mb-3" />
          <h3 className="text-lg font-semibold text-chocolate-800">No media files</h3>
          <p className="text-sm text-chocolate-500 mt-1">Upload your first image to get started.</p>
          <Button
            className="mt-4 bg-gold hover:bg-gold-muted text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {files.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={`group relative overflow-hidden cursor-pointer border-chocolate-100 hover:shadow-md transition-shadow ${
                    selectedItem?._id === item._id ? 'ring-2 ring-gold' : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-square bg-chocolate-50">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-white text-chocolate-800 hover:bg-white/90"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(item.url)
                        }}
                      >
                        {copiedUrl === item.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-white text-red-500 hover:bg-white/90"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(item._id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="border-chocolate-100">
          <CardContent className="p-0">
            <div className="divide-y divide-chocolate-100">
              {files.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 hover:bg-chocolate-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-chocolate-100 shrink-0">
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-chocolate-800 truncate">{item.filename}</p>
                    <p className="text-xs text-chocolate-500">
                      {formatFileSize(item.size)} • {formatDateShort(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(item.url)
                      }}
                    >
                      {copiedUrl === item.url ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(item._id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display truncate">{selectedItem?.filename}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-chocolate-50">
                <img src={selectedItem.url} alt={selectedItem.filename} className="w-full max-h-96 object-contain" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-chocolate-500">Size:</span>
                  <span className="ml-2 text-chocolate-800">{formatFileSize(selectedItem.size)}</span>
                </div>
                <div>
                  <span className="text-chocolate-500">Type:</span>
                  <span className="ml-2 text-chocolate-800">{selectedItem.mimetype}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-chocolate-500">URL:</span>
                  <span className="ml-2 text-chocolate-800 font-mono text-xs break-all">{selectedItem.url}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => copyToClipboard(selectedItem.url)}
                >
                  {copiedUrl === selectedItem.url ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy URL</>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteId(selectedItem._id)
                    setSelectedItem(null)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
