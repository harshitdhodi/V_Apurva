import React from 'react';

export const ProductDetailsTable = ({ details = {} }) => {
  console.log(details);
  // Create rows array with all possible fields
  const allRows = [
    { label: "CAS No.", value: details.CASNo },
    { label: "Formula", value: details.formula },
    { label: "EINECS", value: details.EINECS },
    { label: "Molecular Weight", value: details.MW },
    { label: "Appearance", value: details.appearance },
    { label: "Application", value: details.application },
    { label: "Density", value: details.density },
    { label: "Purity", value: details.purity },
    { label: "Packing", value: details.packing },
    { label: "Synonym", value: details.synonym }
  ];

  // Filter out rows where value is empty, null, undefined, or an empty array
  const rows = allRows.filter(row => {
    const value = row.value;
    // Check if value exists and is not empty
    if (value === undefined || value === null || value === '') return false;
    // Special handling for Synonym which is an array
    if (row.label === 'Synonym') {
      return Array.isArray(value) && 
             value.length > 0 && 
             value.some(syn => syn && syn.trim() !== '');
    }
    // For other fields, check if value is not 'N/A'
    return value !== 'N/A';
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm sm:text-base">
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="px-3 py-2 font-semibold text-gray-700 w-1/3">{row.label}</td>
              <td className="px-3 py-2 text-gray-800">
                {row.label === "Synonym" ? (
                  <ul className="flex flex-wrap gap-3 list-inside">
                    {row.value.map((synonym, i) => (
                      <li key={i} className="mb-1 px-2 rounded-md bg-gray-100">
                        {synonym}
                      </li>
                    ))}
                  </ul>
                ) : (
                  row.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
