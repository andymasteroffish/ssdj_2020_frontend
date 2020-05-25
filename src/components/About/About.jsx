import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div className="About panel">
      <h4>ABOUT</h4>
      <div className="boxtext about-box">
        <p>
          SLASH DANCE is an 8-player battle royale game built using websockets,
          p5, node, and React as part of{" "}
          <a
            href="https://www.wonderville.nyc/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wonderville
          </a>{" "}
          /{" "}
          <a
            href="https://www.deathbyaudioarcade.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Death By Audio Arcade
          </a>
          ’s{" "}
          <a href="http://ssdj.am/" target="_blank" rel="noopener noreferrer">
            Super Social Distance Game Jam 2020
          </a>
          .
        </p>
        <p>Theme: “being together / being alone”</p>
        <p>
          <a
            href="https://twitter.com/Andy_Makes"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Andy_Makes
          </a>
          {" - "}
          <a
            href="https://twitter.com/l3iodeez"
            target="_blank"
            rel="noopener noreferrer"
          >
            @l3iodeez
          </a>
          {" - "}
          <a
            href="https://twitter.com/AilanthusG"
            target="_blank"
            rel="noopener noreferrer"
          >
            @AilanthusG
          </a>
        </p>
        <p>
          Volume icon by{" "}
          <a
            href="https://thenounproject.com/rudezstudio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rudez Studio
          </a>{" "}
          from the Noun Project. Sounds by{" "}
          <a
            href="https://twitter.com/zassimo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zassimo
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
