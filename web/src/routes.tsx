import { Route, BrowserRouter } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import CreatePoint from "./pages/CreatePoint";
import Modal from "./pages/Modal";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" />
      <Route component={Modal} path="/modal" />
    </BrowserRouter>
  );
};

export default Routes;
