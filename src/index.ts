import "reflect-metadata";
const DECORATOR_ONLLY_METHOD_ERROR =
	"The @time decorator can only be used on methods.";
/**
 *
 * @param loggerFunction - A function that takes the time taken by the function in milliseconds
 * and returns void. This function will be called with the time taken by the function.
 * @example
 * ```typescript
 * function logger(timeTaken: number) {
 *   console.log(`Time taken: ${timeTaken}ms`);
 * }
 * ```
 * @example
 * ```typescript
 * class Example {
 *   @time(logger)
 *   async fetchData() {
 *    // Simulate a network request
 *    await new Promise((resolve) => setTimeout(resolve, 1000));
 *   console.log("waiting");
 *   await new Promise((resolve) => setTimeout(resolve, 1000));
 *   return "Data fetched";
 *  }
 *
 * @time((timeTaken) => {
 *   console.log(`Custom logger: Time taken: ${timeTaken}ms`);
 * })
 *  syncMethod() {
 *     let sum = 0;
 *     // Simulate a synchronous operation
 *     for (let i = 0; i < 1e7; i++) {
 *        sum += i;
 *     };
 *    console.log(`Sum: ${sum}`);
 *   return "Sync method completed";
 *  }
 * }
 * ```
 * @returns
 *
 */
export function time(
	loggerFunction?: (
		/**
		 * The time taken by the function in milliseconds
		 * @param timeTaken - The time taken by the function in milliseconds
		 * @returns void
		 * @example
		 * ```typescript
		 * function logger(timeTaken: number) {
		 *  console.log(`Time taken: ${timeTaken}ms`);
		 * }
		 * ```
		 */
		timeTaken: number,
	) => void,
) {
	return function (
		_target: unknown,
		key: string | symbol,
		descriptor: PropertyDescriptor,
	): unknown {
		if (!descriptor || !descriptor.value) {
			throw new Error(DECORATOR_ONLLY_METHOD_ERROR);
		}
		const originalMethod = descriptor.value;
		if (typeof originalMethod !== "function") {
			throw new Error(DECORATOR_ONLLY_METHOD_ERROR);
		}
		if (originalMethod.constructor.name === "AsyncFunction") {
			descriptor.value = async function (...args: unknown[]) {
				const start = Date.now();
				const result = await originalMethod.apply(this, args);
				const end = Date.now();
				const timeTaken = end - start;

				if (loggerFunction) {
					loggerFunction(timeTaken);
				} else {
					console.log(
						`Time taken by \x1b[36m${String(key)}\x1b[0m: \x1b[33m${timeTaken}\x1b[0m ms`,
					);
				}
				return result;
			};
			return descriptor;
		}
		/**
		 * Handling synchronous methods
		 */
		descriptor.value = function (...args: unknown[]) {
			const start = Date.now();
			const result = originalMethod.apply(this, args);
			const end = Date.now();
			const timeTaken = end - start;

			if (loggerFunction) {
				loggerFunction(timeTaken);
			} else {
				console.log(`Time taken by ${String(key)}: ${timeTaken}ms`);
			}
			return result;
		};
		return descriptor;
	};
}
