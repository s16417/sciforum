import React from 'react';
import { Grid, Typography, Link, Divider, IconButton, Modal, Fade, Backdrop, Box } from '@material-ui/core';
import { Facebook, LinkedIn, GitHub, Edit, AddCircleOutline, School, Work, Language, Build } from '@material-ui/icons';
import EditContact from './editors/editContact';
import EditCredentials from './editors/editCredentials';
import CreateEmployment from './editors/credentials/createEmployment';
import { useStyles } from '../styles/profileStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserEmployment } from '../../../redux/ActionCreators';

export default function ProfilePanel() {

    const classes = useStyles();

    const dispatch = useDispatch();

    const { username } = useParams();

    const user = useSelector(state => state.User);
    const auth = useSelector(state => state.Auth);
    const userEmployment = useSelector(state => state.UserEmployment);

    React.useEffect(() => {
        if(userEmployment.status === 'idle') dispatch(fetchUserEmployment(username));
    }, [dispatch]);

    React.useEffect(() => {
        if(userEmployment.userEmployment) handleUserEmployment(userEmployment.userEmployment);
    }, [userEmployment]);

    const [contact, setContact] = React.useState(user.user ? user.user.data.contact: null);
    const [employment, setEmployment] = React.useState(userEmployment.userEmployment ? userEmployment.userEmployment: []);
    const [education, setEducation] = React.useState(user.user ? user.user.data.education: []);
    const [languages, setLanguages] = React.useState(user.user ? user.user.data.languages: []);
    const [skills, setSkills] = React.useState(user.user ? user.user.data.skills: []);

    const handleUserEmployment = (employment) => {
        setEmployment(employment);
    };

    const [selectedEmploymentItem, setSelectedEmploymentItem] = React.useState();

    const [openModal, setOpenModal] = React.useState(false);
    const [modalSelection, setModalSelection] = React.useState(null);
  
    const handleModalOpen = (modal) => {
      setOpenModal(true);
      setModalSelection(modal);
    };
  
    const handleModalClose = () => {
      setOpenModal(false);
      setModalSelection(null);
    };

    const EditModal = ({...rest}) => (
        <Modal {...rest}
          open={openModal} 
          className={classes.modal} 
          onClose={handleModalClose}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
              timeout: 500,
          }}
        />
    );

    function GithubLink({link}) {
        return(
            <Link underline="none" href={link}>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={0}>
                    <Grid item>
                        <GitHub fontSize="small"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" >{"Github"}</Typography>
                    </Grid>
                </Grid>
            </Link>
        );
    }

    function LinkedInLink({link}) {
        return(
            <Link underline="none" href={link}>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={0}>
                    <Grid item>
                        <LinkedIn fontSize="small"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" >{"LinkedIn"}</Typography>
                    </Grid>
                </Grid>
            </Link>
        );
    }

    function FacebookLink({link}) {
        return(
            <Link underline="none" href={link}>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={0}>
                    <Grid item>
                        <Facebook fontSize="small"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">{"Facebook"}</Typography>
                    </Grid>
                </Grid>
            </Link>
        );
    }

    const EmploymentTypo = employment ? employment.map(item => 
        <Grid item key={item.id}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Work fontSize="small" style={{fill: "gray"}}/>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">{item.position + " at " + item.company}</Typography>
                </Grid>
            </Grid>
        </Grid>
    ): undefined;

    return(
        <React.Fragment>
            <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={2}>
                <Grid item>
                    <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={1}>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6" style={{fontSize: 16}}>Credentials</Typography>
                                    <Divider/>
                                </Grid>
                                {auth.isAuthenticated && auth.currentUser === username ? <Grid item>
                                    <IconButton size="small" onClick={() => handleModalOpen("credentials")}>
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                </Grid>: undefined}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Box m={0}>
                                <Grid container direction="column" alignItems="baseline" justify="center" spacing={1}>
                                    {EmploymentTypo}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={2}>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6" style={{fontSize: 16}}>Contact</Typography>
                                    <Divider/>
                                </Grid>
                                {auth.isAuthenticated && auth.currentUser === username ? <Grid item>
                                    <IconButton size="small" onClick={() => handleModalOpen("contact")}>
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                </Grid>: undefined}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                <Grid item>
                                    {contact ? contact.github !== "" ? <GithubLink link={contact.github}/>: undefined: undefined}
                                </Grid>
                                <Grid item>
                                    {contact ? contact.linkedIn !== "" ? <LinkedInLink link={contact.linkedIn}/>: undefined: undefined}
                                </Grid>
                                <Grid item>
                                    {contact ? contact.facebook !== "" ? <FacebookLink link={contact.facebook}/>: undefined: undefined}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <EditModal>
                <Fade in={openModal}>
                {/*
                    modalSelection === 'contact' ? 
                        <EditContact contact={contact} setContact={setContact} handleModalClose={handleModalClose}/>: 
                    modalSelection === 'aboutMe' ?
                        <UpdateAboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} handleModalClose={handleModalClose}/>:
                    modalSelection === 'profileImage' ?
                        <UpdateProfileImage usernameFromTheUrl={usernameFromTheUrl} profileImage={profileImage} setProfileImage={setProfileImage} handleModalClose={handleModalClose}/>:
                    undefined
                */}
                {
                    modalSelection === 'contact' ? 
                        <EditContact contact={contact} setContact={setContact} handleModalClose={handleModalClose}/>: 
                    modalSelection === 'credentials' ? 
                        <EditCredentials 
                            handleModalClose={handleModalClose}
                            setModalSelection={setModalSelection}
                            setOpenModal={setOpenModal}
                            employment={employment}
                            setSelectedEmploymentItem={setSelectedEmploymentItem}
                        />:
                    modalSelection === 'employmentCreate' ?
                        <CreateEmployment
                            employment={employment}
                            handleModalClose={handleModalClose}
                            varient="create"
                        />:
                    modalSelection === 'employmentUpdate' ?
                        <CreateEmployment
                            employment={employment}
                            handleModalClose={handleModalClose}
                            selectedEmploymentItem={selectedEmploymentItem}
                            varient="update"
                        />:
                    undefined
                }
                </Fade>
            </EditModal>
        </React.Fragment>
    );
}