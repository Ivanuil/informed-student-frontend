import classes from './FolderPanel.module.scss';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {folderOptions} from "../sidebar/Sidebar";
import FormHelperText from '@mui/material/FormHelperText';
import {useState} from "react";

function FolderPanel() {

    const [folder, setFolder] = useState('');

    return (<div className={classes.container}>

        <div className={classes.controls}>
            <FormControl sx={{ m: 1, minWidth: 225, margin: 0 }} size='small'>
                <InputLabel>Секция</InputLabel>
                <Select label="Folder"
                        value={folder}
                        onChange={e => setFolder(e.target.value)}>
                    {folderOptions.map(o =>
                        <MenuItem key={`folderOption_${JSON.stringify(o)}`}
                                  value={JSON.stringify(o)}>{o.name}</MenuItem>)}
                </Select>
                <FormHelperText>Добавить секцию</FormHelperText>
            </FormControl>

            <Button variant="contained">Добавить</Button>
        </div>
    </div>);
}

export default FolderPanel;