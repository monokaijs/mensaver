import React from "react";
import 'antd/dist/reset.css';
import AppViews from "../../views";
import './options.css';
import {Provider as ReduxProvider} from "react-redux";
import {store} from "../../redux/store";

export default function OptionsPage() {
  return (
    <ReduxProvider store={store}>
      <div className={'options-page'}>
        <AppViews/>
      </div>
    </ReduxProvider>
  )
}
