/**
 * CLIENTS - the "Selected Clients" line on the resume.
 *
 * The homepage no longer lists clients; this feeds the resume only.
 *
 * HOW TO EDIT: add or remove a name. Order matters - the resume prints the
 * first `resumeCount` of them, so the strongest and most recognisable names
 * go at the top. Everything below that line stays on record here without
 * taking up space on a one-page resume.
 *
 * Why a cut rather than the full list: "selected" should mean selected. An
 * eighteen-name dump reads as everyone who ever paid an invoice, costs three
 * lines, and buries the names a Knoxville hiring manager would actually
 * recognise. Raise `resumeCount` if you want more; the resume is checked
 * against one page, so watch that it still fits.
 */

/** How many of the names below the resume prints. */
export const resumeCount = 12;

export const clients: string[] = [
  // --- printed on the resume -----------------------------------------------
  // Local name recognition first, then range across the verticals.
  "Moon Taxi",
  "Russell Biven",
  "Curt Maggitt",
  "SVN",
  "Cornerstone Construction",
  "Hickory Construction",
  "GM Construction Group",
  "Expoquip",
  "Goat Turf",
  "Dodson Designs",
  "Evolve Fitness",
  "Revitalyze MD",

  // --- on record, not printed ----------------------------------------------
  "RoofPlan",
  "F.E. Trainer Construction",
  "McCamy Construction",
  "PTI",
  "Reach Fitness",
  "AJ Johnson",
  "Breazeale Clinic",
];
