"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

type Testimonial = {
  name: string
  role: string
  image: string
  quote: string
  rating: number
  foodImage?: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Mika Virtanen',
    role: 'Kitchen Manager, Ravintola Savoy',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-1',
    quote:
      'Instead of throwing away perfectly good food, we now connect with Helsinki Food Bank instantly. We\'ve donated over 1,700 kg this month alone and it feels amazing to give back.',
    rating: 5,
    foodImage: '/logos/test/download.jpeg',
  },
  {
    name: 'Sanna Korhonen',
    role: 'Store Manager, S-Market Hakaniemi',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-1',
    quote: 'This platform has revolutionized how we handle surplus food. We\'ve reduced waste by 85% and built strong partnerships with local charities. Our customers love that we\'re making a difference.',
    rating: 5,
    foodImage: '/logos/test/images.jpeg',
  },
  {
    name: 'Jari Nieminen',
    role: 'Head Chef, Hotel Kämp Kitchen',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-2',
    quote:
      'The real-time matching with food banks is brilliant. End-of-day surplus goes straight to organizations that need it. We\'ve completed over 1,400 donations in just 30 days.',
    rating: 5,
  },
  {
    name: 'Leena Mäkinen',
    role: 'Operations Manager, Fazer Café',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-2',
    quote:
      'Our bakery products used to go to waste every evening. Now we donate to Pelastusarmeija and other organizations. The tracking system shows we\'ve saved over 960 kg this month.',
    rating: 5,
    foodImage: '/logos/test/images (1).jpeg',
  },
  {
    name: 'Antti Laine',
    role: 'Regional Manager, K-Supermarket Kamppi',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-3',
    quote:
      'Managing food donations across multiple locations is seamless. The automated notifications ensure nothing goes to waste, and the impact reports show we\'re feeding hundreds of families weekly.',
    rating: 5,
  },
  {
    name: 'Hanna Järvinen',
    role: 'Owner, Café Aalto',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-3',
    quote: 'As a small café owner, I love how easy it is to donate leftover pastries and sandwiches. The platform connects me with local shelters in minutes. Zero waste feels incredible.',
    rating: 5,
    foodImage: '/logos/test/Unknown-3.webp',
  },
  {
    name: 'Pekka Salminen',
    role: 'Food Rescue Coordinator, Helsinki Missio',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-4',
    quote:
      'From the charity side, this system is a lifesaver. We receive quality food donations daily from trusted partners like S-Market and Hotel Kämp. It helps us serve 200+ people every day.',
    rating: 5,
    foodImage: '/logos/test/red_cross.webp',
  },
  {
    name: 'Riikka Heikkinen',
    role: 'Sustainability Manager, Sodexo Finland',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-4',
    quote: 'The impact on our sustainability goals has been remarkable. Detailed analytics help us optimize donations and the recognition system motivates our kitchen teams across all locations.',
    rating: 5,
    foodImage: '/logos/test/sodexo.jpg',
  },
  {
    name: 'Oskari Laaksonen',
    role: 'Executive Chef, Restaurant Olo',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-5',
    quote:
      'Fine dining creates surplus too. This platform lets us donate high-quality ingredients to culinary schools and food programs. Watching our waste metrics drop to near-zero is satisfying.',
    rating: 5,
  },
  {
    name: 'Johanna Rantanen',
    role: 'Pastry Chef, Ekberg Bakery',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-5',
    quote: 'Every evening, our unsold bread and pastries find a new home through this system. The pickup coordination is smooth and we\'ve donated to 15 different organizations this month.',
    rating: 5,
    foodImage: '/logos/test/download.jpeg',
  },
  {
    name: 'Ville Koskinen',
    role: 'Franchise Owner, Hesburger Kamppi',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-6',
    quote:
      'Fast food generates waste, but not anymore. We schedule daily pickups with youth programs and shelters. The app makes it effortless and our team loves being part of the solution.',
    rating: 5,
    foodImage: '/logos/test/images.jpeg',
  },
  {
    name: 'Maija Toivonen',
    role: 'Director, Hyvä Jää Hyötykäyttöön',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-6',
    quote: 'This platform connects us with dozens of food donors across Helsinki. The real-time updates and reliable logistics mean fresh food reaches those in need within hours, not days.',
    rating: 5,
    foodImage: '/logos/test/images (1).jpeg',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-20">
      <div className="container mx-auto px-8 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Fighting Food Waste Together
          </h2>
          <p className="text-lg text-muted-foreground">
            Join hundreds of restaurants, supermarkets, and food banks across Helsinki who are rescuing surplus food and feeding those in need.
          </p>
        </div>

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="mb-6 break-inside-avoid shadow-none lg:mb-4">
              <CardContent>
                <div className="relative">
                  <div className="flex items-start gap-4 pr-12">
                    <Avatar className="bg-muted size-12 shrink-0">
                      <AvatarImage
                        alt={testimonial.name}
                        src={testimonial.image}
                        loading="lazy"
                        width="120"
                        height="120"
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <a href="#" onClick={e => e.preventDefault()} className="cursor-pointer">
                        <h3 className="font-medium hover:text-primary transition-colors">{testimonial.name}</h3>
                      </a>
                      <span className="text-muted-foreground block text-sm tracking-wide">
                        {testimonial.role}
                      </span>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {testimonial.foodImage && (
                    <div className="absolute right-0 top-0 hidden h-10 w-10 overflow-hidden rounded-md border border-border bg-background/80 shadow-sm sm:block">
                      {/* Decorative food image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={testimonial.foodImage}
                        alt="Food donation"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <blockquote className="mt-4">
                    <p className="text-sm leading-relaxed text-balance">{testimonial.quote}</p>
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
