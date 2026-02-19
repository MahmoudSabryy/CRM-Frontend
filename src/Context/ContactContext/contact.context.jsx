import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseURL, myHeaders } from "../../Environment/environment";

export const ContactContext = createContext(null);

export default function ContactContextProvider(props) {
  const [contacts, setContacts] = useState([]);

  const getAllContacts = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/contact/all`, {
        headers: myHeaders,
      });
      setContacts(data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        getAllContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
}
