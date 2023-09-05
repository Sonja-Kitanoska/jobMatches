import { useQuery } from '@tanstack/react-query';
import { Job, SearchResult } from '../types/externalTypes';
import { CircularProgress, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Skill } from '../types/innerTypes';
import JobFilters, { FilterFormValues } from './JobFilters';
import JobCard from './JobCard';
import { useAuth0 } from '@auth0/auth0-react';

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchSkills = async (accessToken : string): Promise<Skill[]> => {
  const res = await fetch(`${backendServer}api/Skills`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    }
  });
  return res.json();
};

const fetchJobs = async (
  page: number
): Promise<SearchResult> => {
  const res = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?q=javascript&offset=${
      page * 10
    }&limit=10`
  );
  return res.json();
};

// export type searchParams = {
//   searchKeyword: string,
//   isRemote: boolean | null,
//   isExperienced: boolean | null
// }

const AllJobs = () => {
  const [searchKeyword, setSearchKeyword] = useState<FilterFormValues>({
    searchKeyword: '',
  isRemote: false,
  isExperienced: false,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const { getAccessTokenSilently } = useAuth0();


  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[]>(['skills'], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken)});

  const { isLoading, error, data } = useQuery<SearchResult>(
    ['jobs', searchKeyword, currentPage],
    () => fetchJobs(currentPage),
    {
      // to prevent the page from fetching data too many times
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const pageChangeHandler = (_event: ChangeEvent<unknown>, value: number) => {
    value = value - 1;
    setCurrentPage(value);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchKeyword]);

  if (isLoading || isSkillsLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );

  if (error || skillsError) {
    console.log('❗️error: ', error);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }

  if (!data || !skills) {
    return;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] mx-10">
        <JobFilters setSearchKeyword={setSearchKeyword} skills={skills} />
        <div className="jobcards">
          {data.hits.map((job: Job) => (
            <JobCard key={job.id} jobInfo={job} />
          ))}
        </div>
        <Pagination
          count={Math.floor(data.total.value / 10) + 1}
          variant="outlined"
          shape="rounded"
          onChange={pageChangeHandler}
          page={currentPage + 1}
        />
      </div>
    </div>
  );
};

export default AllJobs;
