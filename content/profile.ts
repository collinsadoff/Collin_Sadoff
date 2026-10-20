/**
 * PROFILE — your identity block.
 *
 * HOW TO EDIT: change any string below. These values feed the nav wordmark,
 * the hero, the about section, the contact section, the footer, the /resume
 * page, the downloadable PDF, and all SEO metadata. Edit once, changes land
 * everywhere.
 */

export type Profile = {
  name: string;
  title: string;
  /** Phonetic hint shown on the headshot name tag. "" hides it. */
  pronunciation: string;
  /** One-line positioning statement, used under the hero title. */
  tagline: string;
  /** Short paragraph used for the resume summary and SEO description. */
  summary: string;
  /** Long-form first-person bio. Each string is its own paragraph. */
  bio: string[];
  /** Small monospace facts shown under the About bio. */
  quickFacts: string[];
  location: string;
  email: string;
  /** Human-readable phone, e.g. "(865) 771-7703". */
  phone: string;
  /** Digits-only phone for the tel: link, e.g. "+18657717703". */
  phoneHref: string;
  /** Bare domain, no protocol. */
  domain: string;
  /** Full canonical site URL, used for metadataBase, sitemap, JSON-LD. */
  siteUrl: string;
};

export const profile: Profile = {
  name: "Collin Sadoff",
  title: "Video Editor & Post Producer",
  pronunciation: "Say-doff",
  tagline:
    "Nine years of cutting, grading, and mixing - and shooting when a set needs it. I care about how it feels, not just whether it's technically right.",
  summary:
    "Video editor and post producer with 9 years of experience finishing commercial, social, and event content. Currently lead videographer and lead editor at The Skvara Agency, owning projects through edit, color, sound mix, and delivery, and reviewing other editors' cuts to hold one standard across the team. Strong in DaVinci Resolve (Edit, Color, Fairlight, Fusion), comfortable running a post pipeline, and equally effective on a team or solo.",
  bio: [
    "I'm Collin, a video editor and post producer based in Knoxville. I've spent the last nine years behind the camera and in the edit: starting at Haven Media, running my own wedding film business, and now leading shoots and post at The Skvara Agency.",
    "I care about the stuff people feel but can't always name: the timing of a cut, a grade that holds together across a whole project, a mix where nothing fights for attention. I'm just as comfortable owning a project solo as I am taking direction inside a creative team, and I'll finish someone else's cut without ego - the point is the piece, not whose timeline it started on. I build the schedule early and raise a problem early, which is usually why things land on time.",
    "I've worked with construction companies, real estate teams, fitness brands, medical practices, and public figures across East Tennessee and beyond.",
  ],
  quickFacts: [
    "Based in Knoxville, TN",
    "9 years experience",
    "Mac + Windows",
  ],
  location: "Knoxville, TN",
  email: "cmsadoff@gmail.com",
  phone: "(865) 771-7703",
  phoneHref: "+18657717703",
  domain: "collinsadoff.com",
  siteUrl: "https://collinsadoff.com",
};
