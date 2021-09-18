import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../styles/SideBar.css';


const SideBar = () => {
    return (
        <div className="sidebar">
            <div>
                <HomeIcon /><br />
                HOME
            </div>
            <div>
                <HistoryIcon /><br />
                HISTORY
            </div>
            {/* <div className="openimage">
                <AddCircleIcon fontSize="large" />
            </div> */}
        </div>
    );
};

export default SideBar;