"use client";

import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/resumeData";

/**
 * The downloadable PDF, built from the SAME ResumeData the on-screen sheet
 * uses. @react-pdf/renderer draws real text runs, so the result is selectable
 * and machine-readable - an ATS can parse it, unlike a screenshot or a
 * print-to-image.
 *
 * Fonts are left as the built-in Helvetica family on purpose: it is embedded
 * in every PDF reader, keeps the file small, and avoids shipping webfont
 * binaries that @react-pdf would otherwise have to fetch at runtime.
 */

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 46,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#111111",
    lineHeight: 1.35,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 21,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 3,
    color: "#333333",
  },
  contact: {
    fontSize: 8,
    marginTop: 5,
    color: "#555555",
  },
  headerRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginTop: 8,
  },
  section: { marginTop: 10 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingBottom: 2.5,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    marginBottom: 5,
  },
  role: { marginBottom: 7 },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  company: { fontFamily: "Helvetica-Bold", fontSize: 9.8, flexShrink: 1 },
  roleName: { fontFamily: "Helvetica", color: "#444444" },
  dates: { fontSize: 8, color: "#666666", textAlign: "right" },
  bulletRow: { flexDirection: "row", marginTop: 1.5 },
  bulletMark: { width: 9, color: "#666666" },
  bulletText: { flex: 1, color: "#222222" },
  skillRow: { marginBottom: 2 },
  skillLabel: { fontFamily: "Helvetica-Bold" },
  body: { color: "#222222" },
  link: { color: "#111111", textDecoration: "none" },
});

export function ResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document
      title={`${data.name} - Resume`}
      author={data.name}
      subject={data.title}
      keywords="video editor, post producer, post production, color, sound, DaVinci Resolve"
    >
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.contact}>{data.contact.join("  ·  ")}</Text>
          <View style={styles.headerRule} />
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.body}>{data.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.roles.map((role) => (
            <View key={role.company} style={styles.role} wrap={false}>
              <View style={styles.roleHeader}>
                <Text style={styles.company}>
                  {role.company}
                  <Text style={styles.roleName}> {"—"} {role.role}</Text>
                </Text>
                <Text style={styles.dates}>
                  {role.dates}
                  {role.location ? ` · ${role.location}` : ""}
                </Text>
              </View>

              {role.bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <Text style={styles.bulletMark}>{"•"}</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {data.skills.map((line) => (
            <Text key={line.label} style={styles.skillRow}>
              <Text style={styles.skillLabel}>{line.label}: </Text>
              <Text style={styles.body}>{line.value}</Text>
            </Text>
          ))}
        </View>

        {/* Clients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Clients</Text>
          <Text style={styles.body}>{data.clients}</Text>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((item) => (
            <View key={item.line}>
              <Text style={styles.skillLabel}>{item.line}</Text>
              <Text style={styles.body}>{item.detail}</Text>
            </View>
          ))}
        </View>

        {/* Portfolio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <Link src={`https://${data.portfolio}`} style={styles.link}>
            {data.portfolio}
          </Link>
        </View>
      </Page>
    </Document>
  );
}
