"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * A toy model of SmartPark's event flow, drawn from its README: a dashboard
 * behind a gateway, three services with their own databases, and a Kafka bus
 * they publish to and consume from.
 *
 * Pressing a space is what a sensor would report. The request goes down to the
 * space service; the space service publishes what happened; and through the bus
 * the reservation service hears an arrival, or the billing service hears a
 * departure and closes the stay. No service ever calls another directly, and
 * the drawing shows exactly that.
 *
 * It is a model, not the product: nothing here talks to a backend.
 */

const ROWS = ["A", "B", "C"];
const PER_ROW = 6;
const SPACES = ROWS.flatMap((row) =>
  Array.from({ length: PER_ROW }, (_, i) => `${row}${String(i + 1).padStart(2, "0")}`),
);
const INITIALLY_TAKEN = new Set(["A02", "A05", "B01", "B03", "B04", "C02", "C06"]);

type Target = "reservation" | "billing";
type Flight = { id: number; path: string; duration: number; target?: Target };
type LogEntry = { id: number; space: string; arrived: boolean };

const SERVICES = [
  { x: 8, name: "space" },
  { x: 156, name: "reservation" },
  { x: 304, name: "billing" },
] as const;

const INBOUND = "M220 32 V162 H72 V222";
const OUTBOUND: Record<Target, string> = {
  reservation: "M72 254 V372 H220 V254",
  billing: "M72 254 V372 H368 V254",
};

const BOX = { fill: "var(--raised)", strokeWidth: 1 };
const WIRE = { stroke: "var(--line)", strokeWidth: 1, fill: "none" };

/** One event travelling along a path, then reporting that it arrived. */
function Packet({ flight, onDone }: { flight: Flight; onDone: (flight: Flight) => void }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const length = path.getTotalLength();
    const state = { progress: 0 };
    const tween = gsap.to(state, {
      progress: 1,
      duration: flight.duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const point = path.getPointAtLength(state.progress * length);
        dot.setAttribute("cx", String(point.x));
        dot.setAttribute("cy", String(point.y));
      },
      onComplete: () => onDone(flight),
    });
    return () => {
      tween.kill();
    };
    // A flight never changes after it is created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <path ref={pathRef} d={flight.path} fill="none" stroke="none" />
      <circle ref={dotRef} r="5" cx="-20" cy="-20" fill="var(--accent)" />
    </>
  );
}

export function ParkingSim() {
  const { animate } = useMotionAllowed();
  const [taken, setTaken] = useState<Set<string>>(INITIALLY_TAKEN);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [events, setEvents] = useState(0);
  const [invoices, setInvoices] = useState(0);
  const [lit, setLit] = useState<Target | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const takenRef = useRef(taken);
  const lastTouch = useRef(0);
  const litTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    takenRef.current = taken;
  }, [taken]);

  const arrive = useCallback((target: Target) => {
    if (target === "billing") setInvoices((count) => count + 1);
    setLit(target);
    if (litTimer.current) clearTimeout(litTimer.current);
    litTimer.current = setTimeout(() => setLit(null), 700);
  }, []);

  const toggle = useCallback(
    (space: string) => {
      const arrived = !takenRef.current.has(space);
      const next = new Set(takenRef.current);
      if (arrived) next.add(space);
      else next.delete(space);
      takenRef.current = next;
      setTaken(next);

      const id = nextId.current++;
      setEvents((count) => count + 1);
      setLog((entries) => [{ id, space, arrived }, ...entries].slice(0, 4));

      const target: Target = arrived ? "reservation" : "billing";
      if (animate) {
        setFlights((current) => [
          ...current,
          { id, path: INBOUND, duration: 0.7, target },
        ]);
      } else {
        // No motion: the outcome simply happens.
        arrive(target);
      }
    },
    [animate, arrive],
  );

  const onFlightDone = useCallback(
    (flight: Flight) => {
      setFlights((current) => {
        const rest = current.filter((item) => item.id !== flight.id);
        // The inbound leg hands over to the leg through the bus.
        if (flight.path === INBOUND && flight.target) {
          return [
            ...rest,
            { id: nextId.current++, path: OUTBOUND[flight.target], duration: 1.25 },
          ];
        }
        return rest;
      });
      if (flight.path === OUTBOUND.reservation) arrive("reservation");
      if (flight.path === OUTBOUND.billing) arrive("billing");
    },
    [arrive],
  );

  // Left alone, the lot keeps living: a space changes every few seconds while
  // the model is on screen. Any press hands control to the visitor for a while.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !animate) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(root);
    const timer = setInterval(() => {
      if (!visible || document.hidden) return;
      if (Date.now() - lastTouch.current < 6000) return;
      toggle(SPACES[Math.floor(Math.random() * SPACES.length)]);
    }, 2600);
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [animate, toggle]);

  useEffect(
    () => () => {
      if (litTimer.current) clearTimeout(litTimer.current);
    },
    [],
  );

  const counters = [
    { label: "Occupied", value: `${taken.size}/${SPACES.length}` },
    { label: "Events", value: String(events) },
    { label: "Invoices", value: String(invoices) },
  ];

  return (
    <div ref={rootRef} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        <p className="mono-label">Try it: press a space</p>

        <div className="mt-5 grid grid-cols-6 gap-2 md:gap-2.5">
          {SPACES.map((space) => {
            const isTaken = taken.has(space);
            return (
              <button
                key={space}
                type="button"
                aria-pressed={isTaken}
                aria-label={`Space ${space}, ${isTaken ? "occupied" : "free"}`}
                onClick={() => {
                  lastTouch.current = Date.now();
                  toggle(space);
                }}
                className={`focus-ring flex aspect-[4/5] flex-col justify-between rounded-xl p-2 text-left transition-[background-color,box-shadow,transform] duration-500 ease-fluid active:scale-[0.94] md:rounded-2xl md:p-3 ${
                  isTaken
                    ? "bg-accent text-[#0a0a0c]"
                    : "text-muted shadow-[inset_0_0_0_1px_var(--line)] hover:bg-white/5"
                }`}
              >
                <span className="font-mono text-[0.625rem] font-medium tracking-[0.08em] md:text-[0.6875rem]">
                  {space}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-1 w-full rounded-full ${isTaken ? "bg-[#0a0a0c]/35" : "bg-white/10"}`}
                />
              </button>
            );
          })}
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-6">
          {counters.map((counter) => (
            <div key={counter.label} className="border-t border-line pt-4">
              <dd className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tabular-nums tracking-[-0.04em]">
                {counter.value}
              </dd>
              <dt className="mono-label mt-1.5">{counter.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="mt-6 grid min-h-[6.5rem] content-start gap-1.5 font-mono text-[0.75rem] text-muted">
          {log.map((entry, index) => (
            <li key={entry.id} style={{ opacity: 1 - index * 0.24 }}>
              <span className="text-fg">{entry.space}</span>{" "}
              {entry.arrived ? "FREE → OCCUPIED" : "OCCUPIED → FREE"}
              <span className="text-faint">
                {"  "}
                {entry.arrived ? "reservation hears it" : "billing closes the stay"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto w-full max-w-[520px] lg:col-span-5 lg:col-start-8">
        <svg
          viewBox="0 0 440 396"
          role="img"
          aria-label="SmartPark architecture: a React dashboard calls an Nginx gateway, which routes to three Quarkus services for spaces, reservations and billing. Each service has its own PostgreSQL database and they communicate only through Apache Kafka."
          className="h-auto w-full"
        >
          <path d="M220 54 V90" {...WIRE} />
          <path d="M220 134 V162 H72 V190 M220 162 V190 M220 162 H368 V190" {...WIRE} />
          {SERVICES.map((service) => (
            <path key={service.name} d={`M${service.x + 64} 254 V330`} {...WIRE} />
          ))}

          <rect x="130" y="10" width="180" height="44" rx="14" stroke="var(--line)" {...BOX} />
          <text x="220" y="37" textAnchor="middle" fontSize="14" fontWeight="500" fill="var(--fg)">
            React dashboard
          </text>

          <rect x="130" y="90" width="180" height="44" rx="14" stroke="var(--line)" {...BOX} />
          <text x="220" y="117" textAnchor="middle" fontSize="14" fontWeight="500" fill="var(--fg)">
            Nginx gateway
          </text>

          {SERVICES.map((service) => (
            <g key={service.name}>
              <rect
                x={service.x}
                y="190"
                width="128"
                height="64"
                rx="16"
                stroke={lit === service.name ? "var(--accent)" : "var(--line)"}
                style={{ transition: "stroke 0.5s cubic-bezier(0.32, 0.72, 0, 1)" }}
                {...BOX}
              />
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
              <text
                x={service.x + 64}
                y="238"
                textAnchor="middle"
                fontSize="11.5"
                fill="var(--faint)"
              >
                own PostgreSQL
              </text>
            </g>
          ))}

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
            style={{ fontFamily: "var(--font-mono)" }}
          >
            APACHE KAFKA
          </text>

          {flights.map((flight) => (
            <Packet key={flight.id} flight={flight} onDone={onFlightDone} />
          ))}
        </svg>
      </div>
    </div>
  );
}
