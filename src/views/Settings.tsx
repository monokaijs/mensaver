import React from "react";
import {Card, Switch} from "antd";
import {useAppDispatch, useAppSelector} from "../redux/store";
import {setAppSettings} from "../redux/actions/app.actions";

export default function Settings() {
  const dispatch = useAppDispatch();
  const {settings} = useAppSelector(state => state.app);
  return (
    <div className={'page'}>
      <h1>
        Settings
      </h1>
      <Card
        title={'General Settings'}
      >
        <div className={'settings-line'}>
          <Switch
            checked={settings.warnGirlsFR}
            onChange={(checked) => {
              dispatch(setAppSettings({
                ...settings,
                warnGirlsFR: checked,
              }));
            }}
          /> <span>Warn me about girls' friend request.</span>
        </div>
      </Card>
    </div>
  )
}
