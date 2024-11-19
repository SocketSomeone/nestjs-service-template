import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
	@Get('health')
	@ApiOperation({ summary: 'Health check' })
	public health(): string {
		return 'OK';
	}
}
