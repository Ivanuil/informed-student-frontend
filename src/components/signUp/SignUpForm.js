import {Divider, IconButton, Snackbar, TextField} from '@mui/material';
import classes from './SignUpForm.module.scss';
import AppButton from '../ui/AppButton';
import {NavLink, useNavigate} from 'react-router-dom';
import {useContext, useState} from 'react';
import axios from "../../services/axios";
import CloseIcon from "@mui/icons-material/Close";
import {AppContext} from '../../App';

function SignUpForm() {

    const navigate = useNavigate();
    const {setUser} = useContext(AppContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    const [snackbarState, setSnackbarState] = useState({});

    const onUsernameChange = (e) => {
        const newValue = e.target.value;
        setUsername(newValue);

        let errorMsg = '';
        if (newValue.length < 3) {
            errorMsg = 'Имя пользователя не может быть короче 3 символов';
        }
        setUsernameError(errorMsg);
    }

    const onPasswordChange = (e) => {
        const newValue = e.target.value;
        setPassword(newValue);

        let errorMsg = '';
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(.){8,}$/;
        if (!passwordRegex.test(newValue)) {
            errorMsg = `Пароль должен быть более 8 символов, содержать латинские буквы 
            верхнего и нижнего регистра и минимум одну цифру`;
        }
        setPasswordError(errorMsg);
    }

    const onConfirmPasswordChange = (e) => {
        const newValue = e.target.value;
        setConfirmPassword(newValue);

        let errorMsg = '';
        if (newValue !== password) {
            errorMsg = 'Пароли не совпадают';
        }
        setConfirmPasswordError(errorMsg);
    }

    const isDataValid = () => {
        return usernameError?.length === 0
            && passwordError?.length === 0
            && confirmPasswordError?.length === 0;
    }

    const signUp = () => {
        const requestBody = {
            username,
            email,
            password
        }

        axios.post('auth/register', requestBody)
            .then(response => {
                setUser(response.data);
                navigate('/main');
            })
            .catch(error => {
                if (error.response?.status === 409) {
                    setSnackbarState({open: true, message: 'Пользователь с таким именем уже существует'});
                }
                console.log(error);
            });
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarState({open: false});
    };

    return (<div className={classes.container}>

        <div className={classes.card}>
            <h3 className={classes.header}>Регистрация</h3>
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
                label="Email"
                variant="standard"
                value={email}
                onChange={e => setEmail(e.target.value)}/>

            <TextField
                error={!!(passwordError && passwordError.length > 0)}
                required
                value={password}
                onChange={onPasswordChange}
                label="Пароль"
                type="password"
                variant="standard"
                helperText={passwordError} />

            <TextField
                error={!!(confirmPasswordError && confirmPasswordError.length > 0)}
                required
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                label="Подтвердите пароль"
                type="password"
                variant="standard"
                helperText={confirmPasswordError} />

            <AppButton style={{ width: '100%', marginTop: '10px' }}
                disabled={!isDataValid()}
                onClick={signUp}>
                Регистрация
            </AppButton>

            <NavLink to='/login'>
                Уже есть аккаунт?
            </NavLink>
        </div>

        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={snackbarState.open}
            autoHideDuration={4000}
            message={snackbarState.message}
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

export default SignUpForm;