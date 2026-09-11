import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { metroSystems } from "../data/subwayStations";

const SubWayGame = () => {
  const { metroId, lineId } = useParams();
  const navigate = useNavigate();
  const metro = metroSystems.find((item) => item.id === metroId);
  const selectedLine = metro?.lines.find((item) => item.id === lineId);
  const [randomStation, setRandomStation] = useState<string | null>(null);
  const stationIndex = randomStation ? selectedLine?.stations.indexOf(randomStation) ?? -1 : -1;

  useEffect(() => {
    const title = selectedLine ? `${metro!.city} ${selectedLine.name} 랜덤 역 뽑기 | 지하철 어디` : metro ? `${metro.city} 지하철 노선 선택 | 지하철 어디` : "전국 지하철 랜덤 역 선택기 | 지하철 어디";
    const description = selectedLine ? `${metro!.name} ${selectedLine.name} 주요 역 중 만날 장소를 무작위로 골라보세요.` : metro ? `${metro.name} 노선을 선택하고 만날 역을 랜덤으로 정해보세요.` : "지역과 지하철 노선을 선택하면 만날 역을 무작위로 골라드려요.";
    document.title = title;
    const setMeta = (selector: string, value: string) => document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", value);
    setMeta('meta[name="description"]', description); setMeta('meta[property="og:title"]', title); setMeta('meta[property="og:description"]', description); setMeta('meta[name="twitter:title"]', title); setMeta('meta[name="twitter:description"]', description);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", `https://trainivf.com${location.pathname}`);
  }, [metro, selectedLine]);

  const drawStation = () => {
    if (!selectedLine?.stations.length) return;
    const candidates = selectedLine.stations.filter((station) => station !== randomStation);
    setRandomStation(candidates[Math.floor(Math.random() * candidates.length)] || selectedLine.stations[0]);
  };

  if (metroId && !metro) {
    return <main className="metro-page"><section className="empty-route"><h1>지역을 찾을 수 없어요</h1><Link to="/">지역 다시 선택하기</Link></section></main>;
  }

  if (lineId && !selectedLine) {
    return <main className="metro-page"><section className="empty-route"><h1>노선을 찾을 수 없어요</h1><Link to={`/metro/${metroId}`}>노선 다시 선택하기</Link></section></main>;
  }

  if (!metro) {
    return (
      <main className="metro-page selection-page">
        <header className="metro-hero"><span className="eyebrow">STEP 1 · REGION</span><h1>어느 지역에서<br/>만날까요?</h1><p>이용할 지하철 지역을 먼저 선택해주세요.</p></header>
        <section className="choice-card" aria-labelledby="region-heading">
          <div className="section-title"><span>1</span><div><h2 id="region-heading">지역 선택</h2><p>전국 주요 도시철도를 지원해요.</p></div></div>
          <div className="metro-grid">{metroSystems.map((system) => <Link key={system.id} className="metro-option" to={`/metro/${system.id}`}><span className="city-icon" aria-hidden="true">{system.city.slice(0,1)}</span><span className="option-copy"><b>{system.city}</b><small>{system.name} · {system.lines.length}개 노선</small></span><span className="option-arrow" aria-hidden="true">→</span></Link>)}</div>
        </section>
      </main>
    );
  }

  if (!selectedLine) {
    return (
      <main className="metro-page selection-page">
        <nav className="breadcrumb" aria-label="선택 단계"><Link to="/">지역 선택</Link><span>›</span><strong>노선 선택</strong></nav>
        <header className="metro-hero compact"><span className="eyebrow">STEP 2 · LINE</span><h1>{metro.city}에서<br/>어떤 노선인가요?</h1><p>{metro.description}</p></header>
        <section className="choice-card" aria-labelledby="line-heading">
          <div className="section-title"><span>2</span><div><h2 id="line-heading">{metro.name} 노선</h2><p>탑승할 노선을 선택해주세요.</p></div></div>
          <div className="line-list">{metro.lines.map((line) => <Link key={line.id} className="line-option" style={{"--line-color":line.color} as React.CSSProperties} to={`/metro/${metro.id}/${line.id}`}><i/><span className="option-copy"><strong>{line.name}</strong><small>주요 역 {line.stations.length}개</small></span><span className="option-arrow" aria-hidden="true">→</span></Link>)}</div>
        </section>
      </main>
    );
  }

  return (
    <main className="metro-page result-page" style={{"--line-color":selectedLine.color} as React.CSSProperties}>
      <nav className="breadcrumb" aria-label="선택 단계"><Link to="/">지역 선택</Link><span>›</span><Link to={`/metro/${metro.id}`}>노선 선택</Link><span>›</span><strong>역 뽑기</strong></nav>
      <header className="route-summary"><span className="route-mark"><i/></span><div><span>{metro.city} · {metro.name}</span><h1>{selectedLine.name}</h1><p>주요 역 {selectedLine.stations.length}곳 중 한 곳을 골라드려요.</p></div><button type="button" onClick={() => navigate(`/metro/${metro.id}`)}>노선 변경</button></header>
      <section className={`station-stage ${randomStation ? "has-result" : ""}`} aria-live="polite">
        <div className="scanner" aria-hidden="true" />
        {randomStation ? <><span className="result-label">DESTINATION SELECTED</span><h2 key={randomStation}>{randomStation}<small>역</small></h2><div className="station-track" aria-label="이전 역, 선택된 역, 다음 역"><div className="track-line" aria-hidden="true"/>{stationIndex > 0 && <div className="track-stop previous"><i/><span>{selectedLine.stations[stationIndex - 1]}</span><small>이전 역</small></div>}<div className="track-stop current"><i/><b>{randomStation}</b><small>선택된 역</small></div>{stationIndex < selectedLine.stations.length - 1 && <div className="track-stop next"><i/><span>{selectedLine.stations[stationIndex + 1]}</span><small>다음 역</small></div>}</div></> : <div className="station-empty"><span className="radar-icon" aria-hidden="true"><i>🚇</i></span><h2>만날 역을 탐색할까요?</h2><p>버튼을 누르면 노선 안에서 무작위로 선택해요.</p></div>}
      </section>
      <button type="button" className="draw-station" onClick={drawStation}><span aria-hidden="true">{randomStation ? "↻" : "🎲"}</span>{randomStation ? "다른 역 다시 뽑기" : "랜덤 역 뽑기"}</button>
    </main>
  );
};
export default SubWayGame;
