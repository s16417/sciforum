import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import { Button, Typography, ThemeProvider, Divider, Grid, Modal, Backdrop, Fade, Card, CardHeader, CardContent, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AlertDialogSlide from './AlertComponent';
import NotFound from '../alert/NotFoundComponent';
//import PostViewer from './PostViewerComponent';
import { theme, useStyles } from './styles/postsStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPostDetail, postAnswer } from '../../redux/ActionCreators';
import { Preview } from './MarkdownPreview';
import TimeAgo from 'react-timeago';
import AnswerModalCard from '../answer/answerModalCard';

function AnswerModal({openModal, answerContent, setAnswerContent, handleModalClose, classes, postId, ...rest}) {
    return(
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
        >  
            <Fade in={openModal}>
                <AnswerModalCard 
                    answerContent={answerContent} 
                    setAnswerContent={setAnswerContent} 
                    postId={postId} 
                    handleModalClose={handleModalClose}
                />
            </Fade>
        </Modal>
    );
}

function RenderCard({title, body, viewCount, created_at, updated_at, owner, handleModalOpen, classes}) {

    /*function getTime(date) {
        return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date)
    }*/

    return(
       <Grid container direction="column" spacing={1}>
           <Grid item lg={8} sm xs={12}>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                        <Grid container direction="row" alignItems="flex-start" justify="flex-start" spacing={3}>
                            <Grid item>
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    {"Posted by  "}
                                    <Link style={{textDecoration: 'none', fontSize: 14}} to={`/profile/${owner}/`}>{owner}</Link>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    {viewCount == 1 ? viewCount + " View": viewCount + " Views"}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    {/*"Created on " + created_at*/}
                                    {"Created "}<TimeAgo live={false} date={created_at} />
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    {"Updated "}<TimeAgo live={false} date={updated_at} />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button className={classes.answerButton} onClick={handleModalOpen}>
                            <Typography className={classes.iconWrap} variant="body2">
                                <QuestionAnswerRoundedIcon/>{" Answer"}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={8} sm xs={12}>
                <Divider/>
            </Grid>
            <Grid item lg={8} sm xs={12}>
                <Preview source={body}/>
            </Grid>
            <Grid item lg={8} sm xs={12}>
                <Divider/>
            </Grid>
       </Grid>
    );
    
}

export default function PostDetail() {

    const classes = useStyles();
    const auth = useSelector(state => state.Auth);
    const post = useSelector(state => state.Post);

    const dispatch = useDispatch();

    const {postId} = useParams(); //another way of approaching for getting the postId from the url other than match.params

    const [open, setOpen] = React.useState(false);

    const [openModal, setOpenModal] = React.useState(false);
    const [answerContent, setAnswerContent] = React.useState('');

    const [postInfo, setPostInfo] = React.useState({
        title: post.post ? post.post.title: null,
        body: post.post ? post.post.body: null,
    });
    const id = post.post ? post.post.id: null;
    const owner = post.post ? post.post.owner: null;
    const viewCount = post.post ? post.post.viewCount: null;
    const created_at = post.post ? post.post.created_at: null;
    const updated_at = post.post ? post.post.updated_at: null;

    React.useEffect(() => {
        if(post.status === 'idle') {
            dispatch(fetchPostDetail(postId));
        }
    }, [post, dispatch]);
    
    React.useEffect(() => {
        if(post.post) {
            handlePostInfo(post.post.id, post.post.owner, post.post.title, post.post.body, post.post.viewCount, post.post.created_at, post.post.updated_at);
        }
    }, [post]);

    const handlePostInfo = (id, owner, title, body, viewCount, created_at, updated_at) => {
        setPostInfo({
            title,
            body,
        });
        id = id;
        owner = owner;
        viewCount = viewCount;
        created_at = created_at;
        updated_at = updated_at
    }

    //console.log(answerContent);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleModalOpen = () => {
      setOpenModal(true);
    };
  
    const handleModalClose = () => {
      setOpenModal(false);
    };

    if(post.status === 'loading' || post.status === 'idle') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(post.errMess) {
        return(<h4>Error loading...!</h4>);
    } else {
        if(post !== undefined) {
            return(
                <div>
                    <ThemeProvider theme={theme}>
                        <RenderCard 
                            title={postInfo.title} 
                            body={postInfo.body} 
                            viewCount={viewCount}
                            created_at={created_at}
                            updated_at={updated_at}
                            owner={owner}
                            classes={classes}
                            handleModalOpen={handleModalOpen}
                        />
                        <AnswerModal 
                            classes={classes}
                            openModal={openModal}
                            answerContent={answerContent}
                            setAnswerContent={setAnswerContent}
                            handleModalClose={handleModalClose}
                            postId={postId}
                        />
                        {auth.isAuthenticated && auth.currentUser == owner ?
                            <React.Fragment>
                                <Link to={`/posts/${postId}/edit/`} style={{textDecoration: 'none'}}>
                                    <Button
                                        className={classes.submit}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        variant="outlined"
                                    >
                                    Edit
                                    </Button>
                                </Link>
                                <Button
                                    className={classes.submit}
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleClickOpen}
                                    size="small"
                                    variant="outlined"
                                >
                                    Delete
                                </Button>
                                <AlertDialogSlide open={open} handleClose={handleClose} postId={id}/>
                            </React.Fragment>
                            : undefined
                        }
                    </ThemeProvider>
                </div>
            );
        }else {
            return(<NotFound/>);
        }
    }
}