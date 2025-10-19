class Line {
    constructor(svg, svgNS, width, height) {
        this.svg = svg;
        this.svgNS = svgNS;
        this.width = width;
        this.height = height;

        this.rawPoints = [];
        this.roughness = 5;
        this.segmentsRate = 50;
        this.speed = 0.1;
        this.pathElement = document.createElementNS(this.svgNS, 'path');
        this.pathElement.setAttribute('class', 'handwritten-line');
        this.svg.appendChild(this.pathElement);

        this.isWaving = false; // 波の状態を管理するプロパティを追加

        for (let x = 1.2 * this.height; x <= this.width; x += this.segmentsRate) {
            let y = 0.7 * this.height + (Math.random() - 0.5) * this.roughness;
            this.rawPoints.push({x: x, y: y, })
        }
    }

    startWave() {
        this.isWaving = true;
    }

    stopWave() {
        this.isWaving = false;
    }

    buildPathData() { 
        if (!this.rawPoints || this.rawPoints.length < 2) return "";
        let pathData = `M ${this.rawPoints[0].x} ${this.rawPoints[0].y}`;
        for (let i = 0; i < this.rawPoints.length - 1; i++) {
            const P0 = this.rawPoints[i];
            const P1 = this.rawPoints[i + 1];
            const midPointX = (P0.x + P1.x) / 2;
            const midPointY = (P0.y + P1.y) / 2;
            pathData += ` Q ${P0.x} ${P0.y}, ${midPointX} ${midPointY}`;
        }
        return pathData;
    }

    updatePoints() {
        // 1. すべての点を右に動かす
        this.rawPoints.forEach(point => {
            point.x += this.speed;
        });

        // 2. 画面の右側にはみ出しすぎた点を配列から削除する
        //    （配列が無限に長くなるのを防ぐ）
        this.rawPoints = this.rawPoints.filter(p => p.x < this.width + 200); // 画面幅+200pxより左にある点だけを残す

        // 3. 左側に隙間ができていたら、新しい点を追加して埋める
        //    （whileループを使うことで、もしアニメーションが遅れても一気に隙間を埋められる）
        while (this.rawPoints.length > 0 && this.rawPoints[0].x > 1.2 * this.height) {
            const newY = 0.7 * this.height + (Math.random() - 0.5) * this.roughness;
            const newX = this.rawPoints[0].x - this.segmentsRate;
            this.rawPoints.unshift({x: newX, y: newY});
        }
    }
    propagateWave() {
        // 配列が短い場合は何もしない
        if (this.rawPoints.length < 10) return;
        // 1. 波の「源」となる点のY座標を決める
        const waveSourceIndex = 2; // 例えば、左から5番目の点を波の源とする
        const centerY = 0.7 * this.height;

        if (this.isWaving) {
            // 押されている時は、源の点を高い位置に
            this.rawPoints[waveSourceIndex].y = centerY - 30; // 振幅30
        } else {
            // 押されていない時は、源の点をランダムに揺らす
            this.rawPoints[waveSourceIndex].y = centerY + (Math.random() - 0.5) * this.roughness;
        }

        // 2. Y座標を右へ伝播させる (重要：ループは右から左へ！)
        // 右端の点から始め、一つ左の点のy座標を自分にコピーする
        for (let i = this.rawPoints.length - 1; i > 0; i--) {
            this.rawPoints[i].y = this.rawPoints[i - 1].y;
        }
    }

    updateRoughness() {
        this.rawPoints.forEach(point => {
            point.y = 0.7 * this.height + (Math.random() - 0.5) * this.roughness;
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