import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes/routes';
import config from './config';
import { logger } from './utils/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	standardHeaders: true,
	legacyHeaders: false
});

app.use(limiter);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error({
		message: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method
	});
	res.status(500).json({ 
		message: 'Internal Server Error' 
	});
});

app.listen(config.port, () => {
	logger.info(`Server running on port ${config.port}`);
});