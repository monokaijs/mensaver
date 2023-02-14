import React from "react";
import {Card, Col, Row} from "antd";

const AnalyticsCard = () => {
  return (
    <Card
      bordered={false}
      style={{marginBottom: 16}}
    >
      <h2>
        123
      </h2>
    </Card>
  )
}

export default function Home() {
  return (
    <div style={{marginTop: 32}}>
      <Row gutter={16}>
        <Col sm={12} md={6}>
          <AnalyticsCard/>
        </Col>
        <Col sm={12} md={6}>
          <AnalyticsCard/>
        </Col>
        <Col sm={12} md={6}>
          <AnalyticsCard/>
        </Col>
        <Col sm={12} md={6}>
          <AnalyticsCard/>
        </Col>
      </Row>
    </div>
  )
}
