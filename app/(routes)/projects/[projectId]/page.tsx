import ProjectDetailsContent from "./components/ProjectDetailsContent";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectDetailsContent projectId={params.projectId} />;
}