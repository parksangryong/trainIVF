import { createBrowserRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import SubWayGame from "./page/SubWayGame";
import { AdSense } from "./Advertising/AdSense";
import Privacy from "./page/Privacy";

function App({ url }: { url?: string }) {
  const routes = [
    {
      path: "/",
      element: <SubWayGame />,
    },
    { path: "/metro/:metroId", element: <SubWayGame /> },
    { path: "/metro/:metroId/:lineId", element: <SubWayGame /> },
    { path: "/privacy", element: <Privacy /> },
  ];
  const router = url ? createMemoryRouter(routes, { initialEntries: [url] }) : createBrowserRouter(routes);

  return <><RouterProvider router={router} /><AdSense slot={import.meta.env.VITE_ADS_DISPLAY_HORIZONTAL_FOOTER} /><a href="/privacy" style={{display:"block",textAlign:"center",margin:"0 0 28px",color:"#7898a9",fontSize:12}}>개인정보처리방침</a></>;
}

export default App;
