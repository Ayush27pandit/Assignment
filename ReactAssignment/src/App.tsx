import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Fetchdata from "./FetchRows/Fetchdata";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div></div>
      <Routes>
        <Route path="/" element={<Fetchdata />} />
      </Routes>
    </>
  );
}

export default App;
