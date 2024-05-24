import React from "react";
import { Box, Stack, Button } from "@mui/material";
import { Page, Toolbar } from "@mmrl/ui";
import {
  useActivity,
} from "@mmrl/hooks";


const Sound = (props) => {
  const aud = React.useMemo(() => {
    const a = new Audio(String(props.src))
    a.loop = props.loop
    return a
  }, [props.src, props.loop])

  const handlePlay = () => {
    if (aud.isPlaying()) {
      aud.pause()
    } else {
      aud.play()
    }
  }


  return (
    <Box sx={{
      position: 'relative',
      verticalAlign: 'top',
      width: '94px',
      textAlign: 'center',
      wordWrap: 'break-word'
    }}>
      <Box sx={{
        width: '190px',
        margin: '0 auto 25px'
      }}>
        <Box
          style={{ backgroundColor: "#FFFFA0" }} sx={{
            width: '86px',
            height: '84px',
            marginTop: '3px',
            marginLeft: '3px',
            position: 'absolute',
            borderRadius: "50%"
          }}></Box>
        <Box component="button" onClick={handlePlay} sx={{
          ":not(:disabled)": {
            cursor: "pointer"
          },
          ":active": {
            background: 'url(https://www.myinstants.com/media/images/transparent_button_small_sprite.png) no-repeat',
            backgroundPosition: '-109px -5px'
          },
          width: '94px',
          height: '89px',
          position: 'absolute',
          background: 'url(https://www.myinstants.com/media/images/transparent_button_small_sprite.png) no-repeat',
          backgroundPosition: '-5px -5px',
          border: '0',
          display: 'block',
          WebkitAppearance: 'button',
          WebkitTapHighlightColor: 'transparent'
        }}></Box>
        <Box sx={{
          width: '94px',
          height: '89px',
          marginBottom: '5px',
          background: 'url(https://www.myinstants.com/media/images/transparent_button_small_shadow.png) no-repeat'
        }}></Box>
      </Box>
      <Box sx={{
        fontSize: '14px',
        textDecoration: 'underline',
        display: 'block',
        lineHeight: '1.4em',
        height: '2.8em',
        overflow: 'hidden'
      }}>{props.title || "N/A"}</Box>
    </Box>
  )

}

export default () => {
  const { context } = useActivity();


  const renderToolbar = () => {
    return (
      <Toolbar modifier="noshadow">
        <Toolbar.Left><Toolbar.BackButton onClick={context.popPage} /></Toolbar.Left>
        <Toolbar.Center>Soundboard</Toolbar.Center>
      </Toolbar>
    );
  };

  return (
    <Page
      sx={{
        pl: 1,
        pr: 1,
      }}
      modifier="noshadow"
      renderToolbar={renderToolbar}
    >
      <Box sx={{
        display: "grid",
        gridTemplateColumns: " repeat(5, 1fr)",
        gap: 1
      }}>
        <Sound title="Drill" src="https://actions.google.com/sounds/v1/tools/drill_press.ogg" />
        <Sound title="pew pew" src="https://www.myinstants.com/media/sounds/pew_pew-dknight556-1379997159.mp3" />
      </Box>
    </Page>
  );
};

