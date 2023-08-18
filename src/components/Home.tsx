import { Stack, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()
  return (
    <Stack
      direction="column"
      spacing={3}
      sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '150px'}}
    >
      <img src={logo} className='md:w-1/3 w-1/2'/>
      <Stack
        direction="row"
        spacing={3}
      >
        <Button variant="outlined" onClick={() => navigate('/developers')}>Developers</Button>
        <Button variant="outlined" onClick={() => navigate('/jobs')}>Jobs</Button>
        <Button variant="outlined"onClick={() => window.open('https://github.com/lups-tech')} >
          <GitHubIcon sx={{ paddingRight: 1 }} />
          GitHub
        </Button>
      </Stack>
    </Stack>
  );
};

export default Home;
