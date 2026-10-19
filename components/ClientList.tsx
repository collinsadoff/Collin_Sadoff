import { clients } from "@/content/clients";
import { Reveal } from "@/components/Reveal";

/**
 * Typographic client list - names only, no logos. A plain uppercase grid
 * rather than a marquee: it stays readable, costs no animation frames, and
 * needs no pause control.
 */
export function ClientList() {
  return (
    <Reveal>
      <h2 className="label mb-7 text-fog">Selected Clients</h2>
      <ul className="grid grid-cols-1 gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <li
            key={client}
            className="border-b border-line py-3.5 font-display text-base font-semibold tracking-[0.08em] text-chalk uppercase sm:text-lg"
          >
            {client}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
