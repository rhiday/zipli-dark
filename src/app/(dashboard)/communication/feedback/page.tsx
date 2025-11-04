import { ContactSection } from "@/app/landing/components/contact-section"
import { TestimonialsSection } from "@/app/landing/components/testimonials-section"

export default function FeedbackPage() {
  return (
    <div className="px-6">
      <h1 className="text-2xl font-semibold">Feedback</h1>

      {/* User Reviews and Testimonials */}
      <div className="mt-6">
        <TestimonialsSection />
      </div>

      {/* Contact Form */}
      <div className="mt-12">
        <ContactSection />
      </div>
    </div>
  )
}


