import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, makeStyles, createStyles } from "@material-ui/core";
import { createTheme } from "./theme/index";
import useSettings from "./hooks/useSettings";
import Routes from "./routes/Routes";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      "*": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      },
      html: {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
        height: "100%",
        width: "100%",
      },
      body: {
        height: "100%",
        width: "100%",
      },
      "#root": {
        height: "100%",
        width: "100%",
      },
    },
  })
);

function App() {
  useStyles();

  const { settings } = useSettings();

  return (
    <div className="App">
      <ThemeProvider theme={createTheme(settings)}>
        <BrowserRouter>
          <Routes></Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
