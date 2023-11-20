import {Button, Divider, IconButton, Snackbar} from '@mui/material';
import classes from './PostFeed.module.scss';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import axios from '../../services/axios';
import {useParams} from 'react-router-dom';
import PostItem from './postItem/PostItem';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function PostFeed() {

    const { folderId } = useParams();

    const [postText, setPostText] = useState('');

    const [attachedFile, setAttachedFile] = useState(null);

    const [posts, setPosts] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const params = {
            folderId
        }

        axios.get('post/filterByFolder', { params })
            .then(response => {
                console.log(response.data);
                setPosts(response.data.content);
            })
            .catch(error => {
                console.log(error);
            });
    }, [folderId]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const addPost = () => {
        const postObject = {
            folderId,
            text: postText
        }
        const formData = new FormData();
        formData.append("post", new Blob([JSON.stringify(postObject)], {
            type: "application/json"
        }));
        if (attachedFile) {
            formData.append("files", attachedFile);
        }

        axios.post('post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {

                setSnackbarOpen(true);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (<div className={classes.container}>
        
        <div className={classes.addPost}>
            <textarea rows={3} className={classes.textArea}
                placeholder='Напишите что-нибудь'
                value={postText}
                onChange={(e) => setPostText(e.target.value)}>
            </textarea>

            <Divider style={{margin: '8px 0'}} />

            <div className={classes.controls}>
                
                <span className={classes.fileName}>{attachedFile?.name}</span>

                <div className={classes.buttons}>

                    <IconButton component="label">
                        <AttachFileIcon />
                        <VisuallyHiddenInput type="file"
                            accept="image/png, image/jpeg, application/pdf"
                            onChange={handleFileChange} />
                    </IconButton>

                    <Button variant="contained"
                        onClick={addPost}>
                        Добавить
                    </Button>
                </div>
                

            </div>
        </div>

        {
            posts && posts.map(p => <PostItem post={p} />)
        }

        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={snackbarOpen}
            autoHideDuration={4000}
            message="Пост добавлен"
            onClose={handleSnackbarClose}
            action={<IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}>
                <CloseIcon fontSize="small" />
            </IconButton>}>

        </Snackbar>
    </div>);
}

export default PostFeed;