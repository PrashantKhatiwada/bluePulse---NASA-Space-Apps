'use client';

export default function Legend({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <div style={{
      position: 'absolute',
      top: 12,
      right: 12,
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        {data.meta.variable} ({data.meta.units})
      </div>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
        {Array.from({ length: 7 }, (_, i) => {
          const t = i / 6;
          const hue = 200 - 200 * t;
          return (
            <div
              key={i}
              style={{
                width: '16px',
                height: '12px',
                background: `hsl(${hue} 80% 55%)`,
                border: '1px solid #333'
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
        <span>{data.meta.min}</span>
        <span>{data.meta.max}</span>
      </div>
    </div>
  );
}
