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

    /* キーボード1の生成 */
    keybord1array = [
        'あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの',
        'はひふへほ', 'まみむめも', 'や　ゆ　よ', 'らりるれろ'
    ];
    tbody = document.createElement('tbody');
    for(let j = 0; j < 9; j++) {
        row = createKeybordRow(keybord1array[j]);
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
        row = createKeybordRow(keybord2array[j]);
        tbody.appendChild(row);
    }
    document.getElementById('keybord2').appendChild(tbody);

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
    helpmessage += issuelink + ' or ' + twitterlink
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
    for(let i = 0; i < wordlen; i++) {
        p = pred.charAt(i);
        if (p == answer.charAt(i)) {
            green.push(p);
            document.getElementById(cursor - wordlen + i).style.background = '#65ab31';
            document.getElementById(cursor - wordlen + i).style.color = 'white';
            if (p != '　') {
                document.getElementById(p).style.background = '#65ab31';
                document.getElementById(p).style.color = 'white';
            }
        } else if (answer.indexOf(p) != -1) {
            document.getElementById(cursor - wordlen + i).style.background = '#fcc800';
            document.getElementById(cursor - wordlen + i).style.color = 'white';
            if (p != '　') {
                if (!green.includes(p)) {
                    document.getElementById(p).style.background = '#fcc800';
                    document.getElementById(p).style.color = 'white';
                }
            }
        } else {
            document.getElementById(cursor - wordlen + i).style.background = 'gray';
            document.getElementById(cursor - wordlen + i).style.color = 'white';
            if (p != '　') {
                document.getElementById(p).style.background = 'gray';
                document.getElementById(p).style.color = 'white';
            }
        }
    }
    if (pred == answer) {
        document.getElementById('message').innerHTML = '正解です！';
        finished = true;
        return;
    }
    if (cursor == wordlen * round) {
        document.getElementById('message').innerHTML = '正解は' + answer + 'です。';
        finished = true;
        return;
    }
    document.getElementById('message').innerHTML = '違います。';
}
