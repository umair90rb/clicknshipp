export default function PieChart({ width = '50%', color = '#ff9f00', percentage = 30 }) {
  const dashArray = `${percentage}, 100`; // Stroke-dasharray value based on percentage

  return (
    <div style={{ width, display: 'flex', justifyContent: 'space-around' }}>
      <svg
        viewBox="0 0 36 36"
        style={{
          display: 'block',
          margin: '10px auto',
          maxWidth: '80%',
          maxHeight: '250px'
        }}
      >
        {/* Background Circle */}
        <path
          className="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{
            fill: 'none',
            stroke: '#eee',
            strokeWidth: '3.8'
          }}
        />

        {/* Foreground Circle */}
        <path
          className="circle"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{
            fill: 'none',
            stroke: color,
            strokeWidth: '2.8',
            strokeLinecap: 'round',
            animation: 'progress 1s ease-out forwards',
            strokeDasharray: dashArray
          }}
        />

        {/* Percentage Text */}
        <text
          x="18"
          y="20.35"
          className="percentage"
          style={{
            fill: '#666',
            fontFamily: 'sans-serif',
            fontSize: '0.5em',
            textAnchor: 'middle'
          }}
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
}
