// Size guide component - Ghana market only
function SizeGuide({ productSizes = [] }: { productSizes?: string[] }) {
  const [showGuide, setShowGuide] = useState(false);
  
  // Ghana shoe size chart (UK/European sizes only)
  const shoeSizeChart = [
    { size: '36', uk: 'UK 3', foot: '22.5 cm', fit: 'Small' },
    { size: '37', uk: 'UK 4', foot: '23.5 cm', fit: 'Small' },
    { size: '38', uk: 'UK 5', foot: '24.5 cm', fit: 'Medium' },
    { size: '39', uk: 'UK 6', foot: '25.5 cm', fit: 'Medium' },
    { size: '40', uk: 'UK 7', foot: '26.5 cm', fit: 'Large' },
    { size: '41', uk: 'UK 8', foot: '27.5 cm', fit: 'Large' },
    { size: '42', uk: 'UK 9', foot: '28.5 cm', fit: 'X-Large' },
    { size: '43', uk: 'UK 10', foot: '29.5 cm', fit: 'X-Large' },
    { size: '44', uk: 'UK 11', foot: '30.5 cm', fit: 'XX-Large' },
    { size: '45', uk: 'UK 12', foot: '31.5 cm', fit: 'XX-Large' },
  ];

  // Ghana clothing size chart (African fit)
  const clothingChart = [
    { size: 'S', chest: '34-36 in', waist: '28-30 in', description: 'Small - Fits slim build' },
    { size: 'M', chest: '38-40 in', waist: '32-34 in', description: 'Medium - Average build' },
    { size: 'L', chest: '42-44 in', waist: '36-38 in', description: 'Large - Slightly bigger build' },
    { size: 'XL', chest: '46-48 in', waist: '40-42 in', description: 'Extra Large - Big build' },
    { size: 'XXL', chest: '50-52 in', waist: '44-46 in', description: 'Double Extra Large' },
    { size: '3XL', chest: '54-56 in', waist: '48-50 in', description: 'Triple Extra Large' },
    { size: '4XL', chest: '58-60 in', waist: '52-54 in', description: '4X Large' },
  ];

  // Check if sizes are numbers (shoe sizes)
  const isShoeProduct = productSizes.some(size => /^\d+$/.test(size));
  const chartToShow = isShoeProduct ? shoeSizeChart : clothingChart;
  const chartTitle = isShoeProduct ? 'Shoe Size Guide' : 'Clothing Size Guide';

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline ml-2"
        type="button"
      >
        <HelpCircle className="h-3 w-3" />
        Size Guide (Ghana)
      </button>
      
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowGuide(false)}>
          <div className="bg-white rounded-lg p-5 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">{chartTitle}</h3>
              <button onClick={() => setShowGuide(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
            
            {/* Available sizes for this product */}
            {productSizes.length > 0 && (
              <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Available Sizes:</p>
                <div className="flex flex-wrap gap-2">
                  {productSizes.map((size) => (
                    <span key={size} className="bg-white border border-primary rounded-full px-3 py-1 text-sm font-medium">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Chart */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    {isShoeProduct ? (
                      <>
                        <th className="text-left py-2 px-2">Size</th>
                        <th className="text-left py-2 px-2">UK</th>
                        <th className="text-left py-2 px-2">Foot Length</th>
                        <th className="text-left py-2 px-2">Fit</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left py-2 px-2">Size</th>
                        <th className="text-left py-2 px-2">Chest</th>
                        <th className="text-left py-2 px-2">Waist</th>
                        <th className="text-left py-2 px-2">Description</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {chartToShow.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      {isShoeProduct ? (
                        <>
                          <td className="py-2 px-2 font-medium">{(item as any).size}</td>
                          <td className="py-2 px-2">{(item as any).uk}</td>
                          <td className="py-2 px-2">{(item as any).foot}</td>
                          <td className="py-2 px-2 text-green-600">{(item as any).fit}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-2 font-medium">{(item as any).size}</td>
                          <td className="py-2 px-2">{(item as any).chest}</td>
                          <td className="py-2 px-2">{(item as any).waist}</td>
                          <td className="py-2 px-2 text-xs">{(item as any).description}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Ghana-specific tips */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
              <p className="font-medium mb-1 flex items-center gap-1">🇬🇭 Ghana Size Tips:</p>
              <p className="text-gray-600">• Our sizes are UK/European standard – widely used in Ghana</p>
              <p className="text-gray-600">• If between sizes, choose the larger size for better comfort</p>
              <p className="text-gray-600">• Need help? Call us on 027 180 8592 for size assistance</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
