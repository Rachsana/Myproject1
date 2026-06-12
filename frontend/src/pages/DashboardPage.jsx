import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import OverviewCards from "../components/dashboard/OverviewCards"
import HeatmapChart from "../components/dashboard/HeatmapChart"
import RatingChart from "../components/dashboard/RatingChart"
import TagsChart from "../components/dashboard/TagsChart"
import RecentSubmissions from "../components/dashboard/RecentSubmissions"

function DashboardPage() {
  const { username, logout } = useAuth()

  return (
    <div className="min-h-screen bg-base text-text p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold">
          welcome, <span className="text-accent">{username}</span>
        </h1>
        <div className="flex gap-3">
          <Link
            to="/settings"
            className="bg-surface-2 hover:bg-surface border border-border text-text px-4 py-2 rounded transition-colors"
          >
            Settings
          </Link>
          <button
            onClick={logout}
            className="bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <OverviewCards />
      <HeatmapChart />
      <RatingChart />
      <TagsChart />
      <RecentSubmissions />
    </div>
  )
}

export default DashboardPage