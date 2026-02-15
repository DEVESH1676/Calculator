export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f2027]/90 backdrop-blur-md border border-[#00f5ff]/30 p-2 rounded-lg shadow-xl">
        <p className="text-xs text-white/70">x: {label}</p>
        <p className="text-sm font-bold text-[#00f5ff]">y: {payload[0].value?.toFixed(3)}</p>
      </div>
    );
  }
  return null;
};
