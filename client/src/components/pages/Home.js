import React, {useContext, useEffect} from 'react';
import Contacts from '../contacts/Contacts';
import ContactForm from '../contacts/ContactFrom';
import ContactFilter from '../contacts/ContactFilter';
import AuthContext from '../../context/auth/authContext';

const Home = () => {
  const context = useContext(AuthContext);
  const {loadUser} = context;

  useEffect(() => {
    loadUser();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="grid-2">
      <div>
        <ContactForm />
      </div>
      <div>
        <ContactFilter />
        <div className="contact-list">
          <Contacts />
        </div>
      </div>
    </div>
  )
}

export default Home
