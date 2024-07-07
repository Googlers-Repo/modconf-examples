import { Page, Toolbar, BottomToolbar } from "@mmrl/ui";
import { useActivity } from "@mmrl/hooks";
import { Clear } from "@mui/icons-material";
import { List, ListItem, ListItemText, ListItemButton, Checkbox, Button, Stack, OutlinedInput, Box, InputAdornment, IconButton, Divider } from "@mui/material";
import FlatList from "flatlist-react";

export default () => {
  const pkgs = Shell.cmd(`echo $(pm list packages | cut -d ":" -f 2)`).result().split(" ");
  const [detachList, setDetachList] = React.useState(Shell.cmd("echo $(/data/detach list)").result().split(" "));
  const [search, setSearch] = React.useState("");
  const searchRef = React.useRef(null);
  const { context } = useActivity();

  const renderToolbar = React.useCallback(() => {
    return (
      <Toolbar modifier="noshadow">
        <Toolbar.Left>
          <Toolbar.BackButton onClick={context.popPage} />
        </Toolbar.Left>
        <Toolbar.Center>Zygisk Detach</Toolbar.Center>
      </Toolbar>
    );
  }, []);

  const renderBottomToolbar = React.useCallback(() => {
    return (
      <BottomToolbar sx={(theme) => ({ backgroundImage: "none", backgroundColor: theme.palette.background.default, p: 1 })}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <Button onClick={detachAll} fullWidth variant="contained" size="small">
            Detach
          </Button>
        </Stack>
      </BottomToolbar>
    );
  }, [detachList]);

  const detachAll = React.useCallback(() => {
    const detachArg = detachList.join(" ");
    const res = Shell.cmd(`/data/detach detachall "${detachArg}"`).result();
    os.toast(res, Toast.LENGTH_SHORT);
  }, [detachList]);

  return (
    <Page renderBottomToolbar={renderBottomToolbar} renderToolbar={renderToolbar}>
      <Box
        sx={{
          m: 1,
        }}
      >
        <OutlinedInput
          fullWidth
          inputProps={{
            ref: searchRef,
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              setSearch(e.target.value);
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setSearch("");
                  searchRef.current.value = "";
                }}
                edge="end"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
          placeholder="Search package"
        />
      </Box>

      <List desne>
        <FlatList
          list={pkgs}
          search={{
            by: ["id", "name", "author"],
            term: search,
            caseInsensitive: true,
          }}
          group={{
            by: (a) => (detachList.includes(a) ? "Detached" : "Not Detached"),
            separator: (_, __, label) => <Divider sx={{ mr: 1, mr: 1 }} children={label} />,
          }}
          renderItem={(pkg, key) => (
            <ListItem
              disablePadding
              key={key}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setDetachList((prev) => [...prev, pkg]);
                    } else {
                      setDetachList((prev) => prev.filter((a) => a !== pkg));
                    }
                  }}
                  checked={detachList.includes(pkg)}
                />
              }
            >
              <ListItemButton>
                <ListItemText primary={pkg} />
              </ListItemButton>
            </ListItem>
          )}
          renderOnScroll
          renderWhenEmpty={() => null}
        />
      </List>
    </Page>
  );
};
