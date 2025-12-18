import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Transparent property - Your Trusted Real Estate Partner',
  description: 'Learn about Transparent property, our mission to revolutionize real estate, and the dedicated team behind our success in connecting people with their dream homes.',
}

const AboutPage = () => {
  const stats = [
    { number: '250+', label: 'Properties Sold', icon: '🏠' },
    { number: '500+', label: 'Happy Clients', icon: '😊' },
    { number: '25+', label: 'Cities Covered', icon: '🌍' },
  ]

  const services = [
    {
      icon: '🔍',
      title: 'Smart Property Search',
      description: 'AI-powered matching to find your perfect home based on preferences, budget, and lifestyle.'
    },
    {
      icon: '📱',
      title: 'Virtual Tours',
      description: 'Explore properties from anywhere with immersive 3D tours and high-quality photos.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden fees. Get real-time market data and fair pricing for every property.'
    },
    {
      icon: '🤝',
      title: 'Expert Support',
      description: 'Dedicated agents and 24/7 customer support throughout your real estate journey.'
    }
  ]

  const whyChooseUs = [
    {
      icon: '🚀',
      title: 'Innovation First',
      description: 'Cutting-edge technology that makes real estate simple and enjoyable.'
    },
    {
      icon: '🏆',
      title: 'Proven Track Record',
      description: 'Over 5 years of excellence with thousands of satisfied customers.'
    },
    {
      icon: '🔒',
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with bank-level security.'
    },
    {
      icon: '🌱',
      title: 'Community Focus',
      description: 'Building sustainable communities and lasting relationships.'
    }
  ]

  const team = [
  {
    name: 'Yosef Asmare & Yonas Damte',
    role: 'Lead Software Engineers',
    experience: '2+ years',
    bio: 'Skilled software engineers who have built diverse projects including study platforms and other web applications.'
  },
  {
    name: 'Yeabebal',
    role: 'Realtor',
    experience: '1+ years',
    bio: 'Dedicated real estate professional with hands-on experience helping clients buy, sell, and rent properties.'
  },
  {
    name: 'Dani',
    role: 'Manager',
    experience: '—',
    bio: 'Oversees team operations and ensures smooth project management across all initiatives.'
  }
]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-accent-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-accent-600 font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-accent-600 rounded-full animate-pulse"></span>
            Since 2018 • Trusted by 5,000+ Clients
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-8 leading-tight">
            We&apos;re Building the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-800 to-primary-700">
              Real Estate
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Combining cutting-edge technology with personalized service to make your home buying and selling journey 
            <span className="font-semibold text-neutral-800"> seamless, transparent, and enjoyable.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-800 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-primary-900 hover:to-primary-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Explore Properties
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <a 
              href="/contact" 
              className="group inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm text-neutral-800 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-neutral-200"
            >
              Get in Touch
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-200 to-accent-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 group-hover:text-accent-600 transition-colors duration-300">{stat.number}</div>
                  <div className="text-neutral-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              What We Do
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We&apos;re not just another real estate platform. W&apos;re your trusted partner in finding the perfect home.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-neutral-100">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-accent-600 transition-colors duration-300">{service.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose Transparent property?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We combine innovation, trust, and excellence to deliver an unmatched real estate experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-white to-primary-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-primary-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{reason.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-accent-600 transition-colors duration-300">{reason.title}</h3>
                    <p className="text-neutral-600 leading-relaxed text-lg">{reason.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              The passionate team behind Transparent property&apos;s success story.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="group text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-neutral-100">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-accent-50 to-primary-50 rounded-full flex items-center justify-center text-5xl text-accent-600 group-hover:from-accent-100 group-hover:to-primary-100 transition-all duration-300 group-hover:scale-110">
                    👤
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-accent-600 transition-colors duration-300">{member.name}</h3>
                  <p className="text-accent-600 font-semibold text-lg mb-2">{member.role}</p>
                  <p className="text-neutral-500 mb-4">{member.experience} experience</p>
                  <p className="text-neutral-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-primary-800 to-primary-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Find Your Dream Home?
              </h2>
                <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto">
                Join thousands of satisfied customers who have found their perfect home with Transparent property. 
                Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/properties" 
                  className="group inline-flex items-center gap-3 bg-white text-primary-800 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-neutral-100 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl transform"
                >
                  Browse Properties
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
                <a 
                  href="/contact" 
                  className="group inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-primary-800 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl transform"
                >
                  Contact Us
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage