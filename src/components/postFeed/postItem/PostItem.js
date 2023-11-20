import {Divider, IconButton} from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import classes from './PostItem.module.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import SendIcon from '@mui/icons-material/Send';
import {styled} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import axios from '../../../services/axios';

const isImageExtension = (fileName) => {
    const dotIndex = fileName.lastIndexOf(".");
    if (dotIndex !== -1) {
        const ext = fileName.substring(dotIndex + 1);
        return ['jpg', 'jpeg', 'png', 'webp'].some(f => f.toLowerCase() === ext.toLowerCase());
    }
    return false;
}

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: 'none',
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    padding: '0',
    minHeight: '22px',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        margin: '0'
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: '8px 8px 0',
}));

function PostItem({post}) {

    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const [commentsExpanded, setCommentsExpanded] = useState(false);

    useEffect(() => {
        if (commentsExpanded) {
            getAllPostComments();
        }
    }, [post, commentsExpanded]);

    const getAllPostComments = () => {
        axios.get('comment/filterByPost', { params: { postId: post.id } })
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const getAttachedFile = () => {
        if (!post.files || !post.files.length) return null;
        
        const fileObj = post.files[0];
        const fileUrl = `http://localhost:8080/files?filename=${fileObj.savedByName}`;
        
        if (isImageExtension(fileObj.originalName)) {
            return <img width={'100%'} src={fileUrl} alt='Attached image'></img>;
        }
        return (<a href={fileUrl}>{fileObj.originalName}</a>);
    }

    const addNewComment = () => {
        const commentObject = {
            postId: post.id,
            text: commentText
        };
        axios.post('comment', commentObject)
            .then(response => {
                setCommentText('');
                setComments([...comments, response.data]);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getAllCommentElements = () => {
        return comments.map(c => {
            const timestamp = new Date(c.createdAt);
            const formattedTime = timestamp.toLocaleDateString() +
                ' ' + timestamp.toLocaleTimeString(); 

            return <div className={classes.comment}>
                <div>{c.text}</div>
                <div className={classes.createdAt}>
                    {formattedTime}
                </div>
                <Divider style={{marginTop: '4px'}}/>
            </div>
        });
    }

    return (<div key={`post${post.id}`} className={classes.container}>

        <div className={classes.text} style={{marginBottom: '10px'}}>
            {post.text}
        </div>
        {getAttachedFile()}

        <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
        <Accordion 
            expanded={commentsExpanded}
            onChange={(_e, isExpanded) => setCommentsExpanded(isExpanded)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <span className={classes.commentsLabel}>Обсуждение</span>
            </AccordionSummary>
            <AccordionDetails>
                <div>
                    {getAllCommentElements()}

                    <div className={classes.addCommentSection}>
                        <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            className={classes.textArea}
                            placeholder='Оставить комментарий'>
                        </textarea>

                        <IconButton color="primary"
                            disabled={!commentText}
                            onClick={addNewComment}>
                            <SendIcon />
                        </IconButton>
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    </div>);
}

export default PostItem;