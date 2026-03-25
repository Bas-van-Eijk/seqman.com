<template>
  <div class="home">
    <div class="coming-soon">
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
