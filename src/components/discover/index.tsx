import React from "react";
import ReactDOM from "react-dom/client";
import EmblaCarousel from "./emblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "../css/base.css";
import "../css/sandbox.css";
import "../css/embla.css";

// Update the SLIDES array to include objects with image, title, and description
const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };
const SLIDES = [
    {
        image: "/discover-images/popularEvents/grandprix.jpg", // Replace with your image paths
        title: "PUP Grand Prix 2025",
        description: "This is the description for Event 1.",
      },
      {
        image: "/discover-images/popularEvents/jobfair.png",
        title: "Job Fair: We need You!",
        description: "This is the description for Event 2.",
      },
      {
        image: "/discover-images/popularEvents/grandprix.jpg",
        title: "PUP Grand Prix 2025",
        description: "This is the description for Event 3.",
      },
      {
        image: "/discover-images/popularEvents/grandprix.jpg",
        title: "PUP Grand Prix 2025",
        description: "This is the description for Event 4.",
      },
      {
        image: "/discover-images/popularEvents/grandprix.jpg",
        title: "PUP Grand Prix 2025",
        description: "This is the description for Event 5.",
      },
];

const App: React.FC = () => (
  <>
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
  </>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
