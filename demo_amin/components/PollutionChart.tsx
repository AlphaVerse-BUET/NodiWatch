'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { year: '2016', textile: 45, tannery: 32, thermal: 18, total: 95 },
  { year: '2017', textile: 48, tannery: 35, thermal: 20, total: 103 },
  { year: '2018', textile: 52, tannery: 38, thermal: 22, total: 112 },
  { year: '2019', textile: 55, tannery: 42, thermal: 24, total: 121 },
  { year: '2020', textile: 58, tannery: 45, thermal: 26, total: 129 },
  { year: '2021', textile: 62, tannery: 48, thermal: 28, total: 138 },
  { year: '2022', textile: 65, tannery: 52, thermal: 30, total: 147 },
  { year: '2023', textile: 68, tannery: 55, thermal: 32, total: 155 },
  { year: '2024', textile: 72, tannery: 58, thermal: 34, total: 164 },
  { year: '2025', textile: 75, tannery: 61, thermal: 36, total: 172 },
  { year: '2026', textile: 78, tannery: 64, thermal: 38, total: 180 },
]

export default function PollutionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis dataKey="year" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="textile" stroke="#ef4444" strokeWidth={2} name="Textile Dye" />
        <Line type="monotone" dataKey="tannery" stroke="#f59e0b" strokeWidth={2} name="Tannery" />
        <Line type="monotone" dataKey="thermal" stroke="#8b5cf6" strokeWidth={2} name="Thermal" />
        <Line type="monotone" dataKey="total" stroke="#00b58c" strokeWidth={3} name="Total" />
      </LineChart>
    </ResponsiveContainer>
  )
}
