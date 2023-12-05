import classes from './Layout.module.scss';
import {AppContext} from '../../../App';
import axios from '../../../services/axios';
import {Fragment, useContext, useState} from 'react';
import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

function Layout() {

    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const menuIsOpen = Boolean(anchorEl);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const signOut = () => {
        axios.post('auth/logout')
            .then(_response => {
                // todo: ??
                setUser(null);
                navigate('/login');
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (<div className={classes.container}>
        <header className={classes.header}>
            <NavLink to="/main">
                <span>Informed student</span>
            </NavLink>

            <div className={classes.actions}>
                <span>{user.username}</span>

                <IconButton
                    onClick={handleAvatarClick}
                    size="small">
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#bdbdbd' }}
                        src={process.env.PUBLIC_URL + '/account_icon.svg'}
                        imgProps={{ style: { width: '1em', height: '1em' } }} />
                </IconButton>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={menuIsOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClose}>
                
                <MenuItem onClick={() => navigate('profile')}>Мой профиль</MenuItem>

                {user.roles.indexOf('ADMIN') !== -1 &&
                <Fragment>
                    <MenuItem onClick={() => navigate('/admin/controls')}>Инструменты администратора</MenuItem>
                    <MenuItem onClick={() => navigate('/admin/users')}>Пользователи</MenuItem>
                </Fragment>}
                <MenuItem onClick={signOut}>Выйти</MenuItem>
            </Menu>
        </header>

        <Outlet />
    </div>);
}

export default Layout;