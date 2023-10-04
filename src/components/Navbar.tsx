import { AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { NavBarButtons } from './buttons/nav-bar-buttons';

const Navbar = () => {
  return (
    <AppBar className="h-16 fixed">
      <Toolbar>
        <div className="w-full grid grid-cols-3">
          <div className="flex flex-row justify-start align-middle items-center">
            <Link to="/" color="#ffffff">
              TalentHub
            </Link>
          </div>
          <div className="flex flex-row gap-4 justify-center items-center">
            <Link to="/developers" color="#ffffff">
              Developers
            </Link>
            <Link to="/jobs" color="#ffffff">
              Jobs
            </Link>
          </div>
          <div className="flex flex-row justify-end items-center">
            <NavBarButtons />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
