"use client";

import React, { useState, useEffect, useRef } from "react";

import {
  Play,
  Film,
  Scissors,
  Sparkles,
  Layers,
  Volume2,
  Cpu,
  Award,
  Send,
  CheckCircle,
  Mail,
  X,
  ChevronRight,
  Briefcase,
  Star,
  Sliders,
  Eye,
  Clapperboard,
  Aperture,
  Radio,
} from "lucide-react";
import {
  CONTACT_EMAIL,
  showreel,
  projects,
  recentFilms,
  caseStudies,
  stages,
  arsenal,
  services,
} from "./content";

const ICONS = {
  Scissors,
  Aperture,
  Sparkles,
  Eye,
  Volume2,
  Layers,
  Cpu,
  Clapperboard,
};

const NAV = [
  { id: "hero", label: "Studio" },
  { id: "vault", label: "Films" },
  { id: "timeline", label: "Process" },
  { id: "arsenal", label: "Tools" },
  { id: "booking", label: "Contact" },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [briefcaseOpen, setBriefcaseOpen] = useState(false);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const ids = NAV.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.15, 0.4] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const locked = Boolean(selectedVideo || briefcaseOpen);
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedVideo, briefcaseOpen]);

  useEffect(() => {
    if (!selectedVideo && !briefcaseOpen) return;
    const previous = document.activeElement;
    const dialog = document.querySelector('[role="dialog"]');
    const focusable = () => [...dialog.querySelectorAll('button, a[href], video[controls], [tabindex="0"]')].filter(el => el.getClientRects().length);
    focusable()[0]?.focus();
    const trap = (event) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => { document.removeEventListener("keydown", trap); previous?.focus(); };
  }, [selectedVideo, briefcaseOpen]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setSelectedVideo(null);
      setBriefcaseOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-[#101012] text-[#F4F1EA] min-h-screen font-body selection:bg-[#E5B869] selection:text-[#09090B] overflow-x-hidden">
      <ScrollProgress />

      <Navbar
        scrollTo={scrollTo}
        activeSection={activeSection}
        onOpenBriefcase={() => setBriefcaseOpen(true)}
      />

      <HeroSection
        scrollTo={scrollTo}
        onPlayShowreel={() => setSelectedVideo(showreel)}
        onOpenBriefcase={() => setBriefcaseOpen(true)}
      />

      <EditorialMarquee />

      <PortfolioVaultSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSelectVideo={(video) => setSelectedVideo(video)}
        onOpenBriefcase={(index) => {
          if (typeof index === "number") setActiveCaseStudy(index);
          setBriefcaseOpen(true);
        }}
      />

      <TimelineWorkflowSection />
      <ArsenalSection />
      <AwardsAndReviewsSection />
      <BookingSection />
      <Footer scrollTo={scrollTo} />

      {selectedVideo && (
        <ScreeningModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {briefcaseOpen && (
        <EditorsBriefcaseModal
          activeIndex={activeCaseStudy}
          setActiveIndex={setActiveCaseStudy}
          onClose={() => setBriefcaseOpen(false)}
          onPlayCase={(video) => {
            setBriefcaseOpen(false);
            setSelectedVideo(video);
          }}
        />
      )}
    </div>
  );
}

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={barRef} className="scroll-progress" />;
}

function Navbar({ scrollTo, activeSection, onOpenBriefcase }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
        scrolled
          ? "bg-[#101012]/90  border-b border-[#F1EEE7]/10 py-3 "
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center space-x-3 cursor-pointer group text-left"
        >
          <img
            src="/logo.svg"
            alt="Talha Bhatti logo"
            className="w-11 h-11 rounded-full  transition-transform duration-500"
          />
          <div>
            <div className="font-editorial font-medium text-lg tracking-normal text-[#F4F1EA]">
              Talha <span className="text-[#E5B869]">Bhatti</span>
            </div>
            <div className="font-tc text-xs text-[#E5B869] tracking-normal">
              Editor & colorist
            </div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center space-x-7">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-tc text-xs tracking-normal transition-colors py-1 relative ${
                activeSection === item.id
                  ? "text-[#E5B869]"
                  : "text-[#A19D94] hover:text-[#F4F1EA]"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 inset-x-0 h-px bg-[#E5B869]" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={onOpenBriefcase}
            className="px-3.5 py-2 rounded-lg bg-[#141418] border border-[#E5B869]/40 hover:border-[#E5B869] text-[#E5B869] font-tc text-xs tracking-normal flex items-center gap-2 transition-colors hover:bg-[#E5B869]/10"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Briefcase</span>
          </button>
          <button
            onClick={() => scrollTo("booking")}
            className="px-3.5 py-2 rounded-lg bg-[#E5B869] text-[#09090B] font-tc text-xs tracking-normal font-medium flex items-center gap-2 transition-colors hover:bg-[#F7DFAA]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Book a cut</span>
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg border border-[#F1EEE7]/10 text-[#E5B869]"
          aria-label="Toggle menu" aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Clapperboard className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#151517]  border-b border-[#F1EEE7]/10 px-6 py-5 space-y-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollTo(item.id);
                setMenuOpen(false);
              }}
              className="block w-full text-left font-tc text-xs tracking-normal py-2 text-[#F4F1EA] hover:text-[#E5B869]"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onOpenBriefcase();
                setMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-lg bg-[#E5B869] text-[#09090B] font-tc font-medium text-xs"
            >
              OPEN EDITOR&apos;S BRIEFCASE
            </button>
            <button
              onClick={() => {
                scrollTo("booking");
                setMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-lg border border-[#B4B1AA] text-[#B4B1AA] font-tc font-medium text-xs"
            >
              Book a cut
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection({ scrollTo, onPlayShowreel }) {
  return <section id="hero" className="hero section-wrap">
    <div className="hero-copy">
      <p className="kicker">Talha Bhatti · Video editor and colorist</p>
      <h1>Video editing.<br />A story in every frame.</h1>
      <p className="lede">Commercial films, music videos, documentaries and social content. I shape your footage through picture editing, color grading and sound, from the first assembly to the final export.</p>
      <div className="hero-actions"><button className="primary-button" onClick={onPlayShowreel}><Play size={16} />Watch showreel</button><button className="secondary-button" onClick={() => scrollTo("vault")}>Explore the films</button></div>
    </div>
    <div className="hero-film"><video src={showreel.videoUrl} poster={showreel.thumbnail} controls playsInline preload="none" aria-label="Talha Bhatti video editing showreel" /><div className="film-caption"><span>Picture, color and sound</span><span className="font-tc">{showreel.duration}</span></div></div>
  </section>;
}

function EditorialMarquee() {
 return <div className="service-strip section-wrap"><span>Picture editing</span><span>Color grading</span><span>Sound design</span><span>Social video</span></div>;
}

function PortfolioVaultSection({
  selectedCategory,
  setSelectedCategory,
  onSelectVideo,
  onOpenBriefcase,
}) {
  const [sliderPos, setSliderPos] = useState(52);
  const sliderRef = useRef(null);

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  const filtered =
    selectedCategory === "all"
      ? [...recentFilms, ...projects]
      : [...recentFilms, ...projects].filter((project) => project.category === selectedCategory);

  return (
    <section id="vault" className="py-24 bg-[#101012] relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24 p-6 sm:p-8 rounded-3xl bg-[#101014] gold-border ">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-tc text-xs text-[#B4B1AA] tracking-normal flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4" />
                <span>Color preview · Drag to compare</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#F4F1EA]">
                Explore a color treatment
              </h3>
            </div>
            <div className="font-tc text-xs text-[#E5B869] bg-[#101012] px-4 py-2 rounded-lg border border-[#F1EEE7]/10">
              SPLIT: {sliderPos}% GRADED / {100 - sliderPos}% FLAT
            </div>
          </div>

          <div
            ref={sliderRef}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              handleSliderMove(event.clientX);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                handleSliderMove(event.clientX);
              }
            }}
            role="slider" tabIndex={0} aria-label="Color treatment comparison" aria-valuemin={0} aria-valuemax={100} aria-valuenow={sliderPos}
            onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); setSliderPos(event.key === "Home" ? 0 : event.key === "End" ? 100 : Math.max(0, Math.min(100, sliderPos + (event.key === "ArrowRight" ? 5 : -5)))); } }}
            className="relative aspect-[16/8] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 touch-none"
          >
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80"
              alt="Illustrative muted color preview"
              className="absolute inset-0 w-full h-full object-cover filter saturate-[0.28] contrast-[0.72] brightness-[1.08]"
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded bg-black/75 font-tc text-xs text-gray-300 border border-white/15">
              Muted preview
            </span>

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80"
                alt="Illustrative warm color preview"
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.28] saturate-[1.35] sepia-[0.18]"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded bg-[#E5B869] text-[#09090B] font-tc font-medium text-xs">
                Color treatment
              </span>
            </div>

            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#E5B869] "
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101012] border-2 border-[#E5B869] text-[#E5B869] flex items-center justify-center ">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <p className="preview-note">Illustrative color comparison using the same still image</p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="kicker text-[#E5B869] mb-2 flex items-center gap-2">
              <Film className="w-4 h-4 text-[#B4B1AA]" />
              <span>Selected Cuts</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-medium tracking-tight text-[#F4F1EA]">
              Selected video editing projects
            </h2>
            <p className="lede mt-3 max-w-xl">
              Explore video editing projects and five recently added films. Choose a category or open a film to watch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All films" },
              { id: "recent", label: "Recent films" },
              { id: "commercials", label: "Brand films" },
              { id: "ai-vfx", label: "VFX and social" },
              { id: "music", label: "Music videos" },
              { id: "trailers", label: "Trailers" },
              { id: "docs", label: "Documentaries" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                aria-pressed={selectedCategory === tab.id}
                className={`px-4 py-2 rounded-lg font-tc text-xs tracking-normal transition-colors ${
                  selectedCategory === tab.id
                    ? "bg-[#E5B869] text-[#09090B] font-medium  "
                    : "bg-[#121216] text-[#A19D94] border border-white/10 hover:text-[#F4F1EA]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl bg-[#101014] gold-border gold-border-hover overflow-hidden transition-colors duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectVideo(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectVideo(item);
                    }
                  }}
                  data-cursor="play"
                  aria-label={`Watch ${item.title}`}
                  onMouseEnter={(event) => {
                    const clip = event.currentTarget.querySelector("video");
                    if (clip && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) clip.play().catch(() => {});
                  }}
                  onMouseLeave={(event) => {
                    const clip = event.currentTarget.querySelector("video");
                    if (!clip) return;
                    clip.pause();
                    clip.currentTime = 0;
                  }}
                  className="relative aspect-video overflow-hidden bg-black w-full text-left"
                >
                  <video
                    src={item.videoUrl}
                    poster={item.thumbnail}
                    muted
                    playsInline
                    preload="none"
                    className="w-full h-full object-contain opacity-90"
                  />
                  <div className="absolute inset-0    " />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#101012]/85 border border-[#F1EEE7]/10 font-tc text-xs text-[#E5B869]">
                    {item.specs}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#101012]/90 font-tc text-xs text-[#F4F1EA]">
                    {item.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#E5B869] text-[#09090B] flex items-center justify-center ">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="font-tc text-xs text-[#B4B1AA] tracking-normal mb-1">
                    {item.client}
                  </div>
                  <h3 className="font-editorial text-lg font-medium text-[#F4F1EA] group-hover:text-[#E5B869] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-[#A19D94]">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {item.tools.slice(0, 2).map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 rounded bg-[#18181F] font-tc text-xs text-[#B5B0A6]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => item.caseIndex === undefined ? onSelectVideo(item) : onOpenBriefcase(item.caseIndex)}
                  className="font-tc text-xs text-[#E5B869] hover:text-[#B4B1AA] flex items-center gap-1 transition-colors"
                >
                  <span>{item.caseIndex === undefined ? "Watch film" : "Edit notes"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineWorkflowSection() {
  const [activeStage, setActiveStage] = useState(2);
  const stage = stages[activeStage];

  return (
    <section
      id="timeline"
      className="py-24 bg-[#151517] border-y border-[#F1EEE7]/10 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="kicker text-[#B4B1AA] mb-2 flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            <span>How a Cut Gets Made</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-medium tracking-tight text-[#F4F1EA] mb-4">
            From footage to final film
          </h2>
          <p className="lede">
            Click a track to move the playhead. This is the path Talha uses from first selects to a graded master.
          </p>
        </div>

        <div className="rounded-3xl bg-[#101012] gold-border p-6 sm:p-8 ">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 font-tc text-xs text-[#A19D94]">
            <span>SEQUENCE: TALHA_EDIT_MASTER</span>
            <span className="text-[#E5B869]">PLAYHEAD: {stage.tc}</span>
          </div>

          <div className="space-y-3 mb-8">
            {stages.map((item, idx) => {
              const isSelected = activeStage === idx;
              return (
                <button
                  key={item.track}
                  onClick={() => setActiveStage(idx)}
                  aria-pressed={isSelected}
                  className={`w-full text-left cursor-pointer rounded-xl p-3.5 transition-colors border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? "    border-[#E5B869]"
                      : "bg-[#121216] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? "bg-[#B4B1AA] " : "bg-[#E5B869]/50"
                      }`}
                    />
                    <span className="font-tc text-xs font-medium text-[#E5B869]">
                      {item.track}
                    </span>
                  </div>
                  <span className="font-tc text-xs text-[#A19D94]">{item.tc}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-[#121217] border border-[#F1EEE7]/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="font-tc text-xs text-[#B4B1AA] mb-1">
                STAGE 0{activeStage + 1} // {stage.track}
              </div>
              <h3 className="font-editorial text-2xl font-medium text-[#F4F1EA] mb-2">
                {stage.title}
              </h3>
              <p className="font-body text-sm text-[#B5B0A6] max-w-2xl">{stage.details}</p>
            </div>
            <div className="shrink-0 p-4 rounded-xl bg-[#101012] border border-white/10">
              <div className="font-tc text-xs text-[#A19D94] mb-1">
                What you receive
              </div>
              <div className="font-tc text-xs font-medium text-[#E5B869]">
                {stage.deliverable}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArsenalSection() {
  return (
    <section id="arsenal" className="py-24 bg-[#101012] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="kicker text-[#E5B869] mb-2">Edit Bay</div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-medium tracking-tight text-[#F4F1EA] mb-4">
            Tools Behind the Cut
          </h2>
          <p className="lede">
            Premiere for the story, Resolve for the picture, After Effects for type and cleanup, and Frame.io so notes stay on the frame.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {arsenal.map((tool) => {
            const Icon = ICONS[tool.icon] || Film;
            return (
              <div
                key={tool.name}
                className="p-6 rounded-2xl bg-[#101015] gold-border gold-border-hover transition-colors group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#181820] border border-[#F1EEE7]/10 flex items-center justify-center text-[#E5B869] group-hover:text-[#B4B1AA] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-tc text-xs px-2.5 py-1 rounded bg-[#B4B1AA]/15 text-[#B4B1AA] border border-[#B4B1AA]/30 font-medium">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-body font-medium text-base text-[#F4F1EA] mb-1">
                  {tool.name}
                </h3>
                <p className="font-body text-xs text-[#A19D94] mb-5 min-h-[32px]">
                  {tool.role}
                </p>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AwardsAndReviewsSection() {
 return <section className="delivery-section section-wrap"><div><p className="kicker">The finishing details</p><h2>Ready for the screen<br />you have in mind</h2></div><div><p className="lede">A film, a YouTube release or a vertical social edit each needs its own finish. Share your intended platforms so the picture, sound and export format can be planned together.</p><p className="delivery-list">Picture edit · Color grade · Sound · Final exports</p></div></section>;
}

function BookingSection() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const format = data.get("format");
    const budget = data.get("budget");
    const brief = data.get("brief");
    const subject = encodeURIComponent(`Edit booking from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nFormat: ${format}\nBudget: ${budget}\n\n${brief}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="booking" className="py-24 bg-[#101012] border-t border-[#F1EEE7]/10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="kicker text-[#B4B1AA] mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 " />
              <span>Now Booking Edit Sessions</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-medium tracking-tight text-[#F4F1EA] mb-5 leading-tight">
              Hire Talha Bhatti to Cut Your Next Film
            </h2>
            <p className="lede mb-8">
              Remote editing for commercials, music videos, YouTube, and short
              documentaries. Send selects or a drive link. You get an assembly,
              a fine cut, a grade, and the exports you actually post.
            </p>

            <ul className="space-y-3 mb-8">
              {services.map((service) => (
                <li key={service} className="flex items-center gap-3 font-tc text-xs text-[#F4F1EA]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]" />
                  {service}
                </li>
              ))}
            </ul>

            <div className="space-y-4 font-tc text-xs text-[#F4F1EA]">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 hover:text-[#E5B869]">
                <Mail className="w-4 h-4 text-[#E5B869]" />
                <span>{CONTACT_EMAIL}</span>
              </a>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-[#B4B1AA]" />
                <span>Premiere, resolve & frame.io</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#101014] gold-border ">
            {sent ? (
              <div className="py-16 text-center">
                <CheckCircle className="w-16 h-16 text-[#E5B869] mx-auto mb-4" />
                <h3 className="font-editorial text-2xl font-medium text-[#F4F1EA] mb-2">
                  Brief ready to send
                </h3>
                <p className="font-body text-sm text-[#A19D94] max-w-md mx-auto">
                  Your email app should open with the cut request addressed to Talha.
                  If it did not, write directly to {CONTACT_EMAIL}.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 font-tc text-xs text-[#E5B869] hover:text-[#F4F1EA]"
                >
                  Edit the brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-tc text-xs text-[#E5B869] tracking-normal mb-2">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full bg-[#101012] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-tc text-xs text-[#E5B869] tracking-normal mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@studio.com"
                      className="w-full bg-[#101012] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="format" className="block font-tc text-xs text-[#E5B869] tracking-normal mb-2">
                      What needs cutting
                    </label>
                    <select
                      id="format"
                      name="format"
                      className="w-full bg-[#101012] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                    >
                      <option>Brand commercial</option>
                      <option>Music video</option>
                      <option>YouTube or documentary</option>
                      <option>Color grade only</option>
                      <option>Trailer or launch film</option>
                      <option>Reels and social cutdowns</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block font-tc text-xs text-[#E5B869] tracking-normal mb-2">
                      Edit budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="w-full bg-[#101012] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                    >
                      <option>$800 to $2,000</option>
                      <option>$2,000 to $6,000</option>
                      <option>$6,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="brief" className="block font-tc text-xs text-[#E5B869] tracking-normal mb-2">
                    Footage, runtime & deadline
                  </label>
                  <textarea
                    id="brief"
                    name="brief"
                    rows={4}
                    required
                    placeholder="Camera, rough runtime, references, and the date you need the master..."
                    className="w-full bg-[#101012] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl    text-[#09090B] font-tc font-medium text-xs tracking-normal  hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send edit brief</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ scrollTo }) {
  return (
    <footer className="bg-[#070709] border-t border-[#F1EEE7]/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="w-8 h-8 rounded-full" />
          <span className="font-editorial font-medium tracking-normal text-sm text-[#F4F1EA]">
            Talha <span className="text-[#E5B869]">Bhatti</span> · Video editor
          </span>
        </button>

        <div className="font-tc text-xs text-[#A19D94] text-center">
          © {new Date().getFullYear()} Talha Bhatti · Picture, color and finish
        </div>

        <div className="flex items-center gap-4 text-[#A19D94]">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-[#E5B869] transition"
            aria-label="Email Talha Bhatti"
          >
            <Mail className="w-5 h-5" />
          </a>
          <button
            onClick={() => scrollTo("vault")}
            className="hover:text-[#E5B869] transition"
            aria-label="View selected cuts"
          >
            <Film className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

function EditorsBriefcaseModal({ activeIndex, setActiveIndex, onClose, onPlayCase }) {
  const current = caseStudies[activeIndex] || caseStudies[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 "
      role="dialog"
      aria-modal="true"
      aria-label="Editor briefcase"
    >
      <button className="absolute inset-0" aria-label="Close briefcase" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-[#0F0F13] gold-border  overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-[#15151B] border-b border-[#F1EEE7]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#E5B869] font-tc text-xs tracking-normal">
            <Briefcase className="w-4 h-4 text-[#B4B1AA]" />
            <span>TALHA&apos;S EDIT BRIEFCASE</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#A19D94] hover:text-[#F4F1EA]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5 flex flex-wrap gap-2">
          {caseStudies.map((item, idx) => (
            <button
              key={item.code}
              onClick={() => setActiveIndex(idx)}
              className={`px-3.5 py-1.5 rounded-lg font-tc text-xs transition ${
                activeIndex === idx
                  ? "bg-[#E5B869] text-[#09090B] font-medium"
                  : "bg-[#181820] text-[#A19D94] hover:text-[#F4F1EA]"
              }`}
            >
              DOSSIER 0{idx + 1}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="font-tc text-xs text-[#B4B1AA] mb-1">{current.code}</div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F4F1EA]">
              {current.title}
            </h3>
            <div className="font-tc text-xs text-[#A19D94] mt-1">PROJECT: {current.client}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#101012] border border-white/10">
              <div className="font-tc text-xs text-[#E5B869] mb-1.5">The edit problem</div>
              <p className="font-body text-xs text-[#B5B0A6] leading-relaxed">{current.challenge}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#101012] border border-white/10">
              <div className="font-tc text-xs text-[#B4B1AA] mb-1.5">How talha cut it</div>
              <p className="font-body text-xs text-[#B5B0A6] leading-relaxed">{current.solution}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {current.metrics.map((metric) => (
              <span
                key={metric}
                className="px-3 py-1.5 rounded-lg bg-[#E5B869]/10 border border-[#F1EEE7]/10 font-tc text-xs text-[#E5B869]"
              >
                {metric}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => onPlayCase(current.video)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl    text-[#09090B] font-tc font-medium text-xs tracking-normal flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Screen this cut</span>
            </button>
            <button onClick={onClose} className="font-tc text-xs text-[#A19D94] hover:text-[#F4F1EA]">
              Close briefcase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreeningModal({ video, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 "
      role="dialog"
      aria-modal="true"
      aria-label="Screening room"
    >
      <button className="absolute inset-0" aria-label="Close screening" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#151517] gold-border overflow-hidden ">
        <div className="px-6 py-4 bg-[#14141A] border-b border-[#F1EEE7]/10 flex items-center justify-between">
          <div>
            <div className="font-tc text-xs text-[#B4B1AA] tracking-normal">
              {video.specs || "SCREENING ROOM"}
            </div>
            <h3 className="font-editorial text-base sm:text-lg font-medium text-[#F4F1EA]">
              {video.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#A19D94] hover:text-[#F4F1EA]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black relative">
          {video.videoUrl ? (
            <video
              src={video.videoUrl}
              poster={video.thumbnail}
              controls
              autoPlay
              preload="metadata"
              playsInline
              className="w-full h-full bg-black"
            />
          ) : (
            <>
              <img
                src={video.thumbnail}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0  from-black  " />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#E5B869] text-[#09090B] flex items-center justify-center mb-4">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <p className="font-tc text-xs tracking-normal text-[#E5B869]">
                  MASTER STILL · {video.duration}
                </p>
                <p className="font-body text-sm text-[#F4F1EA] mt-2 max-w-md">
                  Edited by Talha Bhatti. The private master is available on request.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-[#111116] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-tc text-xs text-[#B4B1AA] tracking-normal mb-1">{video.client}</p>
            <p className="font-body text-xs sm:text-sm text-[#B5B0A6]">{video.description}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 px-5 py-2 rounded-lg bg-[#E5B869] text-[#09090B] font-tc font-medium text-xs"
          >
            Exit screening
          </button>
        </div>
      </div>
    </div>
  );
}
