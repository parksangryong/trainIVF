import { renderToString } from "react-dom/server";
import App from "./App";
import { metroSystems } from "./data/subwayStations";
export const render = (url: string) => renderToString(<App url={url} />);
export const getStaticRoutes = () => ["/", ...metroSystems.flatMap((metro) => [`/metro/${metro.id}`, ...metro.lines.map((line) => `/metro/${metro.id}/${line.id}`)])];
export const getSeo = (url: string) => {
  const [, , metroId, lineId] = url.split("/");
  const metro = metroSystems.find((item) => item.id === metroId);
  const line = metro?.lines.find((item) => item.id === lineId);
  if (line) return { title: `${metro!.city} ${line.name} 랜덤 역 뽑기 | 지하철 어디`, description: `${metro!.name} ${line.name} 주요 역 중 만날 장소를 무작위로 골라보세요.`, canonical: `https://trainivf.com${url}` };
  if (metro) return { title: `${metro.city} 지하철 노선 선택 | 지하철 어디`, description: `${metro.name} 노선을 선택하고 만날 역을 랜덤으로 정해보세요. ${metro.description}.`, canonical: `https://trainivf.com${url}` };
  return { title: "전국 지하철 랜덤 역 선택기 | 지하철 어디", description: "지역과 지하철 노선을 선택하면 만날 역을 무작위로 골라드려요.", canonical: "https://trainivf.com/" };
};
