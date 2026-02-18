import { useState, useEffect } from 'react';
import HomeComponent from '../components/HomeComponent';
import { useLocation } from "react-router";
import DailyRewardModal from "../components/DailyRewardModal"

function HomePage() {
  const location = useLocation();
  const [dailyRewardOpen, setDailyRewardOpen] = useState(false);
  const [dailyRewardGold, setDailyRewardGold] = useState(0);

  useEffect(() => {
    const shown = localStorage.getItem("dailyReward");
    const gold = localStorage.getItem("dailyRewardGold");

    if (shown === "true") {
      setDailyRewardGold(Number(gold));
      setDailyRewardOpen(true);

      localStorage.setItem("dailyReward", "false"); 
      localStorage.removeItem("dailyRewardGold");
    }
  }, []);

  return (
    <>
      <DailyRewardModal open={dailyRewardOpen} gold={dailyRewardGold} onClose={() => setDailyRewardOpen(false)} />
      <HomeComponent />
    </>
  );
}

export default HomePage;
