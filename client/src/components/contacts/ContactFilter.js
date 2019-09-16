import React, {useContext, useRef, useEffect} from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactFilter = () => {
const context = useContext(ContactContext);
const text = useRef('');

useEffect(() => {
  if (context.filtered === null){
    text.current.value = '';
  }
});

const onChange = e => {
  if (text.current.value !== ''){
    context.filterContacts(e.target.value);
  }
  else {
    context.clearFilter();
  }
}

  return (
    <form>
      <input ref={text} type="text" placeholder="Filter Contacts..." onChange={onChange} />
    </form>
  )
}

export default ContactFilter
