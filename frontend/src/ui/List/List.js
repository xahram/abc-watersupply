import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { func } from "joi";

export default function CustomList({ list }) {
  return (
    <List>
      {list.map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText>{text}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export function UtilityList({list , icon}) {
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
