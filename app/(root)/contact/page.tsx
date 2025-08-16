import { Metadata } from 'next'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { IoMail, IoCall, IoLocation, IoTime, IoGlobe, IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5'

export const metadata: Metadata = {
  title: 'Contact Hulu House - Get in Touch with Our Team',
  description: 'Contact Hulu House for any inquiries about properties, real estate services, or general questions. Our team is here to help you find your dream home.',
}

const ContactPage = () => {
  const contactInfo = {
    phone: '+251 911 123 456',
    email: 'info@huluhouse.com',
    address: 'Bole, Addis Ababa, Ethiopia',
    workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    website: 'www.huluhouse.com'
  }

  const socialLinks = [
    { name: 'Facebook', icon: IoLogoFacebook, url: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: IoLogoTwitter, url: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: IoLogoInstagram, url: '#', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: IoLogoLinkedin, url: '#', color: 'hover:text-blue-700' }
  ]

  const departments = [
    {
      name: 'Sales Team',
      description: 'Get help with property purchases and sales',
      contact: '+251 911 123 457',
      email: 'sales@huluhouse.com'
    },
    {
      name: 'Rental Team',
      description: 'Find your perfect rental property',
      contact: '+251 911 123 458',
      email: 'rentals@huluhouse.com'
    },
    {
      name: 'Support Team',
      description: 'Technical support and general inquiries',
      contact: '+251 911 123 459',
      email: 'support@huluhouse.com'
    }
  ]

  const features = [
    {
      icon: IoCall,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for urgent inquiries'
    },
    {
      icon: IoMail,
      title: 'Quick Response',
      description: 'Get responses within 2 hours during business hours'
    },
    {
      icon: IoLocation,
      title: 'Local Expertise',
      description: 'Deep knowledge of Addis Ababa real estate market'
    },
    {
      icon: IoGlobe,
      title: 'Online Services',
      description: 'Complete your real estate journey online'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-blue-600 font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            We&apos;re Here to Help
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Get in Touch with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Hulu House
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about properties? Need help with your real estate journey? 
            Our expert team is ready to assist you every step of the way.
          </p>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IoCall className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600 mb-3">{contactInfo.phone}</p>
                <a href={`tel:${contactInfo.phone}`} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Call Now
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IoMail className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-3">{contactInfo.email}</p>
                <a href={`mailto:${contactInfo.email}`} className="text-green-600 hover:text-green-700 font-medium transition-colors">
                  Send Email
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IoLocation className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600 mb-3">{contactInfo.address}</p>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                  Get Directions
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IoTime className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Working Hours</h3>
                <p className="text-gray-600 mb-3">{contactInfo.workingHours}</p>
                <span className="text-orange-600 font-medium">Available Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Support?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide exceptional service and support to make your real estate journey smooth and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Our Teams
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get in touch with the right team for your specific needs and inquiries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-blue-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{dept.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{dept.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <IoCall className="text-blue-600" />
                      <a href={`tel:${dept.contact}`} className="text-gray-800 hover:text-blue-600 transition-colors font-medium">
                        {dept.contact}
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <IoMail className="text-blue-600" />
                      <a href={`mailto:${dept.email}`} className="text-gray-800 hover:text-blue-600 transition-colors font-medium">
                        {dept.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Website */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow us on social media and visit our website for the latest updates and property listings.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* Website */}
            <div className="group text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <IoGlobe className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Our Website</h3>
              <a 
                href={`https://${contactInfo.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                {contactInfo.website}
              </a>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100 ${social.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <social.icon className="text-2xl text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Real Estate Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Contact us today and let our expert team help you find your perfect home or investment property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl transform"
                >
                  Call Us Now
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="group inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl transform"
                >
                  Send Email
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

export default ContactPage