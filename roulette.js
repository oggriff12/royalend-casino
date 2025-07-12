let degree = 0;
let isSpinning = false;

document.getElementById("spinButton").addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;

  const wheel = document.getElementById("wheel");
  const extraSpin = Math.floor(Math.random() * 360);
  degree += 360 * 5 + extraSpin;

  wheel.style.transform = `rotate(${degree}deg)`;

  setTimeout(() => {
    const winningNumber = 12 - Math.floor(((degree % 360) / 30)) || 12;
    document.getElementById("result").innerText = `Result: ${winningNumber}`;
    isSpinning = false;
  }, 5200);
});

document.getElementById("resetButton").addEventListener("click", () => {
  degree = 0;
  document.getElementById("wheel").style.transform = "rotate(0deg)";
  document.getElementById("result").innerText = "";
});
