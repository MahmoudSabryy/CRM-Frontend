import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseURL, myHeaders } from "../../Environment/environment";
import toast from "react-hot-toast";

export const LeadContext = createContext(null);

export default function LeadContextProvider(props) {
  const [leads, setLeads] = useState([]);

  const getAllLeads = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/lead`, {
        headers: myHeaders,
      });

      setLeads(data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const softDeleteLead = async (leadId) => {
    try {
      await axios.delete(`${baseURL}/lead/delete/${leadId}`, {
        headers: myHeaders,
      });
      getAllLeads();

      toast.success("Lead Deleted Successfully ✔");
    } catch (error) {
      toast.error("Unable to delete this lead ❌");

      console.log(error.response);
    }
  };

  useEffect(() => {
    getAllLeads();
  }, []);

  return (
    <LeadContext.Provider
      value={{
        leads,
        softDeleteLead,
        getAllLeads,
        setLeads,
      }}
    >
      {props.children}
    </LeadContext.Provider>
  );
}
