import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RadarGraph from "./radarGraph";
import GuageCard from "./guageCard";
import { TITLES } from "./consts";
import logo from "./dyp-logo.png";
import "./modalContainer.css";

function ModalContainer() {
  //react hook to support resizing changes
  let windowSize = useWindowSize();

  //typically would be requesting for data here
  const data = {
    primitives: [
      { name: "static-analysis", issues: 41, checks: 400, score: 80 },
      { name: "onchain-monitoring", issues: 0, checks: 9, score: 60 },
      { name: "social-sentiment", issues: 6, checks: 6, score: 80 },
      { name: "governance-autonomy", issues: 1, checks: 0, score: 100 },
      { name: "market-volatility", issues: 0, checks: 6, score: 98 },
      { name: "safety-assessment", issues: 12, checks: 96, score: 98 },
    ],
  };

  return (
    <Card className="modal-container p-4">
      <div className="d-flex align-items-center">
        <img className="logo" src={logo} alt="logo" />
        <h3 className="mx-2">DYP.Finance - Skynet Overview</h3>
      </div>
      <Container>
        <Row>
          <Col className="p-0 radar-col">
            <RadarGraph
              data={data.primitives.map((property) => property.score)}
            />
          </Col>
          <Col
            className={`d-flex flex-column justify-content-between guage-col ${
              windowSize.width < 1145 && "p-0 mt-3"
            }`}
          >
            {data.primitives.map((property, i) => (
              <GuageCard title={TITLES[i]} data={property} key={i} />
            ))}
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default ModalContainer;
