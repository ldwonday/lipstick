const monthEN = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
]

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export function formatDate(date, fmt) {
	date = date == undefined ? new Date() : date;
	date = typeof date == 'number' ? new Date(date) : date;
	fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
	var obj =
		{
			'y': date.getFullYear(), // 年份，注意必须用getFullYear
			'M': date.getMonth() + 1, // 月份，注意是从0-11
			'd': date.getDate(), // 日期
			'q': Math.floor((date.getMonth() + 3) / 3), // 季度
			'w': date.getDay(), // 星期，注意是0-6
			'H': date.getHours(), // 24小时制
			'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
			'm': date.getMinutes(), // 分钟
			's': date.getSeconds(), // 秒
			'S': date.getMilliseconds() // 毫秒
		};
	var week = ['天', '一', '二', '三', '四', '五', '六'];
	for(var i in obj)
	{
		fmt = fmt.replace(new RegExp(i+'+', 'g'), function(m)
		{
			var val = obj[i] + '';
			if(i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
			for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
			return m.length == 1 ? val : val.substring(val.length - m.length);
		});
	}
	return fmt;
}

/**
 * 将字符串解析成日期
 * @param str 输入的日期字符串，如'2014-09-13'
 * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
 * @returns 解析后的Date类型日期
 */
export function parseDate(str, fmt) {
	fmt = fmt || 'yyyy-MM-dd';
	var obj = {y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0};
	fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function(m, $1, $2, $3, $4, idx, old)
	{
		str = str.replace(new RegExp($1+'(\\d{'+$2.length+'})'+$4), function(_m, _$1)
		{
			obj[$3] = parseInt(_$1);
			return '';
		});
		return '';
	});
	obj.M--; // 月份是从0开始的，所以要减去1
	var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
	if(obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
	return date;
}

export default str => {
	if (str === '') return
	let date

	const year = str.substring(0, 4)
	const month = str.substring(4, 6)
	const day = str.substring(6, 8)
	const hour = str.substring(8, 10)
	const min = str.substring(10, 12)
	const sec = str.substring(12, 14)

	const time = new Date(year, month - 1, day, hour, min, sec).getTime()
	const timeNow = new Date().getTime()
	const absond = parseInt((timeNow - time) / 1000, 10)
	const abs = Math.abs(absond)
	const options = {
		sec: '%d 秒前',
		min: '%d 分钟前',
		hour: '%d 小时前',
		day: '%d 天前',
		week: '%d 周前',
	}
	let v = abs
	if (abs < 60) {
		v = abs
		date = options.sec.replace('%d', parseInt(v, 10))
	} else if (abs < 3600) {
		v = abs / 60
		date = options.min.replace('%d', parseInt(v, 10))
	} else if (abs < 86400) {
		v = abs / 3600
		date = options.hour.replace('%d', parseInt(v, 10))
	} else if (abs < 604800) {
		v = abs / 86400
		date = options.day.replace('%d', parseInt(v, 10))
	} else if (abs < 2592000) {
		v = abs / 604800
		date = options.week.replace('%d', parseInt(v, 10))
	} else {
		date = [day, monthEN[month - 1], year].join(' ')
	}

	return date
};
