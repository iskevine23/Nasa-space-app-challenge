"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Bar, ComposedChart, Legend } from "recharts";

export function PowerChart({ rows }: { rows: any[] }) {
  // Show last 30 days, but make it super simple: rain bars + plant health line
  const data = rows.map(r => ({
    date: r.date.slice(5), // MM-DD short
    rain: r.PRECTOTCORR,
    temp: r.T2M,
    plant: r.ndvi,
  }));
  return (
    <div className="h-64 bg-stone-50 rounded-2xl p-3 border border-stone-100">
      <div className="text-xs font-bold text-stone-500 mb-1">📊 Last 30 days — blue = rain, green = how green your plants look</div>
      <ResponsiveContainer width="100%" height="88%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#78716c" }} interval={4} />
          <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[0, 0.9]} tickFormatter={(v)=>v.toFixed(1)} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="right" dataKey="rain" name="🌧️ Rain (mm)" fill="#0ea5e9" radius={[6,6,0,0]} />
          <Line yAxisId="left" type="monotone" dataKey="plant" name="🌱 Plant health" stroke="#16a34a" strokeWidth={2.5} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="temp" name="🌡️ Temp °C" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
