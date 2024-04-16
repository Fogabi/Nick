let highestZ;

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

    rotation = 0;

    rotating = false;

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

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotate(${this.rotation}deg)`;
            }
        });

        window.addEventListener('mouseup', () => {
            this.holdingPaper = false;
        });
    }
}

if (/Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)) {
    // Código para dispositivos móveis
    highestZ = 1;

    class MobilePaper extends Paper {
        touchX = 0;
        touchY = 0;
        prevTouchX = 0;
        prevTouchY = 0;

        init(paper) {
            super.init(paper);

            paper.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.holdingPaper = true;

                paper.style.zIndex = highestZ;
                highestZ += 1;

                const touch = e.touches[0];
                this.touchX = touch.clientX;
                this.touchY = touch.clientY;
                this.prevTouchX = touch.clientX;
                this.prevTouchY = touch.clientY;

                if (e.touches.length === 2) {
                    this.rotating = true;
                }
            });

            window.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (this.holdingPaper) {
                    const touch = e.touches[0];
                    this.handleMove(touch.clientX, touch.clientY);
                }
            });

            window.addEventListener('touchend', () => {
                this.holdingPaper = false;
                this.rotating = false;
            });
        }

        handleMove(x, y) {
            if (!this.rotating) {
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
            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevTouchX = x;
                this.prevTouchY = y;
            }
        }
    }

    const papers = Array.from(document.querySelectorAll('.paper'));

    papers.forEach(paper => {
        const p = new MobilePaper();
        p.init(paper);
    });
} else {
    // Código para computadores
    highestZ = 1;

    class DesktopPaper extends Paper {
        // Código para computadores...
    }

    const papers = Array.from(document.querySelectorAll('.paper'));

    papers.forEach(paper => {
        const p = new DesktopPaper();
        p.init(paper);
    });
}
