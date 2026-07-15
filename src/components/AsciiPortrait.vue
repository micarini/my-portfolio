<script setup>
import retrato from '../assets/ascii/retrato.txt?raw';
</script>

<template>
  <figure class="ascii-portrait">
    <pre
      class="ascii-portrait__art"
      aria-hidden="true"
    >{{ retrato }}</pre>
    <div
      class="ascii-portrait__scrim"
      aria-hidden="true"
    />
  </figure>
</template>

<style scoped>
.ascii-portrait {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 0;
}

.ascii-portrait__art {
  font-family: var(--font-mono);
  font-size: clamp(5.5px, 1vw, 15px);
  line-height: 1.05;
  letter-spacing: 0;
  white-space: pre;
  color: #efefef;
  text-shadow: 0 0 22px rgba(146, 165, 203, 0.3);
  user-select: text;
}

@media (max-width: 719px) {
  .ascii-portrait__art {
    font-size: clamp(4px, 2.3vw, 7px);
  }
}

.ascii-portrait__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #0a0a0a00 0%,
    #0a0a0a72 55%,
    #0a0a0af5 100%
  );
  pointer-events: none;
}

</style>