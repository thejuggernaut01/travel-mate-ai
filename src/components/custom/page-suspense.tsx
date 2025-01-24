import { MorphingText } from '@/components/custom/morphing-text';

const texts = ['Travel Mate', 'Unique Experience', 'Explore the World'];

const PageSuspense = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen">
        <MorphingText texts={texts} />
      </div>
    </>
  );
};

export default PageSuspense;
