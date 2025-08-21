import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  Users, 
  Calendar, 
  MapPin, 
  Gift,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const LandingPage: React.FC = () => {
  // Add this useEffect for carousel functionality
  useEffect(() => {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    let currentSlide = 0;
    
    const showSlide = (index: number) => {
      // Hide all slides
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));
      
      // Show current slide
      slides[index]?.classList.add('active');
      indicators[index]?.classList.add('active');
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    // Auto-advance carousel every 5 seconds
    const interval = setInterval(nextSlide, 5000);

    // Add click listeners to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });

    // Cleanup
    return () => {
      clearInterval(interval);
      indicators.forEach(indicator => {
        indicator.removeEventListener('click', () => {});
      });
    };
  }, []);

  const features = [
    {
      icon: MapPin,
      title: 'Find Perfect Venues',
      description: 'Discover stunning wedding venues that match your vision and budget.',
    },
    {
      icon: Users,
      title: 'Connect with Vendors',
      description: 'Browse verified wedding professionals from photographers to caterers.',
    },
    {
      icon: Calendar,
      title: 'Plan Your Timeline',
      description: 'Stay organized with our comprehensive wedding planning tools.',
    },
    {
      icon: Gift,
      title: 'Create Your Registry',
      description: 'Build and share your wedding registry with friends and family.',
    },
  ];

  const testimonials = [
    {
      name: 'Sharon & Kelvin',
      location: 'Nairobi, Kenya',
      text: 'Aurora Nuptials made planning our dream wedding effortless. The platform connected us with amazing vendors!',
      rating: 5,
    },
    {
      name: 'Aurora & Allan',
      location: 'Kisumu, Kenya',
      text: 'From venue selection to vendor coordination, everything was seamless. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Jessica & David',
      location: 'Kakamega, Kenya',
      text: 'The registry feature was a hit with our guests. Planning has never been this organized!',
      rating: 5,
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Couples' },
    { number: '5,000+', label: 'Trusted Vendors' },
    { number: '1,000+', label: 'Beautiful Venues' },
    { number: '50+', label: 'Cities Covered' },
  ];

  const planningSteps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Tell us about your dream wedding and preferences.',
    },
    {
      step: '02',
      title: 'Discover & Connect',
      description: 'Browse venues and vendors that match your style.',
    },
    {
      step: '03',
      title: 'Plan & Organize',
      description: 'Use our tools to manage bookings and timeline.',
    },
    {
      step: '04',
      title: 'Celebrate Your Day',
      description: 'Enjoy your perfect wedding with confidence.',
    },
  ];

  return (
    <div className="min-h-screen">
{/* Hero Section with Carousel Background */}
<section className="relative min-h-screen flex items-center py-20 lg:py-32 overflow-hidden">
  {/* Background Carousel */}
  <div className="absolute inset-0 z-0">
    <div className="carousel-container relative w-full h-full">
      {/* Carousel slides will cycle through these images */}
      </div>
      <div className="carousel-slide">
        <img 
          src="https://images.unsplash.com/photo-1664646449735-69bc987a49da?w=2070&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmxhY2slMjB3ZWRkaW5nfGVufDB8fDB8fHww" 
          alt="Bride and groom"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="carousel-slide">
        <img 
          src="https://images.unsplash.com/photo-1561345822-1d5a8ccea1ff?w=2070&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsYWNrJTIwd2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D" 
          alt="Wedding vows exchange"
          className="w-full h-full object-cover object-center"
        />
          </div>
          <div className="carousel-slide active">
        <img 
          src="https://images.unsplash.com/photo-1664646449779-ee70428b3936?w=2070&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmxhY2slMjB3ZWRkaW5nfGVufDB8fDB8fHww" 
          alt="Beautiful wedding ceremony"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="carousel-slide">
        <img 
          src="https://plus.unsplash.com/premium_photo-1674484905263-5a95892ee187?w=2070&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGJsYWNrJTIwd2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D" 
          alt="Wedding reception"
          className="w-full h-full object-cover object-center"
        />
    </div>
    {/* Dark overlay for better text readability */}
    <div className="absolute inset-0 bg-black/40 z-10"></div>
  </div>

  {/* Content */}
  <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <Sparkles className="w-12 h-12 text-rose-gold animate-pulse-soft drop-shadow-lg" />
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
        Your Dream Wedding
        <span className="block text-rose-gold">Awaits</span>
      </h1>
      <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
        Plan your perfect wedding with Aurora Nuptials. Connect with trusted vendors, 
        discover stunning venues, and create memories that last a lifetime.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="btn-primary text-lg px-8 py-4 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start Planning Today
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link
          to="/venues"
          className="btn-secondary text-lg px-8 py-4 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Browse Venues
          <MapPin className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  </div>

  {/* Carousel indicators */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
    <button className="carousel-indicator active w-3 h-3 rounded-full bg-white/70 hover:bg-white transition-colors" data-slide="0"></button>
    <button className="carousel-indicator w-3 h-3 rounded-full bg-white/30 hover:bg-white/70 transition-colors" data-slide="1"></button>
    <button className="carousel-indicator w-3 h-3 rounded-full bg-white/30 hover:bg-white/70 transition-colors" data-slide="2"></button>
    <button className="carousel-indicator w-3 h-3 rounded-full bg-white/30 hover:bg-white/70 transition-colors" data-slide="3"></button>
  </div>
</section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-rose-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Everything You Need for Your Perfect Wedding
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and connections you need 
              to plan your dream wedding effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-rose-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-rose-gold" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Planning your wedding has never been easier. Follow these simple steps 
              to create your perfect day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {planningSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-rose-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              What Couples Say About Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy couples who planned their perfect wedding with Aurora Nuptials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-rose-gold/20 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-6 h-6 text-rose-gold" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-rose-gold text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Plan Your Dream Wedding?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join Aurora Nuptials today and start planning the wedding you've always dreamed of. 
            It's free to get started!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-rose-gold hover:bg-gray-50 font-medium py-4 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center"
            >
              Get Started Free
              <CheckCircle className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-rose-gold font-medium py-4 px-8 rounded-lg transition-all duration-200 inline-flex items-center justify-center"
            >
              Sign In
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;