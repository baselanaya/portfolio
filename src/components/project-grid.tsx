"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/projects";
import ProjectCard from "@/components/project-card";

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project, i) => (
        <motion.div
          key={project.slug}
          initial={shouldReduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
