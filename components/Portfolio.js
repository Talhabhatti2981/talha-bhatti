"use client";

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
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
  { id: "hero", label: "01. STUDIO" },
  { id: "vault", label: "02. ARCHIVE" },
  { id: "timeline", label: "03. PIPELINE" },
  { id: "arsenal", label: "04. ARSENAL" },
  { id: "booking", label: "05. BOOK" },
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
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setSelectedVideo(null);
      setBriefcaseOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-[#09090B] text-[#F4F1EA] min-h-screen font-body selection:bg-[#E5B869] selection:text-[#09090B] overflow-x-hidden">
      <ScrollProgress />
      <CustomCursor />
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

function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return undefined;

    document.body.classList.add("has-custom-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let frame = 0;

    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      const field = event.target.closest("input, textarea, select");
      const hot = !field && event.target.closest("a, button, [data-cursor]");
      ringRef.current?.classList.toggle("is-hot", Boolean(hot));
      if (ringRef.current) ringRef.current.style.opacity = field ? "0" : "1";
      if (dotRef.current) dotRef.current.style.opacity = field ? "0" : "1";
    };

    const loop = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
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
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[#09090B]/90 backdrop-blur-xl border-b border-[#E5B869]/20 py-3 shadow-2xl"
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
            className="w-11 h-11 rounded-full group-hover:scale-105 transition-transform duration-500"
          />
          <div>
            <div className="font-editorial font-bold text-lg tracking-[0.16em] text-[#F4F1EA]">
              TALHA <span className="text-[#E5B869]">BHATTI</span>
            </div>
            <div className="font-tc text-[10px] text-[#E5B869] tracking-[0.22em]">
              EDITOR & COLORIST
            </div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center space-x-7">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-tc text-xs tracking-widest transition-colors py-1 relative ${
                activeSection === item.id
                  ? "text-[#E5B869]"
                  : "text-[#A19D94] hover:text-[#F4F1EA]"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#E5B869] to-[#FF4D2D]" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={onOpenBriefcase}
            className="px-3.5 py-2 rounded-lg bg-[#141418] border border-[#E5B869]/40 hover:border-[#E5B869] text-[#E5B869] font-tc text-xs tracking-wider flex items-center gap-2 transition-all hover:bg-[#E5B869]/10"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>BRIEFCASE</span>
          </button>
          <button
            onClick={() => scrollTo("booking")}
            className="px-3.5 py-2 rounded-lg bg-[#E5B869] text-[#09090B] font-tc text-xs tracking-wider font-bold flex items-center gap-2 transition-all hover:bg-[#F7DFAA]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>BOOK A CUT</span>
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg border border-[#E5B869]/30 text-[#E5B869]"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Clapperboard className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#0D0D10]/98 backdrop-blur-2xl border-b border-[#E5B869]/30 px-6 py-5 space-y-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollTo(item.id);
                setMenuOpen(false);
              }}
              className="block w-full text-left font-tc text-xs tracking-widest py-2 text-[#F4F1EA] hover:text-[#E5B869]"
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
              className="flex-1 py-2.5 rounded-lg bg-[#E5B869] text-[#09090B] font-tc font-bold text-xs"
            >
              OPEN EDITOR&apos;S BRIEFCASE
            </button>
            <button
              onClick={() => {
                scrollTo("booking");
                setMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-lg border border-[#FF4D2D] text-[#FF4D2D] font-tc font-bold text-xs"
            >
              BOOK A CUT
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection({ scrollTo, onPlayShowreel, onOpenBriefcase }) {
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let disposed = false;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.032);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      1000
    );
    camera.position.set(0, 0.35, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xf4f1ea, 0.35);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xe5b869, 4, 45);
    goldLight.position.set(8, 6, 8);
    scene.add(goldLight);

    const crimsonLight = new THREE.PointLight(0xff4d2d, 3.5, 45);
    crimsonLight.position.set(-9, -6, 6);
    scene.add(crimsonLight);

    const heroSculpture = new THREE.Group();
    scene.add(heroSculpture);

    const prismGeo = new THREE.OctahedronGeometry(2.3, 0);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0xe5b869,
      metalness: 0.92,
      roughness: 0.14,
      emissive: 0x3b280c,
      emissiveIntensity: 0.5,
    });
    const centralPrism = new THREE.Mesh(prismGeo, prismMat);
    heroSculpture.add(centralPrism);

    const wireGeo = new THREE.OctahedronGeometry(2.85, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff4d2d,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const wirePrism = new THREE.Mesh(wireGeo, wireMat);
    heroSculpture.add(wirePrism);

    const filmStripGroup = new THREE.Group();
    const frameCount = 42;
    const frameGeo = new THREE.BoxGeometry(0.95, 0.62, 0.04);
    const sprocketGeo = new THREE.BoxGeometry(0.12, 0.08, 0.06);
    const frameMatDark = new THREE.MeshStandardMaterial({
      color: 0x16161c,
      metalness: 0.7,
      roughness: 0.25,
    });
    const frameMatGold = new THREE.MeshStandardMaterial({
      color: 0xe5b869,
      metalness: 0.85,
      roughness: 0.2,
    });
    const frameMatCrimson = new THREE.MeshStandardMaterial({
      color: 0xff4d2d,
      emissive: 0x661508,
      metalness: 0.6,
      roughness: 0.3,
    });

    const filmFrames = [];
    for (let i = 0; i < frameCount; i++) {
      const t = (i / frameCount) * Math.PI * 2;
      const radius = 5.4 + Math.sin(t * 3) * 0.65;
      const mat =
        i % 7 === 0 ? frameMatCrimson : i % 3 === 0 ? frameMatGold : frameMatDark;
      const frameMesh = new THREE.Mesh(frameGeo, mat);
      frameMesh.position.set(
        Math.cos(t) * radius,
        Math.sin(t * 2) * 1.65,
        Math.sin(t) * radius
      );
      frameMesh.lookAt(0, 0, 0);
      frameMesh.rotateZ(t * 0.5);

      const topSprocket = new THREE.Mesh(sprocketGeo, frameMatGold);
      topSprocket.position.set(0, 0.35, 0);
      frameMesh.add(topSprocket);

      const bottomSprocket = new THREE.Mesh(sprocketGeo, frameMatGold);
      bottomSprocket.position.set(0, -0.35, 0);
      frameMesh.add(bottomSprocket);

      filmStripGroup.add(frameMesh);
      filmFrames.push({ mesh: frameMesh, baseAngle: t });
    }
    heroSculpture.add(filmStripGroup);

    const waveCount = 180;
    const waveGeo = new THREE.BufferGeometry();
    const wavePositions = new Float32Array(waveCount * 3);
    for (let i = 0; i < waveCount; i++) {
      wavePositions[i * 3] = (i / waveCount - 0.5) * 24;
      wavePositions[i * 3 + 1] = -4.2;
      wavePositions[i * 3 + 2] = 0;
    }
    waveGeo.setAttribute("position", new THREE.BufferAttribute(wavePositions, 3));
    const waveMat = new THREE.PointsMaterial({
      color: 0xe5b869,
      size: 0.11,
      transparent: true,
      opacity: 0.75,
    });
    const timelineWave = new THREE.Points(waveGeo, waveMat);
    scene.add(timelineWave);

    const dustCount = 320;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    const cGold = new THREE.Color(0xe5b869);
    const cTerracotta = new THREE.Color(0xff4d2d);

    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 34;
      dustPos[i + 1] = (Math.random() - 0.5) * 24;
      dustPos[i + 2] = (Math.random() - 0.5) * 24;
      const chosen = Math.random() > 0.25 ? cGold : cTerracotta;
      dustCol[i] = chosen.r;
      dustCol[i + 1] = chosen.g;
      dustCol[i + 2] = chosen.b;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustCol, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);

    let mouseX = 0;
    let mouseY = 0;
    let scrollFactor = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollFactor = window.scrollY * 0.002;
    };
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let rafId;
    const timer = new THREE.Timer();

    const animate = (timestamp) => {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const t = timer.getElapsed();

      centralPrism.rotation.y = t * 0.45;
      centralPrism.rotation.x = Math.sin(t * 0.3) * 0.35;
      wirePrism.rotation.y = -t * 0.28;
      wirePrism.rotation.z = t * 0.2;

      filmStripGroup.rotation.y = t * 0.22 + scrollFactor;
      filmStripGroup.rotation.x = 0.28 + Math.sin(t * 0.4) * 0.12;

      filmFrames.forEach((item, idx) => {
        item.mesh.position.y = Math.sin(item.baseAngle * 2 + t * 1.4) * 1.75;
        item.mesh.rotation.z = Math.sin(t + idx * 0.2) * 0.35;
      });

      const posAttr = timelineWave.geometry.attributes.position;
      for (let i = 0; i < waveCount; i++) {
        const x = posAttr.getX(i);
        const y =
          -4.3 +
          Math.sin(x * 0.6 + t * 2.5) * 0.45 +
          Math.cos(x * 1.4 - t * 1.8) * 0.25;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      dustSystem.rotation.y = t * 0.04;
      heroSculpture.position.x += (mouseX * 0.45 - heroSculpture.position.x) * 0.05;
      heroSculpture.position.y += (-mouseY * 0.35 - heroSculpture.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      prismGeo.dispose();
      prismMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      frameGeo.dispose();
      sprocketGeo.dispose();
      frameMatDark.dispose();
      frameMatGold.dispose();
      frameMatCrimson.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      timer.dispose();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden scroll-mt-24"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 78% 42%, rgba(229,184,105,0.14), transparent 32%), radial-gradient(circle at 12% 80%, rgba(255,77,45,0.08), transparent 28%), #09090B",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          <div className="text-left max-w-xl">
            <p className="kicker text-[#E5B869] mb-5">Video Editor & Colorist</p>
            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-[#F4F1EA]">
              Talha Bhatti
            </h1>
            <p className="mt-4 font-editorial text-2xl sm:text-3xl leading-tight text-[#E5B869]">
              Cutting Stories Frame by Frame
            </p>
            <p className="lede mt-6">
              I cut commercials, music videos, documentaries, and social films, then finish them with a DaVinci Resolve grade, clean sound, and masters ready for web, broadcast, and vertical.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="font-editorial text-5xl sm:text-6xl font-black leading-none text-[#E5B869]">
                5+
              </div>
              <div>
                <div className="kicker text-[#F4F1EA]">Years Experience</div>
                <p className="mt-1 font-body text-sm text-[#A19D94]">
                  Picture edit, color, and sound
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onPlayShowreel}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#E5B869] to-[#D49B42] text-[#09090B] font-tc font-bold text-xs tracking-[0.18em] uppercase shadow-xl shadow-[#E5B869]/20 hover:shadow-[#E5B869]/40 hover:scale-[1.03] transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Screen Showreel</span>
              </button>
              <button
                onClick={onOpenBriefcase}
                className="px-8 py-4 rounded-xl bg-[#121216]/90 border border-[#E5B869]/50 hover:border-[#FF4D2D] text-[#F4F1EA] font-tc font-semibold text-xs tracking-[0.18em] uppercase backdrop-blur-md transition-all flex items-center justify-center gap-3"
              >
                <Briefcase className="w-4 h-4 text-[#FF4D2D]" />
                <span>Editor&apos;s Briefcase</span>
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] aspect-square">
            <div className="avatar-orbit absolute inset-3 rounded-full border border-dashed border-[#E5B869]/40" />
            <div className="avatar-orbit-reverse absolute inset-10 rounded-full border border-[#FF4D2D]/35" />
            <div className="absolute inset-8 rounded-full overflow-hidden border border-[#E5B869]/50 shadow-[0_0_80px_-12px_rgba(229,184,105,0.45)] bg-[#09090B]">
              <div ref={canvasContainerRef} className="absolute inset-0" />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_42%,#09090B_88%)]" />
            </div>
            <div className="absolute left-0 top-8 px-3 py-1.5 rounded-full bg-[#141418]/90 border border-[#E5B869]/40 font-tc text-[10px] tracking-[0.18em] text-[#E5B869]">
              EDIT BAY
            </div>
            <div className="absolute right-0 bottom-10 px-3 py-1.5 rounded-full bg-[#141418]/90 border border-[#FF4D2D]/40 font-tc text-[10px] tracking-[0.18em] text-[#FF4D2D]">
              24 FPS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialMarquee() {
  const items = [
    "OFFLINE EDITING",
    "PICTURE LOCK",
    "DAVINCI RESOLVE COLOR",
    "MUSIC VIDEO RHYTHM CUTS",
    "COMMERCIAL SPOTS",
    "DOCUMENTARY STORY",
    "MOTION GRAPHICS",
    "DIALOGUE & SOUND SYNC",
    "SOCIAL CUTDOWNS",
    "FRAME.IO REVIEWS",
  ];

  return (
    <div className="border-y border-[#E5B869]/20 bg-[#0E0E12] py-3.5 overflow-hidden">
      <div className="animate-marquee flex items-center space-x-10">
        {[...items, ...items].map((text, idx) => (
          <div key={`${text}-${idx}`} className="flex items-center space-x-10">
            <span className="font-tc text-xs tracking-[0.25em] text-[#A19D94] uppercase">
              {text}
            </span>
            <span className="text-[#FF4D2D] text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
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
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section id="vault" className="py-24 bg-[#09090B] relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24 p-6 sm:p-8 rounded-3xl bg-[#101014] gold-border shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-tc text-xs text-[#FF4D2D] tracking-widest uppercase flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4" />
                <span>COLOR SUITE • DRAG TO COMPARE THE GRADE</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F1EA]">
                Flat Log vs. Talha&apos;s Film-Print Look
              </h3>
            </div>
            <div className="font-tc text-xs text-[#E5B869] bg-[#09090B] px-4 py-2 rounded-lg border border-[#E5B869]/30">
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
            className="relative aspect-[16/8] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 touch-none"
          >
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80"
              alt="Flat, ungraded footage"
              className="absolute inset-0 w-full h-full object-cover filter saturate-[0.28] contrast-[0.72] brightness-[1.08]"
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded bg-black/75 font-tc text-[11px] text-gray-300 border border-white/15">
              FLAT / LOG
            </span>

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80"
                alt="Talha Bhatti film print grade"
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.28] saturate-[1.35] sepia-[0.18]"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded bg-[#E5B869] text-[#09090B] font-tc font-bold text-[11px]">
                TALHA PRINT LUT
              </span>
            </div>

            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#E5B869] shadow-[0_0_15px_#E5B869]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#09090B] border-2 border-[#E5B869] text-[#E5B869] flex items-center justify-center shadow-xl">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="kicker text-[#E5B869] mb-2 flex items-center gap-2">
              <Film className="w-4 h-4 text-[#FF4D2D]" />
              <span>Selected Cuts</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F1EA]">
              Film & Commercial Vault
            </h2>
            <p className="lede mt-3 max-w-xl">
              Eight cuts by Talha Bhatti. Play a video, or open the edit notes in the briefcase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "ALL CUTS" },
              { id: "commercials", label: "BRAND FILMS" },
              { id: "ai-vfx", label: "VFX & SOCIAL" },
              { id: "music", label: "MUSIC VIDEOS" },
              { id: "trailers", label: "TRAILERS" },
              { id: "docs", label: "DOCUMENTARIES" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-lg font-tc text-xs tracking-wider transition-all ${
                  selectedCategory === tab.id
                    ? "bg-[#E5B869] text-[#09090B] font-bold shadow-lg shadow-[#E5B869]/20"
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
              className="group rounded-2xl bg-[#101014] gold-border gold-border-hover overflow-hidden transition-all duration-300 flex flex-col justify-between"
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
                  onMouseEnter={(event) => {
                    const clip = event.currentTarget.querySelector("video");
                    if (clip) clip.play().catch(() => {});
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
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#09090B]/85 border border-[#E5B869]/30 font-tc text-[10px] text-[#E5B869]">
                    {item.specs}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#09090B]/90 font-tc text-[11px] text-[#F4F1EA]">
                    {item.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#E5B869] text-[#09090B] flex items-center justify-center shadow-2xl">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="font-tc text-[11px] text-[#FF4D2D] tracking-widest mb-1">
                    {item.client}
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-[#F4F1EA] group-hover:text-[#E5B869] transition-colors mb-2">
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
                      className="px-2 py-0.5 rounded bg-[#18181F] font-tc text-[10px] text-[#B5B0A6]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onOpenBriefcase(item.caseIndex)}
                  className="font-tc text-[11px] text-[#E5B869] hover:text-[#FF4D2D] flex items-center gap-1 transition-colors"
                >
                  <span>EDIT NOTES</span>
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
      className="py-24 bg-[#0D0D11] border-y border-[#E5B869]/15 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="kicker text-[#FF4D2D] mb-2 flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            <span>How a Cut Gets Made</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F1EA] mb-4">
            Post-Production Pipeline
          </h2>
          <p className="lede">
            Click a track to move the playhead. This is the path Talha uses from first selects to a graded master.
          </p>
        </div>

        <div className="rounded-3xl bg-[#09090B] gold-border p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 font-tc text-[11px] text-[#A19D94]">
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
                  className={`w-full text-left cursor-pointer rounded-xl p-3.5 transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#E5B869]/20 via-[#FF4D2D]/15 to-transparent border-[#E5B869]"
                      : "bg-[#121216] border-white/5 hover:border-white/20"
                  }`}
                  style={{ marginLeft: `${idx * 3}%`, width: `${100 - idx * 3}%` }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? "bg-[#FF4D2D] animate-ping" : "bg-[#E5B869]/50"
                      }`}
                    />
                    <span className="font-tc text-xs font-bold text-[#E5B869]">
                      {item.track}
                    </span>
                  </div>
                  <span className="font-tc text-[11px] text-[#A19D94]">{item.tc}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-[#121217] border border-[#E5B869]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="font-tc text-xs text-[#FF4D2D] mb-1">
                STAGE 0{activeStage + 1} // {stage.track}
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#F4F1EA] mb-2">
                {stage.title}
              </h3>
              <p className="font-body text-sm text-[#B5B0A6] max-w-2xl">{stage.details}</p>
            </div>
            <div className="shrink-0 p-4 rounded-xl bg-[#09090B] border border-white/10">
              <div className="font-tc text-[10px] text-[#A19D94] uppercase mb-1">
                WHAT YOU RECEIVE
              </div>
              <div className="font-tc text-xs font-bold text-[#E5B869]">
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
    <section id="arsenal" className="py-24 bg-[#09090B] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="kicker text-[#E5B869] mb-2">Edit Bay</div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F1EA] mb-4">
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
                className="p-6 rounded-2xl bg-[#101015] gold-border gold-border-hover transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#181820] border border-[#E5B869]/30 flex items-center justify-center text-[#E5B869] group-hover:text-[#FF4D2D] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-tc text-[10px] px-2.5 py-1 rounded bg-[#FF4D2D]/15 text-[#FF4D2D] border border-[#FF4D2D]/30 font-bold">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-body font-bold text-base text-[#F4F1EA] mb-1">
                  {tool.name}
                </h3>
                <p className="font-body text-xs text-[#A19D94] mb-5 min-h-[32px]">
                  {tool.role}
                </p>
                <div className="flex items-center justify-between font-tc text-[11px] mb-1.5">
                  <span className="text-[#A19D94]">DAILY USE</span>
                  <span className="text-[#E5B869] font-bold">{tool.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1B1B22] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E5B869] to-[#FF4D2D] rounded-full"
                    style={{ width: `${tool.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AwardsAndReviewsSection() {
  const stats = [
    { num: "Picture", label: "ASSEMBLY TO FINE CUT" },
    { num: "Color", label: "DAVINCI FINISHING" },
    { num: "Sound", label: "SYNC, BEDS & HITS" },
    { num: "Delivery", label: "MASTER + SOCIAL CUTS" },
  ];

  const reviews = [
    {
      quote:
        "Talha found the rhythm in a messy assembly and sent back a cut that finally felt like the film we shot.",
      author: "PRODUCTION CLIENT",
      role: "BRAND FILM",
    },
    {
      quote:
        "Notes came back on Frame.io the same day, and the grade matched from the hero shot to the vertical cutdown.",
      author: "CREATIVE TEAM",
      role: "CAMPAIGN FINISH",
    },
    {
      quote:
        "The music video stayed on the beat without feeling chopped. Performance, chorus, and titles all landed together.",
      author: "ARTIST TEAM",
      role: "MUSIC VIDEO",
    },
  ];

  return (
    <section className="py-24 bg-[#0D0D11] border-t border-[#E5B869]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-[#111116] gold-border text-center">
              <div className="font-editorial text-3xl sm:text-4xl font-black text-[#E5B869] mb-2">
                {stat.num}
              </div>
              <div className="font-tc text-[11px] tracking-widest text-[#A19D94]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.role}
              className="p-8 rounded-2xl bg-[#101014] gold-border flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[#E5B869] mb-4">
                  {[...Array(5)].map((_, star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-body text-sm text-[#D6D2C9] italic leading-relaxed mb-6">
                  “{rev.quote}”
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="font-tc text-xs font-bold text-[#F4F1EA]">{rev.author}</div>
                <div className="font-tc text-[10px] text-[#FF4D2D] tracking-wider">
                  {rev.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
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
    <section id="booking" className="py-24 bg-[#09090B] border-t border-[#E5B869]/15 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="kicker text-[#FF4D2D] mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Now Booking Edit Sessions</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F1EA] mb-5 leading-tight">
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
                <span>{CONTACT_EMAIL.toUpperCase()}</span>
              </a>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-[#FF4D2D]" />
                <span>PREMIERE, RESOLVE & FRAME.IO</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#101014] gold-border shadow-2xl">
            {sent ? (
              <div className="py-16 text-center">
                <CheckCircle className="w-16 h-16 text-[#E5B869] mx-auto mb-4" />
                <h3 className="font-editorial text-2xl font-bold text-[#F4F1EA] mb-2">
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
                  EDIT THE BRIEF
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-tc text-[11px] text-[#E5B869] tracking-wider mb-2">
                      YOUR NAME
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full bg-[#09090B] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-tc text-[11px] text-[#E5B869] tracking-wider mb-2">
                      EMAIL
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@studio.com"
                      className="w-full bg-[#09090B] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="format" className="block font-tc text-[11px] text-[#E5B869] tracking-wider mb-2">
                      WHAT NEEDS CUTTING
                    </label>
                    <select
                      id="format"
                      name="format"
                      className="w-full bg-[#09090B] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
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
                    <label htmlFor="budget" className="block font-tc text-[11px] text-[#E5B869] tracking-wider mb-2">
                      EDIT BUDGET
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="w-full bg-[#09090B] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                    >
                      <option>$800 – $2,000</option>
                      <option>$2,000 – $6,000</option>
                      <option>$6,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="brief" className="block font-tc text-[11px] text-[#E5B869] tracking-wider mb-2">
                    FOOTAGE, RUNTIME & DEADLINE
                  </label>
                  <textarea
                    id="brief"
                    name="brief"
                    rows={4}
                    required
                    placeholder="Camera, rough runtime, references, and the date you need the master..."
                    className="w-full bg-[#09090B] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E5B869]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E5B869] to-[#FF4D2D] text-[#09090B] font-tc font-bold text-xs tracking-[0.2em] uppercase shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND EDIT BRIEF</span>
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
    <footer className="bg-[#070709] border-t border-[#E5B869]/15 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="w-8 h-8 rounded-full" />
          <span className="font-editorial font-bold tracking-[0.16em] text-sm text-[#F4F1EA]">
            TALHA <span className="text-[#E5B869]">BHATTI</span> · VIDEO EDITOR
          </span>
        </button>

        <div className="font-tc text-[11px] text-[#A19D94] text-center">
          © {new Date().getFullYear()} TALHA BHATTI · PICTURE, COLOR & FINISH
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Editor briefcase"
    >
      <button className="absolute inset-0" aria-label="Close briefcase" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-[#0F0F13] gold-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-[#15151B] border-b border-[#E5B869]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#E5B869] font-tc text-xs tracking-widest">
            <Briefcase className="w-4 h-4 text-[#FF4D2D]" />
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
              className={`px-3.5 py-1.5 rounded-lg font-tc text-[11px] transition ${
                activeIndex === idx
                  ? "bg-[#E5B869] text-[#09090B] font-bold"
                  : "bg-[#181820] text-[#A19D94] hover:text-[#F4F1EA]"
              }`}
            >
              DOSSIER 0{idx + 1}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="font-tc text-xs text-[#FF4D2D] mb-1">{current.code}</div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
              {current.title}
            </h3>
            <div className="font-tc text-xs text-[#A19D94] mt-1">PROJECT: {current.client}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#09090B] border border-white/10">
              <div className="font-tc text-[10px] text-[#E5B869] mb-1.5">THE EDIT PROBLEM</div>
              <p className="font-body text-xs text-[#B5B0A6] leading-relaxed">{current.challenge}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#09090B] border border-white/10">
              <div className="font-tc text-[10px] text-[#FF4D2D] mb-1.5">HOW TALHA CUT IT</div>
              <p className="font-body text-xs text-[#B5B0A6] leading-relaxed">{current.solution}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {current.metrics.map((metric) => (
              <span
                key={metric}
                className="px-3 py-1.5 rounded-lg bg-[#E5B869]/10 border border-[#E5B869]/30 font-tc text-xs text-[#E5B869]"
              >
                ✦ {metric}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => onPlayCase(current.video)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5B869] to-[#FF4D2D] text-[#09090B] font-tc font-bold text-xs tracking-wider flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>SCREEN THIS CUT</span>
            </button>
            <button onClick={onClose} className="font-tc text-xs text-[#A19D94] hover:text-[#F4F1EA]">
              CLOSE BRIEFCASE
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Screening room"
    >
      <button className="absolute inset-0" aria-label="Close screening" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#0D0D11] gold-border overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-[#14141A] border-b border-[#E5B869]/20 flex items-center justify-between">
          <div>
            <div className="font-tc text-[10px] text-[#FF4D2D] tracking-widest">
              {video.specs || "SCREENING ROOM"}
            </div>
            <h3 className="font-editorial text-base sm:text-lg font-bold text-[#F4F1EA]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#E5B869] text-[#09090B] flex items-center justify-center mb-4">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <p className="font-tc text-[11px] tracking-[0.22em] text-[#E5B869]">
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
            <p className="font-tc text-[10px] text-[#FF4D2D] tracking-widest mb-1">{video.client}</p>
            <p className="font-body text-xs sm:text-sm text-[#B5B0A6]">{video.description}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 px-5 py-2 rounded-lg bg-[#E5B869] text-[#09090B] font-tc font-bold text-xs"
          >
            EXIT SCREENING
          </button>
        </div>
      </div>
    </div>
  );
}
