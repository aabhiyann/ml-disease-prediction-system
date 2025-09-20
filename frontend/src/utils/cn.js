/**
 * Utility function to combine class names
 * Similar to clsx but simpler for our use case
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}
