import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SubWayGame from "./page/SubWayGame";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SubWayGame />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
