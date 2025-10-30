import Link from 'next/link';
import { ArrowRight, FileText, TestTube2, Dna, HeartPulse, DnaOff, FlaskConical } from 'lucide-react';

const colorMap = {
  FileText: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    hoverBgColor: "group-hover:bg-blue-500",
    hoverTextColor: "group-hover:text-white",
  },
  TestTube2: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    hoverBgColor: "group-hover:bg-red-500",
    hoverTextColor: "group-hover:text-white",
  },
  Dna: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    hoverBgColor: "group-hover:bg-green-500",
    hoverTextColor: "group-hover:text-white",
  },
  HeartPulse: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
    hoverBgColor: "group-hover:bg-yellow-500",
    hoverTextColor: "group-hover:text-white",
  },
  DnaOff: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    hoverBgColor: "group-hover:bg-purple-500",
    hoverTextColor: "group-hover:text-white",
  },
  FlaskConical: {
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
    hoverBgColor: "group-hover:bg-pink-500",
    hoverTextColor: "group-hover:text-white",
  },
  // Add other color mappings as needed
};

const ServiceCard = ({ imageSrc, icon: Icon, title, slug, alt, imgTitle }) => {
  const iconName = Icon?.displayName || Icon?.name || '';
  const colors = colorMap[iconName] || {
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    hoverBgColor: "group-hover:bg-gray-200",
    hoverTextColor: "group-hover:text-white",
  };

  return (
    <div className="bg-white shadow-lg group h-auto">
      <div className="overflow-hidden">
        <Link href={`/${slug}`}>
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={alt}
            title={imgTitle}
            className="w-full sm:h-56 h-auto bg-gray-100 object-cover transform group-hover:scale-105 transition duration-500"
          />
        </Link>
      </div>
      <div className="py-8 px-4 items-start justify-center flex flex-col gap-2">
        <div className="flex items-center w-full gap-4">
          <div
            className={`flex justify-center items-center ${colors.bgColor} ${colors.hoverBgColor} rounded-full p-4 h-fit`}
          >
            <Icon className={`${colors.textColor} ${colors.hoverTextColor} transition duration-300 w-5 h-5`} />
          </div>
          <Link href={`/${slug}`} className="text-[18px] font-bold text-gray-800 hover:text-primary">
            {title}
          </Link>
        </div>
        <div className="flex w-full justify-end">
          <Link href={`/${slug}`} className="text-[#bf2e2e] font-medium flex items-center text-[14px] hover:underline">
            READ MORE <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RelatedProducts = ({ products = [], iconMap = [FileText, TestTube2, Dna, HeartPulse, DnaOff, FlaskConical] }) => {
  if (!products.length) return null;

  return (
    <div className="my-16 mx-2 md:mx-auto sm:max-w-8xl lg:mr-5">
      <h3 className="text-2xl font-bold mb-4 text-black pb-2 inline-block">
        __Related Products
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
        {products.map((product, index) => (
          <ServiceCard
            key={product.id || index}
            imageSrc={product.photo?.[0] ? `/api/image/download/${product.photo[0]}` : '/placeholder.svg'}
            icon={iconMap[index % iconMap.length]}
            title={product.title || 'Untitled Product'}
            imgTitle={product.imgTitle}
            alt={product.alt || product.title || 'Product Image'}
            slug={product.slug || '#'}
          />
        ))}
      </div>
    </div>
  );
};
