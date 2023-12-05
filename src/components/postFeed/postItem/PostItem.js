import {Divider, IconButton} from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import classes from './PostItem.module.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import {styled} from '@mui/material/styles';
import React, {useContext, useEffect, useState} from 'react';
import axios from '../../../services/axios';
import FormControlLabel from '@mui/material/FormControlLabel';
import AppCheckbox from '../../ui/AppCheckbox';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import {AppContext} from '../../../App';
import {Link} from "react-router-dom";

const { Fragment } = React;


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
    }
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
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: '8px 8px 0'
}));

const DEFAULT_PAGE_SIZE = 5;

function PostItem({ post, onPostDeleted }) {

    const {user} = useContext(AppContext);

    const [commentText, setCommentText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [comments, setComments] = useState([]);
    const [totalItems, setTotalItems] = useState(null);

    const [commentsExpanded, setCommentsExpanded] = useState(false);

    useEffect(() => {
        if (commentsExpanded) {
            loadCommentsPage(0)
                .then(payload => {
                    setComments(payload.content);
                });
        }
    }, [post, commentsExpanded]);

    const loadCommentsPage = (page, size = DEFAULT_PAGE_SIZE) => {
        return axios.get('comment/filterByPost', { params: { postId: post.id, page, size } })
            .then(response => {
                const payload = response.data;
                setTotalItems(payload.totalSize);
                return payload;
            })
            .catch(error => {
                console.log(error);
                return error;
            });
    }

    const getAttachedFile = () => {
        if (!post.files || !post.files.length) return null;

        const fileObj = post.files[0];
        const fileUrl = `${process.env.REACT_APP_BASEURL}/files?filename=${fileObj.savedByName}`;

        if (isImageExtension(fileObj.originalName)) {
            return <img width={'100%'} src={fileUrl} alt='Attached image'></img>;
        }
        return (<a href={fileUrl}>{fileObj.originalName}</a>);
    }

    const addNewComment = () => {
        const commentObject = {
            postId: post.id,
            text: commentText,
            isAnonymous
        };
        axios.post('comment', commentObject)
            .then(response => {
                setCommentText('');
                setComments([response.data, ...comments]);
                setTotalItems(prevSize => prevSize + 1);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteComment = (comment) => {
        axios.delete(`comment/${comment.id}`)
            .then(_response => {
                setComments(comments.filter(c => c.id !== comment.id));
                setTotalItems(prevSize => prevSize - 1);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deletePost = () => {
        axios.delete(`post/${post.id}`)
            .then(_response => {
                onPostDeleted(post);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getAllCommentElements = () => {
        const getCommenterUsername = (comment) => {
            if (comment.user) {
                return comment.user.username;
            }
            return (<div className={classes.anonymousUser}>
                <span>Аноним</span>
                <Tooltip title="Данный комментарий оставлен анонимно" placement="right">
                    <HelpOutlineIcon style={{ width: '20px', height: '20px' }} />
                </Tooltip>
            </div>);
        }

        const getCommentActions = (comment) => {
            if (user.roles && user.roles.indexOf('MODERATOR') !== -1) {
                return (<div className={classes.actions}>
                    <Tooltip placement="top" title="Удалить комментарий">
                        <IconButton style={{ padding: '0' }}
                            onClick={e => deleteComment(comment)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>);
            }
            return null;
        }

        return comments.map(c => {
            const timestamp = new Date(c.createdAt);
            const formattedTime = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();

            return <div className={classes.comment}>
                <div className={classes.usernameAndActions}>
                    <span style={{flexGrow: '1'}}>{getCommenterUsername(c)}</span>

                    {getCommentActions(c)}
                </div>

                <div style={{ marginLeft: '8px' }}>
                    <div>{c.text}</div>
                    <div className={classes.createdAt}>
                        {formattedTime}
                    </div>
                </div>
                <Divider style={{ marginTop: '4px' }} />
            </div>
        });
    }

    const getOldCommentsWithoutIntersecting = (newPage) => {
        const commentsCopy = comments.slice();
        newPage.forEach(el => {
            const indexInOldArray = commentsCopy.findIndex(c => c.id === el.id);
            if (indexInOldArray !== -1) {
                commentsCopy.splice(indexInOldArray, 1);
            }
        });
        return commentsCopy;
    }

    const onShowMoreClick = (e) => {
        e.preventDefault();
        if (comments.length < totalItems) {
            const nextPage = Math.floor(comments.length / DEFAULT_PAGE_SIZE);
            loadCommentsPage(nextPage)
                .then(payload => {
                    const anotherPage = payload.content;
                    setComments([...getOldCommentsWithoutIntersecting(anotherPage), ...anotherPage]);
                });
        }
    }

    const getShowMoreButton = () => {
        if (totalItems !== null && comments.length < totalItems) {
            return (<a href='#' onClick={onShowMoreClick}>Показать больше</a>);
        }
        return null;
    }

    const getPostActions = () => {
        if (user.roles && user.roles.indexOf('MODERATOR') !== -1) {
            return (<div className={classes.actions}>
                <Tooltip placement="top" title="Удалить пост">
                    <IconButton style={{ padding: '0' }}
                        onClick={deletePost}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>);
        }
        return null;
    }

    return (<div key={`post${post.id}`} className={classes.container}>
        <div className={classes.mainContent}>
            <div className={classes.postUsernameAndActions}>
                <Link to={`/users/${post.user.username}`}>
                    {post.user.username}
                </Link>

                {getPostActions()}
            </div>
            <div className={classes.text} style={{ marginBottom: '10px' }}>
                {post.text}
            </div>
            {getAttachedFile()}
        </div>

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
                    {getShowMoreButton()}

                    <div className={classes.addCommentSection}>
                        <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            className={classes.textArea}
                            placeholder='Оставить комментарий'>
                        </textarea>

                        <div className={classes.controls}>
                            <IconButton color="primary"
                                disabled={!commentText}
                                onClick={addNewComment}>
                                <SendIcon />
                            </IconButton>

                            <FormControlLabel className={classes.anonymousCheckbox}
                                labelPlacement="start"
                                control={<AppCheckbox
                                    onChange={e => setIsAnonymous(e.target.checked)}
                                    checked={isAnonymous} />}
                                label="Анонимно" />
                        </div>
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    </div>);
}

export default PostItem;