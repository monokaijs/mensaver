import { Layout } from "antd";
import React from "react";
import {BoxedLayout} from "./BoxedLayout";
import {AppLogo} from "../common/AppLogo";

const AppLinks = () => {
  return (
    <div className={'app-links'}>
      <BoxedLayout>
        Some links goes here
      </BoxedLayout>
    </div>
  )
}

export const AppHeader = () => {
  return (
    <div>
      <Layout.Header style={{padding: 0}}>
        <BoxedLayout>
          <AppLogo/>
        </BoxedLayout>
      </Layout.Header>
      <AppLinks/>
    </div>
  )
}
