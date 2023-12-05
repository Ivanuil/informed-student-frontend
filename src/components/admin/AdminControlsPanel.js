import classes from './AdminControlsPanel.module.scss';
import {Divider, FormControl, IconButton, InputAdornment, InputLabel, Tabs,} from "@mui/material";
import Tab from '@mui/material/Tab';
import {useContext, useState} from "react";
import Input from '@mui/material/Input';
import FormHelperText from "@mui/material/FormHelperText";
import CheckIcon from '@mui/icons-material/Check';
import axios from '../../services/axios';
import {AppContext} from "../../App";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (<div
        role="tabpanel"
        hidden={value !== index}
        {...other}>
        {value === index && children}
    </div>);
}

const MAX_NUMBER = 10000000000;

function AdminControlsPanel() {

    const {setSnackbarState} = useContext(AppContext);

    const [activeTab, setActiveTab] = useState(0);

    const [commentDeletingInterval, setCommentDeletingInterval] = useState('');
    const [ageOfComments, setAgeOfComments] = useState('');

    const changeIntervalForDeletingComments = () => {
        axios.post(`admin/commentsCleaningInterval?seconds=${commentDeletingInterval}`)
            .then(_response => {
                setSnackbarState({open: true, message: 'Интервал успешно изменен'});
            })
            .catch(_error => {
                setSnackbarState({open: true, message: 'Не удалось изменить интервал'});
            });
    }

    const changeAgeOfCommentsToBeDeleted = () => {
        axios.post(`admin/ageOfCommentsToDelete?days=${ageOfComments}`)
            .then(_response => {
                setSnackbarState({open: true, message: 'Интервал успешно изменен'});
            })
            .catch(_error => {
                setSnackbarState({open: true, message: 'Не удалось изменить интервал'});
            });
    }

    const isIntervalValid = () => {
        if (!commentDeletingInterval) {
            return false;
        }
        const intervalNumber = Number(commentDeletingInterval);
        return intervalNumber > 0 && intervalNumber <= MAX_NUMBER;
    }

    const isAgeOfCommentsValid = () => {
        if (!ageOfComments) {
            return false;
        }
        const ageNumber = Number(ageOfComments);
        return ageNumber > 0 && ageNumber <= MAX_NUMBER;
    }

    return (<div className={classes.container}>
        <div className={classes.card}>
            <Tabs
                value={activeTab}
                onChange={(_event, newValue) => {
                    console.log(newValue);
                    setActiveTab(newValue)
                }}
                orientation="vertical"
                sx={{borderRight: 1, borderColor: 'divider', flexBasis: '20%'}}>
                <Tab label="Очистка" id={0} />
                <Tab label="Другое" id={1} />
            </Tabs>

            <div className={classes.tabContent}>
                <TabPanel value={activeTab} index={0}>

                    <div className={classes.controls}>
                        <span className={classes.sectionHeader}>Комментарии</span>
                        <Divider />

                        <FormControl className={classes.input} sx={{ m: 0}} variant="standard">
                            <InputLabel>Интервал в секундах</InputLabel>
                            <Input
                                value={commentDeletingInterval}
                                onChange={e => setCommentDeletingInterval(e.target.value)}
                                type='number'
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        disabled={!isIntervalValid()}
                                        onClick={changeIntervalForDeletingComments}>
                                        <CheckIcon />
                                    </IconButton>
                                </InputAdornment>
                            }/>
                            <FormHelperText>Интервал очистки комментариев (max 10^10)</FormHelperText>
                        </FormControl>

                        <FormControl className={classes.input} sx={{ m: 0}} variant="standard">
                            <InputLabel>Возраст в днях</InputLabel>
                            <Input
                                value={ageOfComments}
                                onChange={e => setAgeOfComments(e.target.value)}
                                type='number'
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        disabled={!isAgeOfCommentsValid()}
                                        onClick={changeAgeOfCommentsToBeDeleted}>
                                        <CheckIcon />
                                    </IconButton>
                                </InputAdornment>
                            }/>
                            <FormHelperText>Возраст комментариев для удаления (max 10^10)</FormHelperText>
                        </FormControl>
                    </div>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>

                </TabPanel>
            </div>
        </div>
    </div>);
}

export default AdminControlsPanel;