import React, { useState } from "react"
import { X, Send, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    scope: "Social Media Management & Campaign Strategy",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#CB7885", "#893941", "#D4D994", "#F5F3EC"],
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact Anjali Rajput"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#F5F3EC] text-[#211D1D] border-2 border-[#893941] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close contact dialog"
          className="absolute top-5 right-5 p-1.5 rounded-lg border border-[#893941]/30 text-[#893941] hover:bg-[#893941]/10"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#893941]/10 border border-[#893941] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#893941]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#893941] mb-1.5">
              Inquiry Dispatched
            </h3>
            <p className="text-xs text-[#211D1D]/80 max-w-sm font-sans mb-6">
              Thank you, {formData.name || "valued collaborator"}. Anjali will review your proposal and reply within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                onClose()
              }}
              className="px-5 py-2 rounded-full bg-[#893941] text-[#FFFEFA] font-mono text-xs uppercase tracking-wider font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#893941] font-bold block mb-1">
                COLLABORATION INTAKE
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#893941]">
                Initiate Project Inquiry
              </h3>
              <p className="text-xs text-[#5E6623] font-sans mt-0.5">
                For social media management, aesthetic campaigns, or brand collaborations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#893941] font-bold block mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Elena Rostova"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#893941]/30 text-[#211D1D] text-xs focus:border-[#893941] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#893941] font-bold block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@studio.com"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#893941]/30 text-[#211D1D] text-xs focus:border-[#893941] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#893941] font-bold block mb-1">
                  Scope
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#893941]/30 text-[#211D1D] text-xs focus:border-[#893941] focus:outline-none transition-colors"
                >
                  <option value="Social Media Management & Campaign Strategy">Social Media Management & Campaign Strategy</option>
                  <option value="Viral Reels & TikTok Content Production">Viral Reels & TikTok Content Production</option>
                  <option value="Aesthetic Feed Curation & Brand Identity">Aesthetic Feed Curation & Brand Identity</option>
                  <option value="Influencer & Creator Collaborations">Influencer & Creator Collaborations</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#893941] font-bold block mb-1">
                  Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Goals, timeline, and scope overview..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#893941]/30 text-[#211D1D] text-xs focus:border-[#893941] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#893941] hover:bg-[#a1434c] text-[#FFFEFA] font-mono text-xs uppercase tracking-wider font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#D4D994]" />
                  <span>Send Commission Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
