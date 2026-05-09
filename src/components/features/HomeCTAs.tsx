"use client";

import Link from "next/link";
import { useVQE } from "@/hooks/use-vqe";

export const HomeCTAs = () => {
  const { trackLead, trackAction } = useVQE({ 
    id: "home-ctas", 
    title: "Homepage CTAs", 
    contentType: "App", 
    enabled: false 
  });

  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href="/apps"
        onClick={() => trackAction("click_apps", "Home")}
        className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-black text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
      >
        VIEW APPS
      </Link>
      <Link
        href="/contact"
        onClick={() => trackLead("Home", "Contact")}
        className="inline-flex h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 px-8 text-sm font-black text-white hover:bg-white/10 transition-all"
      >
        CONTACT
      </Link>
    </div>
  );
};
