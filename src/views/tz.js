function convertUTCToTimezone(utcString, timeZone) {
	const date = new Date(utcString)
	return new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(date)
}

// Example usage:
const utcTime = '2025-05-15T13:50:00.000Z'
const timeZone = 'Europe/Brussels'

console.log(convertUTCToTimezone(utcTime, timeZone))

