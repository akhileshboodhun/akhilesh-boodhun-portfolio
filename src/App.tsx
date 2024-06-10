import NavigationBar from "./components/navigation-bar";
import { createContext, useState } from "react";
// import CardGrid from "./components/card-grid";
// import TracingBeam from "./components/common/tracing-beam";
import TracingBeamDemo from "./components/tracing-beam-demo";
import VortexDemo from "./components/vortex-demo";
import useWindowDimensions from "./hooks/use-window-dimensions";

interface Author {
  name?: string;
  age?: string;
  title?: string;
}
export const AuthorContext = createContext<{
  author?: Author;
  setAuthor?: (author: Author) => void;
}>({});

export const WindowDimensionsContext = createContext<{
  width?: number;
  height?: number;
}>({});

const App = () => {
  const dimensions = useWindowDimensions();
  const [author, setAuthor] = useState<Author>({ title: "Portfolio" });
  return (
    <>
      <WindowDimensionsContext.Provider value={dimensions}>
        <AuthorContext.Provider value={{ author, setAuthor }}>
          <div>
            <VortexDemo />
            <div className="sticky top-0 z-10">
              <NavigationBar />
            </div>
            <div className="w-full h-full z-0 flex justify-center item-center content-center p-10 ">
              <TracingBeamDemo />
            </div>
          </div>
        </AuthorContext.Provider>
      </WindowDimensionsContext.Provider>
    </>
  );
};

export default App;
