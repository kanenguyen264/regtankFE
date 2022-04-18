import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import React, { useState } from "react";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const StyledMenu = styled(Menu, {
  elevation: 0,
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "right",
  },
})({
  "& .MuiPaper-root": {
    boxShadow: "0px 0px 8px rgba(37, 40, 43, 0.12)",
    borderRadius: "8px",
    width: toRem(256),
  },
  "& .MuiMenuItem-root": {
    padding: `${toRem(12)} ${toRem(16)}`,
    fontWeight: "500",
    fontSize: toRem(12),
    lineHeight: toRem(16),
    color: '#606E7B',
  },
});

const useStyles = makeStyles((theme) => ({
  myClassName: {
    left: 11,
    borderRadius: 6,
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(0, 128, 255, 0.04)",
      color: "#0080FF",
    },
  },
}));

const LongMenu = ({onSelected, data, id, ...props}) => {
    const [anchorEl, setAnchorEl] = useState();
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onSelectedItem = (option) => {
    setAnchorEl(null);
    onSelected(option, id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        className={classes.myClassName}
        aria-label="More"
        onClick={handleClick}
        style={{ padding: 0, borderRadius: 0 }}
      >
        <MoreHoriz />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        {...props}
      >
        {data?.map((option) => (
          <MenuItem
            key={option.id}
            selected={option === "Pyxis"}
            onClick={() => onSelectedItem(option)}
          >
            <IntlMessages id={option.label} />
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};

export default LongMenu;
