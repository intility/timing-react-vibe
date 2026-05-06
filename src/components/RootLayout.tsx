import { Nav } from "@intility/bifrost-react";
import { Link, Outlet } from "react-router";
import { ColorModePicker } from "./ColorMode";

export default function RootLayout() {
  return (
    <Nav
      logo={
        <Link className="bf-neutral-link" to="/">
          <Nav.Logo>__APP_NAME__</Nav.Logo>
        </Link>
      }
      top={<ColorModePicker />}
    >
      <Outlet />
    </Nav>
  );
}
