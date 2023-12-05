import {Outlet, useNavigate} from 'react-router-dom';
import './App.scss';
import axios from './services/axios';
import {createContext, useEffect, useState} from 'react';
import CloseIcon from "@mui/icons-material/Close";
import {IconButton, Snackbar} from '@mui/material';

export const AppContext = createContext(null);

function App() {

  const [user, setUser] = useState(null);
  const [snackbarState, setSnackbarState] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    console.log('registering interceptor');
    const interceptor = axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (error.response?.status === 403) {
        setUser(null);
        navigate('/login');
      }
      return Promise.reject(error);
    });

    axios.get('auth/user')
        .then(response => {
          console.log("received shitty user");
          if (!user) {
            setUser(response.data);
          }
          // navigate('main');
        })
        .catch(error => console.log(error));

    return () => {
      console.log('ejecting interceptor');
      axios.interceptors.request.eject(interceptor);
    }
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState({ open: false });
  };

  return (<div className='app'>
    <AppContext.Provider value={{ user, setUser, setSnackbarState }}>
      <Outlet />
    </AppContext.Provider>

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
        <CloseIcon fontSize="small" />
      </IconButton>}>
    </Snackbar>
  </div>);
}

export default App;
