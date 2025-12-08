import { cn } from './utils';
describe('cn', () => {
    it('should merge and deduplicate class names', () => {
        expect(cn('bg-red-500', 'text-white', 'bg-blue-500')).toBe('text-white bg-blue-500');
    });
    it('should handle conditional classes', () => {
        expect(cn('bg-red-500', { 'text-white': true, 'font-bold': false })).toBe('bg-red-500 text-white');
    });
});
