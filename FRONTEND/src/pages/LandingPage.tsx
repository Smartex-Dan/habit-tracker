import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Public landing page at "/". Down to two CTAs (both go to /login, which
 * handles sign-in and sign-up via its own toggle) — the header button is
 * secondary/small, the hero button is the primary call to action.
 *
 * Buttons use a left-to-right "sweep" hover effect (Render-style): a
 * colored layer slides in from the left on hover instead of the whole
 * button just changing color instantly.
 */

const tokens = {
  background: "#0F172A",
  surface: "#1E293B",
  primary: "#2563EB",
  accent: "#14B8A6",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

/* ------------------------------------------------------------------ */
/* Scroll-triggered fade-in wrapper                                    */
/* ------------------------------------------------------------------ */
function FadeInSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 backdrop-blur-md border-b"
      style={{ backgroundColor: `${tokens.background}CC`, borderColor: `${tokens.surface}` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg"
          style={{ background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.accent})`, color: tokens.text }}
        >
          H
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "'Fraunces', serif", color: tokens.text }}
        >
          Habit Tracker
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Sora', sans-serif" }}>
        {["Features", "Screenshots", "Testimonials", "FAQ"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: tokens.textSecondary }}
          >
            {item}
          </a>
        ))}
      </div>

      <button
        onClick={() => navigate("/login")}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-transform duration-200 hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.accent})`,
          color: tokens.text,
          fontFamily: "'Sora', sans-serif",
        }}
      >
        Sign In
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
function Hero() {
  const navigate = useNavigate();
  
  return (
    <section
      className="flex flex-col items-center text-center px-6 pt-[150px] pb-24 md:pt-[160px] md:pb-32"
      style={{ backgroundColor: tokens.background }}
    >
      <span
        className="text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
        style={{ backgroundColor: tokens.surface, color: tokens.accent, fontFamily: "'Sora', sans-serif" }}
      >
        Now live · Free to start
      </span>

      <h1
        className="text-5xl md:text-7xl font-bold max-w-3xl leading-[1.1] mb-6"
        style={{ fontFamily: "'Fraunces', serif", color: tokens.text }}
      >
        Build habits that actually stick.
      </h1>

      <p
        className="max-w-xl text-lg mb-10"
        style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif", lineHeight: 1.75 }}
      >
        Track streaks, hit goals, and watch your consistency compound —
        one check-in at a time.
      </p>

      <button
        onClick={() => navigate("/login")}
        className="group relative px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.accent})`,
          color: tokens.text,
          fontFamily: "'Sora', sans-serif",
          boxShadow: `0 8px 30px ${tokens.primary}40`,
        }}
      >
        Get Started
        <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                             */
/* ------------------------------------------------------------------ */
function Features() {
  const items = [
    { title: "Streak tracking", desc: "Never lose sight of how far you've come — current and longest streaks, always visible." },
    { title: "Daily check-ins", desc: "One tap to mark a habit done. Friction-free, so the habit sticks instead of the app." },
    { title: "Visual consistency", desc: "A GitHub-style heatmap makes your patterns impossible to ignore, in a good way." },
  ];

  return (
    <section id="features" className="px-6 md:px-12 py-24" style={{ backgroundColor: tokens.background }}>
      <FadeInSection className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            style={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.surface}` }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "'Fraunces', serif", color: tokens.text }}
            >
              {item.title}
            </h3>
            <p style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif", lineHeight: 1.75 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </FadeInSection>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* App Screenshots                                                      */
/* ------------------------------------------------------------------ */
function Screenshots() {
  return (
    <section id="screenshots" className="px-6 md:px-12 py-24" style={{ backgroundColor: tokens.surface }}>
      <FadeInSection className="max-w-5xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "'Fraunces', serif", color: tokens.text }}
        >
          See it in action
        </h2>
        <p className="mb-12" style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif" }}>
          Your dashboard, streaks, and heatmap — all in one place.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="aspect-video rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.textSecondary}30` }}
            >
              <span style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif" }}>
                Screenshot {n}
              </span>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                         */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const quotes = [
    { name: "Random User", text: "Just keeping this section | Y'all haven't said anything yet" },
    { name: "Admin D.", text: "Nothing to see here. | Thanks for coming!" },
  ];

  return (
    <section id="testimonials" className="px-6 md:px-12 py-24" style={{ backgroundColor: tokens.background }}>
      <FadeInSection className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {quotes.map((q) => (
          <div
            key={q.name}
            className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            style={{ backgroundColor: tokens.surface }}
          >
            <p
              className="mb-4 text-lg"
              style={{ color: tokens.text, fontFamily: "'Sora', sans-serif", lineHeight: 1.75 }}
            >
              "{q.text}"
            </p>
            <span style={{ color: tokens.accent, fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
              {q.name}
            </span>
          </div>
        ))}
      </FadeInSection>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: "Is Habit Tracker free?", a: "Yes — the core habit tracking, streaks, and heatmap are free to use." },
    { q: "Can I track more than habits?", a: "Yes, you also get daily goals, a to-do list, and long-term goals with progress tracking." },
    { q: "Does it work on mobile?", a: "Well, not yet. Stay Tuned, Keep Watch!" },
  ];

  return (
    <section id="faq" className="px-6 md:px-12 py-24" style={{ backgroundColor: tokens.surface }}>
      <FadeInSection className="max-w-2xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold mb-10 text-center"
          style={{ fontFamily: "'Fraunces', serif", color: tokens.text }}
        >
          Frequently asked
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl overflow-hidden cursor-pointer transition-colors"
              style={{ backgroundColor: tokens.background }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex justify-between items-center px-6 py-4">
                <span style={{ color: tokens.text, fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                  {item.q}
                </span>
                <span
                  className="transition-transform duration-300"
                  style={{ color: tokens.accent, transform: openIndex === i ? "rotate(45deg)" : "none" }}
                >
                  +
                </span>
              </div>
              <div
                className="transition-all duration-300 overflow-hidden"
                style={{ maxHeight: openIndex === i ? "120px" : "0px" }}
              >
                <p
                  className="px-6 pb-4"
                  style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif", lineHeight: 1.75 }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer
      className="px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
      style={{ backgroundColor: tokens.background, borderColor: tokens.surface }}
    >
      <span style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif", fontSize: "14px" }}>
        © {new Date().getFullYear()} Habit Tracker. Build the streak, don't break the streak.
      </span>
      <div className="flex gap-6" style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px" }}>
        <a href="/privacy" style={{ color: tokens.textSecondary }}>Privacy</a>
        <a href="/terms" style={{ color: tokens.textSecondary }}>Terms</a>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function LandingPage() {

  return (
    <div style={{ backgroundColor: tokens.background, minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Features />
      <Screenshots />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}