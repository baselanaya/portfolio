import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import Timeline from "@/components/timeline";
import { experience, education } from "@/lib/experience";

export const metadata: Metadata = {
  title: "Experience — Basel Anaya",
  description: "Work history and education — Basel Anaya, AI Engineer and Founder of Maximlabs.",
};

export default function ExperiencePage() {
  return (
    <main className="px-[5vw] pt-28 pb-24">
      <SectionHeading
        as="h1"
        index="01"
        title="TIMELINE"
        subtitle="Roles, projects, and education"
      />
      <Timeline experience={experience} education={education} />
    </main>
  );
}
