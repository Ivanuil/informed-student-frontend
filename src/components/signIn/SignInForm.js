import {Divider, TextField} from '@mui/material';
import classes from './SignInForm.module.scss';
import AppButton from '../ui/AppButton';
import {NavLink, useNavigate} from 'react-router-dom';
import {useContext, useState} from 'react';
import axios from '../../services/axios';
import {AppContext} from '../../App';

function SignInForm() {

    const {setUser, setSnackbarState} = useContext(AppContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(null);

    const onUsernameChange = (e) => {
        const newValue = e.target.value;
        setUsername(newValue);

        let errorMsg = '';
        if (newValue.length < 3) {
            errorMsg = 'Имя пользователя не может быть короче 3 символов';
        }
        setUsernameError(errorMsg);
    }

    const isDataValid = () => {
        return usernameError?.length === 0 && password.length > 0;
    }

    const signIn = () => {
        const requestBody = {
            username,
            password
        }

        axios.post('auth/login', requestBody)
            .then(response => {
                setUser(response.data);
                navigate('/main');
            })
            .catch(error => {
                setSnackbarState({open: true, message: 'Не удалось войти в аккаунт'});
                console.log(error);
            });
    }

    return (<div className={classes.container}>

        <div className={classes.card}>
            <h3 className={classes.header}>С возвращением!</h3>
            <Divider />

            <TextField
                error={!!(usernameError && usernameError.length > 0)}
                required
                value={username}
                onChange={onUsernameChange}
                label="Имя пользователя"
                variant="standard"
                helperText={usernameError} />

            <TextField
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                label="Пароль"
                type="password"
                variant="standard" />

            <AppButton style={{width: '100%', marginTop: '10px'}} 
                appVariant="secondary"
                disabled={!isDataValid()}
                onClick={signIn}>
                Вход
            </AppButton>

            <NavLink
                to='/signup'>
                Создать аккаунт
            </NavLink>
        </div>
    </div>);
}

export default SignInForm;