import {Button} from "@mui/material";
import classes from './AppButton.module.scss';

function AppButton({appVariant, ...props}) {

    const getClassName = () => {
        if (appVariant === 'secondary') {
            return classes.secondaryButton;
        }
        if (appVariant === 'text') {
            return classes.textButton;
        }
        return classes.primaryButton;
    }

    return <div className={getClassName()}>
        <Button variant="contained" {...props} />
    </div>;
}

export default AppButton;