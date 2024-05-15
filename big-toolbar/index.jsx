import React from "react"
import { List, ListItem, Switch, ListSubheader, ListItemText } from "@mui/material"
import { Page, Toolbar, ListItemDialogEditText } from "@mmrl/ui"

const toolbarHeight = "calc(56px + 10%)"

export default () => {
  const leftWidthRef = React.useRef()
  const rightWidthRef = React.useRef()
  const toolbarHeightRef = React.useRef()
  const [width, setWidth] = React.useState([0, 0, 56])

  React.useEffect(() => {
    if (leftWidthRef.current && rightWidthRef.current && toolbarHeightRef.current) {
      setWidth([leftWidthRef.current.clientWidth, rightWidthRef.current.clientWidth, toolbarHeightRef.current.clientHeight])
    }
  }, [])

  const renderToolbar = () => {
    return (
      <Toolbar
        ref={toolbarHeightRef}
        modifier="noshadow"
        sx={{
          height: toolbarHeight,
          background: "rgb(188,2,194)",
          background: "linear-gradient(22deg, rgba(188,2,194,1) 0%, rgba(74,20,140,1) 100%)",
        }}>
        <Toolbar.Left id="blue" ref={leftWidthRef}>
          <Toolbar.BackButton />
        </Toolbar.Left>
        <Toolbar.Center sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          display: "flex",
          alignSelf: "center",
          alignItems: "center",
        }} style={{
          marginLeft: -width[0] + width[1]
        }}>MMRL Install Tools</Toolbar.Center>

        <Toolbar.Right ref={rightWidthRef}/>
      </Toolbar>
    )
  }

  return (
    <Page
      renderToolbar={renderToolbar}
      sx={{
        top: `${width[2]}px !important`
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
