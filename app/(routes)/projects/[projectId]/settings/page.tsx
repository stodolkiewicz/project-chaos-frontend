import ProjectSettingsContent from "./components/ProjectSettingsContent";

interface ProjectSettingsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const { projectId } = await params;
  return <ProjectSettingsContent projectId={projectId} />;
}
