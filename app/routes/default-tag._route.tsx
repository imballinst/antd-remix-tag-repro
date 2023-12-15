import type { MetaFunction } from "@remix-run/node";
import { Tag } from "antd";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function DefaultTAg() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a href="/">
            Go to other page with all kind of tag colors
          </a>
        </li>
      </ul>

      <div>
        <Tag>Hello</Tag>
      </div>
    </div>
  );
}
