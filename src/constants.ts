import { contentTypes } from './types/misc.types';

export const DB_NAME = 'ideasphere';
export const CONTENT_TYPES = [
	'document',
	'tweet',
	'youtube',
	'article',
	'blog',
] as const;

export const ROLE_TYPES = ['user', 'superuser'] as const;
