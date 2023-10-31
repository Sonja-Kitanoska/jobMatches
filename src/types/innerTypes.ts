import { Region } from './externalTypes';

export type Skill = {
  id: string;
  title: string;
  type: string;
};

export type ComboBoxProps = {
  skills: Skill[];
  skillType: string;
  refetchSkills: () => void;
  isRequired: boolean;
};

export type FilterFormValues = {
  searchKeyword: string;
  skillsFilter: string[];
  regionFilter: Region[];
  isExperienced?: boolean;
};

export type DeveloperFilterFormValues = {
  searchKeyword: string;
  skillsFilter: string[];
  speaksSwedish: boolean;
};

export type Developer = {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
  skillMatch: number;
};

export type TeamMemberInfo = {
  imgUrl: string;
  memberName: string;
  memberDescription: string;
  githubLink: string;
  linkedinLink: string;
};

export type JobSkillDTO = {
  id: string;
  title: string;
  type: string;
};

export type DevSkillDTO = {
  id: string;
  title: string;
  type: string;
};

export type JobDTO = {
  id: string;
  jobTechId: string;
  url: string;
  jobText: string;
  title: string;
  deadline: string;
  employer: string;
  skills: JobSkillDTO[];
};

export type DeveloperDTO = {
  id: string;
  name: string;
  email: string;
  skills: DevSkillDTO[];
  skillMatch: number;
};

export type UserInfoDTO = {
  id: string;
  jobs: JobDTO[];
  developers: DeveloperDTO[];
};

export type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

export type Dataset = {
  id: number;
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};
