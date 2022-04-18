import React from "react";
import { List } from "@material-ui/core";
import NavMenuItem from "@protego/sdk/UI/NavMenuItem/NavMenuItem";
import NavSection from "./NavSection";
import NavMenuCollapse from "@protego/sdk/UI/NavMenuCollapse/NavMenuCollapse";

function Navigation(props) {
  const { menuItems, drawerType } = props;
  return (
    <List component="nav" disablePadding className="side-nav-menu">
      {menuItems.map((item, index) => {
        switch (item.type) {
          case "section":
            return <NavSection drawerType={drawerType} {...item} key={index} />;
          case "collapse":
            return <NavMenuCollapse {...item} key={index} />;
          case "item":
            return <NavMenuItem {...item} key={index} />;
          default:
            return "";
        }
      })}
    </List>
  );
}

export default Navigation;
