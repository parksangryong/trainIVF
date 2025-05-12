import { useState } from "react";
import { stations } from "../data/subwayStations";
import styled, { keyframes } from "styled-components";

const LINE_COLORS = {
  1: "#E60012", // 1호선 빨강
  2: "#00A651", // 2호선 초록
  3: "#F5A200", // 3호선 노랑
  4: "#0066B3", // 대경선 파랑
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

interface StationLineProps {
  lineColor: string;
}

const SubWayGame = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [randomStation, setRandomStation] = useState<string | null>(null);

  const handleStart = () => {
    setIsStarted(true);
    setRandomStation(null);
  };

  const handleLineSelect = (line: number) => {
    setSelectedLine(line);
    setRandomStation(null);
  };

  const handleRandomStation = () => {
    if (selectedLine === null) return;

    const lineStations = stations.filter(
      (station) => station.line === selectedLine
    );
    const randomIndex = Math.floor(Math.random() * lineStations.length);
    setRandomStation(lineStations[randomIndex].name);
  };

  const getAdjacentStations = (stationName: string) => {
    if (!selectedLine) return { prev: null, next: null };

    const lineStations = stations.filter(
      (station) => station.line === selectedLine
    );
    const currentIndex = lineStations.findIndex(
      (station) => station.name === stationName
    );

    return {
      prev: currentIndex > 0 ? lineStations[currentIndex - 1].name : null,
      next:
        currentIndex < lineStations.length - 1
          ? lineStations[currentIndex + 1].name
          : null,
    };
  };

  return (
    <Container>
      <ContentWrapper>
        <Title>
          <SubwayIcon>🚇</SubwayIcon>
          대구 지하철 랜덤 역 선택기
        </Title>

        {!isStarted ? (
          <StartButton onClick={handleStart}>
            <span>시작하기</span>
            <ArrowIcon>→</ArrowIcon>
          </StartButton>
        ) : (
          <GameContainer>
            <LineSelection>
              <h2>호선을 선택하세요</h2>
              <LineButtons>
                {[1, 2, 3, 4].map((line) => (
                  <LineButton
                    key={line}
                    selected={selectedLine === line}
                    lineColor={LINE_COLORS[line as keyof typeof LINE_COLORS]}
                    onClick={() => handleLineSelect(line)}
                  >
                    <LineCircle
                      lineColor={LINE_COLORS[line as keyof typeof LINE_COLORS]}
                    />
                    {line === 4 ? "대경선" : `${line}호선`}
                  </LineButton>
                ))}
              </LineButtons>
            </LineSelection>

            {selectedLine && (
              <RandomSection>
                <RandomButton
                  onClick={handleRandomStation}
                  lineColor={
                    LINE_COLORS[selectedLine as keyof typeof LINE_COLORS]
                  }
                >
                  <DiceIcon>🎲</DiceIcon>역 랜덤 돌리기
                </RandomButton>
                {randomStation && (
                  <ResultBox
                    lineColor={
                      LINE_COLORS[selectedLine as keyof typeof LINE_COLORS]
                    }
                  >
                    <h3>선택된 역</h3>
                    <StationLine
                      lineColor={
                        LINE_COLORS[selectedLine as keyof typeof LINE_COLORS]
                      }
                    >
                      {getAdjacentStations(randomStation).prev && (
                        <AdjacentStation>
                          <StationDot
                            lineColor={
                              LINE_COLORS[
                                selectedLine as keyof typeof LINE_COLORS
                              ]
                            }
                          />
                          <StationName>
                            {getAdjacentStations(randomStation).prev}
                          </StationName>
                        </AdjacentStation>
                      )}
                      <CurrentStation>
                        <CurrentStationDot
                          lineColor={
                            LINE_COLORS[
                              selectedLine as keyof typeof LINE_COLORS
                            ]
                          }
                        />
                        <SelectedStationName>
                          {randomStation}
                        </SelectedStationName>
                      </CurrentStation>
                      {getAdjacentStations(randomStation).next && (
                        <AdjacentStation>
                          <StationDot
                            lineColor={
                              LINE_COLORS[
                                selectedLine as keyof typeof LINE_COLORS
                              ]
                            }
                          />
                          <StationName>
                            {getAdjacentStations(randomStation).next}
                          </StationName>
                        </AdjacentStation>
                      )}
                    </StationLine>
                    <LineIndicator
                      lineColor={
                        LINE_COLORS[selectedLine as keyof typeof LINE_COLORS]
                      }
                    >
                      {selectedLine}호선
                    </LineIndicator>
                  </ResultBox>
                )}
              </RandomSection>
            )}
          </GameContainer>
        )}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

const SubwayIcon = styled.span`
  font-size: 2.8rem;
  animation: ${pulse} 2s infinite;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const StartButton = styled.button`
  padding: 1.2rem 3rem;
  font-size: 1.4rem;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #34495e 0%, #2980b9 100%);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.2rem;
  }
`;

const ArrowIcon = styled.span`
  font-size: 1.6rem;
  transition: transform 0.3s;
  ${StartButton}:hover & {
    transform: translateX(5px);
  }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background-color: white;
  padding: 2.5rem;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
    border-radius: 20px;
  }
`;

const LineSelection = styled.div`
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.8rem;
    font-weight: 600;

    @media (max-width: 768px) {
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }
  }
`;

const LineButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
    width: 100%;
  }
`;

const LineCircle = styled.div<{ lineColor: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.lineColor};
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`;

const LineButton = styled.button<{ selected: boolean; lineColor: string }>`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: ${(props) => (props.selected ? props.lineColor : "white")};
  color: ${(props) => (props.selected ? "white" : props.lineColor)};
  border: 2px solid ${(props) => props.lineColor};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    min-width: 200px;
  }
`;

const RandomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const DiceIcon = styled.span`
  font-size: 1.4rem;
  margin-right: 0.5rem;
`;

const RandomButton = styled.button<{ lineColor: string }>`
  padding: 1.2rem 2.5rem;
  font-size: 1.3rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.lineColor} 0%,
    ${(props) => props.lineColor}dd 100%
  );
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    filter: brightness(1.1);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    width: 100%;
    max-width: 300px;
  }
`;

const ResultBox = styled.div<{ lineColor: string }>`
  padding: 2.5rem;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid ${(props) => props.lineColor};
  width: 90%;
  max-width: 800px;
  animation: ${fadeIn} 0.5s ease-out;

  h3 {
    margin-bottom: 1.5rem;
    color: #495057;
    font-size: 1.6rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 2rem;
    border-radius: 15px;

    h3 {
      font-size: 1.4rem;
    }
  }
`;

const StationName = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SelectedStationName = styled(StationName)`
  font-size: 1.5rem;
  font-weight: 700;
  gap: 0.5rem;
  color: #000;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const LineIndicator = styled.div<{ lineColor: string }>`
  display: inline-block;
  padding: 0.6rem 1.4rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.lineColor} 0%,
    ${(props) => props.lineColor}dd 100%
  );
  color: white;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
  }
`;

const StationLine = styled.div<StationLineProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 2.5rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 15px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 6px;
    background: ${(props) => props.lineColor};
    opacity: 0.3;
    z-index: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2.5rem 1.5rem;

    &::before {
      width: 6px;
      height: 100%;
    }
  }
`;

const AdjacentStation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  opacity: 0.7;
  transition: all 0.3s;
  position: relative;
  z-index: 2;
  padding: 0.8rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
  }
`;

const CurrentStation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.5rem;
  background: white;
  border-radius: 15px;
  transform: scale(1.2);
  position: relative;
  z-index: 2;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  margin: 1rem 2rem;
  animation: ${pulse} 2s infinite;
`;

const StationDot = styled.div<{ lineColor: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.lineColor};
  opacity: 0.7;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: ${(props) => props.lineColor};
    opacity: 0.1;
  }
`;

const CurrentStationDot = styled(StationDot)`
  width: 28px;
  height: 28px;
  opacity: 1;
  box-shadow: 0 0 20px ${(props) => props.lineColor};

  &::after {
    width: 45px;
    height: 45px;
    opacity: 0.3;
  }
`;

export default SubWayGame;
