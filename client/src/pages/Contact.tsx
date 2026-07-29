import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: MessageCircle,
    title: "Whatsapp Us",
    details: ["+2348161342110"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+2347048419200", "Mon-Fri 9am-6pm WAT"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["asogwachetachukwu@gmail.com", "joyfulcrotchets@gmail.com"],
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    const message = `*New Contact Message*

*Name:* ${data.name}
*Email:* ${data.email}
${data.phone ? `*Phone:* ${data.phone}\n` : ''}*Subject:* ${data.subject}

*Message:*
${data.message}`

    const whatsappUrl = `https://wa.me/2348161342110?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    toast.success("Message sent! Redirecting to WhatsApp.");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-chocolate via-mocha to-chocolate">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mt-4">
              Contact Us
            </h1>
            <p className="text-cream/70 mt-4 max-w-xl mx-auto">
              Have a question, suggestion, or just want to say hello? We'd love
              to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Contact Form */}
            <motion.div {...fadeInUp}>
              <Card className="border-sand/30">
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-semibold text-chocolate mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="John Doe"
                        {...register("name")}
                        error={errors.name?.message}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        error={errors.email?.message}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Phone (Optional)"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register("phone")}
                      />
                      <div className="w-full">
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          Subject
                        </label>
                        <Select
                          onValueChange={(value) => setValue("subject", value)}
                        >
                          <SelectTrigger
                            className={
                              errors.subject ? "border-destructive" : ""
                            }
                          >
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">
                              General Inquiry
                            </SelectItem>
                            <SelectItem value="order">Order Support</SelectItem>
                            <SelectItem value="custom">
                              Custom Order Request
                            </SelectItem>
                            <SelectItem value="wholesale">
                              Wholesale Inquiry
                            </SelectItem>
                            <SelectItem value="press">Press & Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.subject && (
                          <p className="mt-1.5 text-sm text-destructive">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Textarea
                      label="Your Message"
                      placeholder="How can we help you?"
                      rows={6}
                      {...register("message")}
                      error={errors.message?.message}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-gold text-white hover:bg-gold/90 px-8"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="border-sand/30 bg-gradient-to-br from-chocolate to-mocha text-cream">
                <CardContent className="p-8">
                  <h3 className="font-display text-xl font-semibold mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((info) => (
                      <div key={info.title} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <h4 className="font-medium text-cream mb-1">
                            {info.title}
                          </h4>
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-sm text-cream/70">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-cream/20">
                    <p className="text-sm text-cream/70 mb-4">Follow Us</p>
                    <div className="flex gap-3">
                      {[Facebook, Instagram, Twitter].map((Icon, i) => (
                        <a
                          key={i}
                          href="#"
                          className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors"
                        >
                          <Icon className="h-5 w-5 text-cream" />
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-3xl font-bold text-chocolate mb-4">
              Common Questions
            </h2>
            <p className="text-mocha mb-8">
              Find quick answers to frequently asked questions
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                "Shipping Information",
                "Return Policy",
                "Custom Orders",
                "Care Instructions",
                "Wholesale Inquiries",
              ].map((topic) => (
                <a
                  key={topic}
                  href="/faqs"
                  className="p-4 rounded-xl border border-sand/30 bg-white hover:border-gold hover:shadow-md transition-all text-left group"
                >
                  <span className="font-medium text-chocolate group-hover:text-gold transition-colors">
                    {topic}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
