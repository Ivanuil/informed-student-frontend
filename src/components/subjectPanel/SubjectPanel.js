import classes from './SubjectPanel.module.scss';
import {TextField} from "@mui/material";
import {useOutletContext, useParams} from "react-router-dom";
import {useContext, useState} from "react";
import axios from '../../services/axios';
import AppButton from '../ui/AppButton';
import {AppContext} from "../../App";

function SubjectPanel() {

    const {user, setSnackbarState} = useContext(AppContext);

    const { course } = useParams();

    const [subjectName, setSubjectName] = useState('');

    const {onSubjectAdded} = useOutletContext();

    const addSubject = () => {
        const subjectCreateRequest = {
            name: subjectName,
            course
        };

        axios.post('subject', subjectCreateRequest)
            .then(response => {
                onSubjectAdded(response.data);
                setSubjectName('');
                setSnackbarState({message: "Предмет добавлен", open: true});
            })
            .catch(error => {
                if (error.response?.status === 409) {
                    setSnackbarState({message: "Такой предмет уже существует", open: true});
                }
            });
    }

    const getControls = () => {
        if (user?.roles && user.roles.indexOf('MODERATOR') !== -1) {
            return (<div className={classes.controls}>
                <TextField
                    style={{flex: '0 0 50%'}}
                    helperText="Добавить новый предмет"
                    required
                    label="Предмет"
                    size="small"
                    value={subjectName}
                    onChange={e => setSubjectName(e.target.value)}
                />

                <AppButton
                    onClick={addSubject}
                    disabled={!subjectName}>
                    Добавить
                </AppButton>
            </div>);
        }
        return <div style={{fontSize: '24px', paddingTop: '10px'}}>
            Выберите предмет
        </div>;
    }

    return (<div className={classes.container}>
        {getControls()}
    </div>);
}

export default SubjectPanel;