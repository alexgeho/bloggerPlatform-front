import LoginForm from "../components/LoginForm";
import { Row, Col } from "antd";

export default function LoginPage() {
  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8} style={{ display: "flex", justifyContent: "center" }}>
        <LoginForm />
      </Col>
    </Row>
  );
}


