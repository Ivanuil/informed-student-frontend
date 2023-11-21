import classes from './SubjectPanel.module.scss';
import {Button, IconButton, Snackbar, TextField} from "@mui/material";
import {useOutletContext, useParams} from "react-router-dom";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import axios from '../../services/axios';

function SubjectPanel() {

    const { course } = useParams();

    const [subjectName, setSubjectName] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const {onSubjectAdded} = useOutletContext();
    const [message, setMessage] = useState('');

    const addSubject = () => {
        const subjectCreateRequest = {
            name: subjectName,
            course
        };
        
        axios.post('subject', subjectCreateRequest)
        .then(response => {
            onSubjectAdded(response.data);
            setSubjectName('');
            setMessage("Предмет добавлен");
            setSnackbarOpen(true);
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

        <div className={classes.controls}>
            <TextField
                style={{flex: '0 0 50%'}}
                helperText="Добавить новый предмет"
                required
                label="Предмет"
                size="small"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
            />

            <Button variant="contained"
                    onClick={addSubject}
                    disabled={!subjectName}>
                Добавить
            </Button>
        </div>

        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={snackbarOpen}
            autoHideDuration={4000}
            message={message}
            onClose={handleSnackbarClose}
            action={<IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}>
                <CloseIcon fontSize="small"/>
            </IconButton>}>

        </Snackbar>

    </div>);
}

export default SubjectPanel;