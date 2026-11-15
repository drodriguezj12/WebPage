import type { CSSProperties } from "react";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * A figure whose digits roll into place like a mechanical counter. Pure CSS:
 * every digit is a reel of 0-9 shifted to its value, and globals.css starts the
 * reels at 0 until the figure is revealed. Without motion it is just the
 * number.
 *
 * Screen readers get the figure once, as text; the reels are hidden from them.
 */
export function Odometer({ figure }: { figure: string }) {
  return (
    <>
      <span className="sr-only">{figure}</span>
      <span className="odometer" aria-hidden="true">
        {[...figure].map((char, index) =>
          /\d/.test(char) ? (
            <span
              key={index}
              className="odo-col"
              style={{ "--d": Number(char), "--c": index } as CSSProperties}
            >
              <span className="odo-reel">
                {DIGITS.map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={index} className="odo-static">
              {char}
            </span>
          ),
        )}
      </span>
    </>
  );
}
