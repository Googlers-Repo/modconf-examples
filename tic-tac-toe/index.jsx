import React from "react"
import { Button, Stack, TextField } from "@mui/material"
import { useTheme, useActivity } from "@mmrl/hooks"
import { Page, Toolbar } from "@mmrl/ui"

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const hasWinner = (values) => {
  for (const [i, j, k] of LINES) {
    if (values[i] && values[i] === values[j] && values[j] === values[k])
      return true;
  }
  return false;
};

const DEFAULT_VALUES = Array(9).fill('');

export default () => {
  const [playerOne, setPlayerOne] = React.useState("O");
  const [playerTwo, setPlayerTwo] = React.useState("X");

  const changePlayer = (player) => {
    return player === playerOne ? playerTwo : playerOne;
  };

  const [values, setValues] = React.useState(DEFAULT_VALUES);
  const [player, setPlayer] = React.useState(playerOne);
  const winner = hasWinner(values) ? changePlayer(player) : null;

  const { theme } = useTheme()
  const { context } = useActivity()

  const play = (index) => {
    if (winner) return;
    if (values[index]) return;

    setValues((prevValues) => prevValues.map(
      (value, _index) => (_index === index ? player : value)
    ));
    setPlayer(perPlayer => changePlayer(perPlayer));
  };

  const lobbyMusic = React.useMemo(() => {
    const a = new Audio("https://joeybabcock.me/blog/wp-content/uploads/2019/05/lobby-classic-game.mp3")
    a.loop = true
    return a
  }, [])
  React.useEffect(() => {
    lobbyMusic.play()
    return () => {
      lobbyMusic.pause()
    }
  }, [])

  const reset = () => {
    setValues(DEFAULT_VALUES);
    setPlayer(playerOne);
  };

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
        <Toolbar.Center>Tic Tac Toe</Toolbar.Center>
      </Toolbar>
    )
  }

  return (
    <Page
      renderToolbar={renderToolbar}
      sx={
        {
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          ".grids": {
            display: "flex",
            flexWrap: "wrap",
            width: 300,
            height: 300,
            "*": {
              "width": "100px",
              "height": "100px",
              "border": `3px solid ${theme.palette.divider}`,
              "fontSize": "32px",
              "textAlign": "center",
              "lineHeight": "100px",
              "cursor": "pointer",
              "transition": "background-color 0.3s",
              ":hover": {
                "backgroundColor": theme.palette.background.paper
              },
              ":nth-child(-n + 3)": {
                "borderTop": "unset"
              },
              ":nth-last-child(-n + 3)": {
                "borderBottom": "unset"
              },
              ":nth-child(3n)": {
                "borderRight": "unset"
              },
              ":nth-child(3n + 1)": {
                "borderLeft": "unset"
              },
            },
          },
          ".info": {
            "textAlign": "center",
          },
        }
      }>
      <div className="grids">
        {values.map((value, index) => (
          <div
            role="button"
            tabIndex={0}
            key={index}
            onClick={() => play(index)}
            onKeyPress={() => play(index)}
          >
            {value}
          </div>
        ))}
      </div>
      <Stack
        sx={{ ml: 1, mr: 1 }}
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <div className="info">
          <h3>
            Player: {player}
            {winner && ` | Winner: ${winner}`}
          </h3>
          <Button variant="contained" onClick={reset}>
            Reset
          </Button>
        </div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <TextField label="Player 1" variant="outlined" value={playerOne} onChange={(e) => setPlayerOne(e.target.value)} />
          <TextField label="Player 2" variant="outlined" value={playerTwo} onChange={(e) => setPlayerTwo(e.target.value)} />
        </Stack>
      </Stack>
    </Page>
  );
};
