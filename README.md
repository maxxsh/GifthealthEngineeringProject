# Gifthealth Engineering Project

This is a small TypeScript CLI that reads prescription event data and prints a patient report. I kept the code simple on purpose, but not just as one big function. The goal was to make it easy to read, easy to test, and easy to change later.

## How to run

Install dependencies first:

```bash
npm install
```

Run with a file name:

```bash
npm start -- input.txt
```

Run with stdin:

```bash
cat input.txt | npx ts-node cli.ts
```

## Design notes

I tried to keep this small, but still organized by responsibility.

The CLI code is separate from the business logic. `cli.ts` only reads from a file/stdin and prints the result.

`app.ts` handles parsing, event processing, and report formatting.
`test.ts` checks the main behavior.

The core logic works with plain strings and objects, which makes it easier to test without touching the file system.

I also added stdin support because the project asks for both file input and piped input. That makes the tool work like a normal command line program.

I used a few basic data structures:

- `Set` to remember which prescriptions were created
- `Map` to track active fills for each prescription
- `Map` again to store the summary for each patient

This gives simple and fast lookups while keeping the code easy to follow. The processor works in one pass over the input events, so the time complexity is O(n).

I did not add controllers, repositories, or dependency injection because this is a small CLI tool, not a web app or database-backed service. Adding those layers here would make the code more complex without much benefit.

If this project became bigger, I would split the source folder more clearly:

- `parser.ts` for parsing and validation
- `processor.ts` for prescription event rules
- `reporter.ts` for output formatting
- separate unit and integration tests

For bigger input files, I would also change the CLI to stream the file line by line instead of reading everything into memory. For stronger validation, I would collect invalid lines and print a clear error report instead of just skipping them.

## Sorting

The sample output shows that the report is not just in input order. I sorted the final report by total fills descending. If two patients have the same fill count, I sort by income ascending.

That was the smallest rule I could use that still matches the example output.

## Testing

The tests are simple and focused.

- `parseLine()` is checked with valid and invalid lines
- `processEvents()` is checked with the sample event list
- `formatReport()` is checked with the expected output text
- stdin behavior should be covered with an integration style test that runs the CLI end to end

I think this is enough for a small project like this. It gives confidence in the core rules without making the test file too heavy.

## Tradeoffs

I chose readability over clever code. I did not try to make a fancy framework or over-engineer the solution.

The main tradeoff is that the output sorting rule is an assumption from the sample, not from the written spec. I documented that in the code and here in the README so it is clear why the report appears in that order.

Another small tradeoff is that the CLI uses simple synchronous file and stdin reads. For this size of tool, that is fine and easier to follow.

## Larger production considerations

For bigger files, I would stream input line by line instead of reading the whole file into memory.

I would also add stronger validation: `MAX_LINE_LENGTH`, clear invalid-line reporting, and maybe strict/lenient modes.

The current prescription key is a simple `patientName:drugName` string. It is good enough for this input format, but with more flexible input I would use a safer key builder.

If more event types were added, I would move event handling into separate handler functions instead of growing one large conditional block.

I kept the code small because this is a small CLI project. The goal was to show clean separation and testability without adding fake enterprise layers.

## Summary

This solution is small, but it still tries to show basic production habits: separate logic, test the important parts, and document the choices that are not fully spelled out in the prompt.
