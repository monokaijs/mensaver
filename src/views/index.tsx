import React from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import Home from "./Home";

const AppViews = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<AppLayout/>}>
          <Route index element={<Home/>}/>
        </Route>
      </Routes>
    </HashRouter>
  )
};

export default AppViews;
