/* キーボードの行の生成 */
function createKeybordRow(s) {
    row = document.createElement('tr');
    for(let i = 0; i < 5; i++) {
        c = s.charAt(i);
        td = document.createElement('td');
        if (c == '　') {
            td.className = 'kara';
        } else if (c == '←') {
            td.innerHTML = c;
            td.setAttribute('onclick', "del()");
        } else if (c == '！') {
            td.innerHTML = c;
            td.setAttribute('onclick', "check()");
        } else {
            td.id = c;
            td.innerHTML = c;
            td.setAttribute('onclick', "input('" + c + "')");
        }
        row.appendChild(td);
    }
    return row;
}

/* キーボードの生成 */
function createKeybord() {
    /* キーボード1の生成 */
    keybord1array = [
        'あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの',
        'はひふへほ', 'まみむめも', 'や　ゆ　よ', 'らりるれろ'
    ];
    tbody = document.createElement('tbody');
    for(let j = 0; j < 9; j++) {
        row = createKeybordRow(keybord1array[j], 5);
        tbody.appendChild(row);
    }
    document.getElementById('keybord1').appendChild(tbody);

    /* キーボード2の生成 */
    keybord2array = [
        'わ　を　ん', 'っゃゅょー', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど',
        'ばびぶべぼ', 'ぱぴぷぺぽ', 'ぁぃぅぇぉ', '←　　　！'
    ];
    tbody = document.createElement('tbody');
    for(let j = 0; j < 9; j++) {
        row = createKeybordRow(keybord2array[j], 5);
        tbody.appendChild(row);
    }
    document.getElementById('keybord2').appendChild(tbody);
}

function init() {
    /* 回答欄の生成 */
    tbody = document.createElement('tbody');
    for(let j = 0; j < round; j++) {
        row = document.createElement('tr');
        for(let i = 0; i < wordlen; i++) {
            td = document.createElement('td');
            td.id = wordlen * j + i;
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }
    row = document.createElement('tr');
    td = document.createElement('td');
    td.colSpan = wordlen;
    td.className = 'note';
    div = document.createElement('div');
    div.id = 'message';
    td.appendChild(div);
    row.appendChild(td);
    tbody.appendChild(row);
    document.getElementById('maindisp').appendChild(tbody);

    /* キーボードの生成 */
    createKeybord();

    /* ヘルプの記述 */
    wordlelink = '<a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>';
    codelink = '(<a href="https://github.com/CookieBox26/games/blob/main/todlefukens">code</a>)';
    issuelink = '<a href="https://github.com/CookieBox26/games/issues">Issues</a>';
    twitterlink = '<a href="https://twitter.com/CookieBox26">twitter.com/CookieBox26</a>';
    helpmessage = wordlelink + ' に着想を得た' + gamedesc1 + 'です ' + codelink + '。';
    helpmessage += 'ブラウザの JavaScript で動作しますので自己責任で遊んでください。<br/>';
    helpmessage += gamedesc2 + '<br/>';
    helpmessage += '何か問題がありましたらコードリポジトリの ' + issuelink + ' か ';
    helpmessage += twitterlink + ' までご連絡ください。<br/>';
    helpmessage += 'This is a game inspired by ' + wordlelink + '. Contact me: ';
    helpmessage += issuelink + ' or ' + twitterlink;
    document.getElementById('help').innerHTML = helpmessage;

    if (window.matchMedia && window.matchMedia('(max-device-width: 480px)').matches) {
        document.getElementById('help').style.width = String((5 + wordlen)* 33) + 'px';
    }
}

function del() {
    if (finished) {
        return;
    }
    if (cursor == cursor_min) {
        return;
    }
    cursor -= 1;
    document.getElementById(cursor).innerHTML = '';
    document.getElementById('message').innerHTML = '';
}

function input(moji) {
    if (finished) {
        return;
    }
    if (cursor == cursor_max) {
        return;
    }
    document.getElementById(cursor).innerHTML = moji;
    document.getElementById('message').innerHTML = '';
    cursor += 1;
}

function check() {
    memo = 0;
    while (cursor % wordlen != 0) {
        input('　');
        memo += 1;
    }
    pred = '';
    for(let i = 0; i < wordlen; i++) {
        pred += document.getElementById(cursor - wordlen + i).innerHTML;
    }
    if (!data.includes(pred)) {
        document.getElementById('message').innerHTML = warningmessage;
        cursor -= memo;
        return;
    }
    cursor_min = cursor;
    cursor_max = cursor + wordlen;
    log += '\n';
    for(let i = 0; i < wordlen; i++) {
        p = pred.charAt(i);
        if (p == answer.charAt(i)) {
            green.push(p);
            document.getElementById(cursor - wordlen + i).style.background = '#65ab31';
            if (p != '　') {
                document.getElementById(p).style.background = '#65ab31';
            }
            log += '&#x1f7e9;';
        } else if (answer.indexOf(p) != -1) {
            document.getElementById(cursor - wordlen + i).style.background = '#fcc800';
            if (p != '　') {
                if (!green.includes(p)) {
                    document.getElementById(p).style.background = '#fcc800';
                }
            }
            log += '&#x1f7e8;';
        } else {
            document.getElementById(cursor - wordlen + i).style.background = 'gray';
            document.getElementById(cursor - wordlen + i).style.color = 'white';
            if (p != '　') {
                document.getElementById(p).style.background = 'gray';
            }
            log += '&#x2b1b;';
        }
        document.getElementById(cursor - wordlen + i).style.color = 'white';
        if (p != '　') {
            document.getElementById(p).style.color = 'white';
        }
    }
    if (pred == answer) {
        document.getElementById('message').innerHTML = '正解です！';
        // document.getElementById('message').innerHTML += tweet(log);
        // twttr.widgets.load();
        finished = true;
        return;
    }
    if (cursor == wordlen * round) {
        document.getElementById('message').innerHTML = '正解は' + answer + 'です。';
        // document.getElementById('message').innerHTML += tweet(log);
        // twttr.widgets.load();
        finished = true;
        return;
    }
    document.getElementById('message').innerHTML = '違います。';
}

function tweet(log) {
    if (document.title != 'ふぁんでるわーどる') {
        return '';
    }
    if (true) {
        tw = '<div style="margin-top: 10px;">';
        tw += '<a href="https://twitter.com/share?ref_src=twsrc%5Etfw"';
        tw += ' class="twitter-share-button" data-size="large" style="margin:10px 0;"';
        tw += ' data-text="' + document.title + log + '\n"';
        tw += ' data-url="https://cookiebox26.github.io/games/todlefukens/vanderwardle.html"';
        tw += ' data-lang="ja"';
        tw += ' data-show-count="false">Tweet</a></div>';
        return tw;
    } else {
        url = 'https://twitter.com/intent/tweet?text='
        url += document.title + log + '\n';
        url += 'https://cookiebox26.github.io/games/todlefukens/vanderwardle.html'
        tw = '<div style="margin-top: 10px;">';
        tw += '<a href="' + encodeURI(url) + '">Tweet</a></div>';
        return tw;
    }
}
