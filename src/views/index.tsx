import {Button, DatePicker, Space } from "antd";
import React from "react";

const AppViews = () => {
  return (
    <div>
      <Space>
        <DatePicker />
        <Button type="primary">Primary Button</Button>
      </Space>
    </div>
  )
};

export default AppViews;
