import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Tag } from "antd";

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
        <Tag color="success">Hello</Tag>
        <Tag color="warning">Hello</Tag>
      </div>
    </div>
  );
}
