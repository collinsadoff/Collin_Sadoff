/**
 * EDUCATION — rendered on /resume and in the PDF.
 *
 * HOW TO EDIT: fill in `year` with your graduation year. Leave it as an empty
 * string and the year is omitted cleanly rather than printing a placeholder.
 */

export type Education = {
  degree: string;
  field: string;
  school: string;
  /** Optional abbreviation shown in parentheses. */
  schoolShort?: string;
  location?: string;
  /** TODO (Collin): add your graduation year. "" hides it. */
  year: string;
};

export const education: Education[] = [
  {
    degree: "Associate's Degree",
    field: "Web Design & Development",
    school: "Pellissippi State Community College",
    schoolShort: "PSTCC",
    location: "Knoxville, TN",
    year: "", // TODO (Collin): e.g. "2017"
  },
];
