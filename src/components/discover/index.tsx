import React from "react";
import ReactDOM from "react-dom/client";
import EmblaCarousel from "./emblaCarousel";
import "../css/base.css";
import "../css/embla.css";

type SlideType = {
  id: number;
  image: string;
  title: string;
  description: string;
  details: string;
  date: string;
  time: string;
  location: string;
  host: string;
  availableSlots: number;
  totalSlots: number;
  isCreator: boolean;
};

const SLIDES: SlideType[] = [
  {
    id: 1,
    image: "/discover-images/popularEvents/grandprix.jpg",
    title: "PUP Grand Prix 2025",
    description: "Experience the thrill of competition in this year’s PUP Grand Prix.",
    details: "Join the annual PUP Grand Prix, an event full of excitement, competition, and camaraderie among students and professionals alike.",
    date: "2025-03-25",
    time: "10:00 AM - 5:00 PM",
    location: "PUP Main Campus, Manila",
    host: "PUP University",
    availableSlots: 50,
    totalSlots: 100,
    isCreator: false,
  },
  {
    id: 2,
    image: "/discover-images/popularEvents/jobfair.png",
    title: "Job Fair: We Need You!",
    description: "Discover career opportunities at our biggest job fair of the year.",
    details: "Explore numerous job opportunities, network with industry leaders, and kickstart your career journey at our annual job fair.",
    date: "2025-04-10",
    time: "9:00 AM - 4:00 PM",
    location: "SMX Convention Center",
    host: "JobLink PH",
    availableSlots: 200,
    totalSlots: 500,
    isCreator: true,
  },
  {
    id: 3,
    image: "/discover-images/popularEvents/grandprix.jpg",
    title: "PUP Grand Prix 2025",
    description: "Experience the thrill of competition in this year’s PUP Grand Prix.",
    details: "Join the annual PUP Grand Prix, an event full of excitement, competition, and camaraderie among students and professionals alike.",
    date: "2025-03-25",
    time: "10:00 AM - 5:00 PM",
    location: "PUP Main Campus, Manila",
    host: "PUP University",
    availableSlots: 50,
    totalSlots: 100,
    isCreator: false,
  },
  {
    id: 4,
    image: "/discover-images/popularEvents/jobfair.png",
    title: "Job Fair: We Need You!",
    description: "Discover career opportunities at our biggest job fair of the year.",
    details: "Explore numerous job opportunities, network with industry leaders, and kickstart your career journey at our annual job fair.",
    date: "2025-04-10",
    time: "9:00 AM - 4:00 PM",
    location: "SMX Convention Center",
    host: "JobLink PH",
    availableSlots: 200,
    totalSlots: 500,
    isCreator: true,
  },
  {
    id: 5,
    image: "/discover-images/popularEvents/grandprix.jpg",
    title: "PUP Grand Prix 2025",
    description: "Experience the thrill of competition in this year’s PUP Grand Prix.",
    details: "Join the annual PUP Grand Prix, an event full of excitement, competition, and camaraderie among students and professionals alike.",
    date: "2025-03-25",
    time: "10:00 AM - 5:00 PM",
    location: "PUP Main Campus, Manila",
    host: "PUP University",
    availableSlots: 50,
    totalSlots: 100,
    isCreator: false,
  },
  {
    id: 6,
    image: "/discover-images/popularEvents/jobfair.png",
    title: "Job Fair: We Need You!",
    description: "Discover career opportunities at our biggest job fair of the year.",
    details: "Explore numerous job opportunities, network with industry leaders, and kickstart your career journey at our annual job fair.",
    date: "2025-04-10",
    time: "9:00 AM - 4:00 PM",
    location: "SMX Convention Center",
    host: "JobLink PH",
    availableSlots: 200,
    totalSlots: 500,
    isCreator: true,
  },
];

const App: React.FC = () => <EmblaCarousel slides={SLIDES} onCardClick={() => {}} />;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
