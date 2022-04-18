import { List } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import NavMenuCollapse from "@protego/sdk/UI/NavMenuCollapse/NavMenuCollapse";
import NavMenuItem from "@protego/sdk/UI/NavMenuItem/NavMenuItem";
import styles from "./NavMenu.module.scss";
import clsx from "clsx";
import React, { useState } from "react";

const NavSection = (props) => {
  const { name, icon, children = [], drawerType } = props;
  const isExpandable = children && children.length > 0;
  const [activeCollapse, setActiveCollapse] = useState(false);

  const MenuCollapse = (
    <List component="div" className="nav-header">
      {/* Display an icon if any */}
      {!!icon && <i className={"zmdi zmdi-hc-fw  zmdi-" + icon} />}
      <IntlMessages id={name} />
    </List>
  );

  const onClickCollapse = (item) => {
    setActiveCollapse(item.active);
  };

  const MenuItemChildren = isExpandable ? (
    <List component="div" disablePadding>
      {children.map((item, index) => {
        switch (item.type) {
          case "section":
            return <NavSection {...item} key={index} />;
          case "collapse":
            return (
              <NavMenuCollapse
                activeCollapse={activeCollapse}
                handleClickMiniSibebar={() => onClickCollapse(item)}
                drawerType={drawerType}
                {...item}
                key={index}
              />
            );
          case "item":
            return (
              <NavMenuItem
                onClick={() => onClickCollapse(item)}
                {...item}
                key={index}
              />
            );
          default:
            return "";
        }
      })}
    </List>
  ) : null;

  return (
    <div className={clsx("nav-section", styles.NavSection)}>
      {MenuCollapse}
      {MenuItemChildren}
    </div>
  );
};

export default NavSection;
