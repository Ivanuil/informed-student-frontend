import {
    Autocomplete, Backdrop,
    Breadcrumbs, CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import classes from './Sidebar.module.scss';
import { subjectData } from './subjectsData';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export const folderOptions = [
    {

        name: 'Контрольная работа',
        id: 1
    },
    {
        name: 'Конспекты семинаров',
        id: 2
    },
    {
        name: 'Литература',
        id: 3
    }
];

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();
    const urlSplit = location.pathname?.split('/');

    const courseOptions = Array.from(Array(6), (e, i) => i + 1);
    const [subjects, setSubjects] = useState(subjectData);
    const [folders, setFolders] = useState(folderOptions);

    const [course, setCourse] = useState('');
    const [subject, setSubject] = useState('');
    const [folder, setFolder] = useState('');

    useEffect(() => {
        const newUrl = getUrlByFilters();
        if (newUrl) {
            navigate(newUrl);
        }
    }, [course, subject, folder]);

    useEffect(() => {
        setSubject('');
    }, [course]);

    useEffect(() => {
        setFolder('');
    }, [subject]);

    function getUrlByFilters() {
        if (!course) return null;
        let url = `/courses/${course}`;
        if (subject) {
            url += `/subjects/${subject.id}`;
        }
        if (subject && folder) {
            const folderObject = JSON.parse(folder);;
            url += `/folders/${folderObject.id}`;
        }
        return url;
    }

    const getAllBreadcrumbs = () => {
        const breadcrumbs = [];
        if (course) {
            breadcrumbs.push(`Курс ${course}`);
        }
        if (course && subject) {
            breadcrumbs.push(subject.label);
        }
        if (course && subject && folder) {
            const folderObject = JSON.parse(folder);
            breadcrumbs.push(folderObject.name);
        }
        return breadcrumbs.map(t => <span key={`navigation_${t}`}
                                          className={classes.segmentLabel}>{t}</span>);
    }

    return (<div className={classes.container}>

        <div className={classes.sidebarContainer}>
            <h3 className={classes.header}>Фильтры</h3>
            <Divider className={classes.divider}/>

            <div className={classes.controls}>
                <FormControl variant='standard' size='small'>
                    <InputLabel>Курс</InputLabel>
                    <Select label="Course"
                            value={course}
                            onChange={e => setCourse(e.target.value)}>
                        {courseOptions.map(o =>
                            <MenuItem key={`course_${o}`}
                                      value={o}>{o}</MenuItem>)}
                    </Select>
                </FormControl>

                <Autocomplete
                    size='small'
                    options={subjects}
                    blurOnSelect
                    disableClearable
                    value={subject}
                    disabled={!course}
                    onChange={(event, newValue) =>
                        setSubject(newValue)}
                    renderInput={(params) =>
                        <TextField {...params} variant='standard' label="Предмет"/>}
                />

                <FormControl variant='standard' size='small'>
                    <InputLabel>Секция</InputLabel>
                    <Select label="Folder"
                            disabled={!subject}
                            value={folder}
                            onChange={e => setFolder(e.target.value)}>

                        {folders.map(o =>
                            <MenuItem key={`actualFolder_${JSON.stringify(o)}`}
                                      value={JSON.stringify(o)}>{o.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </div>
        </div>


        <div className={classes.mainContentContainer}>
            {/*<Backdrop*/}
            {/*    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}*/}
            {/*    open={true}>*/}
            {/*    <CircularProgress color="inherit" />*/}
            {/*</Backdrop>*/}

            <Breadcrumbs aria-label="breadcrumb">
                {getAllBreadcrumbs()}
            </Breadcrumbs>

            <Outlet context={[subjects, setSubjects]} />
        </div>
    </div>);
}

export default Sidebar;