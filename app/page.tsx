"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VanaraLogo from "./components/VanaraLogo";

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen vanara-gradient flex items-center justify-center">
        <div className="vanara-loading w-32 h-32"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 vanara-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <VanaraLogo size="md" />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-[#2D5A3D] dark:text-gray-300 dark:hover:text-[#F4A261] transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-[#2D5A3D] dark:text-gray-300 dark:hover:text-[#F4A261] transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-[#2D5A3D] dark:text-gray-300 dark:hover:text-[#F4A261] transition-colors">Contact</a>
              <button
                onClick={signInWithGoogle}
                className="vanara-btn-primary px-6 py-2 rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#2D5A3D] hover:bg-gray-100 dark:text-gray-300 dark:hover:text-[#F4A261] dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2D5A3D] transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#2D5A3D] hover:bg-gray-50 dark:text-gray-300 dark:hover:text-[#F4A261] dark:hover:bg-gray-800 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#2D5A3D] hover:bg-gray-50 dark:text-gray-300 dark:hover:text-[#F4A261] dark:hover:bg-gray-800 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#2D5A3D] hover:bg-gray-50 dark:text-gray-300 dark:hover:text-[#F4A261] dark:hover:bg-gray-800 transition-colors"
                >
                  Contact
                </a>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full vanara-btn-primary px-6 py-3 rounded-lg font-medium text-center"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#F1F8E9] text-[#2D5A3D] dark:bg-[#2D5A3D]/20 dark:text-[#F4A261] mb-8">
            <span className="mr-2">🐒</span>
            Ancient Wisdom Meets Modern AI
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Evolve Your Career with
            <span className="vanara-text-gradient block mt-2"> Vanara Intelligence</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Like the legendary vanaras · intelligent, agile, and adaptive · transform your resume with AI that helps you navigate and conquer your career journey.
          </p>
          
          <p className="text-base md:text-lg text-[#2D5A3D] dark:text-[#F4A261] mb-8 font-medium">
            Adapt. Transform. Land Your Dream Job.
          </p>
          
          <div className="flex justify-center mb-12">
            <button
              onClick={signInWithGoogle}
              className="vanara-btn-primary inline-flex items-center px-6 md:px-8 py-3 md:py-4 font-semibold rounded-lg shadow-lg text-base md:text-lg"
            >
              Start Your Transformation
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-500 w-full max-w-xs sm:max-w-none mx-auto">
            <ul className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 p-0 m-0 list-none">
              <li className="flex items-center w-full sm:w-auto">
                <svg className="w-5 h-5 text-[#2D5A3D] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </li>
              <li className="flex items-center w-full sm:w-auto">
                <svg className="w-5 h-5 text-[#2D5A3D] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>2-minute setup</span>
              </li>
              <li className="flex items-center w-full sm:w-auto">
                <svg className="w-5 h-5 text-[#2D5A3D] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Instant transformation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F1F8E9]/30 dark:bg-[#2D5A3D]/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="vanara-text-gradient">Vanara Intelligence?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Harness the power of ancient wisdom and cutting-edge AI to transform your career journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="vanara-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2D5A3D] to-[#264653] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intelligent Adaptation</h3>
              <p className="text-gray-600 dark:text-gray-300">Like vanaras adapting to any challenge, our AI intelligently optimizes your resume for each unique opportunity.</p>
            </div>
            
            <div className="vanara-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F4A261] to-[#E76F51] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Lightning Agility</h3>
              <p className="text-gray-600 dark:text-gray-300">Swift as a vanara&apos;s leap, get your optimized resume in under 2 minutes with precision and speed.</p>
            </div>
            
            <div className="vanara-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#264653] to-[#2D5A3D] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Wise Transformation</h3>
              <p className="text-gray-600 dark:text-gray-300">Ancient wisdom meets modern technology to transform your career story into compelling narratives.</p>
            </div>
            
            <div className="vanara-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F4A261] to-[#2D5A3D] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Strategic Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-300">Get detailed ATS compatibility scores and strategic insights to outsmart the competition.</p>
            </div>
            
            <div className="vanara-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E76F51] to-[#264653] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Loyal Companion</h3>
              <p className="text-gray-600 dark:text-gray-300">Like a faithful vanara ally, we&apos;re with you throughout your entire career journey.</p>
            </div>
            
            <div className="vanara-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2D5A3D] to-[#F4A261] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Secure & Trusted</h3>
              <p className="text-gray-600 dark:text-gray-300">Your career data is protected with enterprise-grade security and complete privacy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, <span className="vanara-text-gradient">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start your transformation journey. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="vanara-card rounded-2xl p-8 border-2 border-[#F1F8E9] dark:border-[#2D5A3D]/30">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Explorer</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $0<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Perfect for discovering your potential</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5 resume transformations
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Intelligence score analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  2 professional templates
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Community support
                </li>
              </ul>
              <button
                onClick={signInWithGoogle}
                className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Start Free
              </button>
            </div>
            
            {/* Pro Plan */}
            <div className="vanara-gradient rounded-2xl p-8 border-2 border-[#2D5A3D] relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="vanara-gold-gradient text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Vanara Pro</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  $29.99<span className="text-lg text-[#F1F8E9]">/month</span>
                </div>
                <p className="text-[#F1F8E9]">For serious career transformers</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-[#F4A261] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited transformations
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-[#F4A261] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced intelligence analysis
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-[#F4A261] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All premium templates
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-[#F4A261] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Career journey tracking
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-[#F4A261] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority vanara support
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-white text-[#2D5A3D] font-semibold rounded-lg hover:bg-[#F1F8E9] transition-colors">
                Coming Soon
              </button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="vanara-card rounded-2xl p-8 border-2 border-[#F1F8E9] dark:border-[#2D5A3D]/30">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Custom
                </div>
                <p className="text-gray-600 dark:text-gray-300">For teams and organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Vanara Pro
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Team collaboration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2D5A3D] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated vanara guide
                </li>
              </ul>
              <a href="mailto:hello@vanara.ai?subject=Enterprise Plan Inquiry" className="block w-full py-3 px-4 border-2 border-[#2D5A3D] text-[#2D5A3D] dark:border-[#F4A261] dark:text-[#F4A261] font-semibold rounded-lg hover:bg-[#2D5A3D] hover:text-white dark:hover:bg-[#F4A261] dark:hover:text-[#2A2A2A] transition-colors text-center">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#F1F8E9]/30 dark:bg-[#2D5A3D]/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Connect with <span className="vanara-text-gradient">Vanara Wisdom</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Have questions? Our vanara guides are here to help you on your journey.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');
                const mailtoLink = `mailto:hello@vanara.ai?subject=Contact from ${name}&body=Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`;
                window.location.href = mailtoLink;
              }}
              className="vanara-card rounded-2xl shadow-xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2D5A3D] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2D5A3D] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2D5A3D] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
                />
              </div>
              <button
                type="submit"
                className="vanara-btn-primary w-full font-semibold py-3 px-6 rounded-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 vanara-gradient">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-[#F1F8E9] mb-8">
            Join thousands who&apos;ve already evolved their careers with Vanara intelligence.
          </p>
          <button
            onClick={signInWithGoogle}
            className="vanara-btn-secondary inline-flex items-center px-8 py-4 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Begin Your Evolution
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <VanaraLogo size="lg" className="mb-4" />
              <p className="text-gray-400 mb-4 max-w-md">
                Transform your career with the wisdom of vanaras and the power of AI. Navigate your journey with intelligence, agility, and purpose.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-[#F4A261]">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-[#F4A261]">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:hello@vanara.ai" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="mailto:hello@vanara.ai" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="mailto:hello@vanara.ai" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Vanara.ai. All rights reserved. Evolve with wisdom.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}