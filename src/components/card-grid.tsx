import moon from "@assets/astro-images/moon.webp";
import sun from "@assets/astro-images/sun.jpg";
import centaurusA from "@assets/astro-images/centaurus-a-galaxy.webp";
import CustomCard from "./custom-card";

const imageList: CardProps[] = [
  { title: "Moon", image: moon, description: "Shot from Xiaomi Redmi K30 Pro" },
  { title: "Sun", image: sun, description: "Shot from SV305 Camera" },
  {
    title: "Centaurus A Galaxy",
    image: centaurusA,
    description: "Shot from SV305 Camera",
  },
];

const CardGrid: React.FC = () => {
  return (
    <div className="flex shrink justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-auto-cols gap-20">
        {imageList.map(({ title, image, description }: CardProps) => (
          <div className=" max-w-screen-sm col-span-1 row-span-1">
            <CustomCard title={title} image={image} description={description} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
