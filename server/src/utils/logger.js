import winston from 'winston'

const { colorize, combine, simple } = winston.format

const logger = winston.createLogger({
	format: combine(
		colorize({
			colors: {
				info: 'blue',
				error: 'red',
				warn: 'yellow'
			},
      
		}),
		simple(),
	),
	transports: [
		new winston.transports.Console()
	]
})

export default logger