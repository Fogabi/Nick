if (/Mobi|Android/i.test(navigator.userAgent)) {
    let highestZ = 1;
  
    class Paper {
      holdingPaper = false;
      touchX = 0;
      touchY = 0;
      prevTouchX = 0;
      prevTouchY = 0;
      velX = 0;
      velY = 0;
      rotation = Math.random() * 30 - 15;
      currentPaperX = 0;
      currentPaperY = 0;
      rotating = false;
  
      init(paper) {
        const handleMove = (x, y) => {
          if(!this.rotating) {
            this.touchX = x;
            this.touchY = y;
  
            this.velX = this.touchX - this.prevTouchX;
            this.velY = this.touchY - this.prevTouchY;
          }
  
          const dirX = x - this.touchX;
          const dirY = y - this.touchY;
          const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
          const dirNormalizedX = dirX / dirLength;
          const dirNormalizedY = dirY / dirLength;
  
          const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
          let degrees = 180 * angle / Math.PI;
          degrees = (360 + Math.round(degrees)) % 360;
          if(this.rotating) {
            this.rotation = degrees;
          }
  
          if(this.holdingPaper) {
            if(!this.rotating) {
              this.currentPaperX += this.velX;
              this.currentPaperY += this.velY;
            }
            this.prevTouchX = x;
            this.prevTouchY = y;
  
            paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
          }
        };
  
        const handleStart = (e) => {
          if(this.holdingPaper) return;
          this.holdingPaper = true;
  
          paper.style.zIndex = highestZ;
          highestZ += 1;
  
          const touch = e.touches[0];
          this.touchX = touch.clientX;
          this.touchY = touch.clientY;
          this.prevTouchX = touch.clientX;
          this.prevTouchY = touch.clientY;
  
          if(e.touches.length === 2) {
            this.rotating = true;
          }
        };
  
        const handleEnd = () => {
          this.holdingPaper = false;
          this.rotating = false;
        };
  
        paper.addEventListener('touchstart', (e) => {
          e.preventDefault();
          handleStart(e);
        });
  
        window.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if(this.holdingPaper) {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
          }
        });
  
        window.addEventListener('touchend', () => {
          handleEnd();
        });
  
        window.addEventListener('contextmenu', (e) => {
          e.preventDefault();
        });
      }
    }
  
    const papers = Array.from(document.querySelectorAll('.paper'));
  
    papers.forEach(paper => {
      const p = new Paper();
      p.init(paper);
    });
  } else {
    let highestZ = 1;
  
    class Paper {
      holdingPaper = false;
  
      prevMouseX = 0;
      prevMouseY = 0;
  
      mouseX = 0;
      mouseY = 0;
  
      velocityX = 0;
      velocityY = 0;
  
      currentPaperX = 0;
      currentPaperY = 0;
  
      init(paper) {
        paper.addEventListener('mousedown', (e) => {
          this.holdingPaper = true;
  
          paper.style.zIndex = highestZ;
          highestZ += 1;
  
          if (e.button === 0) {
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
          }
        });
  
        document.addEventListener('mousemove', (e) => {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
  
          this.velocityX = this.mouseX - this.prevMouseX;
          this.velocityY = this.mouseY - this.prevMouseY;
  
          if (this.holdingPaper) {
            this.currentPaperX += this.velocityX;
            this.currentPaperY += this.velocityY;
  
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
  
            paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px)`;
          }
        });
  
        window.addEventListener('mouseup', (e) => {
          this.holdingPaper = false;
        });
      }
    }
  
    const papers = Array.from(document.querySelectorAll('.paper'));
  
    papers.forEach(paper => {
      const p = new Paper();
      p.init(paper);
    });
  }
  