/**
 * SmartPark's architecture, drawn from its README: a dashboard behind a
 * gateway, three services, and a Kafka bus they publish to and consume from.
 * The moving dots are events going from one service to the next through the
 * bus; no service ever calls another directly, and the drawing shows exactly
 * that.
 *
 * The dots are hidden unless motion is allowed (`.packet` in globals.css).
 */

const SERVICES = [
  { x: 8, name: "space" },
  { x: 156, name: "reservation" },
  { x: 304, name: "billing" },
];

// Out of one service, along the bus, up into another.
const ROUTES = [
  { d: "M72 254 V372 H220 V254", begin: "0s" },
  { d: "M220 254 V372 H368 V254", begin: "1.6s" },
  { d: "M368 254 V372 H72 V254", begin: "3.2s" },
];

const BOX = { fill: "var(--raised)", stroke: "var(--line)", strokeWidth: 1 };
const WIRE = { stroke: "var(--line)", strokeWidth: 1, fill: "none" };

export function EventDiagram() {
  return (
    <svg
      viewBox="0 0 440 396"
      role="img"
      aria-label="SmartPark architecture: a React dashboard calls an Nginx gateway, which routes to three Quarkus services for spaces, reservations and billing. Each service has its own PostgreSQL database and they communicate only through Apache Kafka."
      className="h-auto w-full"
      fontFamily="var(--font-geist-sans)"
    >
      {/* wires */}
      <path d="M220 54 V90" {...WIRE} />
      <path d="M220 134 V162 H72 V190 M220 162 V190 M220 162 H368 V190" {...WIRE} />
      {SERVICES.map((service) => (
        <path key={service.name} d={`M${service.x + 64} 254 V330`} {...WIRE} />
      ))}

      {/* dashboard and gateway */}
      <rect x="130" y="10" width="180" height="44" rx="14" {...BOX} />
      <text x="220" y="37" textAnchor="middle" fontSize="14" fontWeight="500" fill="var(--fg)">
        React dashboard
      </text>

      <rect x="130" y="90" width="180" height="44" rx="14" {...BOX} />
      <text x="220" y="117" textAnchor="middle" fontSize="14" fontWeight="500" fill="var(--fg)">
        Nginx gateway
      </text>

      {/* services */}
      {SERVICES.map((service) => (
        <g key={service.name}>
          <rect x={service.x} y="190" width="128" height="64" rx="16" {...BOX} />
          <text
            x={service.x + 64}
            y="218"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="var(--fg)"
          >
            {service.name}
          </text>
          <text x={service.x + 64} y="238" textAnchor="middle" fontSize="11.5" fill="var(--faint)">
            own PostgreSQL
          </text>
        </g>
      ))}

      {/* the bus */}
      <rect
        x="8"
        y="330"
        width="424"
        height="58"
        rx="20"
        fill="color-mix(in srgb, var(--accent) 12%, transparent)"
        stroke="color-mix(in srgb, var(--accent) 45%, transparent)"
        strokeWidth="1"
      />
      <text
        x="220"
        y="355"
        textAnchor="middle"
        fontSize="13"
        fontWeight="500"
        letterSpacing="1.6"
        fill="var(--accent)"
        fontFamily="var(--font-geist-mono)"
      >
        APACHE KAFKA
      </text>

      {/* events */}
      {ROUTES.map((route) => (
        <circle key={route.d} className="packet" r="4.5" fill="var(--accent)">
          <animateMotion dur="4.8s" begin={route.begin} repeatCount="indefinite" path={route.d} />
        </circle>
      ))}
    </svg>
  );
}
