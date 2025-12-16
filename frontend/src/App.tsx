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
import CompetitionInfo from "./features/detio-score/info";
import JoinManGoSet from "./features/detio-score/man-go-set/join-competition";
import { DepositPage } from "./features/transaction/deposit";
import { TransactionHistory } from "./features/transaction/history";
import { WithdrawalPage } from "./features/transaction/withdraw";
import { ForgotPasswordForm } from "./features/auth/forgot";
import { ResetPasswordForm } from "./features/auth/reset";
import { NotificationsPage } from "./features/profile/notification";
import { EmailVerificationPage } from "./features/auth/verify-email";
import { UserTeamInfoPage } from "./features/detio-score/ranking-details";
import LeagueDetails from "./features/league/details";
import AdminLayout from "./features/admin/layout";
import { Admin } from "./features/admin";
import AllUsers from "./features/admin/users";
import PendingTransactions from "./features/admin/transactions";
import UserDetailView from "./features/admin/users/details";
import { TransactionDetailView } from "./features/admin/transactions/details";
import CompetitionDetails from "./features/admin/competition/details";
import { CompleteProfileForm } from "./features/auth/complete-profile";
import AuthLayout from "./features/auth-layout";
import Competitions from "./features/admin/competition";
import LeaderboardPage from "./features/leaderboard/leaderboard";
import NotificationDetail from "./features/profile/notification-details";
import AchievementStats from "./features/profile/achievements";

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

          <Route path="" element={<AuthLayout />}>
            <Route path="detio-score" element={<DetioScore />} />
            <Route
              path="detio-score/topscore/create-new-competition"
              element={<CreateTopScoreCompetitionPage />}
            />
            <Route path="detio-score/topscore/:id" element={<JoinTopScore />} />
            <Route
              path="detio-score/:id/details"
              element={<CompetitionInfo />}
            />
            <Route
              path="detio-score/participant"
              element={<UserTeamInfoPage />}
            />
            <Route
              path="detio-score/mango-set/create-new-competition"
              element={<CreateManGoSetCompetitionPage />}
            />
            <Route path="detio-score/mangoset/:id" element={<JoinManGoSet />} />

            <Route path="favourite" element={<Favourite />} />
            <Route path="league" element={<League />} />
            <Route path="league/:leagueName" element={<LeagueDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="deposit" element={<DepositPage />} />
            <Route path="withdraw" element={<WithdrawalPage />} />
            <Route
              path="transaction-history"
              element={<TransactionHistory />}
            />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="notifications/:id" element={<NotificationDetail />} />
            <Route path="achievements" element={<AchievementStats />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
          </Route>

          <Route path="signup" element={<SignupForm />} />
          <Route path="select-country" element={<CompleteProfileForm />} />
          <Route path="signin" element={<SigninForm />} />
          <Route path="forgot-password" element={<ForgotPasswordForm />} />
          <Route path="reset-password" element={<ResetPasswordForm />} />
          <Route path="verify-email" element={<EmailVerificationPage />} />

          <Route path="*" element={<div>Not Found</div>} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="users/:userId" element={<UserDetailView />} />
          <Route path="transactions" element={<PendingTransactions />} />
          <Route
            path="transactions/:txnId"
            element={<TransactionDetailView />}
          />
          <Route path="competition" element={<Competitions />} />
          <Route path="competition/:compId" element={<CompetitionDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
