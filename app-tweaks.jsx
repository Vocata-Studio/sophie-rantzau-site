/* Sophie Rantzau — Tweaks panel
   Applies palette, type pairing, hero image side, and logo placeholder style
   via data-* attrs on <body>.
*/
const { useEffect } = React;

const DEFAULTS = window.__TWEAKS || {
  palette: "clay-deep",
  heroImageSide: "right",
  logoStyle: "bridge-line",
};

const PALETTES = [
  { id: "clay-deep",    label: "Ler & Dyb",     swatch: ["#ede4d0", "#9fb39c", "#8aacae", "#2f4a48"] },
  { id: "sand-water",   label: "Sand & Vand",   swatch: ["#f1ebdd", "#5d7f87", "#2f4148"] },
  { id: "fog-slate",    label: "Tåge & Skifer", swatch: ["#ece4d2", "#b39574", "#8aa3a8", "#3a4f5a"] },
  { id: "stone-moss",   label: "Hvid & Ro",     swatch: ["#ffffff", "#f5f4f1", "#4a6670", "#14171a"] },
  { id: "white-deep",   label: "Hvid & Dyb",    swatch: ["#ffffff", "#9fb39c", "#8aacae", "#2f4a48"] },
  { id: "white-lagoon", label: "Hvid & Lagune", swatch: ["#ffffff", "#eef5f4", "#5fa6a3", "#1d3a3a"] },
  { id: "white-sage",   label: "Hvid & Salvie", swatch: ["#ffffff", "#f3f6f1", "#7e9a78", "#283523"] },
  { id: "white-teal",   label: "Hvid & Hav",    swatch: ["#ffffff", "#eef3f3", "#2f6a68", "#0f2a2b"] },
];

const SIDES = [
  { id: "left",  label: "Venstre" },
  { id: "right", label: "Højre"   },
];

const LOGOS = [
  { id: "bridge-line", label: "Line",        desc: "Bro · piers + vand" },
  { id: "line-flat",   label: "Line · flat", desc: "Bro · jævnt placerede piers, ingen bue" },
  { id: "sallingsund", label: "Sallingsund", desc: "Flad dæk på buer — inspireret af Sallingsundbroen" },
];

function Swatch({ colors, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: "flex",
        alignItems: "stretch",
        padding: 0,
        border: active ? "2px solid #243733" : "1px solid rgba(0,0,0,0.18)",
        outline: active ? "2px solid rgba(192,138,95,.35)" : "none",
        outlineOffset: -4,
        background: "transparent",
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        flex: 1,
        height: 44,
      }}
    >
      {colors.map((c, i) => (
        <span key={i} style={{ background: c, flex: 1, display: "block" }} />
      ))}
    </button>
  );
}

function Seg({ options, value, onChange }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      border: "1px solid rgba(0,0,0,0.18)",
      borderRadius: 6,
      overflow: "hidden",
      background: "#f4ecd8",
    }}>
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding: "9px 10px",
            border: "none",
            background: value === o.id ? "#243733" : "transparent",
            color: value === o.id ? "#f4ecd8" : "#243733",
            fontFamily: "Work Sans, system-ui, sans-serif",
            fontSize: 12,
            letterSpacing: "0.04em",
            cursor: "pointer",
            transition: "background .15s, color .15s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function LogoCard({ id, label, desc, active, onClick }) {
  // mini SVG preview per logo style
  const previews = {
    "bridge-line": (
      <svg viewBox="0 0 240 36" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="4" y1="20" x2="236" y2="20"/>
        <path d="M 78 20 Q 120 0 162 20"/>
        <line x1="78" y1="20" x2="78" y2="30"/>
        <line x1="162" y1="20" x2="162" y2="30"/>
        <line x1="44" y1="20" x2="44" y2="30"/>
        <line x1="196" y1="20" x2="196" y2="30"/>
        <line x1="0" y1="32" x2="240" y2="32" strokeDasharray="1 4" opacity="0.6"/>
      </svg>
    ),
    "line-flat": (
      <svg viewBox="0 0 240 36" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="4" y1="20" x2="236" y2="20"/>
        <line x1="40"  y1="20" x2="40"  y2="30"/>
        <line x1="80"  y1="20" x2="80"  y2="30"/>
        <line x1="120" y1="20" x2="120" y2="30"/>
        <line x1="160" y1="20" x2="160" y2="30"/>
        <line x1="200" y1="20" x2="200" y2="30"/>
        <line x1="0" y1="32" x2="240" y2="32" strokeDasharray="1 4" opacity="0.6"/>
      </svg>
    ),
    "sallingsund": (
      <svg viewBox="0 0 240 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <line x1="0" y1="10" x2="240" y2="10"/>
        <line x1="0" y1="13" x2="240" y2="13"/>
        <path d="M 0 13 Q 20 25 40 13"/>
        <path d="M 40 13 Q 60 25 80 13"/>
        <path d="M 80 13 Q 100 25 120 13"/>
        <path d="M 120 13 Q 140 25 160 13"/>
        <path d="M 160 13 Q 180 25 200 13"/>
        <path d="M 200 13 Q 220 25 240 13"/>
        <line x1="0"   y1="13" x2="0"   y2="27"/>
        <line x1="40"  y1="13" x2="40"  y2="27"/>
        <line x1="80"  y1="13" x2="80"  y2="27"/>
        <line x1="120" y1="13" x2="120" y2="27"/>
        <line x1="160" y1="13" x2="160" y2="27"/>
        <line x1="200" y1="13" x2="200" y2="27"/>
        <line x1="240" y1="13" x2="240" y2="27"/>
        <line x1="0" y1="30" x2="240" y2="30" strokeDasharray="1 4" opacity="0.6"/>
      </svg>
    ),
  };
  return (
    <button
      onClick={onClick}
      title={desc}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 6,
        padding: "12px 10px 10px",
        background: active ? "#f4ecd8" : "transparent",
        border: active ? "1.5px solid #243733" : "1px solid rgba(0,0,0,0.18)",
        borderRadius: 4,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 500,
        fontSize: 13,
        lineHeight: 1,
        color: "#243733",
      }}>Sophie Rantzau</div>
      <div style={{ color: "#c08a5f", display: "block", height: 14 }}>
        {previews[id]}
      </div>
      <div style={{
        fontFamily: "Work Sans, system-ui, sans-serif",
        fontSize: 10,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: active ? "#243733" : "#4e4a3f",
        marginTop: 2,
      }}>{label}</div>
    </button>
  );
}

function TweaksApp() {
  const Panel = window.TweaksPanel;
  const useTweaks = window.useTweaks;
  if (!Panel || !useTweaks) return null;

  const [t, setTweak] = useTweaks(DEFAULTS);

  useEffect(() => {
    const b = document.body;
    b.dataset.palette = t.palette;
    b.dataset.heroSide = t.heroImageSide;
    b.dataset.logo = t.logoStyle;
  }, [t.palette, t.heroImageSide, t.logoStyle]);

  return (
    <Panel title="Tweaks">
      <div style={{ padding: "4px 0", fontFamily: "Work Sans, system-ui, sans-serif" }}>

        <Section title="Palette">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PALETTES.map(p => (
              <Swatch
                key={p.id}
                colors={p.swatch}
                active={t.palette === p.id}
                label={p.label}
                onClick={() => setTweak("palette", p.id)}
              />
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#4e4a3f", letterSpacing: "0.02em" }}>
            {PALETTES.find(p => p.id === t.palette)?.label}
          </div>
        </Section>

        <Section title="Hero — billede side">
          <Seg options={SIDES} value={t.heroImageSide} onChange={(v) => setTweak("heroImageSide", v)} />
        </Section>

        <Section title="Logo · placeholder">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {LOGOS.map(l => (
              <LogoCard
                key={l.id}
                {...l}
                active={t.logoStyle === l.id}
                onClick={() => setTweak("logoStyle", l.id)}
              />
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#4e4a3f" }}>
            {LOGOS.find(l => l.id === t.logoStyle)?.desc}
          </div>
        </Section>

      </div>
    </Panel>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#c08a5f",
        marginBottom: 10,
        fontWeight: 500,
      }}>{title}</div>
      {children}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("tweaks-root"));
root.render(<TweaksApp />);
