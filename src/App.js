import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import LoginPage from "views/LoginPage.js";
import "./App.css";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      showAdminBoard: false,
      showLoginPage: true,
    };
  }

  componentDidMount() {
    const user = authApi.getCurrentUser();
    if (true) {
      this.setState({
        currentUser: user,
        showAdminBoard: true,
        showLoginPage: false,
      });
    }
  }

  componentWillUnmount() {
    sessionStorage.clear();
  }

  logOut() {
    authApi.logout();
  }

  render() {
    const { currentUser, showAdminBoard, showLoginPage } = this.state;
    return (
      <>
        {/* <BrowserRouter>
          <Switch> */}

            {/* <Route
              path="/login"
              render={(props) =>
                <LoginPage {...props} />} /> */}

            {/* <Route 
            path="/admin" 
            render={(props) => <AdminLayout {...props} />} />
            <Redirect to="/login" />

          </Switch>
        </BrowserRouter> */}
        <BrowserRouter>
    <Switch>
    <Route path="/login" render={(props) => <LoginPage {...props} />} />
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Redirect to="/login" />
    </Switch>
  </BrowserRouter>
      </>
    );
  }
}

export default App;
