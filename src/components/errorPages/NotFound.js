import classes from './NotFound.module.scss';


function NotFound() {

    return (<div className={classes.container}>
        <span className={classes.errorHeader}>404</span>
        <span className={classes.errorDescription}>Страница не найдена -_-</span>
    </div>);
}

export default NotFound;