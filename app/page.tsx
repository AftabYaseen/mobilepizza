"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const NAV = [
  { label: "About",    href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Menu",     href: "#menu" },
  { label: "Gallery",  href: "#gallery" },
  { label: "Contact",  href: "#contact" },
];

const SERVICES = [
  {
    title: "Weddings",
    img: "/wedding-eating.png",
    desc: "Make your special day unforgettable. Fresh wood-fired pizzas served slice by slice — a unique, interactive dining experience your guests will remember forever.",
  },
  {
    title: "Events & Parties",
    img: "/van-night1.png",
    desc: "Birthday celebrations, corporate gatherings, garden parties — we bring the full mobile pizzeria experience directly to your venue.",
  },
  {
    title: "Festivals & Pop-Ups",
    img: "/van-forest2.png",
    desc: "Experienced in high-volume festival service. Fast, fresh, and delicious — keeping crowds fed and happy all day long.",
  },
];

// Updated menu from the PDF
const MENU_PIZZAS = [
  { name: "Pepperoni", desc: "" },
  { name: "Margarita", desc: "" },
  { name: "Ham & Pineapple", desc: "" },
  { name: "BBQ Chicken & Bacon", desc: "" },
  { name: "The Veggie", desc: "Sweetcorn, Red Onion, Mushroom" },
];

const MENU_EXTRAS = [
  { name: "Garlic Pizza Bread", desc: "" },
  { name: "Garlic & Cheese Pizza Bread", desc: "" },
  { name: "Loaded Nachos", desc: "" },
];

const TRUST = [
  { icon: "🍕", title: "Fully Insured",     
    desc: "Full public liability insurance for total peace of mind at every event." },

  { icon: "🔥", title: "Food Hygiene Rated", 
    desc: "Officially rated — the highest standards of food safety, every time." },

  { icon: "🚚", title: "Event Specialists",  
    desc: "Years of experience at weddings, festivals, and private events across South Wales." },
];

// All site images for the lightbox
const ALL_IMAGES = [
  { src: "/van-night1.png",     alt: "Mobile Pizza van at night" },
  { src: "/van-night2.png",     alt: "Mobile Pizza van lit up" },
  { src: "/van-forest1.png",    alt: "Pizza van in the forest" },
  { src: "/van-forest2.png",    alt: "Mobile Pizza van at event" },
  { src: "/pizza-margarita.png",alt: "Fresh Margarita Pizza" },
  { src: "/pizza-veggie.png",   alt: "The Veggie Pizza" },
  { src: "/pizza-pepperoni.jpeg",alt: "Pepperoni Pizza" },
  { src: "/pizza-bbq.jpeg",     alt: "BBQ Chicken Pizza" },
  { src: "/pizza-oven1.jpeg",   alt: "Wood-fired oven" },
  { src: "/pizza-oven2.jpeg",   alt: "Flame cooking" },
  { src: "/wedding-box.png",    alt: "Custom wedding pizza box" },
  { src: "/wedding-eating.png", alt: "Wedding guest enjoying pizza" },
];

const AREAS = ["Bridgend","Cardiff","Swansea","Newport","Bristol","Pembrokeshire","Monmouth","Vale of Glamorgan"];

// ── LIGHTBOX ────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: {
  images: { src: string; alt: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose, prev, next]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Image src={images[idx].src} alt={images[idx].alt} width={1200} height={800} className="lightbox-img" style={{ objectFit:"contain" }} />
      </div>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
      {images.length > 1 && (
        <>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          <div className="lightbox-counter">{idx + 1} / {images.length}</div>
        </>
      )}
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const [scrolled, setScrolled]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lightbox, setLightbox]     = useState<{ images: typeof ALL_IMAGES; index: number } | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const openLb = (images: typeof ALL_IMAGES, index: number) => setLightbox({ images, index });
  const close  = () => setDrawerOpen(false);
  const scrollTop = (e: React.MouseEvent) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav id="navbar" className={scrolled ? "solid" : ""}>
        <div className="nav-inner">
          <a href="#" onClick={scrollTop}>
            <Image src="/logo-black.jpeg" alt="Mobile Pizza" width={160} height={60} className="nav-logo" />
          </a>
          <div className="nav-links">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
            <a href="tel:+447932324422" className="nav-cta">📞 Book Now</a>
          </div>
          <button className={`hamburger ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`drawer-overlay ${drawerOpen ? "show" : ""}`} onClick={close} />
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        {/* ✕ Close button */}
        <button
          onClick={close}
          aria-label="Close menu"
          style={{
            position: "absolute", top: 20, right: 20,
            background: "rgba(245,197,24,0.12)",
            border: "1px solid rgba(245,197,24,0.3)",
            color: "#F5C518", fontSize: 18, fontWeight: 700,
            width: 40, height: 40, borderRadius: "50%",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: 12 }}>
          <Image src="/logo-black.jpeg" alt="Mobile Pizza" width={120} height={50} style={{ height: 36, width: "auto", objectFit: "contain" }} />
        </div>

        {NAV.map((n) => <a key={n.href} href={n.href} onClick={close}>{n.label}</a>)}
        <a href="tel:+447932324422" className="drawer-cta" onClick={close}>📞 Book Now</a>

        <div style={{ marginTop: "auto", paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 8 }}>Contact</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#F5C518" }}>+44 7932 324422</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Mobilepizzaco@outlook.com</p>
        </div>
      </div>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-content">
          <Image src="/logo-black.jpeg" alt="Mobile Pizza" width={200} height={100} className="hero-logo" priority />
          <h1 className="hero-h1">Fresh Fire<br /><span>Cooked Pizza</span></h1>
          <p className="hero-sub">Anywhere In South Wales</p>
          <p className="hero-desc">
            Bringing the authentic taste of wood-fired pizza to your weddings, events,
            festivals, and parties. Made fresh, served hot.
          </p>
          <div className="hero-tags">
            {["Weddings", "Events", "Festivals", "Parties"].map((t) => (
              <span key={t} className="hero-tag">{t}</span>
            ))}
          </div>
          <div className="hero-btns">
            <a href="tel:+447932324422" className="btn-primary">📞 Book Now</a>
            <a href="#menu" className="btn-secondary">View Menu →</a>
          </div>
        </div>
      </section>

      {/* ══════════════════════ ABOUT ══════════════════════ */}
      <section id="about" className="section section-alt">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              <Image
                src="/van-night1.png"
                alt="Mobile Pizza van at night"
                width={640} height={480}
                className="about-img clickable-img"
                onClick={() => openLb(ALL_IMAGES, 0)}
              />
              <div className="about-badge">🔥 Wood-Fired<br />At 400°C</div>
            </div>
            <div>
              <p className="about-eyebrow">🍕 About Mobile Pizza</p>
              <h2 className="about-title">Your Event&apos;s<br /><span>Perfect Slice</span></h2>
              <div className="about-line" />
              <p className="about-p">
                We bring the authentic pizzeria experience to you — serving freshly made
                wood-fired pizzas across South Wales. Our mobile setup transforms any
                location into an Italian-inspired feast, perfect for weddings, festivals,
                corporate events, and private parties.
              </p>
              <p className="about-p">
                Each pizza is crafted with care and cooked to perfection in our
                wood-fired oven, delivering that authentic crispy base and perfectly
                melted toppings that only flame-cooking can achieve.
              </p>
              <div className="about-features">
                {[
                  "Wood-fired oven reaching 400°C",
                  "Fresh dough made daily on site",
                  "Serving within 100-mile radius of Bridgend",
                  "Vegetarian & gluten-free options available",
                ].map((f) => (
                  <div key={f} className="about-feat"><div className="feat-dot" />{f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ SERVICES ══════════════════════ */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: 56 }}>
            <p className="eyebrow">Our Specialty Services</p>
            <h2 className="section-title">Bringing The Best Pizza Experience<br /><span>To Your Event</span></h2>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="s-card">
                <div className="s-card-img-wrap clickable-img" onClick={() => openLb(SERVICES.map((sv) => ({ src: sv.img, alt: sv.title })), i)}>
                  <Image src={s.img} alt={s.title} width={600} height={500} className="s-card-img" />
                </div>
                <div className="s-card-body">
                  <h3 className="s-card-title">{s.title}</h3>
                  <p className="s-card-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:48 }}>
            <a href="tel:+447932324422" className="btn-primary">📞 Check Availability</a>
          </div>
        </div>
      </section>

      {/* ══════════════════════ MENU ══════════════════════ */}
      <section id="menu" className="section section-alt">
        <div className="container">
          <div className="section-center" style={{ marginBottom: 56 }}>
            <p className="eyebrow">Our Wood-Fired Pizzas</p>
            <h2 className="section-title">Hand-Crafted Fresh<br /><span>At Every Event</span></h2>
          </div>
          <div className="menu-grid">
            <div className="menu-cats">
              {/* Full 10" Pizzas */}
              <div className="menu-cat">
                <div className="menu-cat-title">🍕 Full 10&quot; Pizza</div>
                <div className="menu-items">
                  {MENU_PIZZAS.map((item) => (
                    <div key={item.name} className="menu-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2, paddingBottom: 10, marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="menu-dot" />
                        <span style={{ fontWeight: 600, fontSize: 15, color: "rgba(255,255,255,0.9)" }}>{item.name}</span>
                      </div>
                      {item.desc && (
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", paddingLeft: 20 }}>{item.desc}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Extras */}
              <div className="menu-cat">
                <div className="menu-cat-title">🧄 Extras &amp; Sides</div>
                <div className="menu-items">
                  {MENU_EXTRAS.map((item) => (
                    <div key={item.name} className="menu-item">
                      <div className="menu-dot" />
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="menu-note">
                <strong>GF &amp; VG Available on request.</strong> Custom menus available for events —
                we can create bespoke pizza options to match your theme or preferences.
              </div>
            </div>

            {/* Menu photos — real pizza shots */}
            <div className="menu-photos">
              <div className="menu-photo square clickable-img" onClick={() => openLb(ALL_IMAGES, 4)}>
                <Image src="/pizza-margarita.png" alt="Fresh Margarita" width={400} height={400} />
              </div>
              <div className="menu-photo square clickable-img" onClick={() => openLb(ALL_IMAGES, 5)}>
                <Image src="/pizza-veggie.png" alt="The Veggie" width={400} height={400} />
              </div>
              <div className="menu-photo tall clickable-img" onClick={() => openLb(ALL_IMAGES, 6)}>
                <Image src="/pizza-pepperoni.jpeg" alt="Pepperoni Pizza" width={800} height={500} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TRUST ══════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-center" style={{ marginBottom: 56 }}>
            <p className="eyebrow">Why Choose Us</p>
            <h2 className="section-title">Why Choose <span>Mobile Pizza</span></h2>
          </div>
          <div className="trust-grid">
            {TRUST.map((t) => (
              <div key={t.title} className="trust-card">
                <div className="trust-icon">{t.icon}</div>
                <div className="trust-title">{t.title}</div>
                <p className="trust-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* ══════════════════════ GALLERY ══════════════════════ */}
<section id="gallery" className="section section-alt">
  <div className="container">
    <div className="section-center" style={{ marginBottom: 56 }}>
      <p className="eyebrow">Photo Gallery</p>
      <h2 className="section-title">
        Explore Our Pizza<br /><span>Experience</span>
      </h2>
    </div>

    {/* ALL GALLERY IMAGES — single responsive grid, no nested rows */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
      gap: 14,
    }}>
      {[
        { src:"/van-night1.png",      alt:"Van at night",            idx:0  },
        { src:"/pizza-margarita.png", alt:"Fresh Margarita pizza",   idx:4  },
        { src:"/van-forest2.png",     alt:"Pizza van outdoor event", idx:3  },
        { src:"/van-night2.png",      alt:"Mobile Pizza van lit up", idx:1  },
        { src:"/wedding-box.png",     alt:"Wedding pizza box",       idx:10 },
        { src:"/wedding-eating.png",  alt:"Wedding guest pizza",     idx:11 },
        { src:"/pizza-veggie.png",    alt:"The Veggie pizza",        idx:5  },
        { src:"/van-forest1.png",     alt:"Van in the forest",       idx:2  },
        { src:"/pizza-bbq.jpeg",      alt:"BBQ Chicken pizza",       idx:7  },
      ].map((g) => (
        <div
          key={g.src}
          className="clickable-img"
          style={{ height: 280, borderRadius: 16, overflow: "hidden" }}
          onClick={() => openLb(ALL_IMAGES, g.idx)}
        >
          <Image
            src={g.src}
            alt={g.alt}
            width={700}
            height={500}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              transition: "transform 0.5s",
            }}
          />
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ══════════════════════ AREAS ══════════════════════ */}
      <section className="section section-center">
        <div className="container">
          <p className="eyebrow" style={{ justifyContent:"center" }}>Where We Serve</p>
          <h2 className="section-title">Based In Bridgend,<br /><span>Serving All Of South Wales</span></h2>
          <p className="section-desc">
            We cover events within a 100-mile radius, specialising in hand-making authentic pizzas on-site for any occasion.
          </p>
          <div className="areas-pills">
            {AREAS.map((a) => <span key={a} className="area-pill">{a}</span>)}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CONTACT ══════════════════════ */}
      <section id="contact" className="section section-alt section-center">
        <div className="container">
          <p className="eyebrow" style={{ justifyContent:"center" }}>Get In Touch</p>
          <h2 className="section-title">Book Mobile Pizza<br /><span>For Your Event</span></h2>
          <p className="section-desc">Ready to make your event special? Get in touch directly — no forms, no spam, just great pizza.</p>
          <div className="contact-card">
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-label">Address</div>
                <div className="contact-value">Bridgend, South Wales</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-label">Email Us</div>
                <div className="contact-value">Mobilepizzaco@outlook.com</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-label">Phone</div>
                <div className="contact-value">+44 7932 324422</div>
              </div>
            </div>
            <div className="contact-divider" />
            <p style={{ fontSize:15, fontWeight:600, color:"rgba(0,0,0,0.6)", marginBottom:20 }}>
              Call or email us directly — no forms, no spam.
            </p>
            <div className="contact-btns">
              <a href="tel:+447932324422" className="cta-dark">📞 Call Now</a>
              <a href="mailto:Mobilepizzaco@outlook.com" className="cta-border">✉️ Send Email</a>
            </div>
          </div>
          <p className="contact-hours">Mon–Fri: 8am – 4pm &nbsp;|&nbsp; Saturday: 8am – 12pm</p>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer>
        <div className="footer-inner">
          <a href="#" onClick={scrollTop}>
            <Image src="/logo-black.jpeg" alt="Mobile Pizza" width={120} height={50} className="footer-logo" />
          </a>
          <div className="footer-links">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </div>
          <div className="footer-copy">© 2025 Mobile Pizza<br />Bridgend, South Wales</div>
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
