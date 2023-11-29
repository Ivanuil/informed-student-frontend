import {Outlet, useNavigate} from 'react-router-dom';
import './App.scss';
import axios from './services/axios';
import {createContext, useEffect, useState} from 'react';

export const AppContext = createContext(null);

function App() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (error?.response?.status === 403) {
        setUser(null);
        navigate('/login');
      }
      return Promise.reject(error);
    });

    axios.get('auth/user')
        .then(response => setUser(response.data))
        .catch(error => console.log(error));

    return () => axios.interceptors.request.eject(interceptor);
  }, []);
  
  return (<div className='app'>
    <AppContext.Provider value={user}>
      <Outlet context={{setUser}}/>
    </AppContext.Provider>
  </div>);
}

export default App;
