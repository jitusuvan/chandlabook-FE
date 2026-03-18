import React, { forwardRef } from "react";

export type TemplateType = "chandlo" | "marriage";
export type TemplateStyle =
  | "floral"
  | "royal"
  | "minimal"
  | "festive"
  | "dark"
  | "pastel";

export interface Section {
  id: string;
  type: "header" | "names" | "datetime" | "venue" | "message" | "footer";
  label: string;
  lines: string[];
  emoji: string;
}

interface Props {
  hostName?: string;
  template: TemplateType;
  templateStyle: TemplateStyle;
  sections: Section[];
  bgColor?: string;
  textColor?: string;
}

export const TEMPLATE_STYLES: Record<
  TemplateStyle,
  { name: string; preview: string; bg: string; textColor: string }
> = {
  floral: {
    name: "🌸 Floral",
    preview: "linear-gradient(135deg,#831843,#be185d,#f43f5e)",
    bg: "linear-gradient(135deg,#831843,#be185d,#f43f5e)",
    textColor: "white",
  },
  royal: {
    name: "👑 Royal",
    preview: "linear-gradient(135deg,#1e1b4b,#3730a3,#fbbf24)",
    bg: "linear-gradient(135deg,#1e1b4b,#3730a3,#fbbf24)",
    textColor: "#fef08a",
  },
  minimal: {
    name: "🤍 Minimal",
    preview: "linear-gradient(135deg,#f5f5f5,#e5e5e5)",
    bg: "#ffffff",
    textColor: "#1a1a1a",
  },
  festive: {
    name: "🎊 Festive",
    preview: "linear-gradient(135deg,#78350f,#d97706,#fbbf24)",
    bg: "linear-gradient(135deg,#78350f,#d97706,#fbbf24)",
    textColor: "white",
  },
  dark: {
    name: "🖤 Dark",
    preview: "linear-gradient(135deg,#0a0a0a,#1a1a2e,#e2c97e)",
    bg: "linear-gradient(135deg,#0a0a0a,#1a1a2e,#e2c97e)",
    textColor: "#e2c97e",
  },
  pastel: {
    name: "🌿 Pastel",
    preview: "linear-gradient(135deg,#ecfdf5,#a7f3d0,#064e3b)",
    bg: "linear-gradient(135deg,#ecfdf5,#a7f3d0,#064e3b)",
    textColor: "#14532d",
  },
};

export const TEMPLATE_DEFAULTS = {
  chandlo: { titleEmoji: "🪔" },
  marriage: { titleEmoji: "💒" },
};

// ── Individual Template Designs ────────────────────────────────────────────

const FloralCard = ({
  sections,
  hostName,
  titleEmoji,
  bgColor,
  textColor,
}: any) => (
  <div
    style={{
      width: 320,
      minHeight: 500,
      background:
        bgColor ||
        "linear-gradient(160deg,#831843 0%,#be185d 50%,#f43f5e 100%)",
      borderRadius: 20,
      color: textColor || "white",
      fontFamily: "'Playfair Display', Georgia, serif",
      boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Floral circles bg */}
    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.07)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -30,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.07)",
        pointerEvents: "none",
      }}
    />
    {/* Petal corners */}
    {[
      { t: 0, l: 0, tr: "none" },
      { t: 0, r: 0, tr: "scaleX(-1)" },
      { b: 0, l: 0, tr: "scaleY(-1)" },
      { b: 0, r: 0, tr: "scale(-1)" },
    ].map((pos, i) => (
      <svg
        key={i}
        width={60}
        height={60}
        viewBox="0 0 60 60"
        style={{
          position: "absolute",
          opacity: 0.3,
          ...pos,
          transform: (pos as any).tr,
        }}
        fill="none"
      >
        <path
          d="M5 5 Q5 30 30 30 Q5 30 5 55"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M5 5 Q30 5 30 30 Q30 5 55 5"
          stroke="white"
          strokeWidth="1.5"
        />
        <circle cx="5" cy="5" r="3" fill="white" />
        <circle cx="30" cy="30" r="2" fill="white" />
      </svg>
    ))}
    <div
      style={{
        position: "absolute",
        inset: 14,
        border: "1.5px solid rgba(255,255,255,0.3)",
        borderRadius: 14,
        pointerEvents: "none",
      }}
    />

    <div style={{ padding: "30px 26px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: 10, opacity: 0.5 }}>
          ✦ ✦ ✦
        </div>
        <div style={{ fontSize: 38, margin: "8px 0" }}>{titleEmoji}</div>
      </div>
      {sections.map((s: Section) => (
        <div key={s.id}>
          <div
            style={{
              textAlign: "center",
              margin: "8px 0",
              opacity: 0.5,
              fontSize: 12,
              letterSpacing: 5,
            }}
          >
            ◆ ◇ ◆
          </div>
          <div
            style={{
              textAlign: "center",
              background:
                s.type === "datetime" || s.type === "venue"
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
              borderRadius: 10,
              padding:
                s.type === "datetime" || s.type === "venue"
                  ? "10px 12px"
                  : "2px 0",
              border:
                s.type === "datetime" || s.type === "venue"
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "none",
            }}
          >
            {s.lines.map((line: string, li: number) => (
              <div
                key={li}
                style={{
                  fontSize:
                    li === 0
                      ? s.type === "header"
                        ? 24
                        : s.type === "names"
                          ? 22
                          : 15
                      : 13,
                  fontWeight: li === 0 ? "700" : "400",
                  fontStyle:
                    s.type === "names" && li === 0 ? "italic" : "normal",
                  lineHeight: 1.5,
                  marginBottom: li < s.lines.length - 1 ? 3 : 0,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.3)",
            margin: "0 30px 8px",
            opacity: 0.5,
          }}
        />
        <div style={{ fontSize: 11, opacity: 0.6, fontStyle: "italic" }}>
          — {hostName} —
        </div>
      </div>
    </div>
  </div>
);

const RoyalCard = ({
  sections,
  hostName,
  titleEmoji,
  bgColor,
  textColor,
}: any) => (
  <div
    style={{
      width: 320,
      minHeight: 500,
      background: bgColor || "linear-gradient(160deg,#0f0c29,#302b63,#24243e)",
      borderRadius: 20,
      color: textColor || "#fef08a",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Gold shimmer lines */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "linear-gradient(90deg,transparent,#fbbf24,transparent)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "linear-gradient(90deg,transparent,#fbbf24,transparent)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 16,
        border: "1px solid rgba(251,191,36,0.4)",
        borderRadius: 12,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 20,
        border: "1px solid rgba(251,191,36,0.15)",
        borderRadius: 10,
        pointerEvents: "none",
      }}
    />
    {/* Crown top */}
    <div
      style={{
        position: "absolute",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 20,
        opacity: 0.4,
      }}
    >
      ♛
    </div>

    <div style={{ padding: "36px 28px 28px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 12,
            opacity: 0.6,
            color: "#fbbf24",
          }}
        >
          ✦ ✦ ✦
        </div>
        <div style={{ fontSize: 36, margin: "8px 0" }}>{titleEmoji}</div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 12,
            opacity: 0.6,
            color: "#fbbf24",
          }}
        >
          ✦ ✦ ✦
        </div>
      </div>
      {sections.map((s: Section) => (
        <div key={s.id}>
          <div
            style={{
              textAlign: "center",
              margin: "10px 0 6px",
              color: "#fbbf24",
              opacity: 0.7,
              fontSize: 14,
            }}
          >
            ❧
          </div>
          <div
            style={{
              textAlign: "center",
              background:
                s.type === "datetime" || s.type === "venue"
                  ? "rgba(251,191,36,0.08)"
                  : "transparent",
              borderRadius: 8,
              padding:
                s.type === "datetime" || s.type === "venue"
                  ? "10px 12px"
                  : "2px 0",
              border:
                s.type === "datetime" || s.type === "venue"
                  ? "1px solid rgba(251,191,36,0.25)"
                  : "none",
            }}
          >
            {s.lines.map((line: string, li: number) => (
              <div
                key={li}
                style={{
                  fontSize:
                    li === 0
                      ? s.type === "header"
                        ? 26
                        : s.type === "names"
                          ? 23
                          : 16
                      : 14,
                  fontWeight: li === 0 ? "600" : "400",
                  fontStyle: s.type === "names" ? "italic" : "normal",
                  lineHeight: 1.6,
                  letterSpacing: s.type === "header" && li === 0 ? 2 : 0,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <div
          style={{
            color: "#fbbf24",
            opacity: 0.5,
            fontSize: 16,
            marginBottom: 6,
          }}
        >
          ❦
        </div>
        <div style={{ fontSize: 11, opacity: 0.55, letterSpacing: 2 }}>
          — {hostName} —
        </div>
      </div>
    </div>
  </div>
);

const MinimalCard = ({
  sections,
  hostName,
  titleEmoji,
  bgColor,
  textColor,
}: any) => (
  <div
    style={{
      width: 320,
      minHeight: 500,
      background: bgColor || "#ffffff",
      borderRadius: 20,
      color: textColor || "#1a1a1a",
      fontFamily: "'Playfair Display', Georgia, serif",
      boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
    }}
  >
    {/* Top color bar */}
    <div
      style={{
        height: 6,
        background: "linear-gradient(90deg,#dc2626,#f97316,#fbbf24)",
        borderRadius: "20px 20px 0 0",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: "18px",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        pointerEvents: "none",
      }}
    />

    <div style={{ padding: "24px 26px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 36, margin: "4px 0" }}>{titleEmoji}</div>
        <div
          style={{
            width: 40,
            height: 2,
            background: "linear-gradient(90deg,#dc2626,#f97316)",
            margin: "8px auto 0",
            borderRadius: 2,
          }}
        />
      </div>
      {sections.map((s: Section) => (
        <div key={s.id}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: "12px 0 6px",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <div
              style={{
                fontSize: 10,
                color: "#9ca3af",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              {s.emoji}
            </div>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>
          <div
            style={{
              textAlign: "center",
              background:
                s.type === "datetime" || s.type === "venue"
                  ? "#f9fafb"
                  : "transparent",
              borderRadius: 8,
              padding:
                s.type === "datetime" || s.type === "venue"
                  ? "10px 12px"
                  : "2px 0",
            }}
          >
            {s.lines.map((line: string, li: number) => (
              <div
                key={li}
                style={{
                  fontSize:
                    li === 0
                      ? s.type === "header"
                        ? 22
                        : s.type === "names"
                          ? 20
                          : 15
                      : 13,
                  fontWeight: li === 0 ? "700" : "400",
                  fontStyle:
                    s.type === "names" && li === 0 ? "italic" : "normal",
                  color:
                    s.type === "header" && li === 0 ? "#dc2626" : "inherit",
                  lineHeight: 1.5,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <div
          style={{
            width: 40,
            height: 2,
            background: "linear-gradient(90deg,#dc2626,#f97316)",
            margin: "0 auto 8px",
            borderRadius: 2,
          }}
        />
        <div style={{ fontSize: 11, color: "#9ca3af", letterSpacing: 1 }}>
          — {hostName} —
        </div>
      </div>
    </div>
  </div>
);

const FestiveCard = ({
  sections,
  hostName,
  titleEmoji,
  bgColor,
  textColor,
}: any) => (
  <div
    style={{
      width: 320,
      minHeight: 500,
      background:
        bgColor || "linear-gradient(160deg,#7c2d12,#c2410c,#ea580c,#f97316)",
      borderRadius: 20,
      color: textColor || "white",
      fontFamily: "'Playfair Display', Georgia, serif",
      boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Diya pattern */}
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        fontSize: 28,
        opacity: 0.12,
        pointerEvents: "none",
      }}
    >
      🪔
    </div>
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        fontSize: 28,
        opacity: 0.12,
        pointerEvents: "none",
      }}
    >
      🪔
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        fontSize: 28,
        opacity: 0.12,
        pointerEvents: "none",
      }}
    >
      🪔
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 10,
        right: 10,
        fontSize: 28,
        opacity: 0.12,
        pointerEvents: "none",
      }}
    >
      🪔
    </div>
    {/* Zigzag top border */}
    <svg
      style={{ position: "absolute", top: 0, left: 0, right: 0, width: "100%" }}
      height="16"
      viewBox="0 0 320 16"
      preserveAspectRatio="none"
    >
      <polyline
        points="0,0 16,16 32,0 48,16 64,0 80,16 96,0 112,16 128,0 144,16 160,0 176,16 192,0 208,16 224,0 240,16 256,0 272,16 288,0 304,16 320,0"
        fill="rgba(255,255,255,0.15)"
      />
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 14,
        border: "1.5px solid rgba(255,255,255,0.25)",
        borderRadius: 14,
        pointerEvents: "none",
      }}
    />

    <div style={{ padding: "32px 26px 28px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: 8, opacity: 0.6 }}>
          🌟 🌟 🌟
        </div>
        <div style={{ fontSize: 40, margin: "6px 0" }}>{titleEmoji}</div>
      </div>
      {sections.map((s: Section) => (
        <div key={s.id}>
          <div
            style={{
              textAlign: "center",
              margin: "8px 0",
              opacity: 0.6,
              fontSize: 13,
            }}
          >
            ~ ✦ ~
          </div>
          <div
            style={{
              textAlign: "center",
              background:
                s.type === "datetime" || s.type === "venue"
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
              borderRadius: 10,
              padding:
                s.type === "datetime" || s.type === "venue"
                  ? "10px 12px"
                  : "2px 0",
              border:
                s.type === "datetime" || s.type === "venue"
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "none",
            }}
          >
            {s.lines.map((line: string, li: number) => (
              <div
                key={li}
                style={{
                  fontSize:
                    li === 0
                      ? s.type === "header"
                        ? 24
                        : s.type === "names"
                          ? 21
                          : 15
                      : 13,
                  fontWeight: li === 0 ? "700" : "400",
                  lineHeight: 1.5,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 4 }}>
          🌟 🌟 🌟
        </div>
        <div style={{ fontSize: 11, opacity: 0.65, fontStyle: "italic" }}>
          — {hostName} —
        </div>
      </div>
    </div>
  </div>
);

const DarkCard = ({
  sections,
  hostName,
  titleEmoji,
  bgColor,
  textColor,
}: any) => (
  <div
    style={{
      width: 320,
      minHeight: 500,
      background: bgColor || "linear-gradient(160deg,#050505,#0f0f1a,#1a1a2e)",
      borderRadius: 20,
      color: textColor || "#e2c97e",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Gold dots pattern */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: 2,
          height: 2,
          borderRadius: "50%",
          background: "#e2c97e",
          opacity: 0.2,
          top: `${10 + i * 8}%`,
          left: `${5 + i * 8}%`,
          pointerEvents: "none",
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        inset: 12,
        border: "1px solid rgba(226,201,126,0.3)",
        borderRadius: 14,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 18,
        border: "1px solid rgba(226,201,126,0.1)",
        borderRadius: 10,
        pointerEvents: "none",
      }}
    />
    {/* Gold top/bottom lines */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "20%",
        right: "20%",
        height: 2,
        background: "linear-gradient(90deg,transparent,#e2c97e,transparent)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "20%",
        right: "20%",
        height: 2,
        background: "linear-gradient(90deg,transparent,#e2c97e,transparent)",
        pointerEvents: "none",
      }}
    />

    <div style={{ padding: "32px 26px 28px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 12,
            opacity: 0.5,
            color: "#e2c97e",
          }}
        >
          ✦ ✦ ✦
        </div>
        <div
          style={{
            fontSize: 36,
            margin: "8px 0",
            filter: "sepia(1) saturate(2)",
          }}
        >
          {titleEmoji}
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 12,
            opacity: 0.5,
            color: "#e2c97e",
          }}
        >
          ✦ ✦ ✦
        </div>
      </div>
      {sections.map((s: Section) => (
        <div key={s.id}>
          <div
            style={{
              textAlign: "center",
              margin: "10px 0 6px",
              color: "#e2c97e",
              opacity: 0.5,
              fontSize: 16,
              letterSpacing: 4,
            }}
          >
            — ✦ —
          </div>
          <div
            style={{
              textAlign: "center",
              background:
                s.type === "datetime" || s.type === "venue"
                  ? "rgba(226,201,126,0.06)"
                  : "transparent",
              borderRadius: 8,
              padding:
                s.type === "datetime" || s.type === "venue"
                  ? "10px 12px"
                  : "2px 0",
              border:
                s.type === "datetime" || s.type === "venue"
                  ? "1px solid rgba(226,201,126,0.2)"
                  : "none",
            }}
          >
            {s.lines.map((line: string, li: number) => (
              <div
                key={li}
                style={{
                  fontSize:
                    li === 0
                      ? s.type === "header"
                        ? 25
                        : s.type === "names"
                          ? 22
                          : 16
                      : 14,
                  fontWeight: li === 0 ? "600" : "400",
                  fontStyle: s.type === "names" ? "italic" : "normal",
                  lineHeight: 1.6,
                  letterSpacing: s.type === "header" && li === 0 ? 3 : 0.5,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <div
          style={{
            color: "#e2c97e",
            opacity: 0.4,
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          ❦
        </div>
        <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>
          — {hostName} —
        </div>
      </div>
    </div>
  </div>
);

const PastelCard = ({
  sections,
  hostName,
  titleEmoji,
  bgColor,
  textColor,
}: any) => (
  <div
    style={{
      width: 320,
      minHeight: 500,
      background: bgColor || "linear-gradient(160deg,#f0fdf4,#dcfce7,#bbf7d0)",
      borderRadius: 20,
      color: textColor || "#14532d",
      fontFamily: "'Playfair Display', Georgia, serif",
      boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #bbf7d0",
    }}
  >
    {/* Leaf corners */}
    {[
      { top: 0, left: 0 },
      { top: 0, right: 0, transform: "scaleX(-1)" },
      { bottom: 0, left: 0, transform: "scaleY(-1)" },
      { bottom: 0, right: 0, transform: "scale(-1)" },
    ].map((pos, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          fontSize: 28,
          opacity: 0.15,
          pointerEvents: "none",
          ...pos,
        }}
      >
        🌿
      </div>
    ))}
    <div
      style={{
        position: "absolute",
        inset: 14,
        border: "1px solid rgba(20,83,45,0.15)",
        borderRadius: 14,
        pointerEvents: "none",
      }}
    />

    <div style={{ padding: "28px 26px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 8,
            opacity: 0.4,
            color: "#16a34a",
          }}
        >
          ✿ ✿ ✿
        </div>
        <div style={{ fontSize: 36, margin: "6px 0" }}>{titleEmoji}</div>
      </div>
      {sections.map((s: Section) => (
        <div key={s.id}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              margin: "10px 0 6px",
            }}
          >
            <div
              style={{ flex: 1, height: 1, background: "rgba(20,83,45,0.15)" }}
            />
            <div style={{ fontSize: 12, color: "#16a34a", opacity: 0.6 }}>
              ✿
            </div>
            <div
              style={{ flex: 1, height: 1, background: "rgba(20,83,45,0.15)" }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              background:
                s.type === "datetime" || s.type === "venue"
                  ? "rgba(20,83,45,0.06)"
                  : "transparent",
              borderRadius: 10,
              padding:
                s.type === "datetime" || s.type === "venue"
                  ? "10px 12px"
                  : "2px 0",
              border:
                s.type === "datetime" || s.type === "venue"
                  ? "1px solid rgba(20,83,45,0.12)"
                  : "none",
            }}
          >
            {s.lines.map((line: string, li: number) => (
              <div
                key={li}
                style={{
                  fontSize:
                    li === 0
                      ? s.type === "header"
                        ? 22
                        : s.type === "names"
                          ? 20
                          : 15
                      : 13,
                  fontWeight: li === 0 ? "700" : "400",
                  fontStyle:
                    s.type === "names" && li === 0 ? "italic" : "normal",
                  color:
                    s.type === "header" && li === 0 ? "#15803d" : "inherit",
                  lineHeight: 1.5,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <div
          style={{
            fontSize: 12,
            color: "#16a34a",
            opacity: 0.4,
            marginBottom: 4,
          }}
        >
          ✿ ✿ ✿
        </div>
        <div style={{ fontSize: 11, opacity: 0.5, fontStyle: "italic" }}>
          — {hostName} —
        </div>
      </div>
    </div>
  </div>
);

// ── Main Card Switcher ─────────────────────────────────────────────────────
const InvitationCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      hostName = "Your Family",
      template,
      templateStyle,
      sections,
      bgColor,
      textColor,
    },
    ref,
  ) => {
    const titleEmoji = TEMPLATE_DEFAULTS[template].titleEmoji;
    const props = { sections, hostName, titleEmoji, bgColor, textColor };

    const CardMap: Record<TemplateStyle, React.ReactElement> = {
      floral: <FloralCard {...props} />,
      royal: <RoyalCard {...props} />,
      minimal: <MinimalCard {...props} />,
      festive: <FestiveCard {...props} />,
      dark: <DarkCard {...props} />,
      pastel: <PastelCard {...props} />,
    };

    return <div ref={ref}>{CardMap[templateStyle]}</div>;
  },
);

InvitationCard.displayName = "InvitationCard";
export default InvitationCard;
