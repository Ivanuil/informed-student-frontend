import {Divider, IconButton, Pagination} from '@mui/material';
import classes from './PostFeed.module.scss';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {useContext, useEffect, useState} from 'react';
import styled from '@emotion/styled';
import axios from '../../services/axios';
import {useParams} from 'react-router-dom';
import PostItem from './postItem/PostItem';
import AppButton from '../ui/AppButton';
import {AppContext} from '../../App';

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

const DEFAULT_PAGE_SIZE = 5;

const MAX_FILE_UPLOAD_SIZE = 5;

function PostFeed() {

    const {setSnackbarState} = useContext(AppContext);

    const { folderId } = useParams();

    const [postText, setPostText] = useState('');

    const [attachedFile, setAttachedFile] = useState(null);

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(null);

    const getPageOfPosts = () => {
        const params = {
            folderId,
            size: DEFAULT_PAGE_SIZE,
            page: currentPage - 1
        }
        axios.get('post/filterByFolder', { params })
            .then(response => {
                const pagedResult = response.data;
                setPosts(pagedResult.content);
                setNumberOfPages(pagedResult.totalPages);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getPageOfPosts();
    }, [folderId, currentPage]);

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
            .then(_response => {
                setPostText('');
                setAttachedFile(null);
                getPageOfPosts();
                setSnackbarState({open: true, message: 'Пост успешно добавлен'});
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handlePageChange = (_event, value) => {
        setCurrentPage(value);
    }

    const isFileTooLarge = () => {
        return attachedFile ? attachedFile.size > (MAX_FILE_UPLOAD_SIZE * 1024 * 1024) : false;
    }

    const getFileInfo = () => {
        if (!attachedFile) return <div/>;

        return (<div>
            <div className={classes.fileName}>
                {attachedFile.name}
            </div>
            {
                isFileTooLarge() && <div className={classes.fileTooLarge}>
                    Максимальный размер файла - {MAX_FILE_UPLOAD_SIZE} МБ
                </div>
            }
        </div>);
    }

    const onPostDeleted = () => {
        if (posts.length === 1 && currentPage !== 1) {
            setCurrentPage(prevPage => prevPage - 1);
        } else {
            getPageOfPosts();
        }
    }

    return (<div className={classes.container}>
        
        <div className={classes.posts}>
            <div className={classes.addPost}>
            <textarea rows={3} className={classes.textArea}
                      placeholder='Напишите новый пост'
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}>
            </textarea>

                <Divider style={{margin: '8px 0'}} />

                <div className={classes.controls}>
                    {getFileInfo()}

                    <div className={classes.buttons}>

                        <IconButton component="label">
                            <AttachFileIcon style={{transform: 'rotate(30deg)'}}/>
                            <VisuallyHiddenInput type="file"
                                                 accept="image/png, image/jpeg, application/pdf"
                                                 onChange={handleFileChange} />
                        </IconButton>

                        <AppButton 
                                appVariant="secondary"
                                onClick={addPost}
                                disabled={isFileTooLarge() || !postText}>
                            Добавить
                        </AppButton>
                    </div>
                </div>
            </div>
            {posts && posts.map(p => <PostItem post={p}
                onPostDeleted={onPostDeleted} />)}
        </div>
        {
            numberOfPages > 0 &&
            <div className={classes.pagination}>
                <Pagination count={numberOfPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    size="large" />
            </div>
        }
    </div>);
}

export default PostFeed;