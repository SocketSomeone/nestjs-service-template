import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
	@ApiOperation({ summary: 'Health check' })
	@Get('health')
	public health(): string {
		return 'OK';
	}
}
