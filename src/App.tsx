import { Toaster } from "react-hot-toast";
import { Navigation } from "./Routes";
import { GlobalStyle } from "./Styles";
import { GoogleSheetsProvider } from "./contexts/GoogleSheetsContext";
import { toasterStyle } from "./Styles/toaster";

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <GoogleSheetsProvider>
        <Navigation />
        <Toaster position="top-center" toastOptions={toasterStyle} />
      </GoogleSheetsProvider>
    </div>
  );
}

export default App;
