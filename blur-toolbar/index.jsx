import React from "react"
import { Typography, alpha } from "@mui/material"
import { Page, Toolbar, BottomToolbar } from "@mmrl/ui"
import { useTheme } from "@mmrl/hooks"

export default () => {
  const toolbarHeightRef = React.useRef()
  const [width, setWidth] = React.useState(56)

  const { theme } = useTheme()

  React.useEffect(() => {
    if (toolbarHeightRef.current) {
      setWidth(toolbarHeightRef.current.clientHeight)
    }
  }, [])

  const renderToolbar = () => {
    return (
      <Toolbar
        ref={toolbarHeightRef}
        modifier="noshadow"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(4px)",
          backgroundColor: alpha(theme.palette.background.default, 0.83)
        }}>
        <Toolbar.Left>
          <Toolbar.BackButton />
        </Toolbar.Left>
        <Toolbar.Center>Blur</Toolbar.Center>
      </Toolbar>
    )
  }

  const renderBottomToolbar = () => {
    return (
      <BottomToolbar sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        backdropFilter: "blur(4px)",
        backgroundImage:"none",
        backgroundColor: alpha(theme.palette.background.default, 0.83),
        height: view.getWindowBottomInsets()
      }} />
    )
  }

  return (
    <Page
      renderToolbar={renderToolbar}
      renderBottomToolbar={renderBottomToolbar}
      sx={{ top: "0px !important", bottom: "0px !important" }}>
      <Typography sx={{ padding: 1, paddingTop: width / 8 + 1 }}>
        {[...new Array(50)]
          .map(
            () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
          )
          .join('\n')}
      </Typography>
    </Page>
  );
};
