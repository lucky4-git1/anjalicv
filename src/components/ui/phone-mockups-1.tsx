import React from "react";
import {
  ImageItem,
  PhoneCarousel,
} from "@/components/ui/phone-mockups-1-utils/phone-carousel";

const exampleImages: ImageItem[] = [
  {
    src: "https://assets.solaceui.com/solaceui-Behance-screen.png",
    alt: "Behance app on iPhone",
  },
  {
    src: "https://assets.solaceui.com/solaceui-Notion-screen.png",
    alt: "Notion app on iPhone",
  },
  {
    src: "https://assets.solaceui.com/solaceui-One-screen.png",
    alt: "One app on iPhone",
  },
  {
    src: "https://assets.solaceui.com/solaceui-Reddit-nj7hwh.png",
    alt: "Reddit app on iPhone",
  },
];

export default function PhoneMockupBasic() {
  return <PhoneCarousel images={exampleImages} />;
}
