export interface Project {
  code: string;
  name: string;
  description: string;
}

export interface Activities {
  tasks: Project[];
  technicalStrengths: string[];
  performanceReview: string;
}
