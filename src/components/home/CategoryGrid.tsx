import Image from 'next/image';
import { useRouter } from 'next/navigation';

const categories = [
  { key: 'men', name: 'Thời Trang Nam', image: '/images/cat-men.png' },
  { key: 'phone', name: 'Điện Thoại & Phụ Kiện', image: '/images/cat-phone.png' },
];

const CategoryGrid = () => {
  const router = useRouter();
  return (
    <section className="bg-white rounded-xl shadow p-6 mt-8 mx-auto max-w-6xl">
      <h2 className="text-xl font-semibold mb-4">DANH MỤC</h2>
      <div className="grid grid-cols-5 gap-y-8 gap-x-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className="flex flex-col items-center focus:outline-none"
            onClick={() => router.push(`/category/${cat.key}`)}
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
              <Image src={cat.image} alt={cat.name} width={80} height={80} className="object-contain" />
            </div>
            <div className="text-xs text-center text-gray-700 leading-tight">{cat.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid; 