import {Autocomplete, Breadcrumbs, Divider, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import classes from './Sidebar.module.scss';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from '../../services/axios';

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const courseOptions = Array.from(Array(6), (e, i) => i + 1);
    const [subjects, setSubjects] = useState([]);
    const [folders, setFolders] = useState([]);

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
        if (!course) return;
        setSubject('');
        axios.get('subject/filterByCourse', { params: { course } })
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [course]);

    useEffect(() => {
        if (!subject) return;
        setFolder('');
        axios.get('folder/filterBySubject', { params: { subjectId: subject.id } })
            .then(response => {
                setFolders(response.data);
            })
            .catch(error => {
                console.log(error);
            });
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

    const getNavigationInfo = () => {
        const breadcrumbs = [];
        if (course) {
            breadcrumbs.push(`Курс ${course}`);
        }
        if (course && subject) {
            breadcrumbs.push(subject.name);
        }
        if (course && subject && folder) {
            const folderObject = JSON.parse(folder);
            breadcrumbs.push(folderObject.type.displayName);
        }
        if (breadcrumbs.length === 0) return null;

        return <Breadcrumbs aria-label="breadcrumb" style={{marginBottom: '14px'}}>
                {breadcrumbs.map(t => <span key={`navigation_${t}`}
                                            className={classes.segmentLabel}>{t}</span>)}
            </Breadcrumbs>;
    }

    const onSubjectAdded = (subject) => {
        setSubjects([...subjects, subject]);
    }

    const onFolderAdded = (folder) => {
        setFolders([...folders, folder]);
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
                    getOptionLabel={option => option.name ?? option}
                    noOptionsText='Нет предметов'
                    onChange={(_event, newValue) => setSubject(newValue)}
                    renderInput={(params) =>
                        <TextField {...params} variant='standard' label="Предмет" />}
                />

                <FormControl variant='standard' size='small'>
                    <InputLabel>Секция</InputLabel>
                    <Select label="Folder"
                        disabled={!subject}
                        value={folder}
                        onChange={e => setFolder(e.target.value)}>

                        {
                            folders.length > 0 ? folders.map(f =>
                                <MenuItem key={`actualFolder_${f.type.type}`}
                                    value={JSON.stringify(f)}>{f.type.displayName}</MenuItem>) :
                                <div className={classes.noOptions}>Нет секций</div>
                        }
                    </Select>
                </FormControl>
            </div>
        </div>

        <div className={classes.verticalDivider}/>
        
        <div className={classes.mainContentContainer}>
            {getNavigationInfo()}
            <Outlet context={{onSubjectAdded, onFolderAdded, folders}} />
        </div>
    </div>);
}

export default Sidebar;