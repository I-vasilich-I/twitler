import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { FloatButton, Layout, Spin } from "antd";
import reportWebVitals from "./reportWebVitals";
import { store } from "./redux/store/store";
import useCheckAuth from "./hooks/useCheckAuth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import { PATHS } from "./constants";
import Profile from "./pages/Profile";
import { getTweetsPath } from "./helpers";
import "./index.scss";

const {
  ROOT,
  EXPLORE,
  BOOKMARKS,
  SIGN_IN,
  SIGN_UP,
  HOME,
  SETTINGS,
  UNKNOWN,
  PROFILE_TWEETS,
  PROFILE_TWEETS_WITH_REPLIES,
  PROFILE_TWEETS_WITH_MEDIA,
  PROFILE_TWEETS_WITH_LIKES,
} = PATHS;

const App = () => {
  const { isLoading } = useCheckAuth();

  return isLoading ? (
    <Spin />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path={ROOT} element={<Navigate to={HOME} replace />} />
          <Route path={HOME} element={<Home />} />
          <Route path={EXPLORE} element={<div>Explore</div>} />
          <Route path={BOOKMARKS} element={<div>Bookmarks</div>} />
          <Route path={PROFILE_TWEETS} element={<Profile />}>
            <Route path={PROFILE_TWEETS_WITH_REPLIES} element={<Profile />} />
            <Route path={PROFILE_TWEETS_WITH_MEDIA} element={<Profile />} />
            <Route path={PROFILE_TWEETS_WITH_LIKES} element={<Profile />} />
            <Route path={getTweetsPath(PROFILE_TWEETS, ":userId")} element={<Profile />} />
            <Route path={getTweetsPath(PROFILE_TWEETS_WITH_REPLIES, ":userId")} element={<Profile />} />
            <Route path={getTweetsPath(PROFILE_TWEETS_WITH_MEDIA, ":userId")} element={<Profile />} />
            <Route path={getTweetsPath(PROFILE_TWEETS_WITH_LIKES, ":userId")} element={<Profile />} />
          </Route>
          <Route path={SETTINGS} element={<div>Settings</div>} />
        </Route>
        <Route path={SIGN_IN} element={<SignIn />} />
        <Route path={SIGN_UP} element={<SignUp />} />
        <Route path={UNKNOWN} element={<div>Not found(404)</div>} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <Layout style={{ minHeight: "100vh" }}>
        <App />
        <FloatButton.BackTop visibilityHeight={500} />
      </Layout>
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
