import SocialCards from "@/components/ui/card-fan-carousel";

const DEMO_CARDS = [
  { imgUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", alt: "Silk skincare ritual" },
  { imgUrl: "https://images.unsplash.com/photo-1608248597358-1e4242fa5214?auto=format&fit=crop&w=800&q=80", alt: "Haute jewelry styling" },
  { imgUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80", alt: "Artisanal stoneware ceramics" },
  { imgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", alt: "Editorial portrait monograph" },
  { imgUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80", alt: "Botanical bloom roses" },
  { imgUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", alt: "Spatial minimalist architecture" },
  { imgUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80", alt: "Organic cosmetic aesthetics" },
  { imgUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80", alt: "Champagne couture silk" },
  { imgUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", alt: "Editorial typography book" },
  { imgUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80", alt: "Terracotta ceramic forms" },
];

export default function Demo() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SocialCards cards={DEMO_CARDS} />
    </div>
  );
}
