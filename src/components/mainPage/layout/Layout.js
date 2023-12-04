import classes from './Layout.module.scss';
import AppButton from '../../ui/AppButton';
import {AppContext} from '../../../App';
import axios from '../../../services/axios';
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';


function Layout({children}) {

    const {user, setUser} = useContext(AppContext);
    const navigate = useNavigate();

    const signOut = () => {
        axios.post('auth/logout')
            .then(_response => {
                setUser(null);
                navigate('/login');
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (<div className={classes.container}>
        <header className={classes.header}>
            <span>{user.username}</span>
            <AppButton appVariant='text'
                variant='text'
                style={{ fontSize: '16px' }}
                onClick={signOut}>
                Выйти
            </AppButton>
        </header>

        {children}
    </div>);
}

export default Layout;