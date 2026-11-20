export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const url = new URL(`../${specifier.slice(2)}.ts`, import.meta.url);
    return nextResolve(url.href, context);
  }

  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !/\.(?:[cm]?js|ts|json|node)$/.test(specifier)
  ) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      // The file may be plain JavaScript. Use the default resolver.
    }
  }

  return nextResolve(specifier, context);
}
