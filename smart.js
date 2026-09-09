import { useState, useEffect, useCallback } from "react";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────

const BINS = [
  {
    id: "B001",
    zone: "Sector 12A",
    type: "biodegradable",
    lat: 28.61,
    lng: 77.21,
    level: 85,
    lastUpdated: "2 min ago",
    address: "Main Market Road",
  },
  {
    id: "B002",
    zone: "Sector 7B",
    type: "recyclable",
    lat: 28.62,
    lng: 77.22,
    level: 45,
    lastUpdated: "5 min ago",
    address: "Green Park Ave",
  },
  {
    id: "B003",
    zone: "Sector 3C",
    type: "biodegradable",
    lat: 28.6,
    lng: 77.2,
    level: 20,
    lastUpdated: "1 min ago",
    address: "Station Road",
  },
  {
    id: "B004",
    zone: "Sector 9D",
    type: "recyclable",
    lat: 28.63,
    lng: 77.23,
    level: 95,
    lastUpdated: "Just now",
    address: "City Center Mall",
  },
  {
    id: "B005",
    zone: "Sector 5E",
    type: "biodegradable",
    lat: 28.59,
    lng: 77.19,
    level: 60,
    lastUpdated: "8 min ago",
    address: "Residential Block E",
  },
  {
    id: "B006",
    zone: "Sector 14F",
    type: "recyclable",
    lat: 28.64,
    lng: 77.24,
    level: 10,
    lastUpdated: "3 min ago",
    address: "Tech Park Gate",
  },
];

const TRUCKS = [
  {
    id: "TRK-01",
    driver: "Ramesh Kumar",
    route: ["B004", "B001", "B005"],
    status: "en-route",
    eta: "12 min",
    zone: "North Cluster",
  },
  {
    id: "TRK-02",
    driver: "Suresh Patel",
    route: ["B002", "B006"],
    status: "idle",
    eta: "—",
    zone: "South Cluster",
  },
  {
    id: "TRK-03",
    driver: "Priya Singh",
    route: ["B003"],
    status: "collecting",
    eta: "5 min",
    zone: "Central",
  },
];

const CITIZENS = [
  {
    id: 1,
    name: "Anjali Mehta",
    points: 1240,
    rank: 1,
    reports: 18,
    badge: "🌟 Eco Champion",
  },
  {
    id: 2,
    name: "Vikram Nair",
    points: 980,
    rank: 2,
    reports: 14,
    badge: "♻️ Green Hero",
  },
  {
    id: 3,
    name: "Deepa Iyer",
    points: 760,
    rank: 3,
    reports: 11,
    badge: "🌿 Eco Warrior",
  },
  {
    id: 4,
    name: "Arjun Sharma",
    points: 540,
    rank: 4,
    reports: 8,
    badge: "🌱 Eco Starter",
  },
  {
    id: 5,
    name: "Neha Gupta",
    points: 320,
    rank: 5,
    reports: 5,
    badge: "🌱 Eco Starter",
  },
];

const REWARDS = [
  {
    id: 1,
    title: "Metro Card Top-up",
    points: 500,
    discount: "₹50 off",
    icon: "🚇",
  },
  {
    id: 2,
    title: "Grocery Voucher",
    points: 800,
    discount: "₹100 off",
    icon: "🛒",
  },
  {
    id: 3,
    title: "Electric Bill Rebate",
    points: 1200,
    discount: "₹150 off",
    icon: "⚡",
  },
  {
    id: 4,
    title: "Green Restaurant Meal",
    points: 300,
    discount: "20% off",
    icon: "🍃",
  },
];

const ALERTS = [
  {
    id: 1,
    time: "10:42 AM",
    msg: "BIN B004 reached 95% capacity — TRK-01 dispatched",
    type: "critical",
  },
  {
    id: 2,
    time: "10:38 AM",
    msg: "BIN B001 at 85% — scheduled for next pickup",
    type: "warning",
  },
  {
    id: 3,
    time: "10:30 AM",
    msg: "Route optimized for TRK-01 (saved 3.2km)",
    type: "success",
  },
  {
    id: 4,
    time: "10:15 AM",
    msg: "Hotspot report received: Old Bus Stand",
    type: "info",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const getBinColor = (level) => {
  if (level >= 80)
    return { bg: "#FF4757", text: "Full", glow: "0 0 12px #FF475780" };
  if (level >= 40)
    return { bg: "#FFA502", text: "Half", glow: "0 0 12px #FFA50280" };
  return { bg: "#2ED573", text: "Empty", glow: "0 0 12px #2ED57380" };
};

const getTruckStatusColor = (status) => {
  if (status === "en-route") return "#FFA502";
  if (status === "collecting") return "#2ED573";
  return "#748CAB";
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("citizen");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (!user || !pass) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onLogin(role, user);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0A1628 0%, #0D2137 50%, #0A1628 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(46,213,115,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(46,213,115,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: [300, 200, 150][i],
            height: [300, 200, 150][i],
            borderRadius: "50%",
            background: [
              "radial-gradient(circle, rgba(46,213,115,0.08), transparent)",
              "radial-gradient(circle, rgba(255,165,2,0.06), transparent)",
              "radial-gradient(circle, rgba(52,152,219,0.07), transparent)",
            ][i],
            top: ["10%", "60%", "30%"][i],
            left: ["70%", "10%", "50%"][i],
            animation: `pulse ${[4, 5, 3.5][i]}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "48px 44px",
          width: 420,
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, #2ED573, #00B894)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              boxShadow: "0 8px 24px rgba(46,213,115,0.3)",
            }}
          >
            ♻️
          </div>
          <h1
            style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}
          >
            SmartWaste
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            Intelligent Waste Management System
          </p>
        </div>

        {/* Role Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
          }}
        >
          {["citizen", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: 9,
                cursor: "pointer",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                textTransform: "capitalize",
                background:
                  role === r
                    ? "linear-gradient(135deg, #2ED573, #00B894)"
                    : "transparent",
                color: role === r ? "#0A1628" : "rgba(255,255,255,0.4)",
                transition: "all 0.25s",
              }}
            >
              {r === "citizen" ? "👤 Citizen" : "🛡️ Admin"}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div
          style={{
            transform: shake ? "translateX(-8px)" : "none",
            transition: "transform 0.1s",
          }}
        >
          {[
            {
              label: "Username",
              value: user,
              set: setUser,
              placeholder:
                role === "admin" ? "admin@smartwaste" : "citizen@city",
            },
            {
              label: "Password",
              value: pass,
              set: setPass,
              placeholder: "••••••••",
              type: "password",
            },
          ].map(({ label, value, set, placeholder, type }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                {label.toUpperCase()}
              </label>
              <input
                type={type || "text"}
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "'Sora', sans-serif",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: 8,
            background: "linear-gradient(135deg, #2ED573, #00B894)",
            border: "none",
            borderRadius: 12,
            color: "#0A1628",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Sora', sans-serif",
            boxShadow: "0 8px 24px rgba(46,213,115,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 32px rgba(46,213,115,0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "none";
            e.target.style.boxShadow = "0 8px 24px rgba(46,213,115,0.3)";
          }}
        >
          Login as {role === "admin" ? "Administrator" : "Citizen"} →
        </button>

        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: 12,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Demo: any username + password
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.1);opacity:1} }
        input::placeholder{color:rgba(255,255,255,0.2)}
        input:focus{border-color:rgba(46,213,115,0.5)!important;box-shadow:0 0 0 3px rgba(46,213,115,0.1)}
      `}</style>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ role, page, setPage, onLogout, userName }) {
  const citizenNav = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "report", label: "Report Hotspot", icon: "📍" },
    { id: "rewards", label: "My Rewards", icon: "🎁" },
  ];
  const adminNav = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "bins", label: "Bin Monitor", icon: "🗑️" },
    { id: "routes", label: "Route Optimizer", icon: "🗺️" },
    { id: "alerts", label: "Alerts & Logs", icon: "🔔" },
  ];
  const nav = role === "admin" ? adminNav : citizenNav;

  return (
    <div
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#0A1628",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Sora', sans-serif",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #2ED573, #00B894)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ♻️
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              SmartWaste
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
              {role === "admin" ? "Admin Portal" : "Citizen Portal"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 12px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              marginBottom: 4,
              background:
                page === item.id ? "rgba(46,213,115,0.12)" : "transparent",
              color: page === item.id ? "#2ED573" : "rgba(255,255,255,0.45)",
              fontFamily: "'Sora', sans-serif",
              fontWeight: page === item.id ? 600 : 400,
              fontSize: 14,
              textAlign: "left",
              transition: "all 0.2s",
              borderLeft:
                page === item.id
                  ? "3px solid #2ED573"
                  : "3px solid transparent",
            }}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
            marginBottom: 4,
          }}
        >
          Logged in as
        </div>
        <div
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {userName}
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "8px",
            background: "rgba(255,71,87,0.1)",
            border: "1px solid rgba(255,71,87,0.2)",
            borderRadius: 8,
            color: "#FF4757",
            fontFamily: "'Sora', sans-serif",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Logout
        </button>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px 22px",
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 12,
          marginBottom: 4,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        {label.toUpperCase()}
      </div>
      <div
        style={{
          color: accent || "#fff",
          fontSize: 28,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── BIN CARD ─────────────────────────────────────────────────────────────────

function BinCard({ bin, onAlert }) {
  const { bg, text, glow } = getBinColor(bin.level);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${bin.level >= 80 ? "rgba(255,71,87,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: "20px",
        cursor: "default",
        transition: "all 0.2s",
        boxShadow: bin.level >= 80 ? "0 0 20px rgba(255,71,87,0.1)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            {bin.id}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            {bin.address}
          </div>
        </div>
        <span
          style={{
            background:
              bin.type === "biodegradable"
                ? "rgba(46,213,115,0.15)"
                : "rgba(52,152,219,0.15)",
            color: bin.type === "biodegradable" ? "#2ED573" : "#3498DB",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 6,
          }}
        >
          {bin.type === "biodegradable" ? "🌱 BIO" : "♻️ REC"}
        </span>
      </div>

      {/* Level bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            Fill Level
          </span>
          <span style={{ color: bg, fontWeight: 700, fontSize: 13 }}>
            {bin.level}%
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${bin.level}%`,
              background: bg,
              borderRadius: 4,
              transition: "width 0.5s ease",
              boxShadow: glow,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: `${bg}20`,
            border: `1px solid ${bg}40`,
            padding: "4px 10px",
            borderRadius: 6,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: bg,
              boxShadow: glow,
            }}
          />
          <span style={{ color: bg, fontSize: 12, fontWeight: 600 }}>
            {text}
          </span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>
          ↻ {bin.lastUpdated}
        </span>
      </div>

      {bin.level >= 80 && (
        <button
          onClick={() => onAlert(bin)}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "8px",
            background: "rgba(255,71,87,0.15)",
            border: "1px solid rgba(255,71,87,0.3)",
            borderRadius: 8,
            color: "#FF4757",
            fontFamily: "'Sora', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🚨 Dispatch Truck
        </button>
      )}
    </div>
  );
}

// ─── SIMULATED MAP ────────────────────────────────────────────────────────────

function SimMap({ bins, activeAlert }) {
  const positions = [
    { x: 60, y: 35 },
    { x: 75, y: 55 },
    { x: 30, y: 65 },
    { x: 85, y: 25 },
    { x: 20, y: 40 },
    { x: 90, y: 70 },
  ];

  return (
    <div
      style={{
        background: "#0D1F35",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        position: "relative",
        height: 320,
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Road lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <line
          x1="10%"
          y1="50%"
          x2="90%"
          y2="50%"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
          strokeDasharray="8,8"
        />
        <line
          x1="50%"
          y1="10%"
          x2="50%"
          y2="90%"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
          strokeDasharray="8,8"
        />
        <path
          d="M 15% 70% Q 50% 30% 85% 60%"
          stroke="rgba(255,165,2,0.25)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="6,6"
        />
        {activeAlert && (
          <path
            d="M 85% 25% Q 60% 40% 20% 40%"
            stroke="#FF4757"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6,6"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
        )}
      </svg>

      {/* Bins */}
      {bins.map((bin, i) => {
        const { bg, glow } = getBinColor(bin.level);
        const pos = positions[i];
        return (
          <div
            key={bin.id}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%,-50%)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `${bg}20`,
                border: `2px solid ${bg}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: bin.level >= 80 ? `0 0 20px ${bg}` : glow,
                animation:
                  bin.level >= 80
                    ? "pingBin 1.5s ease-in-out infinite"
                    : "none",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 14 }}>
                {bin.type === "biodegradable" ? "🌱" : "♻️"}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                top: -20,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#0A1628",
                color: "#fff",
                fontSize: 9,
                padding: "2px 5px",
                borderRadius: 4,
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
            >
              {bin.id}
            </div>
          </div>
        );
      })}

      {/* Truck marker */}
      <div
        style={{
          position: "absolute",
          left: "45%",
          top: "72%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "#FFA502",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            boxShadow: "0 0 12px rgba(255,165,2,0.5)",
          }}
        >
          🚛
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          display: "flex",
          gap: 12,
        }}
      >
        {[
          { c: "#2ED573", l: "Empty" },
          { c: "#FFA502", l: "Half" },
          { c: "#FF4757", l: "Full" },
        ].map(({ c, l }) => (
          <div
            key={l}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: c,
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
              {l}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "rgba(255,255,255,0.06)",
          padding: "4px 10px",
          borderRadius: 8,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
          📍 City Zone — Live
        </span>
      </div>

      <style>{`@keyframes pingBin { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.2)} }`}</style>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function Dashboard({ role, bins, trucks, alerts, onAlert }) {
  const fullBins = bins.filter((b) => b.level >= 80).length;
  const halfBins = bins.filter((b) => b.level >= 40 && b.level < 80).length;
  const emptyBins = bins.filter((b) => b.level < 40).length;

  return (
    <div style={{ padding: "32px", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
          Overview Dashboard
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            margin: "4px 0 0",
            fontSize: 13,
          }}
        >
          Real-time waste management status
        </p>
      </div>

      {/* Stats */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}
      >
        <StatCard
          icon="🗑️"
          label="Total Bins"
          value={bins.length}
          sub="Active IoT sensors"
        />
        <StatCard
          icon="🔴"
          label="Full Bins"
          value={fullBins}
          sub="Needs collection"
          accent="#FF4757"
        />
        <StatCard
          icon="🟠"
          label="Half Bins"
          value={halfBins}
          sub="Monitor closely"
          accent="#FFA502"
        />
        <StatCard
          icon="🟢"
          label="Empty Bins"
          value={emptyBins}
          sub="OK"
          accent="#2ED573"
        />
        <StatCard
          icon="🚛"
          label="Trucks Active"
          value={trucks.filter((t) => t.status !== "idle").length}
          sub={`of ${trucks.length} total`}
          accent="#3498DB"
        />
      </div>

      {/* Map + Recent Alerts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            LIVE MAP VIEW
          </div>
          <SimMap bins={bins} activeAlert={fullBins > 0} />
        </div>
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            RECENT ALERTS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map((a) => {
              const colors = {
                critical: "#FF4757",
                warning: "#FFA502",
                success: "#2ED573",
                info: "#3498DB",
              };
              return (
                <div
                  key={a.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${colors[a.type]}30`,
                    borderLeft: `3px solid ${colors[a.type]}`,
                    borderRadius: "0 10px 10px 0",
                    padding: "10px 14px",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 10,
                      marginBottom: 3,
                    }}
                  >
                    {a.time}
                  </div>
                  <div
                    style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}
                  >
                    {a.msg}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bin Grid (preview) */}
      <div>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
            letterSpacing: 1,
          }}
        >
          BIN STATUS OVERVIEW
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {bins.map((bin) => (
            <BinCard key={bin.id} bin={bin} onAlert={onAlert} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BIN MONITOR (ADMIN) ──────────────────────────────────────────────────────

function BinMonitor({ bins, trucks, onAlert }) {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all" ? bins : bins.filter((b) => b.type === filter);

  return (
    <div style={{ padding: "32px", fontFamily: "'Sora', sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <h2
            style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}
          >
            Bin Monitor
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              margin: "4px 0 0",
              fontSize: 13,
            }}
          >
            IoT-enabled bin tracking across all zones
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "biodegradable", "recyclable"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: filter === f ? "#2ED573" : "rgba(255,255,255,0.1)",
                background:
                  filter === f ? "rgba(46,213,115,0.1)" : "transparent",
                color: filter === f ? "#2ED573" : "rgba(255,255,255,0.4)",
                fontFamily: "'Sora', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {filtered.map((bin) => (
          <BinCard key={bin.id} bin={bin} onAlert={onAlert} />
        ))}
      </div>

      {/* Truck Status */}
      <div>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 14,
            letterSpacing: 1,
          }}
        >
          TRUCK FLEET STATUS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {trucks.map((truck) => (
            <div
              key={truck.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div style={{ fontSize: 28 }}>🚛</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                  {truck.id}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  {truck.driver} · {truck.zone}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                  Route
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {truck.route.join(" → ")}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                  ETA
                </div>
                <div style={{ color: "#FFA502", fontWeight: 700 }}>
                  {truck.eta}
                </div>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: `${getTruckStatusColor(truck.status)}20`,
                  border: `1px solid ${getTruckStatusColor(truck.status)}40`,
                  color: getTruckStatusColor(truck.status),
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {truck.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROUTE OPTIMIZER (ADMIN) ──────────────────────────────────────────────────

function RouteOptimizer({ bins, trucks }) {
  const [optimized, setOptimized] = useState(false);
  const [loading, setLoading] = useState(false);

  const optimize = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOptimized(true);
    }, 2000);
  };

  const urgentBins = bins.filter((b) => b.level >= 80);
  const normalBins = bins.filter((b) => b.level >= 40 && b.level < 80);
  const savings = optimized ? { km: 4.7, time: "18 min", fuel: "2.1L" } : null;

  return (
    <div style={{ padding: "32px", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
          Route Optimizer
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            margin: "4px 0 0",
            fontSize: 13,
          }}
        >
          AI-assisted collection route planning
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Priority Queue */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
              letterSpacing: 1,
            }}
          >
            COLLECTION PRIORITY QUEUE
          </div>
          {urgentBins.map((b, i) => (
            <div
              key={b.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
                background: "rgba(255,71,87,0.08)",
                border: "1px solid rgba(255,71,87,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#FF4757",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>
                  {b.id} — {b.zone}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                  {b.address}
                </div>
              </div>
              <span style={{ color: "#FF4757", fontWeight: 700, fontSize: 13 }}>
                {b.level}%
              </span>
            </div>
          ))}
          {normalBins.map((b, i) => (
            <div
              key={b.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
                background: "rgba(255,165,2,0.05)",
                border: "1px solid rgba(255,165,2,0.15)",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#FFA502",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0A1628",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {urgentBins.length + i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>
                  {b.id} — {b.zone}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                  {b.address}
                </div>
              </div>
              <span style={{ color: "#FFA502", fontWeight: 700, fontSize: 13 }}>
                {b.level}%
              </span>
            </div>
          ))}
        </div>

        {/* AI Panel */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
              letterSpacing: 1,
            }}
          >
            AI ROUTE ANALYSIS
          </div>

          {!optimized ? (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                Run the optimizer to generate the most efficient collection
                routes based on bin fill levels, traffic data, and truck
                availability.
              </p>
              <button
                onClick={optimize}
                disabled={loading}
                style={{
                  padding: "14px 32px",
                  background: loading
                    ? "rgba(46,213,115,0.3)"
                    : "linear-gradient(135deg, #2ED573, #00B894)",
                  border: "none",
                  borderRadius: 12,
                  color: loading ? "rgba(255,255,255,0.6)" : "#0A1628",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading ? "⚙️ Optimizing..." : "⚡ Run AI Optimizer"}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {[
                  { l: "Distance Saved", v: `${savings.km} km` },
                  { l: "Time Saved", v: savings.time },
                  { l: "Fuel Saved", v: savings.fuel },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      flex: 1,
                      background: "rgba(46,213,115,0.08)",
                      border: "1px solid rgba(46,213,115,0.2)",
                      borderRadius: 10,
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#2ED573",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      {s.v}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: 10,
                        marginTop: 3,
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
              {trucks.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    marginBottom: 12,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}
                    >
                      🚛 {t.id}
                    </span>
                    <span
                      style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    >
                      {t.driver}
                    </span>
                  </div>
                  <div
                    style={{ color: "#2ED573", fontSize: 13, fontWeight: 600 }}
                  >
                    {["Depot", ...t.route, "Depot"].join(" → ")}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setOptimized(false)}
                style={{
                  marginTop: 8,
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                ↺ Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <SimMap bins={bins} activeAlert={optimized} />
    </div>
  );
}

// ─── ALERTS PAGE (ADMIN) ──────────────────────────────────────────────────────

function AlertsPage({ alerts }) {
  const types = {
    critical: { c: "#FF4757", l: "CRITICAL" },
    warning: { c: "#FFA502", l: "WARNING" },
    success: { c: "#2ED573", l: "SUCCESS" },
    info: { c: "#3498DB", l: "INFO" },
  };
  return (
    <div style={{ padding: "32px", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
          Alerts & Logs
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            margin: "4px 0 0",
            fontSize: 13,
          }}
        >
          System activity and notifications
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {alerts.map((a) => {
          const t = types[a.type];
          return (
            <div
              key={a.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${t.c}20`,
                borderLeft: `4px solid ${t.c}`,
                borderRadius: "0 14px 14px 0",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  background: `${t.c}20`,
                  color: t.c,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: 6,
                  letterSpacing: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.l}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 14,
                  flex: 1,
                }}
              >
                {a.msg}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                {a.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REPORT HOTSPOT (CITIZEN) ─────────────────────────────────────────────────

function ReportHotspot({ onSubmit }) {
  const [form, setForm] = useState({
    location: "",
    description: "",
    type: "mixed",
    photo: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.location || !form.description) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ location: "", description: "", type: "mixed", photo: null });
      onSubmit();
    }, 3000);
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "32px",
          fontFamily: "'Sora', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 64,
              marginBottom: 20,
              animation: "bounce 0.5s ease",
            }}
          >
            ✅
          </div>
          <h3 style={{ color: "#2ED573", fontSize: 22, margin: "0 0 8px" }}>
            Report Submitted!
          </h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            +50 reward points added to your account
          </p>
        </div>
        <style>{`@keyframes bounce{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "'Sora', sans-serif",
        maxWidth: 600,
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
          Report Waste Hotspot
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            margin: "4px 0 0",
            fontSize: 13,
          }}
        >
          Help keep your city clean and earn reward points
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20,
          padding: 28,
        }}
      >
        {[
          {
            label: "Location / Address *",
            key: "location",
            placeholder: "e.g. Near Old Bus Stand, Sector 5",
          },
          {
            label: "Description *",
            key: "description",
            placeholder: "Describe the waste situation...",
            multiline: true,
          },
        ].map(({ label, key, placeholder, multiline }) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <label
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                fontWeight: 600,
                display: "block",
                marginBottom: 8,
                letterSpacing: 1,
              }}
            >
              {label.toUpperCase()}
            </label>
            {multiline ? (
              <textarea
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "'Sora', sans-serif",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            ) : (
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "'Sora', sans-serif",
                  outline: "none",
                }}
              />
            )}
          </div>
        ))}

        {/* Type */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              display: "block",
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            WASTE TYPE
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {["mixed", "biodegradable", "recyclable", "hazardous"].map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor:
                    form.type === t ? "#2ED573" : "rgba(255,255,255,0.1)",
                  background:
                    form.type === t ? "rgba(46,213,115,0.1)" : "transparent",
                  color: form.type === t ? "#2ED573" : "rgba(255,255,255,0.4)",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 12,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              display: "block",
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            PHOTO (OPTIONAL)
          </label>
          <div
            style={{
              border: "2px dashed rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "24px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("photoInput").click()}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              {form.photo ? `✅ ${form.photo.name}` : "Click to upload photo"}
            </div>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: "rgba(46,213,115,0.08)",
            border: "1px solid rgba(46,213,115,0.2)",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 20 }}>🎁</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            You'll earn{" "}
            <strong style={{ color: "#2ED573" }}>+50 reward points</strong> for
            submitting a verified report
          </span>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #2ED573, #00B894)",
            border: "none",
            borderRadius: 12,
            color: "#0A1628",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Submit Report →
        </button>
      </div>
    </div>
  );
}

// ─── REWARDS (CITIZEN) ────────────────────────────────────────────────────────

function RewardsPage({ citizenPoints }) {
  return (
    <div style={{ padding: "32px", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
          My Rewards
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            margin: "4px 0 0",
            fontSize: 13,
          }}
        >
          Earn points by contributing to a cleaner city
        </p>
      </div>

      {/* Points card */}
      <div
        style={{
          background: "linear-gradient(135deg, #0D3B2B, #0A2E20)",
          border: "1px solid rgba(46,213,115,0.3)",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(46,213,115,0.08)",
          }}
        />
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            marginBottom: 8,
          }}
        >
          Your Balance
        </div>
        <div
          style={{
            color: "#2ED573",
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {citizenPoints.toLocaleString()}
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Eco Points
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {[
            { l: "Reports Filed", v: "12" },
            { l: "Points Redeemed", v: "300" },
            { l: "Rank", v: "#3" },
          ].map(({ l, v }) => (
            <div key={l}>
              <div style={{ color: "#2ED573", fontWeight: 700, fontSize: 18 }}>
                {v}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Rewards */}
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
              letterSpacing: 1,
            }}
          >
            AVAILABLE REWARDS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {REWARDS.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ fontSize: 28 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                    {r.title}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                    {r.points} points
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#2ED573", fontWeight: 700 }}>
                    {r.discount}
                  </div>
                  <button
                    style={{
                      marginTop: 6,
                      padding: "5px 12px",
                      background:
                        citizenPoints >= r.points
                          ? "rgba(46,213,115,0.15)"
                          : "rgba(255,255,255,0.05)",
                      border: `1px solid ${citizenPoints >= r.points ? "rgba(46,213,115,0.3)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 6,
                      color:
                        citizenPoints >= r.points
                          ? "#2ED573"
                          : "rgba(255,255,255,0.2)",
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: citizenPoints >= r.points ? "pointer" : "default",
                    }}
                  >
                    {citizenPoints >= r.points ? "Redeem" : "Locked"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
              letterSpacing: 1,
            }}
          >
            LEADERBOARD
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CITIZENS.map((c, i) => (
              <div
                key={c.id}
                style={{
                  background:
                    i < 3 ? "rgba(255,215,0,0.04)" : "rgba(255,255,255,0.03)",
                  border:
                    i === 0
                      ? "1px solid rgba(255,215,0,0.2)"
                      : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background:
                      ["#FFD700", "#C0C0C0", "#CD7F32"][i] ||
                      "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: i < 3 ? "#0A1628" : "rgba(255,255,255,0.5)",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {c.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>
                    {c.name}
                  </div>
                  <div
                    style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}
                  >
                    {c.badge}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#2ED573", fontWeight: 700 }}>
                    {c.points.toLocaleString()}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                    {c.reports} reports
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ALERT MODAL ──────────────────────────────────────────────────────────────

function AlertModal({ bin, onClose, onDispatch }) {
  if (!bin) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <div
        style={{
          background: "#0D1F35",
          border: "1px solid rgba(255,71,87,0.4)",
          borderRadius: 20,
          padding: 32,
          maxWidth: 420,
          width: "90%",
          boxShadow: "0 0 60px rgba(255,71,87,0.2)",
        }}
      >
        <div style={{ fontSize: 40, textAlign: "center", marginBottom: 16 }}>
          🚨
        </div>
        <h3
          style={{
            color: "#FF4757",
            fontSize: 20,
            textAlign: "center",
            margin: "0 0 8px",
          }}
        >
          Bin Full Alert!
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Bin <strong style={{ color: "#fff" }}>{bin.id}</strong> at{" "}
          {bin.address} has reached{" "}
          <strong style={{ color: "#FF4757" }}>{bin.level}%</strong> capacity
        </p>
        <div
          style={{
            background: "rgba(255,71,87,0.08)",
            border: "1px solid rgba(255,71,87,0.2)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            RECOMMENDED ACTION
          </div>
          <div style={{ color: "#fff", fontSize: 14 }}>
            Dispatch TRK-01 — estimated arrival:{" "}
            <strong style={{ color: "#FFA502" }}>12 minutes</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDispatch(bin);
              onClose();
            }}
            style={{
              flex: 2,
              padding: "12px",
              background: "linear-gradient(135deg, #FF4757, #C0392B)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🚛 Dispatch Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LIVE TOAST ───────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2000,
        background: "#0D2137",
        border: "1px solid rgba(46,213,115,0.3)",
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        maxWidth: 360,
        fontFamily: "'Sora', sans-serif",
        animation: "slideIn 0.3s ease",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 22 }}>✅</span>
        <div>
          <div
            style={{
              color: "#2ED573",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 3,
            }}
          >
            Action Completed
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            {msg}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.3)",
            cursor: "pointer",
            fontSize: 16,
            padding: 0,
          }}
        >
          ✕
        </button>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
}

// ─── LIVE SIMULATION BANNER ───────────────────────────────────────────────────

function SimBanner({ onTrigger }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, rgba(255,71,87,0.1), rgba(255,165,2,0.1))",
        border: "1px solid rgba(255,71,87,0.2)",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#FF4757",
            animation: "blink 1s ease infinite",
          }}
        />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          Live Simulation Mode Active — IoT data updating in real-time
        </span>
      </div>
      <button
        onClick={onTrigger}
        style={{
          padding: "7px 18px",
          background: "rgba(255,71,87,0.15)",
          border: "1px solid rgba(255,71,87,0.3)",
          borderRadius: 8,
          color: "#FF4757",
          fontFamily: "'Sora', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        🔴 Trigger Bin Full Alert
      </button>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [auth, setAuth] = useState(null); // { role, name }
  const [page, setPage] = useState("dashboard");
  const [bins, setBins] = useState(BINS);
  const [alerts, setAlerts] = useState(ALERTS);
  const [alertBin, setAlertBin] = useState(null);
  const [toast, setToast] = useState(null);
  const [citizenPoints, setCitizenPoints] = useState(760);

  // Simulate real-time updates
  useEffect(() => {
    if (!auth) return;
    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((b) => ({
          ...b,
          level: Math.min(
            100,
            Math.max(
              5,
              b.level +
                (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
            ),
          ),
          lastUpdated: "Just now",
        })),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [auth]);

  const handleLogin = (role, name) => {
    setAuth({ role, name });
    setPage("dashboard");
  };

  const handleLogout = () => {
    setAuth(null);
    setPage("dashboard");
  };

  const handleBinAlert = (bin) => setAlertBin(bin);

  const handleDispatch = (bin) => {
    setToast(
      `TRK-01 dispatched to ${bin.id} (${bin.address}). ETA: 12 minutes.`,
    );
    setAlerts((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        msg: `TRK-01 dispatched to ${bin.id} — route updated`,
        type: "critical",
      },
      ...prev,
    ]);
    setBins((prev) =>
      prev.map((b) =>
        b.id === bin.id ? { ...b, level: 30, lastUpdated: "Just now" } : b,
      ),
    );
  };

  const handleTriggerSim = () => {
    const randomBin = {
      ...bins[Math.floor(Math.random() * bins.length)],
      level: 98,
    };
    setBins((prev) =>
      prev.map((b) =>
        b.id === randomBin.id
          ? { ...b, level: 98, lastUpdated: "Just now" }
          : b,
      ),
    );
    setAlertBin(randomBin);
    setAlerts((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        msg: `CRITICAL: ${randomBin.id} at ${randomBin.address} reached 98% capacity!`,
        type: "critical",
      },
      ...prev,
    ]);
  };

  const handleReportSubmit = () => {
    setCitizenPoints((p) => p + 50);
    setToast("Hotspot reported! +50 points added to your account.");
  };

  if (!auth) return <LoginPage onLogin={handleLogin} />;

  const renderPage = () => {
    if (auth.role === "admin") {
      if (page === "dashboard")
        return (
          <Dashboard
            role="admin"
            bins={bins}
            trucks={TRUCKS}
            alerts={alerts}
            onAlert={handleBinAlert}
          />
        );
      if (page === "bins")
        return (
          <BinMonitor bins={bins} trucks={TRUCKS} onAlert={handleBinAlert} />
        );
      if (page === "routes")
        return <RouteOptimizer bins={bins} trucks={TRUCKS} />;
      if (page === "alerts") return <AlertsPage alerts={alerts} />;
    } else {
      if (page === "dashboard")
        return (
          <Dashboard
            role="citizen"
            bins={bins}
            trucks={TRUCKS}
            alerts={alerts}
            onAlert={() => {}}
          />
        );
      if (page === "report")
        return <ReportHotspot onSubmit={handleReportSubmit} />;
      if (page === "rewards")
        return <RewardsPage citizenPoints={citizenPoints} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0A1628",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <Sidebar
        role={auth.role}
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
        userName={auth.name}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <SimBanner onTrigger={handleTriggerSim} />
        <div style={{ flex: 1, overflowY: "auto" }}>{renderPage()}</div>
      </div>
      {alertBin && (
        <AlertModal
          bin={alertBin}
          onClose={() => setAlertBin(null)}
          onDispatch={handleDispatch}
        />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
