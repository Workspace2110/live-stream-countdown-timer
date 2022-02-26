// タイマーを格納する変数の宣言
let m_timer;
// タイマーウィンドウを格納する変数の宣言
let timerWindow = null;
// 経過時間を格納する変数の宣言
let elapsed_time = 0;

// カウントダウン関数を1000ミリ秒毎に呼び出す関数
function startCountdown() {
    document.getElementById("start_btn").disabled = true;
    document.getElementById("stop_btn").disabled = false;
    document.getElementById("reset_btn").disabled = true;

    document.getElementById("input_elapsed_hour").disabled = true;
    document.getElementById("input_elapsed_minute").disabled = true;
    document.getElementById("input_elapsed_second").disabled = true;

    m_timer = setInterval("countdown()", 1000);
}

// タイマー停止関数
function stopCountdown() {
    document.getElementById("start_btn").disabled = false;
    document.getElementById("stop_btn").disabled = true;
    document.getElementById("reset_btn").disabled = false;

    document.getElementById("input_elapsed_hour").disabled = false;
    document.getElementById("input_elapsed_minute").disabled = false;
    document.getElementById("input_elapsed_second").disabled = false;

    clearInterval(m_timer);
}

// カウントダウン関数
function countdown() {
    let input_time = getInputTime();
    let hour = input_time.hour;
    let min = input_time.min;
    let sec = input_time.sec;

    if (hour === "" && min === "" && sec === "") {
        reSet();
    } else {
        if (hour == "") hour = 0;
        hour = parseInt(hour);

        if (min == "") min = 0;
        min = parseInt(min);

        if (sec == "") sec = 0;
        sec = parseInt(sec);

        setInputTime(hour, min, sec);
        writeTimer(hour * 3600 + min * 60 + sec - 1);
        writeElapsedTimer(++elapsed_time);
    }
}

// 残り時間を書き出する関数
function writeTimer(second) {
    let i_second = parseInt(second);

    if (i_second <= 0) {
        timeUp();
    } else {
        let show_time = getShowTime(i_second);

        setInputTime(show_time.hours, show_time.mins, show_time.secs);
        setShowTime(show_time.hours, show_time.mins, show_time.secs);
    }
}

// 経過時間を書き出する関数
function writeElapsedTimer(secound) {
    let i_second = parseInt(secound);
    let show_elapsed_time = getShowTime(i_second);
    setShowElapsedTime(show_elapsed_time.hours, show_elapsed_time.mins, show_elapsed_time.secs);
}

// フォームを初期状態に戻す（リセット）関数
function reSet() {
    let hours = 0;
    let mins = 0;
    let secs = 0;

    setInputTime(hours, mins, secs);
    setShowTime(hours, mins, secs);

    document.getElementById("start_btn").disabled = false;
    document.getElementById("stop_btn").disabled = true;
    document.getElementById("reset_btn").disabled = false;

    clearInterval(m_timer);
}

// タイムアップ関数
function timeUp() {
    reSet();
    document.getElementById("show_time").innerHTML = "<h1 class='show-time-up display-4'>時間到了!</h1>";
    if(timerWindow) {
        if(!timerWindow.closed) {
            timerWindow.document.getElementById("new_window_show_time").innerHTML = "<h1 class='new-window-show-time-up display-4'>時間到了!</h1>";
        }
    }
}

// ダイナミックアップデートタイマー表示残り時間関数
function dynamicUpdateShowTime() {
    let set_time = getInputTime();

    let i_total_second = set_time.hour * 3600 + set_time.min * 60 + set_time.sec;
    let show_time = getShowTime(i_total_second);

    setShowTime(show_time.hours, show_time.mins, show_time.secs);
}

// ダイナミックアップデートタイマー表示経過時間関数
function dynamicUpdateElapsedTime() {
    let set_time = getInputElapsedTime();

    elapsed_time = set_time.hour * 3600 + set_time.min * 60 + set_time.sec;
    let show_time = getShowTime(elapsed_time);

    setShowElapsedTime(show_time.hours, show_time.mins, show_time.secs);
}

// 1時間を追加する関数
function addOneHour() {
    let set_time = getInputTime();

    let i_total_second = (set_time.hour + 1) * 3600 + set_time.min * 60 + set_time.sec;
    let show_time = getShowTime(i_total_second);

    setInputTime(show_time.hours, show_time.mins, show_time.secs);
    setShowTime(show_time.hours, show_time.mins, show_time.secs);
}

// 20分を追加する関数
function addTwentyMinute() {
    let set_time = getInputTime();

    let i_total_second = set_time.hour * 3600 + set_time.min * 60 + set_time.sec + 1200;
    let show_time = getShowTime(i_total_second);

    setInputTime(show_time.hours, show_time.mins, show_time.secs);
    setShowTime(show_time.hours, show_time.mins, show_time.secs);
}

// カスタマイズされた分を追加関数
function addCustomizedMinute() {
    let add_min = normalizeInputNumberValue(document.getElementById("input_add_min").value, 0);
    let set_time = getInputTime();

    let i_total_second = set_time.hour * 3600 + (set_time.min + add_min) * 60 + set_time.sec;
    if (i_total_second <= 0) {
        timeUp();
        return;
    }

    let show_time = getShowTime(i_total_second);

    setInputTime(show_time.hours, show_time.mins, show_time.secs);
    setShowTime(show_time.hours, show_time.mins, show_time.secs);
}

// 換金関数
function convertTime() {
    let donate_money = normalizeInputNumberValue(document.getElementById("donate_money").value, 0);
    let unit_time = normalizeInputNumberValue(document.getElementById("unit_time").value, 1);
    document.getElementById("unit_time").value = unit_time;
    let unit_money = normalizeInputNumberValue(document.getElementById("unit_money").value, 1);
    document.getElementById("unit_money").value = unit_money;

    let add_time = Math.round(donate_money / unit_money) * unit_time;
    let set_time = getInputTime();

    let i_total_second = set_time.hour * 3600 + (set_time.min + add_time) * 60 + set_time.sec;
    let show_time = getShowTime(i_total_second);

    setInputTime(show_time.hours, show_time.mins, show_time.secs);
    setShowTime(show_time.hours, show_time.mins, show_time.secs);
}

// 入力数値を正規化する関数
function normalizeInputNumberValue(input_value, defualt) {
    return parseInt(input_value === "" ? defualt : input_value);
}

// HTMLヘッダーを初期化する関数
function initBaseHtmlHeader(title) {
    const html_meta_setting = '<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
    const html_bootstrap_5_1_3_cdn = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>';
    const html_font_cdn = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Reggae+One&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">';
    const html_m_js_linker = '<script src="./js/timer.js"></script>';
    const html_m_css_linker = '<link rel="stylesheet" href="./css/timer.css">'

    let html_header = "<head>";
    html_header += html_meta_setting;
    html_header += html_bootstrap_5_1_3_cdn;
    html_header += html_font_cdn;
    html_header += html_m_js_linker;
    html_header += html_m_css_linker;
    html_header += ("<title>" + title + "</title>");
    html_header += "</head>";

    return html_header;
}

// HTMLボディを初期化する関数
function initTimerWindowHtmlBody() {
    let show_time = document.getElementById("show_time").innerHTML
    let show_elapsed_time = document.getElementById("show_elapsed_time").innerHTML

    let html_body = '<body class="show-time-background">';
    html_body += '<div>';
    html_body += '<h1 id="" class="display-4 new-window-show-time-title">剩餘時間</h1>';
    html_body += '<h1 id="new_window_show_time" class="display-4 new-window-show-time">' + show_time + '</h1>';
    html_body += '<h1 id="" class="display-4 new-window-show-elapsed-time-title">已開台時間</h1>';
    html_body += '<h1 id="new_window_show_elapsed_time" class="display-4 new-window-show-elapsed-time">' + show_elapsed_time + '</h1>';
    html_body += '</div>';
    html_body += '</body>';

    return html_body;
}

// タイマーウィンドウを初期化する関数
function initTimerWindow() {
    let html_new_window = "<!DOCTYPE html>";
    html_new_window += '<html lang="en">';
    html_new_window += initBaseHtmlHeader("抖內計時器");
    html_new_window += initTimerWindowHtmlBody();
    html_new_window += '</html>';

    timerWindow = window.open("", "", "width=601,height=301");
    timerWindow.document.write(html_new_window);
}

// タイマーウィンドウを開く関数
function openTimerWindow() {
    if(!timerWindow) {
        initTimerWindow();
    } else if(timerWindow.closed) {
        initTimerWindow();
    } else {
        timerWindow.focus();
    }
}

// 経過時間をクリーン関数
function cleanElapsedTime() {
    elapsed_time = 0;
    setShowElapsedTime(0, 0, 0);
    setInputElapsedTime(0, 0, 0);
}

function setInputTime(hours, mins, secs) {
    document.getElementById("input_hour").value = hours;
    document.getElementById("input_minute").value = mins;
    document.getElementById("input_second").value = secs;
}

function setShowTime(hours, mins, secs) {
    let show_hour = hours.toString().padStart(3, "0");
    let show_minute = mins.toString().padStart(2, "0");
    let show_second = secs.toString().padStart(2, "0");

    document.getElementById("show_time").innerHTML = show_hour + ":" + show_minute + ":" + show_second;

    if(timerWindow) {
        if(!timerWindow.closed) {
            timerWindow.document.getElementById("new_window_show_time").innerHTML = show_hour + ":" + show_minute + ":" + show_second;
        }
    }
}

function setShowElapsedTime(hours, mins, secs) {
    let show_hour = hours.toString().padStart(3, "0");
    let show_minute = mins.toString().padStart(2, "0");
    let show_second = secs.toString().padStart(2, "0");

    document.getElementById("show_elapsed_time").innerHTML = show_hour + ":" + show_minute + ":" + show_second;

    if(timerWindow) {
        if(!timerWindow.closed) {
            timerWindow.document.getElementById("new_window_show_elapsed_time").innerHTML = show_hour + ":" + show_minute + ":" + show_second;
        }
    }
}

function setInputElapsedTime(hours, mins, secs) {
    document.getElementById("input_elapsed_hour").value = parseInt(hours);
    document.getElementById("input_elapsed_minute").value = parseInt(mins);
    document.getElementById("input_elapsed_second").value = parseInt(secs);
}

function getInputTime() {
    let hour = normalizeInputNumberValue(document.getElementById("input_hour").value, 0);
    let min = normalizeInputNumberValue(document.getElementById("input_minute").value, 0);
    let sec = normalizeInputNumberValue(document.getElementById("input_second").value, 0);

    return {
        hour,
        min,
        sec
    }
}

function getInputElapsedTime() {
    let hour = normalizeInputNumberValue(document.getElementById("input_elapsed_hour").value, 0);
    let min = normalizeInputNumberValue(document.getElementById("input_elapsed_minute").value, 0);
    let sec = normalizeInputNumberValue(document.getElementById("input_elapsed_second").value, 0);

    return {
        hour,
        min,
        sec
    }
}

function getShowTime(i_time_second) {
    let hours = Math.floor(i_time_second / 3600) > 999 ? 999 : Math.floor(i_time_second / 3600);
    let mins = Math.floor(i_time_second % 3600 / 60);
    let secs = i_time_second % 60;

    return {
        hours,
        mins,
        secs
    }
}
