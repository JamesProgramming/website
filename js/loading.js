// Desktop loading spinner
export const canvasLoading = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = "translate(-50%, -50%)";
  canvas.style.backdropFilter = "blur(2px)";
  canvas.style.zIndex = "1000000";
  const ctx = canvas.getContext("2d");

  /**
   *
   * @param {object} obj - Object containing properties for canvas arc.
   */
  const arcCreator = function (obj) {
    ctx.fillStyle = obj.fill;
    ctx.strokeStyle = obj.lineFill;
    if (obj.gradient) {
      let grd = ctx.createLinearGradient(...obj.gradient);
      grd.addColorStop(...obj.gradientStart);
      grd.addColorStop(...obj.gradientStop);
      ctx.strokeStyle = grd;
    }
    ctx.lineWidth = obj.lineWidth;
    ctx.shadowColor = obj.shadowColor;
    ctx.shadowBlur = obj.shadowBlur;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, obj.startA, obj.stopA);
    if (!obj.lineWidth) ctx.fill();
    else ctx.stroke();
  };

  // Loading spinner and spinnerBackground
  const animationArr = {
    spinner: {
      lineFill: "#0A4BFF",
      lineWidth: 13,
      gradient: [0 - 70, 0 - 70, 0 + 70, 0 + 70],
      gradientStart: [0, "#1d59fd"],
      gradientStop: [1, "#0B0EDF"],
      x: 0,
      y: 0,
      radius: 35,
      startA: Math.PI / 2,
      stopA: Math.PI,
      shadowColor: "rgba(0,0,0, 0.1)",
      shadowBlur: "20",
    },
    spinnerBackground: {
      lineFill: "#E9E9E9",
      lineWidth: 12,
      x: 0,
      y: 0,
      radius: 35,
      startA: 0,
      stopA: Math.PI * 2,
      shadowColor: "rgba(0,0,0, 0.1)",
      shadowBlur: "20",
    },
    // Update spinner start and stop end points' locations.
    spinnerOffset: function () {
      if (this.spinnerIncrease) {
        this.spinner.startA = this.spinner.startA + this.speedConst / 2;
        this.spinner.stopA =
          this.spinner.stopA + this.speed + this.speedConst / 2;
        this.speed -= this.deceleration;
        // Stop spinner from expanding larger than 180 deg
        if (this.spinner.stopA - this.spinner.startA > Math.PI) {
          this.speed = this.speedConst;
          this.spinnerIncrease = false;
        }
      } else {
        this.spinner.startA =
          this.spinner.startA + this.speed + this.speedConst / 2;
        this.spinner.stopA = this.spinner.stopA + this.speedConst / 2;
        this.speed -= this.deceleration;
        // Stop spinner from shrinking smaller than 45 deg
        if (this.spinner.stopA - this.spinner.startA < Math.PI / 4) {
          this.speed = this.speedConst;
          this.spinnerIncrease = true;
        }
      }
    },
    clientUpdateSize: function (x, y) {
      const radius = this.spinner.radius;
      console.log(radius);
      this.spinner.gradient = [x - radius, y - radius, x + radius, y + radius];
      this.spinnerBackground.x = this.spinner.x = x;
      this.spinnerBackground.y = this.spinner.y = y;
    },
    // Indicate whether spinner should expand
    spinnerIncrease: false,
    // Spinner speed (this variable is updated by this.spinnerOffset())
    speed: 0.05,
    // Spinner speed const
    speedConst: 0.05,
    // Deceleration of speed while expanding or shrinking.
    deceleration: 0.0004,
  };

  // Draw elements on sceen
  const redraw = function (obj) {
    arcCreator(obj.spinnerBackground);
    obj.spinnerOffset();
    arcCreator(obj.spinner);
  };

  const animate = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redraw(animationArr);
    requestAnimationFrame(animate);
  };

  // Spinner size update on first load.
  animationArr.clientUpdateSize(canvas.width / 2, canvas.height / 2);

  // Start animation
  animate();

  return canvas;
};
