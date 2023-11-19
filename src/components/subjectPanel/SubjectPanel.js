import classes from './SubjectPanel.module.scss';
import {Button, IconButton, Snackbar, TextField} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';

function SubjectPanel() {

    const [subjectName, setSubjectName] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [subjects, setSubjects] = useOutletContext();

    const addSubject = () => {
        const newSubject = {
            id: Math.floor(Math.random() * 1000),
            label: subjectName
        };
        setSubjects([...subjects, newSubject]);
        setSubjectName('');
        setSnackbarOpen(true);
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
                helperText="Добавить новый предмет"
                required
                label="Предмет"
                size="small"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
            />

            <Button variant="contained" onClick={addSubject}>Добавить</Button>
        </div>

        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={snackbarOpen}
            autoHideDuration={4000}
            message="Предмет добавлен"
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