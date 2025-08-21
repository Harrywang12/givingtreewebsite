'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageBanner from '@/components/PageBanner';
import { Heart, Calendar, MapPin, Phone, Mail, Send } from 'lucide-react';

export default function VolunteerPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    availability: '',
    interests: '',
    experience: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // Reuse contact endpoint to send applications via email
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: 'Volunteer Application',
          message: `Phone: ${form.phone}\nAvailability: ${form.availability}\nInterests: ${form.interests}\nExperience: ${form.experience}\n\nMessage:\n${form.message}`
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit application');
      }
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', availability: '', interests: '', experience: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner
        title="Volunteer With Us"
        subtitle="Apply to join our community of volunteers"
        imageUrl="/volunteerhero.jpg"
        imageAlt="Volunteers supporting The Giving Tree Foundation"
      />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold text-green-900 mb-4">Why Volunteer?</h2>
              <p className="text-green-800 mb-4">
                Volunteers are at the heart of our mission. From running donation drives to sorting items and
                supporting events, your time directly impacts patient care at Mackenzie Health.
              </p>
              <ul className="space-y-3 text-green-800">
                <li>• Flexible hours and roles</li>
                <li>• Community service experience</li>
                <li>• Be part of a compassionate team</li>
              </ul>
              <div className="mt-6 space-y-3 text-sm text-green-800">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2"/>
                    <span>(647) 897-9128</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2"/>
                    <span>(437) 214-6840</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2"/>
                    <span className="break-words">givingtreenonprofit@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2"/>
                    <span>Serving Mackenzie Health communities</span>
                  </div>
                </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            {submitted ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 mb-2">Application Submitted!</h3>
                <p className="text-green-700">Thank you for applying. We'll reach out to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="field" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="field" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="field" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Availability</label>
                    <input name="availability" value={form.availability} onChange={handleChange} className="field" placeholder="Weekends, evenings, etc." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Areas of Interest</label>
                  <input name="interests" value={form.interests} onChange={handleChange} className="field" placeholder="Events, sorting items, outreach, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Relevant Experience</label>
                  <textarea name="experience" value={form.experience} onChange={handleChange} className="field min-h-[100px]" placeholder="Optional"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} className="field min-h-[120px]" placeholder="Tell us why you want to volunteer"></textarea>
                </div>
                <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                  {submitting ? 'Submitting...' : (<><Send className="h-5 w-5 mr-2"/>Submit Application</>)}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}


