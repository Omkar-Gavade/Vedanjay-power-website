import { Hero } from '../components/home/Hero.jsx';
import { WhoWeAre } from '../components/home/WhoWeAre.jsx';
import { Capabilities } from '../components/home/Capabilities.jsx';
import { Expertise } from '../components/home/Expertise.jsx';
import { PortfolioMap } from '../components/home/PortfolioMap.jsx';
import { ClosingCTA } from '../components/home/ClosingCTA.jsx';
import { Seo } from '../components/seo/Seo.jsx';
import { ROUTES } from '../constants/routes.js';

export default function Home() {
  return (
    <>
      <Seo route={ROUTES.home} />

      <Hero />
      <WhoWeAre />
      <Capabilities />
      <Expertise />
      <PortfolioMap />
      <ClosingCTA />
    </>
  );
}
