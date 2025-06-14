import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src="/banner.png"
          width={400}
          height={200}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            Nhon Thien Fashion
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            Đồ hiệu đẳng cấp
          </p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">
          Đầy đủ những gì bạn cần
        </h2>
      </section>
    </div>
  );
}
