import type { MetaFunction } from "@remix-run/node";
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
      <h1>Welcome to Remix Default Tag</h1>
      <ul>
        <li>
          <a href="/default-tag">
            Go to other page with only default tag
          </a>
        </li>
      </ul>

      <div>
        <Tag>Hello</Tag>
      </div>
    </div>
  );
}
