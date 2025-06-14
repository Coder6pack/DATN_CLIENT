'use client';

import Link from 'next/link';
import Image from 'next/image';
import NavItems from '@/app/(public)/nav-items';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-coolmate-new-v2.png"
              alt="Coolmate Logo"
              width={100}
              height={32}
              className="cursor-pointer"
            />
          </Link>

          {/* Navigation Items */}
          <NavItems className="text-gray-700 hover:text-blue-600 font-medium" />
        </div>
      </div>
    </header>
  );
};

export default Header; 