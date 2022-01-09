import React, { useContext } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { followerContext } from '../Contexts/FollowerContext';
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FollowingList = ({following, followingModal, setFollowingModal}) => {
  const handleOpen = () => setFollowingModal(true);
  const handleClose = () => setFollowingModal(false);

  const { unFollowing } = useContext(followerContext);
  return (
    <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={followingModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
        <Fade in={followingModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
                Подписчики
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            <div>
              {following.map(user => (
                <div key={user.email} >  
                <Link to={`/user/profile/${user.email}`}>
                  <h6>{user.name}</h6>
                </Link>
                  <p>{user.email}</p>
                  <img style={{height: '40px'}} src={user.image} />
                  <button onClick={() => unFollowing(user)} >delete</button>
                </div>
              ))}
            </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
)};

export default FollowingList;
