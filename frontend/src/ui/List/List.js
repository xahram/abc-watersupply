import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
  navLinkActiveStyle: {
    borderRight: `5px solid ${theme.palette.grey[500]}`,
  },
}));

export default function CustomList({ list }) {
  const classes = useStyles();

  return (
    <List>
      {list.map((lk, index) => (
        <ListItem
          button
          key={lk.name}
        
        >
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText>
            <MenuItem
              component={NavLink}
              to={lk.address}
              activeClassName={classes.navLinkActiveStyle}
            >
              {lk.name}
            </MenuItem>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export function UtilityList({ list, icon }) {
  return (
    <List>
      {list.map((item, index) => (
        <ListItem button key={item.size}>
          <ListItemIcon>
            <icon />
          </ListItemIcon>
          <ListItemText>{item.size}</ListItemText>
          <ListItemText>{item.price}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
