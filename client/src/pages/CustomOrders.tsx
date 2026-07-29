import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Palette, Scissors, HandMetal, CheckCircle, Upload, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const customOrderSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  projectType: z.string().min(1, 'Please select a project type'),
  description: z.string().min(20, 'Please provide more details (at least 20 characters)'),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  preferredDate: z.string().optional(),
  colors: z.string().optional(),
  dimensions: z.string().optional(),
  materials: z.string().optional(),
  additionalNotes: z.string().optional(),
})

type CustomOrderFormData = z.infer<typeof customOrderSchema>

const processSteps = [
  {
    icon: Palette,
    step: '01',
    title: 'Share Your Vision',
    description: 'Tell us about your dream project - colors, size, style, and any special requirements.',
  },
  {
    icon: Scissors,
    step: '02',
    title: 'Get a Quote',
    description: 'We\'ll review your request and provide a detailed quote within 48 hours.',
  },
  {
    icon: HandMetal,
    step: '03',
    title: 'Crafting Begins',
    description: 'Once approved, our artisans will start bringing your vision to life.',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Delivery',
    description: 'Receive your custom piece, handcrafted with love just for you.',
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function CustomOrders() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomOrderFormData>({
    resolver: zodResolver(customOrderSchema),
  })

  const onSubmit = async (data: CustomOrderFormData) => {
    const budget = data.budgetMin && data.budgetMax
      ? `Budget: ₦${data.budgetMin} - ₦${data.budgetMax}`
      : data.budgetMin
        ? `Budget: ₦${data.budgetMin}`
        : ''

    const message = `*New Custom Order Request*

*Name:* ${data.name}
*Email:* ${data.email}
*Phone:* ${data.phone}

*Project Type:* ${data.projectType}
*Description:*
${data.description}

${budget ? `${budget}\n` : ''}${data.preferredDate ? `*Preferred Date:* ${data.preferredDate}\n` : ''}${data.colors ? `*Colors:* ${data.colors}\n` : ''}${data.dimensions ? `*Dimensions:* ${data.dimensions}\n` : ''}${data.materials ? `*Materials:* ${data.materials}\n` : ''}${data.additionalNotes ? `*Additional Notes:*\n${data.additionalNotes}` : ''}`

    const whatsappUrl = `https://wa.me/2348161342110?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    toast.success('Custom order request submitted! Redirecting to WhatsApp.')
    setIsSubmitted(true)
    reset()
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-chocolate via-mocha to-chocolate relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-caramel rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">Bespoke Creations</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mt-4 mb-6">
              Bring Your Vision to Life
            </h1>
            <p className="text-cream/80 text-lg leading-relaxed">
              Have a special project in mind? Our artisans can create custom pieces tailored 
              exactly to your specifications. From unique color combinations to custom sizes, 
              we bring your crochet dreams to reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-chocolate">How It Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="h-7 w-7 text-gold" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-chocolate mb-2">{step.title}</h3>
                <p className="text-sm text-mocha leading-relaxed">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gold/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order Form */}
      <section className="py-16 bg-cream/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div {...fadeInUp}>
            {isSubmitted ? (
              <Card className="border-sand/30">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-chocolate mb-4">
                    Request Submitted!
                  </h2>
                  <p className="text-mocha mb-8 max-w-md mx-auto">
                    Thank you for your custom order request. Our team will review your details 
                    and get back to you within 48 hours with a quote.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-gold text-white hover:bg-gold/90"
                  >
                    Submit Another Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-sand/30">
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-bold text-chocolate mb-2">Custom Order Request</h2>
                  <p className="text-mocha mb-8">Fill out the form below and we'll get back to you with a quote.</p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="John Doe"
                        {...register('name')}
                        error={errors.name?.message}
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                    </div>

                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...register('phone')}
                      error={errors.phone?.message}
                    />

                    {/* Project Details */}
                    <div className="w-full">
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Project Type</label>
                      <Select onValueChange={(value) => setValue('projectType', value)}>
                        <SelectTrigger className={errors.projectType ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bag">Bag</SelectItem>
                          <SelectItem value="hat">Hat</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="blanket">Blanket</SelectItem>
                          <SelectItem value="home_decor">Home Décor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.projectType && (
                        <p className="mt-1.5 text-sm text-destructive">{errors.projectType.message}</p>
                      )}
                    </div>

                    <Textarea
                      label="Project Description"
                      placeholder="Describe your vision in detail - style, size, colors, pattern preferences, etc."
                      rows={5}
                      {...register('description')}
                      error={errors.description?.message}
                    />

                    {/* Budget & Timeline */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Budget Min ($)"
                          type="number"
                          placeholder="50"
                          {...register('budgetMin')}
                        />
                        <Input
                          label="Budget Max ($)"
                          type="number"
                          placeholder="200"
                          {...register('budgetMax')}
                        />
                      </div>
                      <Input
                        label="Preferred Date"
                        type="date"
                        {...register('preferredDate')}
                      />
                    </div>

                    {/* Preferences */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Preferred Colors"
                        placeholder="e.g., Ivory, Gold, Sage"
                        {...register('colors')}
                      />
                      <Input
                        label="Dimensions"
                        placeholder="e.g., 12x12 inches"
                        {...register('dimensions')}
                      />
                    </div>

                    <Input
                      label="Materials Preference"
                      placeholder="e.g., Cotton, Wool blend"
                      {...register('materials')}
                    />

                    {/* File Upload Area */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Reference Images</label>
                      <div className="border-2 border-dashed border-sand/50 rounded-xl p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-mocha/40 mx-auto mb-3" />
                        <p className="text-sm text-mocha">
                          Drag & drop images here or <span className="text-gold font-medium">browse</span>
                        </p>
                        <p className="text-xs text-mocha/60 mt-1">PNG, JPG up to 5MB each</p>
                      </div>
                    </div>

                    <Textarea
                      label="Additional Notes"
                      placeholder="Any other details we should know..."
                      rows={3}
                      {...register('additionalNotes')}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gold text-white hover:bg-gold/90 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          Submit Request
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
