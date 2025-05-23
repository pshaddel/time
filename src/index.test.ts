import { time } from './index';

describe('@time Decorator', () => {
    describe('Sync Methods', () => {
        test('Default Logger', () => {
            // Mock console.log to capture output
            const originalConsoleLog = console.log;
            const logs: string[] = [];
            console.log = jest.fn((message: string) => {
                logs.push(message);
            });

            class TestClass {
                @time()
                syncMethod() {
                    // Simple synchronous operation
                    let sum = 0;
                    for (let i = 0; i < 1000; i++) {
                        sum += i;
                    }
                    return sum;
                }
            }

            try {
                const instance = new TestClass();
                const result = instance.syncMethod();

                // Check that the method executed correctly
                expect(result).toBe(499500);

                // Check that the log was produced
                expect(logs.length).toBe(1);
                expect(logs[0]).toContain('Time taken by syncMethod:');
                expect(logs[0]).toContain('ms');
            } finally {
                // Restore console.log
                console.log = originalConsoleLog;
            }
        });

        test('Custom Logger', () => {
            let loggedTime = 0;
            const customLogger = (time: number) => {
                loggedTime = time;
            };

            class TestClass {
                @time(customLogger)
                syncMethod() {
                    // Simple synchronous operation
                    let sum = 0;
                    const now = Date.now();
                    const waitingTimeInMs = 3;
                    while (Date.now() - now < waitingTimeInMs) {
                        // Simulate waiting
                    }
                    for (let i = 0; i < 1000; i++) {
                        sum += i;
                    }
                    return sum;
                }
            }

            const instance = new TestClass();
            const result = instance.syncMethod();

            // Check that the method executed correctly
            expect(result).toBe(499500);

            // Check that the custom logger was called
            expect(loggedTime).toBeGreaterThan(0);
        });
    })

    describe('Async Methods', () => {
        test('Default Logger', async () => {
            // Mock console.log to capture output
            const originalConsoleLog = console.log;
            const logs: string[] = [];
            console.log = jest.fn((message: string) => {
                logs.push(message);
            });

            class TestClass {
                @time()
                async asyncMethod() {
                    await new Promise(resolve => setTimeout(resolve, 10));
                    return 'async result';
                }
            }

            try {
                const instance = new TestClass();
                const result = await instance.asyncMethod();

                // Check that the method executed correctly
                expect(result).toBe('async result');

                // Check that the log was produced
                expect(logs.length).toBe(1);
                expect(logs[0]).toContain('Time taken by');
                expect(logs[0]).toContain('asyncMethod');
            } finally {
                // Restore console.log
                console.log = originalConsoleLog;
            }

        });
        test('Custom Logger', async () => {
            let loggedTime = 0;
            const customLogger = (time: number) => {
                loggedTime = time;
            };

            class TestClass {
                @time(customLogger)
                async asyncMethod() {
                    await new Promise(resolve => setTimeout(resolve, 10));
                    return 'async result';
                }
            }

            const instance = new TestClass();
            const result = await instance.asyncMethod();

            // Check that the method executed correctly
            expect(result).toBe('async result');
            // Check that the custom logger was called
            expect(loggedTime).toBeGreaterThan(9);
        });
    });

    describe('Error Handling', () => {
        test('Throws Error when applied to non-method', () => {
            try {
                class TestClass {
                    // @ts-ignore
                    @time()
                    nonMethod = 'not a method';
                }

                // This should throw an error during class definition
                new TestClass();
            } catch (error: any) {
                expect(error.message).toBe(
                    "The @time decorator can only be used on methods."
                );
            }
        });
    });


});
