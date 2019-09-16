import React, {Fragment, useContext, useEffect} from 'react';
import ContactContext from '../../context/contact/contactContext';
import AuthContext from '../../context/auth/authContext';
import ContactItem from './ContactItem';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import Spinner from '../layout/Spinner';

const Contacts = () => {
  const context = useContext(ContactContext);
  const authContext = useContext(AuthContext);
  const {contacts, getContacts, loading, filtered} = context;
  
  useEffect(() => {
    if (authContext.isAuthenticated){
      getContacts();
    }
    else {
      context.clearContacts();
    }
    //eslint-disable-next-line
  }, [authContext.isAuthenticated]);

  return (
    <Fragment>
      {contacts !== null && !loading
      ? (<TransitionGroup>
        {filtered !== null
          ? filtered.map((contact) => 
            <CSSTransition key={contact._id} timeout={500} classNames='item'>
              <ContactItem contact={contact} />
            </CSSTransition>
          )
          : contacts.map((contact) => 
            <CSSTransition key={contact._id} timeout={500} classNames='item'>
              <ContactItem contact={contact} />
            </CSSTransition>
          )
        }
      </TransitionGroup>)

      : <Spinner />
      }
    </Fragment>
  )
}

export default Contacts