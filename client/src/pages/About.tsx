import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Leaf,
  Users,
  Scissors,
  Palette,
  HandMetal,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Scissors,
    title: "Craftsmanship",
    description:
      "Every piece is meticulously handcrafted by skilled artisans, ensuring unparalleled quality and attention to detail in every stitch.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We source eco-friendly yarns and use minimal packaging, because beautiful creations should never come at the cost of our planet.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We support local artisans and give back to our community, because joyful creations are even more meaningful when shared.",
  },
];

const processSteps = [
  {
    icon: Palette,
    step: "01",
    title: "Material Selection",
    description:
      "We source only the finest yarns from trusted suppliers, carefully selecting each fiber for its quality, softness, and durability.",
  },
  {
    icon: Scissors,
    step: "02",
    title: "Design & Planning",
    description:
      "Every piece begins with careful design, where our creative team sketches patterns and plans each detail to perfection.",
  },
  {
    icon: HandMetal,
    step: "03",
    title: "Handcrafting",
    description:
      "Skilled artisans bring each design to life using time-honored crochet techniques passed down through generations.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Quality Assurance",
    description:
      "Rigorous quality checks ensure every product meets our premium standards before it reaches your hands.",
  },
];

const team = [
  {
    name: "Cheta Joy",
    role: "Founder & Creative Director",
    bio: "With over 15 years of crochet experience, Joy founded Joyful Crotchets to share her passion for handcrafted luxury.",
  },
  {
    name: "Boon Kelly",
    role: "Head of Design",
    bio: "Boon brings a modern aesthetic to traditional crochet, creating contemporary pieces that honor the craft's rich heritage.",
  },
  {
    name: "Cee Limbah",
    role: "Production Manager",
    bio: "Cee ensures every piece meets our quality standards while supporting our team of talented artisans.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

export default function About() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-chocolate via-mocha to-chocolate overflow-hidden">
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
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">
              Our Story
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-cream mt-4 mb-6">
              Crafting Joy, One Stitch at a Time
            </h1>
            <p className="text-cream/80 text-lg leading-relaxed">
              Born from a passion for timeless craftsmanship, Joyful Crotchets
              creates premium handmade crochet pieces that bring warmth and
              elegance to everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">
              What We Stand For
            </span>
            <h2 className="font-display text-4xl font-bold text-chocolate mt-4">
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full border-sand/30 bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-gold" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-chocolate mb-4">
                      {value.title}
                    </h3>
                    <p className="text-mocha leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 bg-cream/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-beige via-caramel/30 to-sand/30 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <Heart className="h-24 w-24 text-gold/30 mx-auto mb-4" />
                  <p className="text-mocha/50 font-display text-xl">
                    Founder Portrait
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">
                Meet the Founder
              </span>
              <h2 className="font-display text-4xl font-bold text-chocolate">
                A Passion Woven Into Every Creation
              </h2>
              <div className="space-y-4 text-mocha leading-relaxed">
                <p>
                  What started as a childhood hobby learned from her
                  grandmother's hands has blossomed into a mission to preserve
                  the art of handcrafted crochet while creating pieces of
                  exceptional beauty.
                </p>
                <p>
                  "I believe that every handmade piece carries a piece of the
                  maker's heart. When you hold one of our creations, you're not
                  just holding a product — you're holding hours of dedication,
                  skill, and love."
                </p>
                <p className="font-display text-lg text-chocolate italic">
                  — Cee Limbah, Founder
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">
              How It's Made
            </span>
            <h2 className="font-display text-4xl font-bold text-chocolate mt-4">
              Our Process
            </h2>
            <p className="text-mocha mt-4 max-w-2xl mx-auto">
              From selecting the finest materials to the final quality check,
              every step is guided by our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 relative">
                    <step.icon className="h-8 w-8 text-gold" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold text-white text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-chocolate mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-mocha leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gold/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-cream/50">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">
              The People Behind the Craft
            </span>
            <h2 className="font-display text-4xl font-bold text-chocolate mt-4">
              Our Team
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-caramel/20 flex items-center justify-center mx-auto mb-6">
                  <span className="font-display text-3xl text-gold font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-chocolate">
                  {member.name}
                </h3>
                <p className="text-gold text-sm font-medium mt-1">
                  {member.role}
                </p>
                <p className="text-mocha text-sm mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values Banner */}
      <section className="py-16 bg-gradient-to-r from-gold to-gold-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5000+", label: "Products Crafted" },
              { number: "2000+", label: "Happy Customers" },
              { number: "50+", label: "Artisans" },
              { number: "100%", label: "Handmade" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-display text-4xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-bold text-chocolate mb-6">
              Experience the Difference
            </h2>
            <p className="text-mocha mb-8 leading-relaxed">
              Discover our collection of handcrafted premium crochet pieces,
              each made with love and dedication to the art of traditional
              craftsmanship.
            </p>
            <Link to="/shop">
              <Button
                size="lg"
                className="bg-gold text-white hover:bg-gold/90 px-8 h-14 text-lg"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
