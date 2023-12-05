import {Divider, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import classes from './Profile.module.scss';
import Avatar from '@mui/material/Avatar';
import {DateField} from '@mui/x-date-pickers/DateField';
import AppButton from '../ui/AppButton';
import {useContext, useEffect, useState} from 'react';
import axios from '../../services/axios';
import {AppContext} from '../../App';
import moment from 'moment/moment';
import {genders} from './genders';


function Profile() {

    const {user, setSnackbarState} = useContext(AppContext);

    const [userInfo, setUserInfo] = useState({});

    const [gender, setGender] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);

    useEffect(() => {
        if (!user) return;

        fetchCurrentUserInfo();
    }, []);

    const fetchCurrentUserInfo = () => {
        axios.get('userInfo', { params: { username: user.username } })
            .then(response => {
                const userInfo = response.data;
                setUserInfo(userInfo);
                setGender(userInfo.gender ?? '');
                setSpecialty(userInfo.specialty ?? '');

                let dateOfBirthObj = null;
                if (userInfo.dateOfBirth) {
                    dateOfBirthObj = moment(userInfo.dateOfBirth, 'YYYY-MM-DD');
                }
                setDateOfBirth(dateOfBirthObj);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const inputsHaveChanged = () => {
        let changed = false;
        if (specialty || userInfo.specialty) {
            changed ||= (specialty !== userInfo.specialty);
        }
        if (gender || userInfo.gender) {
            changed ||= (gender !== userInfo.gender);
        }
        if (dateOfBirth) {
            changed ||= Boolean(dateOfBirth.format('YYYY-MM-DD') !== userInfo.dateOfBirth);
        }
        return changed;
    }

    const saveUserInfo = () => {
        const saveRequestBody = {
            dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
            gender: gender ? gender : null,
            specialty: specialty ? specialty : null,
        }
        
        axios.post('userInfo', saveRequestBody)
            .then(_response => {
                setSnackbarState({open: true, message: 'Данные успешно обновлены'});
                fetchCurrentUserInfo();
            })
            .catch(_error => {
                setSnackbarState({open: true, message: 'Не удалось обновить данные'});
            });
    }

    return (<div className={classes.container}>
        <div className={classes.profileCard}>

            <div className={classes.header}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#d3d3d3' }}
                    src={process.env.PUBLIC_URL + '/account_icon.svg'}
                    imgProps={{ style: { width: '3em', height: '3em' } }} />

                <span className={classes.username}>{user.username}</span>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div className={classes.inputs}>

                {/* <div className={classes.inputControlContainer}>
                    <span>Email:</span>
                    <TextField className={classes.input}
                        label="Email"
                        variant="standard" />
                </div> */}

                <div className={classes.inputControlContainer}>
                    <span>Дата рождения:</span>
                    <DateField className={classes.input}
                        variant="standard"
                        label="Дата рождения"
                        value={dateOfBirth}
                        onChange={newValue => {
                            console.log('date change: ', newValue);
                            setDateOfBirth(newValue);
                        }} />
                </div>

                <div className={classes.inputControlContainer}>
                    <span>Пол:</span>
                    <FormControl className={classes.input}
                        variant='standard' size='small'>
                        <InputLabel>Пол</InputLabel>
                        <Select label="Folder"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}>
                            {genders.map(g =>
                                <MenuItem key={`gender_${g.value}`}
                                    value={g.value}>{g.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>

                <div className={classes.inputControlContainer}>
                    <span>Специальность:</span>
                    <TextField className={classes.input}
                        value={specialty}
                        onChange={e => setSpecialty(e.target.value)}
                        label="Специальность"
                        variant="standard" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '10px' }}>
                    <AppButton
                        appVariant="secondary"
                        disabled={!inputsHaveChanged()}
                        onClick={saveUserInfo}>
                        Сохранить
                    </AppButton>
                </div>
            </div>
        </div>
    </div>);
}

export default Profile;