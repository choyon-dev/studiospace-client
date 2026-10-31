import HeroSlider from '@/components/HeroSlider';
import CategoryBrowse from '@/components/CategoryBrowse';
import FeaturedStudios from '@/components/FeaturedStudios';
import HowItWorks from '@/components/HowItWorks';
import HostGuarantee from '@/components/HostGuarantee';
import HostMonetizationBanner from '@/components/HostMonetizationBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSlider />
      <CategoryBrowse />
      <FeaturedStudios />
      <HowItWorks />
      <HostGuarantee />
      <HostMonetizationBanner />
    </div>
  );
}
