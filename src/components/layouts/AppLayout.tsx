import React from "react";
import {Outlet} from "react-router-dom";
import {AppHeader} from "./AppHeader";
import {Layout} from "antd";

export default function AppLayout() {
  return (
    <Layout className={'app-layout'}>
      <AppHeader/>
      <Outlet/>
    </Layout>
  )
}
