import ReadingProgress from "@/components/reading-progress";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}
