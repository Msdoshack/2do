import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import GridWrapper from "../components/GridWrapper";
import { useEffect, useRef, useState } from "react";
import Spinner from "../components/Spinner";

const images = ["/add_task.jpg", "/task.jpg", "/mail_2.jpg", "/mail.jpg"];

const Home = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let index = 0;

    const scrollImages = () => {
      const totalSlides = images.length;
      const containerWidth = container.clientWidth;

      index = (index + 1) % totalSlides;

      container.scrollTo({
        left: containerWidth * index,
        behavior: "smooth",
      });
    };

    const interval = setInterval(scrollImages, 3000); // scroll every 3 sec

    return () => clearInterval(interval);
  }, []);
  return (
    <GridWrapper>
      {/* px-8 sm:px-16 md:px-30 */}
      <div className="container mx-auto pt-16 relative">
        <div className="z-10 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl  md:5xl lilita-one-regular text-orange-400 mb-4 uppercase font-extrabold max-w-sm sm:max-w-xl">
              "Do it now. Sometimes 'later' becomes 'never'."
            </h1>
            <p className="text-center font-medium animate-pulse">
              “You may delay, but time will not.” – Benjamin Franklin
            </p>
          </div>

          <div className="mt-8 p-4">
            <div
              ref={containerRef}
              className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl border max-w-[450px] h-[55vh] bg-neutral-200 mb-5"
            >
              {images.map((url, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover rounded-2xl"
                    onLoad={() => setIsLoading(false)}
                  />
                </div>
              ))}
              {/* {isLoading && <Spinner />} */}
            </div>

            <div className="flex items-center justify-center gap-8 ">
              <div className="pb-10">
                <Link to={"/sign-up"}>
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridWrapper>
  );
};

export default Home;
