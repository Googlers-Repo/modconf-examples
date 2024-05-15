import React from "react"
import { Button, Stack, TextField, Alert, AlertTitle } from "@mui/material"
import { useActivity } from "@mmrl/hooks"
import { Page, Toolbar } from "@mmrl/ui"

export default () => {
  const { context } = useActivity()

  const currentBattery = React.useMemo(() => Number(Shell.cmd("cmd battery get level").result()), [])
  const [battery, setBattery] = React.useState(currentBattery);

  const handleReset = () => {
    setBattery(() => {
      Shell.cmd("cmd battery reset").exec()
      return currentBattery
    })
  };

  const handleSetBattery = () => {
    if (Math.sign(battery) === -1) {
      os.toast("Can't set a negative battery percentage!")
    } else {
      if (battery <= 4) {
        os.toast("Can't set battery level lower than 5%", Toast.LENGTH_SHORT)
      } else {
        Shell.cmd(`cmd battery set level ${String(battery)}`).exec()
      }
    }
  }

  const inputHandler = (e) => {
    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 9)
  }

  const changeHandler = (e) => {
    setBattery(e.target.value)
  }

  const renderToolbar = () => {
    return (
      <Toolbar
        modifier="noshadow"
        sx={{
          background: "rgb(188,2,194)",
          background: "linear-gradient(22deg, rgba(188,2,194,1) 0%, rgba(74,20,140,1) 100%)",
        }}>
        <Toolbar.Left>
          <Toolbar.BackButton onClick={context.popPage} />
        </Toolbar.Left>
        <Toolbar.Center>Fake Battery</Toolbar.Center>
      </Toolbar>
    )
  }

  return (
    <Page renderToolbar={renderToolbar} sx={{ p: 1 }}>
      <Alert variant="outlined" severity="error" sx={{ mt: 1 }}>
        <AlertTitle>Attention!</AlertTitle>
        Be aware of unexpected reboots! Negative battery can lead the device to a endless "Reboot..." screen. MMRL is not responsible for any damages to files, the device etc!
      </Alert>

      <Stack
        sx={{ mt: 2, width: "100%" }}
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <TextField
          type="number"
          label="Battery level"
          fullWidth
          variant="outlined"
          value={battery}
          onInput={inputHandler}
          onChange={changeHandler} />
        <Button sx={{ height: "unset" }} fullWidth variant="contained" onClick={handleSetBattery}>
          Set
        </Button>
        <Button fullWidth variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </Page>
  );
};
