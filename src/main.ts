import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { name, description, version } from '../package.json';
import * as path from 'node:path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		autoFlushLogs: true
	});

	const logger = new Logger('Bootstrap');
	const reflector = app.get(Reflector);
	const configService = app.get(ConfigService);

	const NODE_ENV = configService.get('NODE_ENV', 'development');
	const isDevelopment = NODE_ENV === 'development';
	const isProduction = NODE_ENV === 'production';

	const API_PREFIX = configService.get('API_PREFIX', 'api');

	if (isProduction) {
		// TODO: Wait for https://github.com/nestjs/nest/pull/14121
		// app.useLogger(new ConsoleLogger({ json: true }));
	}

	app.enableCors();
	app.set('trust proxy', true);
	app.enableShutdownHooks();

	app.setGlobalPrefix(API_PREFIX, { exclude: ['health'] });
	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const isSwaggerEnabled = configService.get('SWAGGER_ENABLED', true);

	if (isDevelopment || isSwaggerEnabled) {
		const config = new DocumentBuilder()
			.setTitle(name)
			.setDescription(description)
			.setVersion(version)
			.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
			.build();

		const document = SwaggerModule.createDocument(app, config);
		const swaggerPath = configService.get('SWAGGER_PATH', 'swagger');

		SwaggerModule.setup(swaggerPath, app, document, {
			jsonDocumentUrl: path.join(swaggerPath, 'openapi.json'),
			yamlDocumentUrl: path.join(swaggerPath, 'openapi.yaml'),
			swaggerOptions: { persistAuthorization: true }
		});
	}

	const port = configService.get('PORT', 3000);
	await app.listen(port, () => {
		logger.log(`Server is running on http://localhost:${port}`);
	});
}

void bootstrap();
