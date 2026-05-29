import Link from 'next/link';

export default function FeaturedCategories() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['Shoes', 'Belts', 'Hair Creams', 'Jewellery', 'Bags'].map((cat) => (
          <Link key={cat} href={`/category/${cat.toLowerCase().replace(' ', '-')}`}>
            <div className="bg-white p-4 rounded-lg shadow-card text-center hover:shadow-md transition">
              <div className="h-20 w-20 mx-auto bg-gray-100 rounded-full mb-2 flex items-center justify-center">📦</div>
              <span className="text-sm font-medium">{cat}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
