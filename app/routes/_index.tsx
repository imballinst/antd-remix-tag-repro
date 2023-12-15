import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Badge, Tag } from "antd";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix All Tag Colors</h1>
      <ul>
        <li>
          <Link to="/default-tag">Go to other page with only default tag</Link>
        </li>
      </ul>

      <div>
        <Tag color="success">Success</Tag>
        <Tag color="warning">Warning</Tag>
      </div>

      <div>
        <Badge status="success" text="Success" />
        <Badge status="warning" text="Warning" />
      </div>
    </div>
  );
}
