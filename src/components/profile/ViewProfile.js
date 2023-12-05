import {Divider, IconButton} from '@mui/material';
import classes from './ViewProfile.module.scss';
import Avatar from '@mui/material/Avatar';
import React, {useContext, useEffect, useState} from 'react';
import axios from '../../services/axios';
import {useParams} from "react-router-dom";
import {genders} from './genders';
import UndoIcon from "@mui/icons-material/Undo";
import BlockIcon from "@mui/icons-material/Block";
import Tooltip from "@mui/material/Tooltip";
import {AppContext} from "../../App";

function ViewProfile() {

    const {user, setSnackbarState} = useContext(AppContext);

    const { username } = useParams();

    const [userInfo, setUserInfo] = useState(null);
    const [profileUser, setProfileUser] = useState(null);

    useEffect(() => {
        fetchUserInfo(username);
    }, [username]);

    const fetchUserInfo = (username) => {
        axios.get('userInfo', { params: { username } })
            .then(response => {
                const userInfo = response.data;
                setUserInfo(userInfo);
            })
            .catch(error => {
                console.log(error);
            });
        if (user?.roles && user.roles.indexOf('ADMIN') !== -1) {
            axios.get(`admin/users/${username}`)
                .then(response => {
                    setProfileUser(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    const getGenderText = () => {
        if (userInfo?.gender) {
            const genderObj = genders.find(g => g.value === userInfo.gender);
            return genderObj.label;
        }
        return 'Не указано';
    }

    // todo: duplicate code
    const updateUserBanStatus = (user, isBanned) => {
        const requestBody = {
            userId: user.id,
            isBanned
        }
        axios.post('admin/users/ban', requestBody).then(response => {
            setSnackbarState({open: true, message: 'Статус пользователя успешно изменен'});
            const updatedUser = response.data;
            setProfileUser(updatedUser);
        }).catch(_error => {
            setSnackbarState({open: true, message: 'Не удалось изменить статус пользователя'});
        })
    }

    const getActionsForUser = () => {
        if (!profileUser || profileUser.username === user.username) {
            return null;
        }
        const tooltipText = user.banned ? 'Разблокировать' : 'Заблокировать';
        const clickHandler = user.banned ? () => updateUserBanStatus(user, false)
            : () => updateUserBanStatus(user, true);
        const actionIcon = user.banned ? <UndoIcon/> : <BlockIcon/>;

        return (<Tooltip placement="top" title={tooltipText}>
            <IconButton style={{padding: '2px'}}
                        onClick={clickHandler}>
                {actionIcon}
            </IconButton>
        </Tooltip>);
    }

    return (<div className={classes.container}>
        <div className={classes.profileCard}>

            <div className={classes.header}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#d3d3d3' }}
                    src={process.env.PUBLIC_URL + '/account_icon.svg'}
                    imgProps={{ style: { width: '3em', height: '3em' } }} />

                <span className={classes.username}>{username}</span>

                <div className={classes.actions}>
                    {getActionsForUser()}
                </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div className={classes.profileData}>
                <div className={classes.labeledProfileData}>
                    <span>Дата рождения:</span>

                    <span>{userInfo?.dateOfBirth ?? 'Не указано'}</span>
                </div>
                <div className={classes.labeledProfileData}>
                    <span>Пол:</span>
                    <span>{getGenderText()}</span>
                </div>
                <div className={classes.labeledProfileData}>
                    <span>Специальность:</span>
                    <span>{userInfo?.specialty ?? 'Не указано'}</span>
                </div>
            </div>
        </div>
    </div>);
}

export default ViewProfile;