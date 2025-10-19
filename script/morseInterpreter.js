class MorseInterpreter {
    constructor(options = {}) {
        this.dotThreshold = options.dotThreshold || 200; // ミリ秒
        this.morseToJapaneseMap = {
                "ーー・ーー":"あ","・ー":"い","・・ー":"う","ー・ーーー":"え","・ー・・・":"お",
                "・ー・・":"か","ー・ー・・":"き","・・・ー":"く","ー・ーー":"け","ーーーー":"こ",
                "ー・ー・ー":"さ","ーー・ー・":"し","ーーー・ー":"す","・ーーー・":"せ","ーーー・":"そ",
                "ー・":"た","・・ー・":"ち","・ーー・":"つ","・ー・ーー":"て","・・ー・・":"と",
                "・ー・":"な","ー・ー・":"に","・・・・":"ぬ","ーー・ー":"ね","・・ーー":"の",
                "ー・・・":"は","ーー・・ー":"ひ","ーー・・":"ふ","・":"へ","ー・・":"ほ",
                "ー・・ー":"ま","・・ー・ー":"み","ー":"む","ー・・・ー":"め","ー・・ー・":"も",
                "・ーー":"や","ー・・ーー":"ゆ","ーー":"よ",
                "・・・":"ら","ーー・":"り","ー・ーー・":"る","ーーー":"れ","・ー・ー":"ろ",
                "ー・ー":"わ","・ー・・ー":"ゐ","・ーー・・":"ゑ","・ーーー":"を","・ー・ー・":"ん",

                "・・":"゛",//濁点
                "・・ーー・":"゜",//半濁点
                "・ーー・ー":"ー",//長音
                "・ー・ー・ー":"、"//読点
        };
        this.japaneseToMorseMap = {};
        for (const [morse, japanese] of Object.entries(this.morseToJapaneseMap)) {
            this.japaneseToMorseMap[japanese] = morse;
        }
    }


    decode(duration) {
        if (duration > 0 && duration <= this.dotThreshold) {
            return "dot"; // 短い信号はドット
        } else if (duration > this.dotThreshold) {
            return "dash"; // 長い信号はダッシュ
        } else {
            return null; // 無効な信号
        }
    }
}