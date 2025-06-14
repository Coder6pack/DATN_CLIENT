import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
  return (
    <Link href="/the-thao" className="block relative w-full h-[600px] group cursor-pointer">
      <Image
        src="/images/T-SHIRT__POLO_THE_THAO_-_Desktop-2.jpg"
        alt="Coolmate Banner"
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority
      />
    </Link>
  );
};

export default Banner; 