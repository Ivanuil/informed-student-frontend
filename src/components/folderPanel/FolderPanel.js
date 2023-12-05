import classes from './FolderPanel.module.scss';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import FormHelperText from '@mui/material/FormHelperText';
import {useContext, useEffect, useState} from "react";
import axios from '../../services/axios';
import {useOutletContext, useParams} from 'react-router-dom';
import AppButton from '../ui/AppButton';
import {AppContext} from "../../App";

function FolderPanel() {

    const {user, setSnackbarState} = useContext(AppContext);

    const { subjectId } = useParams();

    const {onFolderAdded, folders} = useOutletContext();

    const [folderOptions, setFolderOptions] = useState([]);
    const [folder, setFolder] = useState('');

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
            setSnackbarState({open: true, message: 'Такая секция уже существует'});
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
                setSnackbarState({open: true, message: 'Секция добавлена'});
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getControls = () => {
        if (user?.roles && user.roles.indexOf('MODERATOR') !== -1) {
            return (<div className={classes.controls}>
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

                <AppButton onClick={addFolder}>Добавить</AppButton>
            </div>);
        }
        return <div style={{fontSize: '24px', paddingTop: '10px'}}>
            Выберите секцию
        </div>;
    }

    return (<div className={classes.container}>
        {getControls()}
    </div>);
}

export default FolderPanel;