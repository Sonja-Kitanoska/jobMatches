import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Matches } from '../types/scraperTypes';
import { Job } from '../types/jobTechApiTypes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { cardColorLogic } from '../data/programmingLanguageColors';

const backendServer = import.meta.env.VITE_BE_SERVER;

type LocationState = {
  state: Job;
};

const fetchMatches = async (job: Job, accessToken: string) => {
  const jobDescription = { description: job.description.text };
  const res = await axios.post(`${backendServer}scraper`, jobDescription, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const JobMatches = () => {
  const { state: jobInfo } = useLocation() as LocationState;
  const [isSaved, setIsSaved] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const {
    isLoading,
    error,
    data: matches,
  } = useQuery<Matches, Error>({
    queryKey: ['developers'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      return fetchMatches(jobInfo, accessToken);
    },
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  const saveJobHandle = async () => {
    const accessToken = await getAccessTokenSilently();
    const createJobReq = {
      jobTechId: jobInfo.id,
      url: jobInfo.application_details.url,
      jobText: jobInfo.description.text,
      SelectedSkillIds: matches.jobSkills.map(jobSkill => jobSkill.id),
    };
    try {
      await axios.post(`${backendServer}api/jobs`, createJobReq, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsSaved(true);
    } catch (error) {
      console.log('Error:', (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-5 justify-center items-start">
      <div className="flex flex-col gap-5">
        <Accordion
          defaultExpanded
          square={true}
          elevation={1}
          sx={{
            maxWidth: 700,
            padding: 4,
            borderRadius: '24px',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="job-content"
            id="job-header"
          >
            <div>
              <Typography variant="h3">{jobInfo.headline}</Typography>
              <Typography variant="h6">{jobInfo.employer.name}</Typography>
              {jobInfo.application_details.url && (
                <Button
                  variant="outlined"
                  sx={{ marginTop: 2 }}
                  onClick={() => window.open(jobInfo.application_details.url)}
                >
                  Click here to apply
                </Button>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div
              dangerouslySetInnerHTML={{
                __html: jobInfo.description.text_formatted,
              }}
              style={{ all: 'inherit' }}
            ></div>
          </AccordionDetails>
        </Accordion>
        {!isSaved ? (
          <Button variant="contained" onClick={saveJobHandle}>
            Save Job
          </Button>
        ) : (
          <Button variant="contained" disabled>
            Saved
          </Button>
        )}
      </div>
      <div className="max-w-md flex-grow">
        <Typography variant="h2">Best Matches</Typography>
        {matches.developers.map(dev => (
          <Paper
            elevation={1}
            sx={{
              padding: 2,
              marginBottom: 2,
              borderRadius: 6,
              // Following logic is to color the dev card based on the first Programming Language they have
              backgroundColor: `${
                cardColorLogic[
                  dev.skills.filter(
                    skill => skill.type === 'Programming Language'
                  ).length > 0
                    ? dev.skills.filter(
                        skill => skill.type === 'Programming Language'
                      )[0].title
                    : 'no_such_programming_skill'
                ]
              }`,
            }}
            key={dev.id}
          >
            <Typography variant="h5">{dev.name}</Typography>
            <Typography variant="body1">
              <EmailIcon fontSize="small" sx={{ marginRight: 1 }} />
              {dev.email}
            </Typography>
            <Stack spacing={1} direction="row">
              {dev.skills
                .filter(skill =>
                  matches.jobSkills.some(jobSkill => jobSkill.id === skill.id)
                )
                .map(skill => (
                  <Chip label={skill.title} size="small" key={skill.id} />
                ))}
            </Stack>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default JobMatches;
