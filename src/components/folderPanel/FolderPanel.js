import classes from './FolderPanel.module.scss';
import {Button, FormControl, IconButton, InputLabel, MenuItem, Select, Snackbar} from "@mui/material";
import FormHelperText from '@mui/material/FormHelperText';
import {useEffect, useState} from "react";
import axios from '../../services/axios';
import CloseIcon from '@mui/icons-material/Close';
import {useOutletContext, useParams} from 'react-router-dom';

function FolderPanel() {

    const { subjectId } = useParams();

    const {onFolderAdded, folders} = useOutletContext();

    const [folderOptions, setFolderOptions] = useState([]);
    const [folder, setFolder] = useState('');

    const [message, setMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        axios.get('folder/types')
            .then(response => {
                setFolderOptions(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const addFolder = () => {
        const typeToAdd = JSON.parse(folder).type;
        if (folders && folders.some(f => f.type.type === typeToAdd)) {
            setMessage("Такая секция уже существует");
            setSnackbarOpen(true);
            return;
        }

        const folderCreateRequest = {
            subjectId,
            type: typeToAdd
        };
        
        axios.post('folder', folderCreateRequest)
            .then(response => {
                onFolderAdded(response.data);
                setFolder('');
                setMessage("Секция добавлена");
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
            <FormControl style={{flex: '0 0 50%'}} size='small'>
                <InputLabel>Секция</InputLabel>
                <Select label="Folder"
                    value={folder}
                    onChange={e => setFolder(e.target.value)}>
                    {folderOptions.map(option =>
                        <MenuItem key={`folderOption_${option.type}`}
                            value={JSON.stringify(option)}>
                            {option.displayName}
                        </MenuItem>)}
                </Select>
                <FormHelperText>Добавить секцию</FormHelperText>
            </FormControl>

            <Button variant="contained" onClick={addFolder}>Добавить</Button>
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

export default FolderPanel;