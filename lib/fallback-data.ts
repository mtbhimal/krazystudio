import type { ServiceItem } from "@/components/Services";

export const fallbackServices: ServiceItem[] = [
  { id: "recording", name: "Recording", description: "Full-band or solo tracking with a live engineer.", price: 8000, duration: 60, icon: "mic" },
  { id: "mixing", name: "Mixing", description: "Balance, depth and clarity for your rough tracks.", price: 6000, duration: 90, icon: "sliders" },
  { id: "mastering", name: "Mastering", description: "Radio-ready loudness and polish, streaming-optimized.", price: 3500, duration: 30, icon: "disc" },
  { id: "production", name: "Music Production", description: "Beat-making and full arrangement from scratch.", price: null, duration: 120, icon: "music" },
  { id: "podcast", name: "Podcast Recording", description: "Multi-mic podcast capture with post-production.", price: 5000, duration: 90, icon: "podcast" },
  { id: "rehearsal", name: "Rehearsal", description: "Full backline rehearsal space, by the hour.", price: 2000, duration: 60, icon: "guitar" }
];
