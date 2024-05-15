import React from "react"
import { List, ListItem, Switch, ListSubheader, ListItemText } from "@mui/material"
import { Page, Toolbar, ListItemDialogEditText } from "@mmrl/ui"

export default () => {
  const renderToolbar = () => {
    return (
      <Toolbar
        modifier="noshadow"
        sx={{
          height: "calc(56px + 10%)",
          background: "rgb(188,2,194)",
          background: "linear-gradient(22deg, rgba(188,2,194,1) 0%, rgba(74,20,140,1) 100%)",
        }}>
        <Toolbar.Left>
          <Toolbar.BackButton />
        </Toolbar.Left>
        <Toolbar.Center sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          display: "flex",
          alignSelf: "center",
          alignItems: "center",
          marginLeft: "calc(-72px + 16px)"
        }}>MMRL Install Tools</Toolbar.Center>
      </Toolbar>
    )
  }

  return (
    <Page
      renderToolbar={renderToolbar}
      sx={{
        top: "calc(56px + 10%) !important"
      }}>
      <List subheader={<ListSubheader>Settings</ListSubheader>}>
        <ListItem>
          <ListItemText primary="Clear terminal" secondary="Clears the terminal after the download" />
          <Switch checked />
        </ListItem>
        <ListItemDialogEditText
          onSuccess={(val) => {
          }}
          inputLabel="Path"
          type="text"
          title="Change curl bin path"
          initialValue={"/system/bin/curl"}
        >
          <ListItemText primary="Change curl bin path" secondary={"/system/bin/curl"} />
        </ListItemDialogEditText>
      </List>
    </Page>
  );
};
