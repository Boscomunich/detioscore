import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import AppLayout from "./features/layout";
import DetioScore from "./features/detio-score";
import Favourite from "./features/favourite";
import League from "./features/league";
import Profile from "./features/profile";
import FootballLayout from "./features/football/layout";
import { LeagueTabs } from "./features/football";
import FixtureDetailsPage from "./features/football/fixture-details";
import { useEffect } from "react";
import { SignupForm } from "./features/auth/signup";
import { SigninForm } from "./features/auth/signin";
import CreateTopScoreCompetitionPage from "./features/detio-score/top-score/competition-form";
import CreateManGoSetCompetitionPage from "./features/detio-score/man-go-set/competition-form";
import JoinTopScore from "./features/detio-score/top-score/join-competition";
import CompetitionInfo from "./features/detio-score/top-score/info";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<FootballLayout />}>
            <Route index element={<LeagueTabs />} />
            <Route path="/:id" element={<FixtureDetailsPage />} />
          </Route>

          <Route path="detio-score" element={<DetioScore />} />
          <Route
            path="detio-score/topscore/create-new-competition"
            element={<CreateTopScoreCompetitionPage />}
          />
          <Route path="detio-score/topscore/:id" element={<JoinTopScore />} />
          <Route
            path="detio-score/topscore/details"
            element={<CompetitionInfo />}
          />
          <Route
            path="detio-score/mango-set/create-new-competition"
            element={<CreateManGoSetCompetitionPage />}
          />
          <Route path="favourite" element={<Favourite />} />
          <Route path="league" element={<League />} />
          <Route path="profile" element={<Profile />} />

          <Route path="signup" element={<SignupForm />} />
          <Route path="signin" element={<SigninForm />} />

          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
