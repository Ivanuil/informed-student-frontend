import classes from './AppCheckbox.module.scss';
import Checkbox from '@mui/material/Checkbox';

function AppCheckbox({appVariant, ...props}) {

    const getClassName = () => {
        if (appVariant === 'secondary') {
            return classes.secondaryCheckbox;
        }
        return classes.primaryCheckbox;
    }

    return <span className={getClassName()}>
        <Checkbox {...props} />
    </span>;
}

export default AppCheckbox;