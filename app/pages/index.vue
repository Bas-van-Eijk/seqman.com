<template>
  <div class="home">
    <div class="coming-soon">
      <svg class="tape-icon" width="72" height="72" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
        <g class="tape-reels">
          <g transform="translate(42, 72)">
            <rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#FFFFFF" stroke-width="2" rx="2"/>
            <rect x="-8" y="-2" width="16" height="4" fill="#FFFFFF"/>
            <rect x="-2" y="-8" width="4" height="16" fill="#FFFFFF"/>
          </g>
          <g transform="translate(102, 72)">
            <rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#FFFFFF" stroke-width="2" rx="2"/>
            <rect x="-8" y="-2" width="16" height="4" fill="#FFFFFF"/>
            <rect x="-2" y="-8" width="4" height="16" fill="#FFFFFF"/>
          </g>
        </g>
        <line x1="54" y1="60" x2="90" y2="60" stroke="#FFFFFF" stroke-width="2"/>
        <line x1="54" y1="84" x2="90" y2="84" stroke="#FFFFFF" stroke-width="2"/>
      </svg>
      <h2>Coming Soon</h2>
      <p>We're working on something. Stay tuned.</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.coming-soon {
  text-align: center;
}

.tape-icon {
  margin-bottom: 1.25rem;
  opacity: 0.5;
}

.tape-reels {
  transform-origin: 72px 72px;
  animation: spin-tape 1.09s linear infinite;
}

@keyframes spin-tape {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.coming-soon h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
  cursor: default;
}

.coming-soon:hover h2 {
  color: #d4b3c8;
}

.coming-soon p {
  font-size: 1rem;
  color: #555;
}
</style>
