import React from 'react';
import { Grid, Typography, Divider, Avatar, Button, Box } from '@material-ui/core';
import { Preview } from './answerPreview';
import { useSelector, useDispatch } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { useStyles } from './styles/answerStyles';
import VoteButtons from '../vote/answerVoteButtons';
import { AnswerCommentInput, AnswerCommentRender } from './comment/comment';
import { fetchAnswerComments } from '../../redux/ActionCreators';
import { createSelector } from 'reselect';

export default function AnswerViewCard({answer, handleModalOpen, handleDeleteModalOpen}) {

    const classes = useStyles();

    const auth = useSelector(state => state.Auth);
    //const answerComments = useSelector(state => state.AnswerComments);
    
    //const dispatch = useDispatch();

    /*const answerSelector = (state) => state.Answers.answers;
    const commentSelector = (state) => state.AnswerComments.answerComments;
    const filtered = (answers, comments) => 
        answers.map(answer => ({
            ...answer,
            comments: comments.filter(comment => comment.filter(comment => comment.answer === answer.id)) 
        }));
    /*const filtered = (answers, comments) => 
        ({
            answers,
            comments,
        });*/

    /*const selectCommentsByAnswer = createSelector(
        [answerSelector, commentSelector],
        filtered
    );

    const sample = useSelector(state => selectCommentsByAnswer(state));

    console.log(sample);*/

    /*React.useEffect(() => {
        dispatch(fetchAnswerComments(answer.id));
    }, [dispatch]);*/

    const isAuthenticated = auth.isAuthenticated;
    const currentUserId = auth.currentUserId;

    const [openCommentBox, setOpenCommentBox] = React.useState(false);
    const [showAddComment, setShowAddComment] = React.useState(true);

    const handleCommentBoxOpen = () => {
        setOpenCommentBox(true);
        handleShowAddComment();
    };

    const handleShowAddComment = () => {
        setShowAddComment(false);
    };

    return(
        <React.Fragment>
            <Box>
                <Grid container direction="column" spacing={0}>
                    <Grid item>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1}>
                                    <Grid item>
                                        <Avatar alt={answer.ownerAvatar} src={answer.ownerAvatar} />
                                    </Grid>
                                    <Grid item>
                                        <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={0}>
                                            <Grid item>
                                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                    <Link style={{textDecoration: 'none', fontSize: 14}} to={`/profile/${answer.ownerDisplayName}/`}>{answer.ownerDisplayName}</Link>
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                    <TimeAgo live={false} date={answer.created_at} />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Preview source={answer.answerContent}/>
                            </Grid>
                            <Grid item>
                                <Grid container justify="space-between" alignItems="center" spacing={2}>
                                    <Grid item>
                                        <VoteButtons 
                                            answerId={answer.id} 
                                            likes={answer.likes}
                                            dislikes={answer.dislikes}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Grid container justify="center" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Grid container justify="center" alignItems="center" spacing={0}>
                                                    <Grid item>
                                                        {isAuthenticated && answer.owner == currentUserId ?
                                                        <Grid item>
                                                            <Button color="primary" className={classes.editButton} onClick={() => handleModalOpen(answer)}>
                                                                <Typography className={classes.iconWrap} variant="body2">
                                                                    {"Edit"}
                                                                </Typography>
                                                            </Button>
                                                        </Grid>: 
                                                        undefined}
                                                    </Grid>
                                                    <Grid item>
                                                        {isAuthenticated && answer.owner == currentUserId ?
                                                        <Grid item>
                                                            <Button color="secondary" className={classes.editButton} onClick={() => handleDeleteModalOpen(answer)}>
                                                                <Typography className={classes.iconWrap} variant="body2">
                                                                    {"Delete"}
                                                                </Typography>
                                                            </Button>
                                                        </Grid>: 
                                                        undefined}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                    {"Updated "}<TimeAgo live={false} date={answer.updated_at} />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        {
                            auth.isAuthenticated && showAddComment ? 
                                <Button variant="text" size="small" style={{textTransform: "none"}} color="inherit" onClick={handleCommentBoxOpen}>
                                    <Typography variant="body2" color="primary">Add comment</Typography>
                                </Button>: 
                            undefined
                        }
                        {
                            auth.isAuthenticated && openCommentBox ? 
                                <AnswerCommentInput currentUserProfileImg={auth.currentUserProfileImg} answerId={answer.id}/>: 
                            undefined
                        }
                    </Grid>
                    <Grid item>
                        {<AnswerCommentRender answerId={answer.id}/>}
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
};