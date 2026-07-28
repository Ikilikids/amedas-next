import { CategoryKey } from "../setting/category";

const CategoryLegend = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
      {Object.values(CategoryKey)
        .filter((p) => p.value !== 2)
        .map((cat) => (
          <div
            key={cat.value}
            className="bg-white p-4 rounded-lg shadow-sm border-l-4 flex items-start gap-3"
            style={{ borderColor: cat.colorFull }}
          >
            <div
              className="p-2 rounded"
              style={{
                backgroundColor: cat.colorBase,
                color: cat.colorFull,
              }}
            >
              {cat.icon}
            </div>

            <div>
              <div className="font-bold text-slate-800">{cat.label}</div>
              <div className="text-xs text-slate-500">{cat.description}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CategoryLegend;
