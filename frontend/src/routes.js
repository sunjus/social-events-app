import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import MyRegistrations from "./pages/MyRegistrations";
import TopNav from "./components/TopNav";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import config from "./config";

//Fix고유주소 reset
export default (Routes) => {
  const [eventFilterIndex, setEventFilterIndex] = useState(0);
  const eventFilter = {
    index: eventFilterIndex,
    list: config.eventFilters,
    update: setEventFilterIndex,
  };

  return (
    <BrowserRouter>
      <TopNav eventFilter={eventFilter} />
      <Switch>
        <Route
          path="/"
          exact
          render={(routeProps) => (
            <Dashboard {...routeProps} eventFilter={eventFilter} />
          )}
        />

        <Route path="/myregistrations" exact component={MyRegistrations} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/events" component={EventsPage} />
        <Route path="/event/:eventId" component={EventsPage} />
        <Route path="/eventdetail/:eventId" component={EventDetail} />
        <Route path="/forgotpassword" exact component={ForgotPassword} />
        <Route path="/resetpassword" component={ResetPassword} />
      </Switch>
    </BrowserRouter>
  );
};
