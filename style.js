const emoji = "🕹️";
const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <text y='50%' x='50%' dominant-baseline='middle' text-anchor='middle' font-size='80'>${emoji}</text>
</svg>`;

const link = document.createElement('link');
link.rel = 'icon';
link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
document.head.appendChild(link);
