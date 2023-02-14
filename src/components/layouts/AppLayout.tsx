import React from "react";
import {Outlet} from "react-router-dom";
import {AppHeader} from "./AppHeader";
import {Layout} from "antd";
import {BoxedLayout} from "./BoxedLayout";

export default function AppLayout() {
  return (
    <Layout className={'app-layout'}>
      <AppHeader/>
      <Layout.Content>
        <BoxedLayout>
          <Outlet/>
        </BoxedLayout>
      </Layout.Content>
    </Layout>
  )
}
