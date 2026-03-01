import ProjectDetailsContent from "./components/ProjectDetailsContent";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  return <ProjectDetailsContent projectId={projectId} />;
}