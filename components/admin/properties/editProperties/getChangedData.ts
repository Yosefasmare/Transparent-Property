export function getUpdatedFields<T extends object>(original: T, updated: T): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in updated) {
    if (typeof updated[key] === "object" && updated[key] !== null) {
      // Recursively compare nested objects
      const nestedChanges = getUpdatedFields(
        original[key] as any,
        updated[key] as any
      );
      if (Object.keys(nestedChanges).length > 0) {
        (changes as any)[key] = nestedChanges;
      }
    } else if (updated[key] !== original[key]) {
      (changes as any)[key] = updated[key];
    }
  }

  return changes;
}
