import React from "react";
import {Card, Switch} from "antd";

export default function Settings() {
  return (
    <div className={'page'}>
      <h1>
        Settings
      </h1>
      <Card
        title={'General Settings'}
      >
        <div className={'settings-line'}>
          <Switch/> <span>Warn me about girls' friend request.</span>
        </div>
      </Card>
    </div>
  )
}
