# Time Decorator

`time-decorator` is a lightweight TypeScript utility for measuring the execution time of methods. It provides a simple decorator to log or handle the duration of method execution.

## Installation

```bash
npm install time-decorator
```

## Usage

### Basic Example

```typescript
import { time } from 'ts-time-decorator';

class Example {
    @time()
    someMethod() {
        // Simulate a task
        for (let i = 0; i < 1e6; i++) {}
    }
}

const example = new Example();
example.someMethod();
```

This will log the execution time of `someMethod` to the console.

### Custom Logger

You can provide a custom logger function to handle the execution time:

```typescript
import { time } from 'time-decorator';

class Example {
    @time((time) => {
        console.log(`Execution time: ${time}ms`);
    })
    anotherMethod() {
        // Simulate a task
        for (let i = 0; i < 1e6; i++) {}
    }
}

const example = new Example();
example.anotherMethod();
```

## Testing

The package includes unit tests to ensure reliability. To run the tests:

```bash
npm test
```

### Example Test

```typescript
import { time } from './index';

describe('time', () => {
    it('should measure execution time', () => {
        let loggedTime = 0;

        class TestClass {
            @time((time) => {
                loggedTime = time;
            })
            testMethod() {
                for (let i = 0; i < 1e6; i++) {}
            }
        }

        const instance = new TestClass();
        instance.testMethod();

        expect(loggedTime).toBeGreaterThan(0);
    });
});
```

## License

This project is licensed under the MIT License.