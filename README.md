# Gifthealth Engineering Project

This is a small TypeScript CLI that reads prescription event data and prints a patient report. I kept the code simple on purpose, but still split by responsibility so it stays easy to read and test.

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
cat input.txt | npm start
```

## Design

The code is split by job:

- `src/cli.ts` reads input and prints output
- `src/app.ts` handles parsing, event processing, and report formatting
- `src/state.ts` keeps the shared prescription state helpers
- `src/types.ts` holds the shared TypeScript types
- `test.ts` checks the main behavior

The core logic works with plain strings and objects, which keeps testing simple. I also added stdin support because the project asks for both file input and piped input.

I used a few basic data structures:

- `Set` to remember which prescriptions were created
- `Map` to track active fills for each prescription
- `Map` again to store the summary for each patient

This gives simple and fast lookups. The processor works in one pass over the input events, so the time complexity is O(n).

I did not add controllers, repositories, or dependency injection because this is a small CLI tool, not a web app or database-backed service. Adding those layers would make the code more complex without much benefit.

## Assumptions

### Sorting

The sample output is not in input order, so I sort the final report by total fills descending. If two patients have the same fill count, I sort by income ascending.

### Validation

I assume each valid input line has exactly three space-delimited values: patient name, drug name, and event name. I also assume patient and drug names are simple single tokens and do not contain spaces or special delimiter characters like `:`.

Event names are case-sensitive and only `created`, `filled`, and `returned` are valid.

The final report should include patients who had a valid `created` event, even if they ended with 0 fills.

Money can be stored as whole dollars because the rules only use `$5` and `$1`.

## Testing

- `parseLine()` is checked with valid and invalid lines
- `processEvents()` is checked with the sample event list
- `formatReport()` is checked with the expected output text
- stdin behavior is handled in `src/cli.ts` and can be covered with an integration style test later

I think this is enough for a small project like this. It gives confidence in the core rules without making the test file too heavy.

## Tradeoffs

I chose readability over clever code. I did not try to make a fancy framework or over-engineer the solution.

The main tradeoff is that the output sorting rule comes from the sample, not from the written spec. I documented that in the code and here in the README so it is clear why the report appears in that order.

Another tradeoff is that the CLI uses simple synchronous file and stdin reads. For this size of tool, that is fine and easier to follow.

## Larger production considerations

If this project became bigger, I would split the source folder more clearly:

- `parser.ts` for parsing and validation
- `processor.ts` for prescription event rules
- `reporter.ts` for output formatting
- separate unit and integration tests

For bigger input files, I would also change the CLI to stream the file line by line instead of reading everything into memory.

I would also add stronger validation: `MAX_LINE_LENGTH`, clear invalid-line reporting, and maybe strict/lenient modes.

The current prescription key is a simple `patientName:drugName` string. It is good enough for this input format, but with more flexible input I would use a safer key builder.

If more event types were added, I would move event handling into separate handler functions instead of growing one large conditional block.

## Summary

This solution tries to show basic production habits: separate logic, test the important parts, and document the choices that are not fully spelled out in the prompt.
