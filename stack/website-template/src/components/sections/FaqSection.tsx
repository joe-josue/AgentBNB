'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { fadeUp, viewportOnce } from '@/lib/animations'

const faqs = [
  {
    q: 'Is there air conditioning?',
    a: 'Your Property is a hilltop breeze home — we don\'t use air conditioning. Because of the elevation and open layout, the property stays cooler than lower areas in Your City, especially late afternoon to evening. Most guests appreciate the natural airflow and relaxed feel of the space.',
  },
  {
    q: 'Is the pool heated?',
    a: 'Our pool is private and natural temperature. We don\'t have pool heating yet. It\'s ideal for a refreshing dip, especially during warmer hours, and is surrounded by greenery for a relaxed retreat vibe.',
  },
  {
    q: 'What is the road like getting there?',
    a: 'Your Property is at the highest point of the subdivision, so the road has steep sections. We recommend confident drivers. If using a smaller vehicle, go steady and avoid rushing the ascent. Guests usually say the cooler hilltop setting is worth it once they arrive.',
  },
  {
    q: 'Is WiFi available?',
    a: 'WiFi is not yet available while internet setup is in progress. We recommend bringing mobile data for your stay. We\'ll update our listings as soon as connectivity is live.',
  },
  {
    q: 'How many guests can stay overnight?',
    a: 'The property sleeps up to 10 guests with our modular single-bed system. Beds can be stacked or arranged to fit your group\'s needs while keeping common areas open and comfortable.',
  },
  {
    q: 'How many guests for a day trip?',
    a: 'Day trips include up to 10 guests in the base rate. Additional guests are welcome at ₱500 per head. Send us your headcount for a custom quote.',
  },
  {
    q: 'What\'s included with the booking?',
    a: 'We provide up to 10 bath towels and 10 pool towels. The kitchen comes fully equipped with a 2-burner gas stove, rangehood, refrigerator with freezer, cooking pots and pans, utensils, plates, and serving platters. An outdoor grill (ihawan) is also available for guest use. A 10-seater dining table and a balcony with pool view are part of the space. Our caretakers are on-site and available for support and procurement requests.',
  },
  {
    q: 'Can we cook our own meals?',
    a: 'Absolutely. The kitchen has everything you need: a 2-burner gas stove, rangehood, refrigerator with freezer, cookware, utensils, plates, and serving platters. We also have an outdoor grill (ihawan) for grilled meals. You\'re welcome to cook. We can also pre-stock ice and drinking water before your check-in upon request.',
  },
  {
    q: 'Do you have an outdoor grill (ihawan)?',
    a: 'Yes. Your Property now has an outdoor grill that guests can use for barbecue and grilled meals.',
  },
  {
    q: 'Is the jacuzzi working?',
    a: 'The pool area has a jacuzzi pool, but the jet/jacuzzi function is currently under repair. The main pool is fully usable. We\'ll update this when repairs are complete.',
  },
  {
    q: 'What does your property name mean?',
    a: 'Replace this with your own origin story. Keep it short, personal, and connected to the kind of stay you want guests to expect.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="section-pad bg-muted">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-3">
            FAQ
          </p>
          <h2 className="font-serif text-display-lg text-ink text-balance">
            Good to Know Before You Come.
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-white border border-border rounded-xl px-6 shadow-sm"
              >
                <AccordionTrigger className="font-serif text-base text-ink hover:no-underline py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm leading-relaxed text-muted-foreground pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
