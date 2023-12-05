import classes from './Users.module.scss';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import CheckIcon from '@mui/icons-material/Check';
import axios from '../../services/axios';
import {Link} from "react-router-dom";
import BlockIcon from '@mui/icons-material/Block';
import UndoIcon from '@mui/icons-material/Undo';
import Tooltip from "@mui/material/Tooltip";
import {AppContext} from "../../App";


const headCells = [
    {
        id: 'username',
        numeric: false,
        label: 'Имя пользователя',
    },
    {
        id: 'email',
        label: 'Email',
    },
    {
        id: 'role',
        label: 'Роль',
    },
    {
        id: 'banned',
        label: 'Забанен',
        align: 'center'
    },
    {
        id: 'actions',
        label: 'Действия',
        align: 'right'
    },
];

const DEFAULT_ITEMS_PER_PAGE = 5;

function Users() {

    const {setSnackbarState} = useContext(AppContext);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        loadPageOfUsers(0);
    }, []);

    const loadPageOfUsers = (page) => {
        axios.get('admin/users', { params: { page, size: DEFAULT_ITEMS_PER_PAGE }})
            .then(response => {
                const pageData = response.data;
                setTotalItems(pageData.totalSize);
                setData(pageData.content);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const updateUserById = (id, newUser) => {
        const newData = data.map(user => user.id !== id ? user : newUser);
        setData(newData);
    }

    const updateUserBanStatus = (user, isBanned) => {
        const requestBody = {
            userId: user.id,
            isBanned
        }
        axios.post('admin/users/ban', requestBody).then(response => {
            const updatedUser = response.data;
            updateUserById(user.id, updatedUser);
            setSnackbarState({open: true, message: 'Статус пользователя успешно изменен'});
        }).catch(_error => {
            setSnackbarState({open: true, message: 'Не удалось изменить статус пользователя'});
        })
    }

    const getActionsForUser = (user) => {
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

        <div className={classes.table}>
            <div className={classes.header}>Пользователи</div>
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}>
                    <TableHead>
                        <TableRow >
                            {headCells.map((headCell) => (
                                <TableCell
                                    style={{fontWeight: '600', fontSize: '16px'}}
                                    key={headCell.id}
                                    align={headCell.align ?? ''}>
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, _index) => {
                            return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    sx={{ cursor: 'pointer' }}
                                    className={classes.userRow}>

                                    <TableCell
                                        className={classes.usernameCell}
                                        component="th"
                                        scope="row">
                                        <Link to={`/users/${row.username}`}>{row.username}</Link>
                                    </TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell align="center">
                                        {row.banned && <CheckIcon />}
                                    </TableCell>
                                    <TableCell align="right" className={classes.userActions}>
                                        {getActionsForUser(row)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPage={5}
                rowsPerPageOptions={[5]}
                component="div"
                count={totalItems}
                page={page}
                onPageChange={(_event, newPage) => {
                    setPage(newPage);
                    loadPageOfUsers(newPage);
                }}
            />
        </div>
    </div>);
}

export default Users;