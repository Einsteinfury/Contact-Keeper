import React, {useState, useContext, useEffect} from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Register = (props) => {

  const context = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const {setAlert} = context;
  const {register, error, clearErrors, isAuthenticated} = authContext;

  useEffect(() => {
    if (isAuthenticated){
      props.history.push('/');
    }

    if (error === 'User already exists'){
      setAlert(error, 'danger');
      clearErrors();
    }
    //eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  
  const {name, email, password, passwordConfirm} = user;
  
  const onChange = (e) => setUser({
    ...user, [e.target.name]: e.target.value
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === ''){
      setAlert('Please enter all fields', 'danger');
    }

    else if (password !== passwordConfirm) {
      setAlert('Passwords don\'t match', 'danger');
    }

    else {
      register({
        name,
        email,
        password
      });
    }
  }

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required minLength="6" />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input type="password" name="passwordConfirm" value={passwordConfirm} onChange={onChange} required />
        </div>
        <input type="submit" vlaue="register" className="btn btn-primary btn-block" required minLength="6" />
      </form>
    </div>
  )
}

export default Register
