import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendContactMessage(formData);
      setSuccessMessage(res.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E87325] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Contact</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
          Contact Temple Ease
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Have queries about darshan, special seva tokens, or wheelchair assistance? Reach out to temple administration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Office Details (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-base font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-3">
            Administration Office
          </h2>

          <div className="space-y-4 text-xs text-stone-700">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] text-[#E87325] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 font-semibold">Temple Office Address</strong>
                <p className="text-stone-600 mt-0.5">Temple Hill Crest Road, Central Pilgrim Enclave</p>
                <p className="text-stone-600">Tirupati District, Andhra Pradesh - 517501</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] text-[#E87325] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 font-semibold">Phone Helpline</strong>
                <p className="text-stone-600 mt-0.5">+91 (0877) 2263000 / 2263100</p>
                <p className="text-stone-400">Toll-Free: 1800-425-3333</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] text-[#E87325] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 font-semibold">Email Support</strong>
                <p className="text-stone-600 mt-0.5">helpdesk@templeease.org</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF5EE] text-[#E87325] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 font-semibold">Physical Counters</strong>
                <p className="text-stone-600 mt-0.5">05:00 AM – 09:00 PM Daily</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-temple-heading text-[#3A1412]">
            Send an Inquiry or Feedback
          </h2>

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl focus:outline-hidden focus:border-[#E87325]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="devotee@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl focus:outline-hidden focus:border-[#E87325]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98480 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl focus:outline-hidden focus:border-[#E87325]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subject <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Seva Timings"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl focus:outline-hidden focus:border-[#E87325]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Message <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write your inquiry or feedback here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl focus:outline-hidden focus:border-[#E87325] resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#E87325] hover:bg-[#C25610] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
