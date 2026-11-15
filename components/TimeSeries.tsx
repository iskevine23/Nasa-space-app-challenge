"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Bar, ComposedChart, Legend } from "recharts";

export function PowerChart({ rows }: { rows: any[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="right" dataKey="PRECTOTCORR" name="Precip (mm/d)" fill="#0ea5e9" />
          <Line yAxisId="left" type="monotone" dataKey="T2M" name="T2M °C" stroke="#ef4444" dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="ndvi" name="NDVI (proxy)" stroke="#16a34a" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
