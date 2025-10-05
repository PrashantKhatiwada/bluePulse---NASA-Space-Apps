'use client';

export default function Timebar({ data, tIndex, setT }: { data: any; tIndex: number; setT: (n: number) => void }) {
  if (!data) return null;
  
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 12,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <input
        type="range"
        min={0}
        max={data.meta.timestamps.length - 1}
        value={tIndex}
        onChange={(e) => setT(parseInt(e.target.value))}
        style={{ width: '60%' }}
      />
    </div>
  );
}