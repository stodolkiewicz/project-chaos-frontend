"use client";

interface Project {
  id: string;
  name: string;
  description: string;
  createdDate: string;
}

interface ProjectInformationProps {
  project: Project;
}

export default function ProjectInformation({ project }: ProjectInformationProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Project Information</h2>
      <div className="space-y-1">
        <div>
          <span className="font-medium text-gray-700">Project ID:</span>
          <span className="ml-2 text-gray-600 font-mono text-sm">{project.id}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Created:</span>
          <span className="ml-2 text-gray-600">
            {new Date(project.createdDate).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Description:</span>
          <span className="ml-2 text-gray-600">{project.description}</span>
        </div>
      </div>
    </div>
  );
}