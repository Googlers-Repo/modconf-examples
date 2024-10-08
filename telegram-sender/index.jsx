import { Page, Toolbar } from "@mmrl/ui";
import { useActivity, useNativeStorage } from "@mmrl/hooks";
import { TextField, Stack, Button, Box, ButtonGroup, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Send, Add, Delete } from '@mui/icons-material';

export default () => {
  const { context } = useActivity();

  const [validChatId, setValidChatId] = React.useState(false);
  const [validBotToken, setValidBotToken] = React.useState(false);
  const [content, setContent] = useNativeStorage("tgs_content", "");
  const [botToken, setBotToken] = useNativeStorage("tgs_bot_token", "");
  const [chatId, setChatId] = useNativeStorage("tgs_chat_id", "");

  const [buttons, setButtons] = useNativeStorage("tgs_buttons", [
    [{ 'text': '📦 Download', 'url': "https://google.com" }],
    [{ 'text': 'Source', 'url': "https://google.com" }, { 'text': 'Support', 'url': "https://google.com" }],
    [{ 'text': 'Donate', 'url': "https://google.com" }]
  ]);

  const [newButtonText, setNewButtonText] = React.useState('');
  const [newButtonValidText, setNewButtonValidText] = React.useState(false);
  const [newButtonUrl, setNewButtonUrl] = React.useState('');
  const [newButtonValidUrl, setNewButtonValidUrl] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(0); // Default to the first row
  const [image, setImage] = React.useState("")

  React.useEffect(() => {
    if (botToken.length >= (43 || 45)) {
      setValidBotToken(true)
    }
    if (chatId.length >= 1) {
      setValidChatId(true)
    }
  }, [])

  const handleRowChange = (event) => {
    setSelectedRow(event.target.value);
  };

  const addNewButton = () => {
    if (newButtonText && newButtonUrl) {
      const newButton = { text: newButtonText, url: newButtonUrl };
      const updatedButtons = [...buttons];

      // Check if selected row is valid
      if (selectedRow >= updatedButtons.length) {
        // If selected row is out of bounds, add new rows if needed
        updatedButtons.push([newButton]);
      } else {
        // Add button to the selected row
        updatedButtons[selectedRow] = [...updatedButtons[selectedRow], newButton];
      }

      setButtons(updatedButtons);
      setNewButtonText('');
      setNewButtonUrl('');
    }
  };

  const removeButton = (rowIndex, buttonIndex) => {
    const updatedButtons = buttons
      .map((row, i) => (i === rowIndex ? row.filter((_, j) => j !== buttonIndex) : row))
      .filter(row => row.length > 0); // Filter out empty rows

    setButtons(updatedButtons);
  };

  const handleSave = React.useCallback(async () => {
    if (botToken.length <= (43 || 45) || chatId.length <= 1) {
      os.toast("Cannot send a message without Chat ID or Bot Token", Toast.LENGTH_SHORT)
      return
    }

    console.log(image)

    const type = image ? "caption" : "text"

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          [type]: content,
          parse_mode: "Markdown",
          photo: image,
          disable_web_page_preview: false,
          reply_markup: JSON.stringify({
            inline_keyboard: buttons || {}
          })
        }),
      }
    );


    if (response.ok) {
      os.toast("Message sent successfully", Toast.LENGTH_SHORT);
    } else {
      os.toast("Error sending message: " + response.statusText, Toast.LENGTH_SHORT);
    }
  }, [botToken, chatId, content, buttons, image])

  const renderToolbar = () => {
    return (
      <Toolbar
        modifier="noshadow"
        sx={{
          backgroundColor: "rgb(36,161,222)",
        }}
      >
        <Toolbar.Left>
          <Toolbar.BackButton onClick={context.popPage} />
        </Toolbar.Left>
        <Toolbar.Center>Telegram Sender</Toolbar.Center>
        <Toolbar.Right>
          <Toolbar.Button disabled={!(validBotToken && validChatId)} icon={Send} onClick={handleSave} />
        </Toolbar.Right>
      </Toolbar>
    );
  };

  return (
    <Page sx={{ p: 2 }} renderToolbar={renderToolbar}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          required
          label="Bot Token"
          value={botToken}
          error={!validBotToken}
          onInput={(e) => {
            setValidBotToken(e.target.value.length >= (43 || 45))
          }}
          onChange={(e) => {
            setBotToken(e.target.value)
          }}
          variant="filled"
        />
        <TextField
          fullWidth
          label="Chat ID"
          required
          value={chatId}
          error={!validChatId}
          onInput={(e) => {
            setValidChatId(e.target.value.length >= 1)
          }}
          onChange={(e) => {
            setChatId(e.target.value)
          }}
          variant="filled"
        />
      </Stack>
      <TextField
        fullWidth
        label="Message content"
        variant="filled"
        onChange={(e) => {
          setContent(e.target.value);
        }}
        value={content}
        sx={{
          mt: 2,
          height: "25%",
          "& .MuiFilledInput-root": {
            height: "100%",
          },
        }}
        inputProps={{
          style: {
            height: "100%",
            fontFamily: "monospace",
          },
        }}
        multiline
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Image
        </Typography>

        <Button variant="contained" onClick={async () => {
          const chooseModule = new Chooser("image/*");

          chooseModule.onChose = (files) => {
            if (Chooser.isSuccess(files)) {
              setImage(files[0])
            }
          };
          chooseModule.getFiles();
        }}>Add Image</Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Buttons
        </Typography>

        <Box mt={1} mb={2}>
          <FormControl fullWidth variant="filled">
            <InputLabel>Choose Row</InputLabel>
            <Select
              value={selectedRow}
              onChange={handleRowChange}
              label="Choose Row"
            >
              {buttons.map((_, index) => (
                <MenuItem key={index} value={index}>
                  Row {index + 1}
                </MenuItem>
              ))}
              <MenuItem value={buttons.length}>Add New Row</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Stack
          direction="column"
          spacing={1}
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {buttons.map((buttonRow, rowIndex) => (
            <Stack
              key={rowIndex}
              direction="row"
              spacing={1}
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {buttonRow.map((button, buttonIndex) => (
                <ButtonGroup variant="contained" sx={{ width: "100%" }}>
                  <Button sx={{ width: "100%" }}>{button.text}</Button>
                  <Button onClick={() => removeButton(rowIndex, buttonIndex)}>
                    <Delete />
                  </Button>
                </ButtonGroup>
              ))}
            </Stack>
          ))}
        </Stack>

        <Stack
          direction="column"
          spacing={2}
          sx={{
            mt: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              label="Button Text"
              variant="filled"
              value={newButtonText}
              error={!newButtonValidText}
              onInput={(e) => {
                setNewButtonValidText(e.target.value.length >= 1)
              }}
              onChange={(e) => setNewButtonText(e.target.value)}
              fullWidth
            />
            <TextField
              label="Button URL"
              value={newButtonUrl}
              variant="filled"
              error={!newButtonValidUrl}
              onInput={(e) => {
                const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/;
                setNewButtonValidUrl(regex.test(e.target.value))
              }}
              onChange={(e) => setNewButtonUrl(e.target.value)}
              fullWidth
            />
          </Stack>
          <Button
            variant="outlined"
            fullWidth
            disabled={!(newButtonValidText && newButtonValidUrl)}
            color="primary"
            onClick={addNewButton}
            endIcon={<Add />}>
            Add new Button
          </Button>
        </Stack>
      </Box>
    </Page>
  );
}
