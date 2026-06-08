'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with an email service or backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Western Region coordinates (Takoradi)
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15891.69347300752!2d-1.7768484!3d4.899357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfda4c1b7d9e45f7%3A0x2f5b2b4b3c4d5e6f!2sTakoradi!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh";

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column - Contact Info & Map */}
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Our Location</h3>
                  <p className="text-gray-600">Takoradi, Western Region, Ghana</p>
                  <p className="text-gray-600">Market Circle, Opposite Ghana Commercial Bank</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Phone Number</h3>
                  <p className="text-gray-600">+233 31 202 1234</p>
                  <p className="text-gray-600">+233 24 456 7890</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Email Address</h3>
                  <p className="text-gray-600">info@wilderscorner.com</p>
                  <p className="text-gray-600">support@wilderscorner.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Map */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Our Location</h2>
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.961467876595!2d-1.766848!3d4.899357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfda4c1b7d9e45f7%3A0x2f5b2b4b3c4d5e6f!2sTakoradi!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wilder's Corner Location - Takoradi, Western Region"
              ></iframe>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              📍 Located in Takoradi, Western Region – Serving all of Ghana
            </p>
          </div>
        </div>
        
        {/* Right Column - Contact Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What is this regarding?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help you..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-2.5">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
          
          {submitted && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              Thank you! We'll get back to you soon.
            </div>
          )}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-12 text-center border-t pt-8">
        <h3 className="font-semibold mb-3">Connect With Us</h3>
        <div className="flex justify-center gap-6">
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition">
            Facebook
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition">
            Instagram
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition">
            Twitter
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
