import {Layout, Typography} from "antd";
import React from "react";
import {BoxedLayout} from "./BoxedLayout";
import {AppLogo} from "../common/AppLogo";
import {navConfig} from "../../configs/nav.config";
import {Link} from "react-router-dom";

const AppLinks = () => {
  return (
    <div className={'app-links'}>
      <BoxedLayout>
        {navConfig.map((link, index) => (
          <Link to={link.path} key={index} className={'link'}>
            <Typography.Text>
              {link.title}
            </Typography.Text>
          </Link>
        ))}
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
