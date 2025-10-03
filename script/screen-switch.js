// スタート画面からひとりでに切り替える
startToHitoride.onclick = function() {
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.hitorideMenu').style.display = 'block';
}

// ひとりでからスタート画面に戻る
hitorideToStart.onclick = function() {
    document.querySelector('.hitorideMenu').style.display = 'none';
    document.querySelector('.start').style.display = 'flex';
    // 画面切り替えたらv.jsを削除する
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('v.js')) {
            document.body.removeChild(scripts[i]);
        }
    }
    // svgも削除する
    const svgs = document.getElementsByTagName('svg');
    for (let i = 0; i < svgs.length; i++) {
        document.body.removeChild(svgs[i]);
    }
}

// ひとりでからうつに切り替える
hitorideMenuToUtu.onclick = function() {
    document.querySelector('.hitorideMenu').style.display = 'none';
    document.querySelector('.hitorideUtu').style.display = 'block';
        // 画面切り替えたらv.jsを読み込む
    const script = document.createElement('script');
    script.src = 'script/v.js';
    document.body.appendChild(script);
}