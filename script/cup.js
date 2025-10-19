class Cup {
    constructor(svg, svgNS, height) {
        this.svg = svg;
        this.svgNS = svgNS;
        this.height = height;

        this.roughness = 5;
        this.segmentsRate = 50;

        this.pathElement = document.createElementNS(this.svgNS, 'path');
        this.pathElement.setAttribute('class', 'handwritten-cup');
        this.svg.appendChild(this.pathElement);
    }

    _pointBlur(pointA, pointB) {
        const dx = Math.abs(pointA[0] - pointB[0]);
        const dy = Math.abs(pointA[1] - pointB[1]);
        const sum = dx + dy;
        if (sum === 0) return [0, 0];
        return [dy / sum, dx / sum];
    }

    buildPathData() {
        const defaultDots = [
            [0.3 * this.height, 0.4 * this.height],
            [0.3 * this.height, this.height],
            [1.1 * this.height, 0.9 * this.height],
            [1.1 * this.height, 0.5 * this.height]
        ];

        const cupPoints = [defaultDots[0]];
        for (let i = 0; i < defaultDots.length; i++) {
            const p1 = defaultDots[i];
            const p2 = defaultDots[(i + 1) % defaultDots.length];
            const dx = p2[0] - p1[0];
            const dy = p2[1] - p1[1];
            const cupSegments = Math.sqrt(dx ** 2 + dy ** 2) / this.segmentsRate | 0;
            const blur = this._pointBlur(p1, p2);

            for (let j = 0; j <= cupSegments; j++) {
                const x = p1[0] + (dx / cupSegments) * j;
                const y = p1[1] + (dy / cupSegments) * j;
                const isLastPoint = (j === cupSegments);
                const shakeX = isLastPoint ? 0 : (Math.random() - 0.5) * this.roughness * blur[0];
                const shakeY = isLastPoint ? 0 : (Math.random() - 0.5) * this.roughness * blur[1];
                cupPoints.push([x + shakeX, y + shakeY]);
            }
        }

        let pathDataCup = `M ${cupPoints[0][0]} ${cupPoints[0][1]}`;
        for (let i = 0; i < cupPoints.length - 1; i++) {
            const P0 = cupPoints[i];
            const P1 = cupPoints[i + 1];
            const midPointX = (P0[0] + P1[0]) / 2;
            const midPointY = (P0[1] + P1[1]) / 2;
            pathDataCup += ` Q ${P0[0]} ${P0[1]}, ${midPointX} ${midPointY}`;
        }
        pathDataCup += ` L ${cupPoints[cupPoints.length - 1][0]} ${cupPoints[cupPoints.length - 1][1]}`;
        return pathDataCup;
    }

    draw() {
        const pathData = this.buildPathData();
        this.pathElement.setAttribute('d', pathData);
    }
}