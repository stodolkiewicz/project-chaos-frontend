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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-primary px-6 py-2">
        <h2 className="text-base font-semibold text-primary-foreground">Project Information</h2>
      </div>
      
      <div className="p-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-lighter-3 rounded-lg flex items-center justify-center">
              <span className="text-primary-darker-1 text-xs font-bold">#</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Project ID</div>
              <div className="text-gray-900 font-mono text-sm mt-0.5">{project.id}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-lighter-3 rounded-lg flex items-center justify-center">
              <span className="text-primary-darker-1 text-sm">📅</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Created</div>
              <div className="text-gray-900 mt-0.5">
                {new Date(project.createdDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-lighter-3 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-darker-1 text-sm">📝</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Description</div>
                <p className="text-gray-900 leading-relaxed max-w-3xl">
                  {project.description || 'This comprehensive project management system enables teams to collaborate effectively through advanced task tracking, real-time communication, and intelligent workflow automation. Built with modern technologies, it provides seamless integration with existing tools while offering intuitive user interfaces for enhanced productivity and streamlined project delivery across multiple departments and stakeholders.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}