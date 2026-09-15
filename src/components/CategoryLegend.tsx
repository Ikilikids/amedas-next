import { CategoryKey } from "../setting/category";

const CategoryLegend = () => {
  return (
    <div className="grid grid-cols-1   gap-3 my-2">
      {Object.values(CategoryKey)
        .filter((p) => p.value !== 2)
        .map((cat) => (
          <div
            key={cat.value}
            className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 border-l-4 flex items-start gap-2.5"
            style={{ borderLeftColor: cat.colorFull }}
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
