class Line {
    constructor(svg, svgNS, width, height) {
        this.svg = svg;
        this.svgNS = svgNS;
        this.width = width;
        this.height = height;

        this.rawPoints = [];
        this.roughness = 5;
        this.segmentsRate = 50;
        this.speed = 3;
        this.pathElement = document.createElementNS(this.svgNS, 'path');
        this.pathElement.setAttribute('class', 'handwritten-line');
        this.svg.appendChild(this.pathElement);

        // 点の円を管理するためのグループ要素を追加
        this.pointElementsGroup = document.createElementNS(this.svgNS, 'g');
        this.svg.appendChild(this.pointElementsGroup);

        this.isWaving = false; // 波の状態を管理するプロパティを追加

        for (let x = 1.2 * this.height; x <= this.width; x += this.segmentsRate) {
            let y = 0.7 * this.height + (Math.random() - 0.5) * this.roughness;
            this.rawPoints.push({x: x, y: y})
        }
        this.rawPoints.unshift({x: 1.1 * height - 5, y: 0.7 * this.height + (Math.random() - 0.5) * this.roughness})
    }

    startWave() {
        this.isWaving = true;
        let random1 = Math.random();
        let random2 = Math.random();
        let random3 = Math.random();

        this.rawPoints.splice(2, 0,
            {x: 1.2 * this.height, y: 0.7 * this.height},
            {x: 1.2 * this.height, y: 0.7 * this.height - 100 + (random1 - 0.5) * this.roughness},
            {x: 1.2 * this.height, y: 0.7 * this.height - 100 + (random1 - 0.5) * this.roughness},
            {x: 1.2 * this.height, y: 0.7 * this.height - 100 + (random2 - 0.5) * this.roughness},
            {x: 1.2 * this.height, y: 0.7 * this.height - 100 + (random2 - 0.5) * this.roughness},
            {x: 1.2 * this.height, y: 0.7 * this.height + (random3 - 0.5) * this.roughness},
            {x: 1.2 * this.height, y: 0.7 * this.height + (random3 - 0.5) * this.roughness});
    }

    stopWave() {
        this.isWaving = false;
        let random4 = Math.random()
        this.rawPoints.splice(1, 0, 
            {x: 1.2 * this.height, y: 0.7 * this.height + (random4 - 0.5) * this.roughness},
            {x: 1.2 * this.height, y: 0.7 * this.height + (random4 - 0.5) * this.roughness});
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
        if (this.isWaving) {
            // 波を出している最中は、左端の点を上下に設置し固定して、他の点を右に動かす
            const fixedpoints = this.rawPoints.splice(0,5); // 左端の点を一時的に取り出す
            this.rawPoints.forEach(point => {
                point.x += this.speed;
            });
            // 2. 取り出しておいた左端の点を再び配列の先頭に戻す
            this.rawPoints.unshift(...fixedpoints);

            // 3. 画面の右側にはみ出しすぎた点を配列から削除する
            //    （配列が無限に長くなるのを防ぐ）
            this.rawPoints = this.rawPoints.filter(p => p.x < this.width + 200); // 画面幅+200pxより左にある点だけを残す
            // 4. 左側に隙間ができていたら、新しい点を追加して埋める
            //    （whileループを使うことで、もしアニメーションが遅れても一気に隙間を埋められる）
            while (this.rawPoints.length > 0 && this.rawPoints[5].x > this.height*1.2 + this.segmentsRate) {
                const centerY = 0.7 * this.height;
                let newY;

                newY = centerY - 100;

                const newX = this.rawPoints[5].x - this.segmentsRate;
                this.rawPoints.splice(4,0,{x: newX, y: newY});
            }

        }else {
            // 1. 左端の点以外を右に動かす
            const fixedpoint = this.rawPoints.splice(0, 2); // 左端の点を一時的に取り出す
            this.rawPoints.forEach(point => {
                point.x += this.speed;
            });
            // 2. 取り出しておいた左端の点を再び配列の先頭に戻す
            this.rawPoints.unshift(...fixedpoint);

            // 3. 画面の右側にはみ出しすぎた点を配列から削除する
            //    （配列が無限に長くなるのを防ぐ）
            this.rawPoints = this.rawPoints.filter(p => p.x < this.width + 200); // 画面幅+200pxより左にある点だけを残す

            // 4. 左側に隙間ができていたら、新しい点を追加して埋める
            //    （whileループを使うことで、もしアニメーションが遅れても一気に隙間を埋められる）
            while (this.rawPoints.length > 0 && this.rawPoints[2].x > this.height*1.2 + this.segmentsRate) {
                const centerY = 0.7 * this.height;
                let newY;

                newY = centerY + (Math.random() - 0.5) * this.roughness;

                const newX = this.rawPoints[2].x - this.segmentsRate;
                this.rawPoints.splice(2,0,{x: newX, y: newY});
            }
        }
    }


    updateRoughness() {
        const fixedpoint = this.rawPoints.shift();
        this.rawPoints.forEach(point => {
            point.y += (Math.random() - 0.5) * this.roughness
        });

        // this.rawPoints.forEach(point => {
        //     this.rawPoints.forEach(point => {
        //         point.y += (Math.random() - 0.5) * this.roughness
        //     })
        // });
        // 動きは面白い

        this.rawPoints.unshift(fixedpoint);
    }

    draw() {
        // 線のパスを描画
        const pathData = this.buildPathData();
        this.pathElement.setAttribute("d", pathData);

        // 点の円を描画
        // 1. まず、既存の円をすべて削除する
        while (this.pointElementsGroup.firstChild) {
            this.pointElementsGroup.removeChild(this.pointElementsGroup.firstChild);
        }

        // 2. 現在のすべての点の位置に新しい円を作成して追加する
        this.rawPoints.forEach(point => {
            const circle = document.createElementNS(this.svgNS, 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '3'); // 円の半径
            circle.setAttribute('fill', 'red'); // 円の色
            // this.pointElementsGroup.appendChild(circle);
        });
    }

    destroy() {
        this.pathElement.remove();
        this.pointElementsGroup.remove();
    }
}