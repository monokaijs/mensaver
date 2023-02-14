import React from "react";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import Home from "./Home";
import ErrorPage from "./ErrorPage";
import Settings from "./Settings";

const AppViews = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<AppLayout/>}>
          <Route index element={<Home/>}/>
          <Route path={'settings/*'} element={<Settings/>}/>

          <Route path={'*'} element={<ErrorPage/>} />
        </Route>
      </Routes>
    </HashRouter>
  )
};

export default AppViews;
