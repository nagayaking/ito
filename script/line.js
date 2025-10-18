document.addEventListener('DOMContentLoaded', () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    document.body.appendChild(svg);

    let currentCupPath = null;
    let currentLinePath = null;
    const width = window.innerWidth;
    const height = window.innerHeight / 2;

    function drawCup() {
        if (currentCupPath) {
            currentCupPath.remove();
        }

        const newCupPath = document.createElementNS(svgNS, "path");
        newCupPath.setAttribute('class', 'handwritten-cup');


        const roughness = 5; // 揺れの大きさ
        const segmentsRate = 50; // 1セグメントあたりの長さ

        //きれいな紙コップ
        const defaultDots = [
            [0.3 * height, 0.4 * height], //左上
            [0.3 * height, height], //左下
            [1.1 * height, 0.9 * height], //右下
            [1.1 * height, 0.5 * height] //右上
        ];

        // 1. ポイントを生成
        const cupPoints = [defaultDots[0]];
        for (let i = 0; i < defaultDots.length; i++) {
            const dx = (i !== 3) ? defaultDots[i + 1][0] - defaultDots[i][0] : defaultDots[0][0] - defaultDots[3][0];
            const dy = (i !== 3) ? defaultDots[i + 1][1] - defaultDots[i][1] : defaultDots[0][1] - defaultDots[3][1];
            const cupSegments = Math.sqrt(dx ** 2 + dy ** 2) / segmentsRate | 0;
            const blur = pointBlur(defaultDots[i], (i !== 3) ? defaultDots[i + 1] : defaultDots[0]);

            // 始点を飛ばして終点まで
            for (let j = 0; j <= cupSegments; j++) {
                const x = defaultDots[i][0] + (dx / cupSegments) * j;
                const y = defaultDots[i][1] + (dy / cupSegments) * j;
                // 終点が大きく揺れないように調整
                const shakeX = (j === cupSegments) ? 0 : (Math.random() - 0.5) * roughness * blur[0];
                const shakeY = (j === cupSegments) ? 0 : (Math.random() - 0.5) * roughness * blur[1];
                cupPoints.push([x + shakeX, y + shakeY]);
            }
        }

        // ポイントのブレを考える関数
        function pointBlur(pointA, pointB) {
            const dx = Math.abs(pointA[0] - pointB[0]);
            const dy = Math.abs(pointA[1] - pointB[1]);
            const sum = dx + dy
            return [dy / sum, dx / sum]
        }

        //  2. ポイントを元に滑らかなパスを作成
        let pathDataCup = `M ${cupPoints[0][0]} ${cupPoints[0][1]}`; //最初の点
        for (let i = 0; i < cupPoints.length - 1; i++) {
            const P0 = cupPoints[i];
            const P1 = cupPoints[i + 1];
            const midPointX = (P0[0] + P1[0]) / 2; //各点の中点を作成
            const midPointY = (P0[1] + P1[1]) / 2;
            pathDataCup += ` Q ${P0[0]} ${P0[1]}, ${midPointX} ${midPointY}`;
        }
        // 最後の点を結ぶ
        pathDataCup += ` L ${cupPoints[cupPoints.length - 1][0]} ${cupPoints[cupPoints.length - 1][1]}`;

        newCupPath.setAttribute("d", pathDataCup);
        svg.appendChild(newCupPath);
        currentCupPath = newCupPath;
    }
        
    class Line {
        constructor() {
            this.rawPoints = [];
            this.roughness = 5;
            this.segmentsRate = 50;
            this.speed = 1;
            this.pathElement = document.createElementNS(svgNS, 'path');
            this.pathElement.setAttribute('class', 'handwritten-line');
            svg.appendChild(this.pathElement);

            for (let x = 0.4 * height; x <= width; x += this.segmentsRate) {
                let y = 0.7 * height + (Math.random() - 0.5) * this.roughness;
                this.rawPoints.push({x: x, y: y, })
            }
        }

        buildPathData() { 
            if (!this.rawPoints || this.rawPoints.length < 2) return "";
            let pathData = `M ${this.rawPoints[0].x} ${this.rawPoints[0].y}`; //最初の点
            for (let i = 0; i < this.rawPoints.length - 1; i++) {
                const P0 = this.rawPoints[i];
                const P1 = this.rawPoints[i + 1];
                const midPointX = (P0.x + P1.x) / 2; //各点の中点を作成
                const midPointY = (P0.y + P1.y) / 2;
                pathData += ` Q ${P0.x} ${P0.y}, ${midPointX} ${midPointY}`;
            }
            return pathData;
        }

        updatePoints() {
            this.rawPoints.forEach(point => {
                point.x += this.speed;
            });
            if (this.rawPoints[this.rawPoints.length - 1].x > width + this.segmentsRate * 2) {
                this.rawPoints.pop();
                let y = 0.7 * height + (Math.random() - 0.5) * this.roughness;
                this.rawPoints.unshift({x: 0.4 * height, y: y});
            }
        }

        updateRoughness() {
            this.rawPoints.forEach(point => {
                point.y = 0.7 * height + (Math.random() - 0.5) * this.roughness;
            });
        }

        draw() {
            const pathData = this.buildPathData();
            this.pathElement.setAttribute("d", pathData);
        }

        destroy() {
            this.pathElement.remove();
        }
    }

    const myLine = new Line();

    function animate() {
    
        myLine.updatePoints();
        myLine.draw();
        requestAnimationFrame(animate);
    }

    function fixedanimete() {
        myLine.updateRoughness();
        drawCup();
    }
    
    setInterval(fixedanimete, 400);
    animate();
})