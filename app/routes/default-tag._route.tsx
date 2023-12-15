import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Badge, Tag } from "antd";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function DefaultTAg() {
  const [isAddedSomething, setIsAddedSomething] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAddedSomething(true);
    }, 1000);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="/">Go to other page with all kind of tag colors</Link>
        </li>
      </ul>

      <div>
        <Tag>Hello</Tag>
      </div>

      <div>{isAddedSomething && <Badge status="success" text="Success" />}</div>
    </div>
  );
}
