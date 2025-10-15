import React from 'react';

export const ProductDetailsTable = ({ details = {} }) => {
  // console.log(details);
  const rows = [
    { label: "CAS No.", value: details.CASNo || "" },
    { label: "Formula", value: details.formula || "N/A" },
    { label: "EINECS", value: details.EINECS || "N/A" },
    { label: "Molecular Weight", value: details.MW || "N/A" },
    { label: "Appearance", value: details.appearance || "N/A" },
    { label: "Application", value: details.application || "N/A" },
    { label: "Density", value: details.density || "N/A" },
    { label: "Purity", value: details.purity || "N/A" },
    { label: "Packing", value: details.packing || "N/A" },
  ]

  // Add Synonym conditionally if it exists
  if (details.synonym) {
    rows.push({ label: "Synonym", value: details.synonym })
  }

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
                    {String(row.value).split(",").map((synonym, i) => (
                      <li key={i} className="mb-1 px-2 rounded-md bg-gray-100">
                        {synonym.trim()}
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
