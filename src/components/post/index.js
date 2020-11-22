import React from 'react';
import PostDetail from './PostDetailComponent';
import Answer from '../answer/answer';
import { Grid, CircularProgress } from '@material-ui/core';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useStore } from 'react-redux';

const useIsMounted = () => {
    const isMounted = React.useRef(false);
    React.useEffect(() => {
      isMounted.current = true;
      return () => isMounted.current = false;
    }, []);
    return isMounted;
};

const useDidMountEffect = (func, deps) => {
    const didMount = React.useRef(false);

    React.useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

export default function PostView() {

    const answers = useSelector(state => state.Answers)

    const { postId } = useParams();
    const location = useLocation();

    const hash = location.hash.substring(1);

    let refs = null;

    if(answers.status === 'succeeded') {
        refs = answers.answers.reduce((acc, value) => {
            acc[value.id] = React.createRef();
            return acc;
        }, {});
    }

    const scrollTo = (id) =>
    refs[id].current.scrollIntoView({
        //behavior: 'smooth',
        block: 'center',
    });

    /*const didMountRef = React.useRef(false);
    React.useEffect(() => {
        if(didMountRef.current) {
            if(refs && refs[Number(hash)]) {
                scrollTo(Number(hash)); 
                refs[Number(hash)].current.style.animation = 'answer-background-fade 10s';
                console.log('REF FROM INDEX:', refs[Number(hash)]);
            }
        }else didMountRef.current = true
    });*/

    useDidMountEffect(() => {
        console.log("mounted");
    }); 

    React.useEffect(() => {
        if(refs && refs[Number(hash)]) {
            scrollTo(Number(hash)); 
            refs[Number(hash)].current.style.animation = 'answer-background-fade 8s';
            //console.log('REF FROM INDEX:', refs[Number(hash)]);
        }
    }, []);

    return(
        <React.Fragment>
            <Grid container direction="column" justify="flex-end" spacing={4}>
                <Grid item lg={8} sm xs={12}>
                    <PostDetail/>
                </Grid>
                <Grid item lg={8} sm xs={12}>
                    <Answer postId={postId} refs={refs}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}