import React, { useState } from "react"
import { Navigation } from "./components/Navigation"
import { HeroSection } from "./components/HeroSection"
import { EditorialPortfolioBoard } from "./components/EditorialPortfolioBoard"
import { CvModal } from "./components/CvModal"
import { ContactModal } from "./components/ContactModal"

export default function App() {
  const [cvModalOpen, setCvModalOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#F9EAE6] text-[#211D1D] selection:bg-[#CB7885] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Editorial Navigation */}
      <Navigation
        onOpenCvModal={() => setCvModalOpen(true)}
        onOpenContactModal={() => setContactModalOpen(true)}
      />

      <main>
        {/* SECTION 1: Full-Width Hero / Portfolio Cover with Botanical Bloom & Butterfly */}
        <HeroSection
          onOpenCvModal={() => setCvModalOpen(true)}
          onOpenContactModal={() => setContactModalOpen(true)}
        />

        {/* SECTIONS 2–8: Editorial Portfolio Board (Follows Reference 2 Grid Composition) */}
        <EditorialPortfolioBoard
          onOpenCvModal={() => setCvModalOpen(true)}
          onOpenContactModal={() => setContactModalOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <CvModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  )
}
