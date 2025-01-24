import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <main className="flex items-center justify-center w-full h-screen">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-[64px] font-semibold text-[#18181B] flex flex-col leading-none">
            <span>Explore the World</span>
            <span>with Your</span>
            <span className="text-[#F56551]">AI Travel Companion</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 w-[95%] md:w-[80%] mx-auto">
            Discover hidden gems, plan perfect itineraries, and access hotel
            services with a single chat — travel made effortless.
          </p>

          <Link to="/travel-planner" className="block">
            <Button className="px-10 py-6 text-base text-white bg-black border rounded-xl hover:bg-black/90">
              Get started - it's free
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
