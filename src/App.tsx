import { createBrowserRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import SubWayGame from "./page/SubWayGame";
import { AdSense } from "./Advertising/AdSense";

function App({ url }: { url?: string }) {
  const routes = [
    {
      path: "/",
      element: <SubWayGame />,
    },
    { path: "/metro/:metroId", element: <SubWayGame /> },
    { path: "/metro/:metroId/:lineId", element: <SubWayGame /> },
  ];
  const router = url ? createMemoryRouter(routes, { initialEntries: [url] }) : createBrowserRouter(routes);

  return <><RouterProvider router={router} /><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT} /></>;
}

export default App;
