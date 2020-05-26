/**
 * 名義変更希望日に3ヶ月以内の入力をできないように
 * サーバーから時間を取得：端末で日付が変更されていることに対処するため
 * jQuery使用
 */

// 日付を格納しておく配列
let date_arr = []
$.ajax({
    type: 'GET'
}).done(function (data, status, xhr) {
    // サーバーから時刻を取得
    const serverDate = new Date(xhr.getResponseHeader('Date'));
    // 月
    const month = serverDate.getMonth() + 1;
    // 西暦
    const min_year = (month + 3 > 12) ? serverDate.getFullYear() + 1 : serverDate.getFullYear();
    // 3カ月後の値を設定
    const min_month = convertMonth(month + 3);
    // 配列に格納
    date_arr.push(min_year, min_month)

    // 日付入力部分のclassを削除して、新しいvalidateの設定を行う
    $('#date01, #date02').removeClass();
    $('#date01').addClass('validate[required,custom[number],min[' + min_year + ']]');
    $('#date02').addClass('validate[required,custom[number],min[' + min_month + '],max[12]]');
})

/**
 * 西暦の値に変更があった場合：現在の西暦と比較
 * 同じ場合   ： 月のvalidateはそのまま
 * 異なる場合 ： 月のvalidateを1から12に変更
 */
$('#date01').change(function () {
    let this_year = Number($(this).val());
    // 大きい場合
    if (this_year > date_arr[0]) {
        $('#date02').removeClass();
        $('#date02').addClass('validate[required,custom[number],min[1],max[12]');
    }
    // 同値の場合
    if (this_year === date_arr[0]) {
        $('#date02').removeClass();
        $('#date02').addClass('validate[required,custom[number],min[' + date_arr[1] + '],max[12]');
    }
    // 小さい場合は処理を変える必要がない：returnで終了
    return;
});

/**
 * 3カ月後を計算する際に12月をこえた場合に変換する関数
 * ex ) 11 + 3 = 14 → 2
 * @param  {Number} month // 月
 * @return {Number}       // 12を超えていた場合に1~に変換　
 */
function convertMonth (month) {
    if (month > 12) return month - 12;
}
