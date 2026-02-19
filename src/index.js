import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Components/App/App.jsx";
import LeadContextProvider from "./Context/LeadContext/lead.context.jsx";
import ContactContextProvider from "./Context/ContactContext/contact.context.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LeadContextProvider>
    <ContactContextProvider>
      <App />
    </ContactContextProvider>
  </LeadContextProvider>,
);
