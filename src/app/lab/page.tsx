import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import LabContent from "@/components/lab-content";

export const metadata: Metadata = {
  title: "Lab — Basel Anaya",
  description: "Experiments, benchmarks, and games — the playground side of Basel Anaya's work.",
};

export default function LabPage() {
  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="// EXPERIMENTS & BENCHMARKS"
          title="Lab"
          subline="The playground side of the work — benchmarks measured on real hardware, small experiments, and one game that used to be a secret."
        />
        <LabContent />
      </div>
    </main>
  );
}
