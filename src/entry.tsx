import * as React from "react";
import * as ReactDOM from "react-dom";

import Search from "./components/Search";
import { Container } from "reactstrap";

const wombat = require("./assets/images/wombat.svg");

ReactDOM.render(
  <div>
    <div className="example-header">
      <span className="example-header-title">
        Development Project - Find a Business
      </span>
      <img className="example-header-logo" src={wombat} />
    </div>

    <Container>
      <Search />
    </Container>
  </div>,
  document.getElementById("main")
);
